//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./interface/IMailService.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// 邮件服务实现
contract MailService is IMailService {
    using Counters for Counters.Counter;

    // 邮件ID
    Counters.Counter private _mailIds;
    // 邮件仓库
    mapping(uint256 => MLib.Mail) private _mailRepository;
    // 收件箱
    mapping(address => uint256[]) private _inbox;
    // 发件箱
    mapping(address => uint256[]) private _sentBox;

    // 查询收件箱
    function inbox() external view override returns (MLib.Mail[] memory) {
        return _getMailList(_inbox[msg.sender]);
    }

    // 查询发件箱
    function sentBox() external view override returns (MLib.Mail[] memory) {
        return _getMailList(_sentBox[msg.sender]);
    }

    // 发送邮件
    function sendMail(address[] memory to, address[] memory cc, string memory subject, string memory content) external override {        
        require(to.length != 0 || cc.length != 0, "RECIPIENT NOT NULL");
        MLib.Mail memory mail = MLib.Mail({
            from: msg.sender,
            to: to,
            cc: cc,
            subject: subject,
            content: content,
            timestamp: block.timestamp
        });
        uint _mailId = _mailIds.current();
        _mailRepository[_mailId] = mail;
        console.log("_mailRepository added a mail. id=%s", _mailId);
        _sentBox[msg.sender].push(_mailId);
        console.log("send:%s sentBox added a mail. id=%s", msg.sender, _mailId);
        for (uint256 i = 0; i < to.length; i++) {
            _inbox[to[i]].push(_mailId);
            console.log("to:%s inbox added a mail. id=%s", msg.sender, _mailId);
        }
        for (uint256 i = 0; i < cc.length; i++) {
            _inbox[cc[i]].push(_mailId);
            console.log("cc:%s inbox added a mail. id=%s", msg.sender, _mailId);
        }
        _mailIds.increment();
        emit MailSent(msg.sender, _mailId);
    }

    // 通过邮件ID获取邮件列表
    function _getMailList(uint256[] memory _mailIdList) private view returns (MLib.Mail[] memory) {
        MLib.Mail[] memory mailList = new MLib.Mail[](_mailIdList.length);
        for (uint256 i = 0; i < _mailIdList.length; i++) {
            mailList[i] = _mailRepository[_mailIdList[i]];
        }
        return mailList;
    }
}