const db = require("../models");
const Invoice = db.invoice;

exports.invoice = (req, res) => {
  Invoice.find({}, (err, invoices) => {
    if (!invoices) {
        return res.status(404).send({ message: "No invoices." });
    }

    return res.status(404).send(invoices);
  });
};
