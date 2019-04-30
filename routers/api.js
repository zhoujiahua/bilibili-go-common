const express = require("express");
const router = express.Router();
const User = require("./../models/User");

//统一验证信息
let msgData;
router.use((req, res, next) => {
    msgData = { code: 0, msg: "" };
    next();
})

router.get("/user", (req, res, next) => {
    res.send("api - User");
});


//登录
router.post("/login", (req, res, next) => {
    let r = req.body;
    console.log(r);
    if (r.username == "") {
        msgData.code = 1
        msgData.msg = "账户名不能为空！"
        res.json(msgData);
        return
    }
    if (r.password == "") {
        msgData.code = 2
        msgData.msg = "密码不能为空！"
        res.json(msgData);
        return
    }

    User.findOne({
        username: r.username,
        password: r.password
    }).then((userInfo) => {
        console.log(userInfo);
        if (!userInfo) {
            msgData.code = 3;
            msgData.msg = "用户名或密码不正确！";
            res.json(msgData);
            return
        }
        msgData.msg = "登录成功!";
        msgData.userInfo = {
            userid: userInfo.id,
            username: userInfo.username
        };
        res.json(msgData);
    })
})

//注册
router.post("/register", (req, res, next) => {
    let r = req.body;
    console.log(r);
    if (r.setname == "") {
        msgData.code = 4;
        msgData.msg = "用户名不能为空！";
        res.json(msgData);
        return
    }
    if (r.setpass == "") {
        msgData.code = 5;
        msgData.msg = "密码不能为空！";
        res.json(msgData);
        return
    }
    if (r.setpass != r.setrepass) {
        msgData.code = 6;
        msgData.msg = "两次输入密码不一致！";
        res.json(msgData);
        return
    }

    User.findOne({
        username: r.setname
    }).then((userInfo) => {
        console.log(userInfo);
        if (userInfo) {
            msgData.code = 7;
            msgData.msg = "当前用户已存在！";
            res.json(msgData);
            return
        }
        let user = new User({
            username: r.setname,
            password: r.setpass
        });
        return user.save();
    }).then((newUserInfo) => {
        if (!newUserInfo) { return }
        console.log(newUserInfo);
        msgData.msg = "用户注册成功";
        msgData.userInfo = {
            userid: newUserInfo.id,
            username: newUserInfo.username
        };
        res.json(msgData);
    })
})


module.exports = router;