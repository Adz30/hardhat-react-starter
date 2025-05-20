const hre = require("hardhat");

async function main() {
  const NAME = 'testToken'
  const SYMBOL = 'testT'
  const MAX_SUPPLY = '1000000'

  const Token = await hre.ethers.getContractFactory('Token')
  const token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY)

  await token.waitForDeployment()

  console.log(`Token deployed to: ${token.target}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
