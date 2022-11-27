const db = require("../models");
const TokenBucket = db.tokenBucket;

exports.adminUnblock = (req, res) => {
  const tokenFilter = {
    ipAddress: req.body.ip,
    enteredEmailAddress: req.body.email,
  };

  TokenBucket.findOne(tokenFilter).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      res.status(404).send({ message: "user not found" });
    } else {
      TokenBucket.findByIdAndDelete({ _id: user._id }).exec((err) => {
        if (err) {
          res.status(500).send({ message: err });
        } else {
          res.status(200).send("Unblocked IP + Email");
        }
      });
    }
  });
};
