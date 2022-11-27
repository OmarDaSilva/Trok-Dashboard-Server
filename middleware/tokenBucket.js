const db = require("../models");
const TokenBucket = db.tokenBucket;

const checkIfIPisLogged = (req, res, next) => {
  TokenBucket.findOne({
    ipAddress: req.ip,
    enteredEmailAddress: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
    }

    if (!user || user == null) {
      return next();
    }

    if (user.tokens == 0) {
        const timeToUnban = parseInt(user.unixTimeStamp) + 60000;
      if (Date.now() >= timeToUnban) {
        TokenBucket.deleteOne({ ipAddress: user.ipAddress }).exec();
        return next();
      } else {
        return res.status(401).send({
          accessToken: null,
          message: "Maximum number of attempts reached, come back in 1 minute",
        });
      }
    }

    req.tokenBucket = user;
    return next();
  });
};

const checkIP = {
  checkIfIPisLogged,
};

module.exports = checkIP;
