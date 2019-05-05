const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const usersSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = usersSchema;
// mongoose.model("users",usersSchema);