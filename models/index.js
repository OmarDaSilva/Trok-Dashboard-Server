const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.invoice = require("./invoice.model");
db.tokenBucket = require("./tokenBucket.model")

module.exports = db;