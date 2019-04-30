const express = require("express");
const router = express.Router();
router.get("/user", (req, res, next) => {
    res.send("api - User");
});
module.exports = router;