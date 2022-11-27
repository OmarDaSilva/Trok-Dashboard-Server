const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const TokenBucket = db.tokenBucket;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.send({ message: "User was registered successfully!" });
    });
  });
};

exports.signin = (req, res) => {
  const tokenFilter = { ipAddress: req.ip, enteredEmailAddress: req.body.email };
  const lockedOutMessage =
    "Maximum number (3) of attempts reached come back in 1 minute";

  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    var updateToken;

    if (!user) {
      if (!req.tokenBucket) {
        updateToken = 2;
        TokenBucket.create({
          ipAddress: req.ip,
          tokens: 2,
          enteredEmailAddress: req.body.email,
          unixTimeStamp: Date.now(),
        });
      } else {
        updateToken = req.tokenBucket.tokens - 1;
        TokenBucket.updateOne(tokenFilter, { $set:{ tokens: updateToken }}).exec();
      }

      console.log(`attempt ${updateToken}`);
      if (updateToken == 0 ) {
        return res.status(401).send({ message: `Maximum number (3) of attempts reached come back in 1 minute` });
      }

      return res.status(401).send({ message: `Email Not found. ${updateToken == 0 ? lockedOutMessage : ''}` });
    }

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      if (!req.tokenBucket) {
        updateToken = 2;
        TokenBucket.create({
          ipAddress: req.ip,
          tokens: 2,
          enteredEmailAddress: req.body.email,
          unixTimeStamp: Date.now(),
        });
      } else {
        updateToken = req.tokenBucket.tokens - 1;
        TokenBucket.updateOne(tokenFilter, { $set:{ tokens: updateToken }}).exec();
      }

      if (updateToken == 0 ) {
        return res.status(401).send({ message: lockedOutMessage });
      }

      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!" ,
      });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      accessToken: token,
      message: "logged In",
    });
  });
};
