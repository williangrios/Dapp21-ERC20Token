
const hre = require("hardhat");

async function main() {
 

  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const erc20Token = await ERC20Token.deploy("TokenTestWill", "TTW", 18, 100000);

  await erc20Token.deployed();

  console.log(
    `Deployed to ${erc20Token.address}`
  );
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
