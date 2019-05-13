const mongoose = require("mongoose");
const config = require("./config");


const conn = mongoose.createConnection(config.DB);

if(conn==null)
{
    return false;
}

module.exports = conn;