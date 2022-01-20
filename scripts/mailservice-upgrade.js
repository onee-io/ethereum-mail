const { ethers, upgrades } = require("hardhat");

async function main() {
  // 代理合约地址
  const proxyAddress = "0x75E6d93B2aBB21CF5ad499F0138BE1D605b44643";
  // 合约升级
  const MailService = await ethers.getContractFactory("MailService");
  const mailService = await upgrades.upgradeProxy(proxyAddress, MailService);
  console.log("MailService Proxy update success");
  // 写入到文件
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