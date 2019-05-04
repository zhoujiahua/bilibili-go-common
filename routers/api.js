const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const cookieTime = 6000 * 30;

//统一验证信息
let msgData;
router.use((req, res, next) => {
    msgData = { code: 0, msg: "" };
    next();
})

//登录
router.post("/login", (req, res, next) => {
    let r = req.body,
        toLowName = r.username.toLowerCase();
    // console.log(r);
    if (toLowName == "") {
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
        username: toLowName,
        password: r.password
    }).then((userInfo) => {
        console.log(userInfo);
        if (!userInfo) {
            msgData.code = 3;
            msgData.msg = "用户名或密码不正确！";
            res.json(msgData);
            req.cookies.set("userInfo", "");
            return
        }
        msgData.msg = "登录成功!";
        msgData.userInfo = {
            userid: userInfo._id,
            username: userInfo.username
        };
        req.cookies.set("userInfo", JSON.stringify({
            userid: userInfo._id,
            username: userInfo.username,
            usercode: req.strCode.str + new Date().getTime()
        }), { signed: true, maxAge: cookieTime });
        res.json(msgData);
    })
})

//注册
router.post("/register", (req, res, next) => {
    let r = req.body;
    toLowName = r.setname.toLowerCase();
    console.log(r);
    if (toLowName == "") {
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
        username: toLowName
    }).then((userInfo) => {
        // console.log(userInfo);
        if (userInfo) {
            msgData.code = 7;
            msgData.msg = "当前用户已存在！";
            res.json(msgData);
            return
        }
        let user = new User({
            username: toLowName,
            password: r.setpass
        });
        return user.save();
    }).then((newUserInfo) => {
        if (!newUserInfo) { return }
        // console.log(newUserInfo);
        msgData.msg = "用户注册成功";
        msgData.userInfo = {
            userid: newUserInfo._id,
            username: newUserInfo.username
        };
        req.cookies.set("userInfo", JSON.stringify({
            userid: newUserInfo._id,
            username: newUserInfo.username,
            usercode: req.strCode.str + new Date().getTime()
        }), { signed: true, maxAge: cookieTime });
        res.json(msgData);
    })
})

//用户注销
router.get("/loginout", (req, res, next) => {
    req.cookies.set("userInfo", "");
    msgData.msg = "用户注销成功！";
    res.json(msgData);
})

module.exports = router;