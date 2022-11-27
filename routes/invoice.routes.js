const controller = require("../controllers/invoice.controller");

module.exports = (app) => {

  app.get("/api/invoices", controller.invoice);
};
