const express = require("express");
const router = express.Router();

//权限验证
router.use((req, res, next) => {
    if (!req.userInfo.isAdmin) {
        res.render("msginfo/index", { msg: "对不起您没足够的访问权限！" });
        return
    }
    next();
})

//后台页面
router.get("/", (req, res, next) => {
    // res.send("admin");
    res.render("admin/index", { userInfo: req.userInfo });
})

module.exports = router;
