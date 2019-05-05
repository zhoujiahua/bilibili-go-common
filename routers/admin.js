const express = require("express");
const router = express.Router();
const User = require("./../models/User");

//权限验证
router.use((req, res, next) => {
    if (!req.userInfo.isAdmin) {
        res.render("msginfo/index", { msg: "对不起您没足够的访问权限！" });
        return
    }
    next();
})

//后台首页
router.get("/", (req, res, next) => {
    // res.send("admin");
    res.render("admin/index", { userInfo: req.userInfo });
})

//用户管理
router.get("/user", (req, res, next) => {
    let page = req.query.page || 1,
        limit = 2,
        skip = (page - 1) * limit;
    // User.find().count({}, (err, count) => {
    //     // console.log(count);
    //     return count;
    // }).then((info) => {
    //     console.log(info);
    // });
    User.find().limit(2).skip(skip).then((users) => {
        // console.log(users);
        res.render("admin/user_index", {
            userInfo: req.userInfo,
            users: users
        });
    })
})

//用户数据
// router.get("/user/info", (req, res, next) => {
//     let r = req.query,
//         page = r.page || 1,
//         limit = r.limit || 10,
//         skip = (page - 1) * limit;
//     User.find().countDocuments({}, (err, num) => {
//         if (err) {
//             res.json({
//                 "code": 1,
//                 "msg": "数据有误",
//                 "count": 0,
//                 "data": []
//             });
//             return
//         }
//         return num;
//     }).then((num) => {
//         User.find().limit(limit).skip(skip).then((usersNum) => {
//             res.json({
//                 "code": 0,
//                 "msg": "数据请求成功",
//                 "count": num,
//                 "data": usersNum
//             });
//         })
//     })
// })

module.exports = router;
