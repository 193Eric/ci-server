'use strict';
/**
 * config
 */
 export default {
    cvsUser: 'myuser',//svn用户名
    cvsPass: 'mypass',//svn密码
    emailHost: 'smtp.qq.com',//通知邮箱地址,这里用qq邮箱作为参考
    emailport: 465,//端口
    emailUser: '3333@qq.com',//邮箱账号
    emailPass: 'xxxxx',//邮箱授权码(具体可以登录mail.qq.com->设置->账户->POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务->生成授权码获取)
    cvsDir: '/temp',//svn代码临时保存目录
    port: 80 //服务器端口，就是部署平台的web服务端口，
}
