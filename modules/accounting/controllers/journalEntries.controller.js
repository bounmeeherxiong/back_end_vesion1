const Journals = require('../models/journalEntries.model');
const journalModel = new Journals();
const uuid = require('uuid');
exports.insertJournal = async (req, res, next) => {
    try {
        const uid = uuid.v4();
        const journal_no = req.body.journal_no;
        const ExchangeRate = req.body.ExchangeRate;
        const newdate = req.body.tr_date;
        var tr_date = newdate.split("-").reverse().join("-");
        const debit = req.body.debit;
        const credit = req.body.credit;
        const informdata = req.body.informdata;
        const currency_id = req.body.currency_id;
        const currency = req.body.currency;
        const data = new Journals(uid, journal_no, tr_date, debit, credit, ExchangeRate);
        const transaction_Id = await data.insertDoubleEntries();
        await data.insertcounting();
        const id = transaction_Id.insertId
        await data.insertledgerEntries(id, informdata, journal_no, tr_date, ExchangeRate, currency);
        await data.insertTransaction_ledger_entries(informdata, id)
        await data.updatechartofaccount(informdata, ExchangeRate)
        res.status(201).json({
            statusCode: 201,
            message: "Create successffully"
        });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.images = async (req, res, next) => {
    try {
        const { filename: image } = req.file;
        await sharp(req.file.path)
            .resize(300, 300)
            .jpeg({ quality: 90 })
            .toFile(
                path.resolve(req.file.destination, 'resized', image)
            )
        return res.status(200).json(req.file.filename);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}
exports.selectcountnumer = async (req, res, next) => {
    const data = await journalModel.selectcountnumber();
    res.status(200).json({
        stastusCode: 200,
        message: "Success",
        result: data
    });
}


exports.deleteledger = async (req, res, next) => {
    try {
        const id = req.params.id;
        const checkid = await journalModel.checkid(id)
        checkid.length > 0 ? (
            await journalModel.deleteledger(id),
            res.status(200).json({
                statusCode: 200,
                message: "Success"
            })
        ) : (
            await journalModel.deleteledger2(id),
            res.status(200).json({
                statusCode: 200,
                message: "Success"
            })

        )
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        })
    }
}