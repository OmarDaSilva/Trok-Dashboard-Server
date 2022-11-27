const mongoose = require("mongoose");

const Invoice = mongoose.model(
    "invoice",
    new mongoose.Schema({
        _id: String,
        invoiceId: String,
        creationDate: String,
        lineItems: {
          description: String
        },
        recipientCompanyAddress: String,
        vat: Number,
        subTotal: Number,
        totalInclVat: Number,
        invoiceFrom: Number,
        dueDate: Number,
    })
);
module.exports = Invoice;