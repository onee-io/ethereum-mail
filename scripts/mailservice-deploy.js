const hre = require("hardhat");

async function main() {
  const MailService = await hre.ethers.getContractFactory("MailService");
  const mailService = await MailService.deploy();
  await mailService.deployed();
  console.log("MailService deployed to:", mailService.address);
}
  
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
