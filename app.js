const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const accountsRouters = require('./modules/accounting/routes/accounts.routes');
const booksRouters = require('./modules/accounting/routes/books.routes');
const codesRouters = require('./modules/accounting/routes/currencyCode.routes');
const currencyRouters = require('./modules/accounting/routes/currency.routes');
const accountRouters = require('./modules/accounting/routes/chartofAccounts.routes');
const companyRouters = require('./modules/accounting/routes/company.routes');
const accountsTypeRouters = require('./modules/accounting/routes/accountsType.routes');
const detailTypeRouters = require('./modules/accounting/routes/detailType.routes');
const journalEntries=require('./modules/accounting/routes/journalEntries.routes');
const reportjournalEntries=require('./modules/accounting/routes/reportjournalentries.routes');
const reportbydate=require('./modules/accounting/routes/reportsearchjournalentries.routes');
const reportgl=require('./modules/accounting/routes/reportGl.routes');
const transaction=require('./modules/accounting/routes/transaction.routes');
const reportsss=require('./modules/accounting/routes/reportTestGL.routes')
const reportbalanceSheet=require('./modules/accounting/routes/reportbalanceSheet.routes')
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, x-access-token, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).send({
        message: "No token provided!"
    });
});
app.use("/accounting/api/accounts", cors(), accountsRouters);
app.use("/accounting/api/books", cors(), booksRouters);
app.use("/accounting/api/currency_code", cors(), codesRouters);
app.use("/accounting/api/currencies", cors(), currencyRouters);
app.use("/accounting/api/chartofaccounts", cors(), accountRouters);
app.use("/accounting/api/company", cors(), companyRouters);
app.use("/accounting/api/accounts-type", cors(), accountsTypeRouters);
app.use("/accounting/api/detail-type", cors(), detailTypeRouters);
app.use("/accounting/api/journal-entries",cors(),journalEntries);
app.use("/accounting/api/reportjournal-entries",cors(),reportjournalEntries);
app.use("/accounting/api/reportbydate",cors(),reportbydate);
app.use("/accounting/api/report",cors(),reportgl);
app.use("/accounting/api/transaction",cors(),transaction);
app.use("/accounting/api/report-test",cors,reportsss);
app.use("/accounting/api/reportbalancesheet",cors,reportbalanceSheet)
module.exports = app;