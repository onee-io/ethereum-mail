const hre = require("hardhat");

async function main() {
  const MailService = await hre.ethers.getContractFactory("MailService");
  const mailService = await MailService.deploy();
  await mailService.deployed();
  console.log("MailService deployed to:", mailService.address);

  saveFrontendFiles(mailService);
}

function saveFrontendFiles(mailService) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ MailService: mailService.address }, undefined, 2)
  );
  const MailServiceArtifact = artifacts.readArtifactSync("MailService");
  fs.writeFileSync(
    contractsDir + "/MailService.json",
    JSON.stringify(MailServiceArtifact, null, 2)
  );
}
  
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
