const express = require("express");
const swig = require("swig");
const bodyParser = require("body-parser");
const Cookies = require("cookies");
const User = require("./models/User");

//加载数据库
const mongoose = require("mongoose");
const app = express();

//使用body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//引入数据链接
const dbconn = require("./db/db");

//引入模块文件
const admin = require("./routers/admin");
const api = require("./routers/api");
const main = require("./routers/main");

//设置静态文件托管设置
app.use("/public", express.static(__dirname + "/public"));

//定义当前使用的模版引擎
app.engine("html", swig.renderFile);

//设置模版目录
app.set("views", "./views");

//注册使用模版引擎
app.set("view engine", "html");

// 开发过程中，需要取消模版缓存
swig.setDefaults({
    cache: false
});

//设置cookie
app.use((req, res, next) => {
    req.cookies = new Cookies(req, res);
    //解析登录用户cookie信息
    req.userInfo = {};
    if (req.cookies.get("userInfo")) {
        console.log(`解析当前登录cookie信息：${req.cookies.get("userInfo")}`);
        try {
            req.userInfo = JSON.parse(req.cookies.get("userInfo"));
            //获取当前用户是否是管理员
            User.findById(req.userInfo.userid).then((userInfo) => {
                console.log("ID查询当前用户信息：" + userInfo);
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })

        } catch (e) { next(); }
    } else {
        next();
    }
});

//app.get("/",(req,res,next) => {
//     // res.send("Hello");
//     res.render("index",{"name":"JiaHua"});
// })

//根据不同功能划分功能模块
app.use("/admin", admin);
app.use("/api", api);
app.use("/", main);

// app.get("/main.css",(req,res,next)=>{
//     res.setHeader("content-type","text/css");
//     res.send("body{background:red}");
// });

//连接数据库
mongoose.connect(dbconn.localLink, (err) => {
    if (err) {
        console.log("数据库连接失败！");
    } else {
        console.log("数据库连接成功！");

        //process.env.PORT：读取当前目录下环境变量port的值
        const port = process.env.PORT || 8088;
        app.listen(port, () => {
            console.log(`服务器启动成功正在监听：${port} 端口`);
        });
    }
});