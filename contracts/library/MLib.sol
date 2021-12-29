//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// 邮件服务公共库
library MLib {

    // 邮件结构体定义
    struct Mail {
        address from; // 发件人
        address[] to; // 收件人
        address[] cc; // 抄送
        string subject; // 主题
        string content; // 内容
    }
}