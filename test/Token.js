const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether');
};

const ether = tokens;

describe('Token', () => {
  let token, accounts, deployer, receiver, exchange;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token');
    token = await Token.deploy('testT', 'testT', '1000000');

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
    exchange = accounts[2];
  });

  describe('Deployment', () => {
    const name = 'testT';
    const symbol = 'testT';
    const decimals = '18';
    const totalSupply = tokens('1000000');

    it('has correct name', async () => {
      expect(await token.name()).to.equal(name);
    });

    it('has correct symbol', async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it('has correct decimals', async () => {
      expect(await token.decimals()).to.equal(decimals);
    });

    it('has correct total supply', async () => {
      expect(await token.totalSupply()).to.equal(totalSupply);
    });

    it('assigns total supply to deployer', async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });
  });

  describe('Sending Tokens', () => {
    let amount, transaction, receipt;

    describe('Success', () => {
      beforeEach(async () => {
        amount = tokens(100);
        transaction = await token.connect(deployer).transfer(receiver.address, amount);
        receipt = await transaction.wait();
      });

      it('transfers token balances', async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900));
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it('emits a Transfer event', async () => {
        const iface = token.interface;
        const event = receipt.logs
          .map(log => {
            try {
              return iface.parseLog(log);
            } catch {
              return null;
            }
          })
          .filter(e => e && e.name === 'Transfer')[0];

        expect(event).to.exist;
        expect(event.args.from).to.equal(deployer.address);
        expect(event.args.to).to.equal(receiver.address);
        expect(event.args.value).to.equal(amount);
      });
    });

    describe('Failure', () => {
      it('rejects insufficient balances', async () => {
        const invalidAmount = tokens(100000000);
        await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted;
      });

      it('rejects invalid recipient', async () => {
        const amount = tokens(100);
        await expect(token.connect(deployer).transfer(ethers.ZeroAddress, amount)).to.be.reverted;
      });
    });
  });

  describe('Approving Tokens', () => {
    let amount, transaction, receipt;

    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token.connect(deployer).approve(exchange.address, amount);
      receipt = await transaction.wait();
    });

    describe('Success', () => {
      it('allocates an allowance for delegated token spending', async () => {
        expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount);
      });

      it('emits an Approval event', async () => {
        const iface = token.interface;
        const event = receipt.logs
          .map(log => {
            try {
              return iface.parseLog(log);
            } catch {
              return null;
            }
          })
          .filter(e => e && e.name === 'Approval')[0];

        expect(event).to.exist;
        expect(event.args.owner).to.equal(deployer.address);
        expect(event.args.spender).to.equal(exchange.address);
        expect(event.args.value).to.equal(amount);
      });
    });

    describe('Failure', () => {
      it('rejects invalid spenders', async () => {
        await expect(token.connect(deployer).approve(ethers.ZeroAddress, amount)).to.be.reverted;
      });
    });
  });

  describe('Delegated Token Transfers', () => {
    let amount, transaction, receipt;

    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token.connect(deployer).approve(exchange.address, amount);
      receipt = await transaction.wait();
    });

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount);
        receipt = await transaction.wait();
      });

      it('transfers token balances', async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900));
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it('resets the allowance', async () => {
        expect(await token.allowance(deployer.address, exchange.address)).to.equal(0);
      });

      it('emits a Transfer event', async () => {
        const iface = token.interface;
        const event = receipt.logs
          .map(log => {
            try {
              return iface.parseLog(log);
            } catch {
              return null;
            }
          })
          .filter(e => e && e.name === 'Transfer')[0];

        expect(event).to.exist;
        expect(event.args.from).to.equal(deployer.address);
        expect(event.args.to).to.equal(receiver.address);
        expect(event.args.value).to.equal(amount);
      });
    });

    describe('Failure', () => {
      it('rejects transfers greater than allowance', async () => {
        const invalidAmount = tokens(100000000);
        await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted;
      });
    });
  });
});
