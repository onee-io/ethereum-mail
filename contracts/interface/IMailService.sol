//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../library/MLib.sol";

// 邮件服务接口定义
interface IMailService {

    // 查询收件箱
    function inbox() external view returns (MLib.Mail[] memory);
    // 查询发件箱
    function sent() external view returns (MLib.Mail[] memory);
    // 发送邮件
    function sendMail(address[] memory to, address[] memory cc, string memory subject, string memory content) external;

    // 邮件已发送事件
    event MailSent(address indexed from, uint256 indexed mailId);
}