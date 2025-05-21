const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => ethers.parseUnits(n.toString(), "ether");
const ether = tokens;

describe("RevenueSplitter", () => {
  let revenueSplitter;
  let deployer, user1, user2, user3;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    [deployer, user1, user2, user3] = accounts;

    const RevenueSplitter = await ethers.getContractFactory("RevenueSplitter");
    revenueSplitter = await RevenueSplitter.deploy();
    await revenueSplitter.waitForDeployment();
  });
  describe("deployment", () => {
    it("starts with zero total percentage", async () => {
      expect(await revenueSplitter.totalPercentage()).to.equal(0);
    });
    it("starts with no recipients", async () => {
      const recipients = await revenueSplitter.getRecipients();
      expect(recipients.length).to.equal(0);
    });
  });
  describe("addRecipient", () => {
    it("adds a recipient and updates totalPercentage", async () => {
      const transaction = await revenueSplitter.addRecipient(user1.address, 50);
      await transaction.wait();

      expect(await revenueSplitter.recipients(user1.address)).to.equal(50);
      expect(await revenueSplitter.totalPercentage()).to.equal(50);

      const recipients = await revenueSplitter.getRecipients();
      expect(recipients).to.include(user1.address);
    });
    it("emits RecipientAdded event", async () => {
      await expect(revenueSplitter.addRecipient(user2.address, 30))
        .to.emit(revenueSplitter, "RecipientAdded")
        .withArgs(user2.address, 30);
    });
    it("rejects zero address", async () => {
      await expect(
        revenueSplitter.addRecipient(ethers.ZeroAddress, 10)
      ).to.be.revertedWith("Invalid address");
    });
    it("rejects zero percentage", async () => {
      await expect(
        revenueSplitter.addRecipient(user1.address, 0)
      ).to.be.revertedWith("Percentage must be > 0");
    });
    it("rejects duplicate recipients", async () => {
      await revenueSplitter.addRecipient(user3.address, 20);
      await expect(
        revenueSplitter.addRecipient(user3.address, 10)
      ).to.be.revertedWith("Recipient already added");
    });
    it("rejects total percentage over 100", async () => {
      await revenueSplitter.addRecipient(user1.address, 60);
      await revenueSplitter.addRecipient(user2.address, 40);
      await expect(
        revenueSplitter.addRecipient(user3.address, 1)
      ).to.be.revertedWith("Total exceeds 100%");
    });
  });
  describe("funds distribution", () => {
    beforeEach(async () => {
      await (await revenueSplitter.addRecipient(user1.address, 60)).wait();
      await (await revenueSplitter.addRecipient(user2.address, 40)).wait();

      await deployer.sendTransaction({
        to: revenueSplitter.getAddress(),
        value: ether(1),
      });
    });
    it("", async  () => {
      
    });

  });

});
