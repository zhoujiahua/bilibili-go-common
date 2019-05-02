const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})

module.exports = usersSchema;

