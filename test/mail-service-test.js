const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MailService", function () {

    let mailService;
    let owner;
    let addr1;
    let addr2;
    let addrs;
  
    beforeEach(async function () {
      MailService = await ethers.getContractFactory("MailService");
      mailService = await MailService.deploy();
      await mailService.deployed();
  
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });
  
    it("test deploy", async function () {
      let inbox = await mailService.inbox();
      let sentBox = await mailService.sentBox();
      expect(inbox.length).to.equal(0);
      expect(sentBox.length).to.equal(0);
    });
  
    it("test sent to mail", async function () {
      // owner 发送邮件给 addr1
      await mailService.sendMail([addr1.address], [], "To addr1 mail", "This is a test mail");
      let inbox = await mailService.inbox();
      let sentBox = await mailService.sentBox();
      expect(inbox.length).to.equal(0);
      expect(sentBox.length).to.equal(1);
      expect(sentBox[0].subject).to.equal("To addr1 mail");
      // 查询 addr1 账户
      let inbox1 = await mailService.connect(addr1).inbox();
      let sentBox1 = await mailService.connect(addr1).sentBox();
      expect(inbox1.length).to.equal(1);
      expect(sentBox1.length).to.equal(0);
      expect(inbox1[0].subject).to.equal("To addr1 mail");
    });

    it("test sent cc mail", async function () {
        // addr1 抄送邮件给 addr2
        await mailService.connect(addr1).sendMail([], [addr2.address], "CC addr2 mail", "This is a test mail");
        let inbox1 = await mailService.connect(addr1).inbox();
        let sentBox1 = await mailService.connect(addr1).sentBox();
        expect(inbox1.length).to.equal(0);
        expect(sentBox1.length).to.equal(1);
        expect(sentBox1[0].subject).to.equal("CC addr2 mail");
        // 查询 addr2 账户
        let inbox2 = await mailService.connect(addr2).inbox();
        let sentBox2 = await mailService.connect(addr2).sentBox();
        expect(inbox2.length).to.equal(1);
        expect(sentBox2.length).to.equal(0);
        expect(inbox2[0].subject).to.equal("CC addr2 mail");
      });
  });