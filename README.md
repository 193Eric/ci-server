# ci-server

* [1.简介](#desc)

* [2.项目技术栈](#tech)

* [3.快速启动](#quickstart)

* [4.部署第一个项目](#firstpro)






<span id="desc"></span>
## 简介


<p>
前端团队构建部署工程化而开发的一个持续交付平台.根据团队人员，项目增长而面临的越来越多在构建，交付等日常工作中的痛点，设计了很多特有而简单易用的功能，节省了团队很多构建部署的协调和copy体力工作，极大的提升了团队的开发效率实现快速构建，快速部署，放心上线。
</p>



<span id="tech"></span>
## 技术栈

 1. 开发语言： [nodejs](http://nodejs.org/ "nodejs") 
 
 2. 数据库: [mysql](https://www.mysql.com/) 

 3. 后端框架： [thinkjs](https://thinkjs.org/) 

 4. 前端js框架  [react](https://github.com/facebook/react) 

 5. 前端ui框架  [ant.design](https://ant.design) 

<span id="quickstart"></span>
## 快速启动(只支持linux)
1. git clone xxxxx.git 代码到本地
2. 安装nodejs 依赖:在根目录下运行npm install
3. 安装ansible （依赖ansible做部署前后的命令行执行）
4. 安装mysql 数据库，这里就不展开讲了，具体请参考:[mysql文档](https://dev.mysql.com/doc/refman/5.7/en/) 
5. 新建一个数据库（名字自己取一个就行，比如fe_build），并且开放足够的访问权限，具体可以参考[mysql文档](https://dev.mysql.com/doc/refman/5.7/en/database-use.html)
6. 配置数据库：
   <p>
     
     打开src/common/config/db.js,分别填写数据库ip地址，数据库名称，用户名和密码,如下所示
    <pre><code>
    export default {
    type: 'mysql',
    log_sql: true,
    log_connect: true,
    adapter: {
        mysql: {
            host: '127.0.0.1',
            port: '',
            database: 'wdfe_publish',
            user: 'root',
            password: '',
            prefix: '',
            encoding: 'utf8'
        },
    }
	}
	</code></pre>
   </p>

7. 代码，通知邮件等访问权限配置：
   <p>
     由于构建部署系统需要从代码仓库（svn,git）拉取代码，所以需要首先配置svn仓库用户名和密码
     
     
     
     打开src/common/config/config.js，分别填写各项配置,具体如下：
         <pre><code>
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
	</code></pre>
	

	
	如果是git项目请保证部署机器能直接有访问git的权限
   </p>
   
8. 代码编译，启动
	<p>输入命令以下命令进行编译：</p>
	 <pre><code>
	 npm run build 
	 </code></pre>
	<p>编译完成，运行以下名命令启动：</p>
	 <pre><code>
	 npm run start
	 </code></pre>	 
	 
	<p>也可以用forever或者pm2来管理服务，以forever为例:
	 <pre><code>
	 npm install -g forever
	 </code></pre>	
	项目内置了forever的启动和停止脚本：
	<pre><code>
	 ./start.sh
	 ./stop.sh
	 </code></pre>	
	</p> 
	服务器起来以后，我们直接访问
	
	http://localhost
	
	页面自动跳到登录注册页面，说明启动成功：
	

9. 导入数据库脚本，生成数据库基础表结构
   这一步主要是为系统运行创建需要的数据库表，为了方便大家使用，项目提供了一个web程序来建立表结构，直接输入:
  
   http://localhost/install

   点击‘确定导入数据库表’生成数据库。
   
   当然，也可以通过mysql 直接倒入数据库表结构文件，数据库表文件是db/db.sql
  
	
	
