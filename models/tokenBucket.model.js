const mongoose = require("mongoose");

const TokenBucket = mongoose.model(
    "TokenBucket",
    new mongoose.Schema({
        ipAddress: String,
        enteredEmailAddress: String,
        tokens: Number,
        unixTimeStamp: String
    })
);
module.exports = TokenBucket;