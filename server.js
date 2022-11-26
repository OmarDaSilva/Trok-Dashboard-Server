const express = require("express");
const cors = require("cors");
const db = require("./models");
const app = express();

// var corsOptions = {
//   origin: "http://*",
// };

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// log errors to console
app.use(logErrors);

app.use(clientErrorHandler);
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    status: error.status || 500,
    message: error.message,
    error: {
      error: error.message,
    },
  });
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    //console.log('xhr request');
    res.status(400).send({status: 400, message: "Bad request from client", error: err.message });
  } else {
    next(err);
  }
}

// app.use(bodyParser.urlencoded({ extended: false }))

// app.use(bodyParser.json())

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.mongoose
  .connect(`mongodb://127.0.0.1`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
