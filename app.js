const express = require("express");
const swig = require("swig");
const bodyParser = require("body-parser");
const Cookies = require("cookies");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const configInc = require("./config/config.inc");

//config
require("./config/passport")(passport);


//加载数据库
const mongoose = require("mongoose");
const app = express();

//使用body-parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//注册使用cookie-parser
app.use(cookieParser());

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

//随机字符串
app.use((req, res, next) => {
    let num, str;
    //随机数
    function GetRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }
    num = GetRandomNum(1, 10);

    //随机字符串
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    function generateMixed(n) {
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }
    str = generateMixed(10);
    req.strCode = {
        num,
        str
    };
    next();
})

//设置cookie
app.use((req, res, next) => {
    req.cookies = new Cookies(req, res, {
        keys: configInc.keys
    });

    //解析登录用户cookie信息
    req.userInfo = {};
    if (req.cookies.get("userInfo", {
            signed: true
        })) {
        // console.log(`解析当前登录cookie信息：${req.cookies.get("userInfo", { signed: true })}`);
        try {
            req.userInfo = JSON.parse(req.cookies.get("userInfo", {
                signed: true
            }));
            //获取当前用户是否是管理员
            User.findById(req.userInfo.userid).then((userInfo) => {
                // console.log("ID查询当前用户信息：" + userInfo);
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })

        } catch (e) {
            next();
        }
    } else {
        next();
    }
});

// method-override middleware
app.use(methodOverride('_method'));

// session & flash middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect-flash
app.use(flash());

// 配置全局变量
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user || null;
    next();
})

//根据不同功能划分功能模块
app.use("/admin", admin);
app.use("/api", api);
app.use("/", main);

//连接数据库
mongoose.connect(dbconn.escLink, (err) => {
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