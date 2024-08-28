const mongoose = require('mongoose');

// Subschema para Address
const addressSchema = new mongoose.Schema({
    street: { type: String, default: null },
    exteriorNumber: { type: String, default: null },
    interiorNumber: { type: String, default: null },
    colony: { type: String, default: null },
    locality: { type: String, default: null },
    municipality: { type: String, default: null },
    zipCode: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    reference: { type: String, default: null },
}, { _id: false });

// Subschema para Accounting Details
const accountingDetailSchema = new mongoose.Schema({
    id: { type: String, default: null },
    idParent: { type: String, default: null },
    name: { type: String, default: null },
    text: { type: String, default: null },
    code: { type: String, default: null },
    description: { type: String, default: null },
    type: { type: String, default: null },
    readOnly: { type: Boolean, default: null },
    nature: { type: String, default: null },
    blocked: { type: String, default: null },
    status: { type: String, default: null },
    categoryRule: {
        id: { type: String, default: null },
        name: { type: String, default: null },
        key: { type: String, default: null },
    },
    use: { type: String, default: null },
    showThirdPartyBalance: { type: Boolean, default: null },
    metadata: {
        satGroupingCode: { type: String, default: null },
        satGroupingText: { type: String, default: null },
    },
}, { _id: false });

// Subschema para Accounting
const accountingSchema = new mongoose.Schema({
    accountReceivable: { type: accountingDetailSchema, default: null },
    debtToPay: { type: accountingDetailSchema, default: null },
}, { _id: false });

// Esquema principal
const clientSchema = new mongoose.Schema({
    id: { type: String, default: null },
    name: { type: String, default: null },
    identification: { type: String, default: null },
    email: { type: String, default: null },
    phonePrimary: { type: String, default: null },
    phoneSecondary: { type: String, default: null },
    fax: { type: String, default: null },
    mobile: { type: String, default: null },
    observations: { type: String, default: null },
    status: { type: String, default: null },
    cfdiUse: { type: String, default: null },
    paymentType: { type: String, default: null },
    paymentMethod: { type: String, default: null },
    operationType: { type: String, default: null },
    thirdType: { type: String, default: null },
    fiscalId: { type: String, default: null },
    regime: { type: String, default: null },
    regimeObject: { type: [String], default: [] },
    address: { type: addressSchema, default: null },
    type: { type: [String], default: null },
    seller: { type: String, default: null },
    term: {
        id: { type: Number, default: null },
        name: { type: String, default: null },
        days: { type: String, default: null }
    },
    priceList: {
        id: { type: Number, default: null },
        name: { type: String, default: null }
    },
    internalContacts: { type: [Object], default: [] },
    statementAttached: { type: Boolean, default: false },
    accounting: { type: accountingSchema, default: null },
}, { timestamps: true });

module.exports = mongoose.model('ClientAlegra', clientSchema);
