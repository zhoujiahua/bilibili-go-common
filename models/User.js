const mongoose = require("mongoose");
const usersSchema = require("./../schemas/users");
const Users = mongoose.model("User",usersSchema);

module.exports = Users;