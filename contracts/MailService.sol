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
    mapping(address => uint256[]) private _sent;

    // 查询收件箱
    function inbox() external view override returns (MLib.Mail[] memory) {
        return _getMailList(_inbox[msg.sender]);
    }

    // 查询发件箱
    function sent() external view override returns (MLib.Mail[] memory) {
        return _getMailList(_sent[msg.sender]);
    }

    // 发送邮件
    function sendMail(address[] memory to, address[] memory cc, string memory subject, string memory content) external override {
        require(to.length != 0, "RECIPIENT NOT NULL");
        _mailIds.increment();
        MLib.Mail memory mail = MLib.Mail({
            from: msg.sender,
            to: to,
            cc: cc,
            subject: subject,
            content: content
        });
        _mailRepository[_mailIds.current()] = mail;
        _sent[msg.sender].push(_mailIds.current());
        for (uint256 i = 0; i < to.length; i++) {
            _inbox[to[i]].push(_mailIds.current());
        }
        for (uint256 i = 0; i < cc.length; i++) {
            _inbox[cc[i]].push(_mailIds.current());
        }
        emit MailSent(msg.sender, _mailIds.current());
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