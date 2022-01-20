const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("MailService(Proxy)", function () {

    let mailService;
  
    beforeEach(async function () {
      MailService = await ethers.getContractFactory("MailService");
      mailService = await upgrades.deployProxy(MailService);
    });
  
    it("test deploy proxy", async function () {
      let inbox = await mailService.inbox();
      let sentBox = await mailService.sentBox();
      expect(inbox.length).to.equal(0);
      expect(sentBox.length).to.equal(0);
    });
  });