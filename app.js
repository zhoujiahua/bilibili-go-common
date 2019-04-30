const express = require("express");
const swig = require("swig");
//加载数据库
const mongoose = require("mongoose");
const app = express();

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
mongoose.connect(dbconn.onlineLink, (err) => {
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