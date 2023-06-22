const reportGL = require('../models/reportGl.model');
const report = new reportGL();

exports.reportGL = async (req, res, next) => {
    try {
        const firstFloor = await report.firstFloorGL()
        const childrenFirstFloor = await report.childrenFirstFloor()
        const childrenSecondFloor = await report.childrenSecondFloor()
        const SecondFloor = await report.SecondFloor();
        return res.status(200).json({ firstFloor: firstFloor, SecondFloor: SecondFloor, childrenFirstFloor: childrenFirstFloor, childrenSecondFloor: childrenSecondFloor });

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.sumTotal = async (req, res, next) => {
    const { c_id } = req.body;
    try {
        const check_data = await report.checkid(c_id)

        const parent = await report.sumTotal(c_id)
        return res.status(200).json({ data: parent, check_data: check_data });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.sumTotalAccountBydate = async (req, res, next) => {
    const newdate1 = req.body.start
    const newdate2 = req.body.end
    const c_id = req.body.ch_id
    var start = newdate1.split("-").reverse().join("-");
    var end = newdate2.split("-").reverse().join("-");
    try {
        const sumList = await report.sumTotalAccountBydate(c_id, start, end)
     
        return res.status(200).json({ data: sumList })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.sumTotalCustomAndTodayBydate = async (req, res, next) => {
    const newdate1 = req.body.start
    const newdate2 = req.body.end
    const c_id = req.body.c_id
    var start = newdate1.split("-").reverse().join("-");
    var end = newdate2.split("-").reverse().join("-");
    try {
        const sumList = await report.sumTotalCustomAndTodayBydate(c_id, start, end)
        return res.status(200).json({ data: sumList })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.sumTotalGL = async (req, res, next) => {

    const { c_id } = req.body;

    try {
        const parent = await report.sumTotalGL(c_id)
        return res.status(200).json({ data: parent });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.runreport = async (req, res, next) => {
    const c_id = req.params.id;
    try {
        const firstFloor = await report.firstFloor(c_id)
        const children = await report.children(c_id)
        return res.status(200).json({ firstFloor: firstFloor, children: children });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.retportAllGL = async (req, res, next) => {
    const c_id = req.params.id
    try {
        const children = await report.retportAllGL(c_id)
        return res.status(200).json({ children: children });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.runreportSeachBydate = async (req, res, next) => {
    const newdate1 = req.body.defaultValue
    const newdate2 = req.body.defaultValue1
    const c_id = req.body.c_id
    var start = newdate1.split("-").reverse().join("-");
    var end = newdate2.split("-").reverse().join("-");
    try {
        const firstFloor = await report.firstFloor(c_id)
        const children = await report.RunreportSeachBydate(c_id, start, end)
        return res.status(200).json({ firstFloor: firstFloor, children: children });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.reportAllGlbydate = async (req, res, next) => {
    const start = req.body.start
    const end = req.body.end
    const id = req.body.id
    try {
        const searchChildren = await report.retportAllGLbyDate(id, start, end)

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        })
    }
}
exports.reportGLbydate = async (req, res, next) => {
    const newdate1 = req.body.start
    const newdate2 = req.body.end
    var start = newdate1.split("-").reverse().join("-");
    var end = newdate2.split("-").reverse().join("-");
    try {
        const firstFloorbySearch = await report.firstFloorbydate(start,end)
 
        const SecondFloorbySearch = await report.SecondFloorbydate(start,end)

        const childrenFirstFloor = await report.reportbydateFirstFloor(start, end)
        console.log("childrenFirstFloor=",childrenFirstFloor)

        const childrenSecondFloor = await report.reportbydateSecondFloor(start, end)
        console.log("childrenSecondFloor=",childrenSecondFloor)

        return res.status(200).json({ firstFloor: firstFloorbySearch, SecondFloor: SecondFloorbySearch, childrenFirstFloor: childrenFirstFloor, childrenSecondFloor: childrenSecondFloor });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        })
    }
}
exports.reportbyaccount = async (req, res, next) => {
    const newdate1 = req.body.start
    const newdate2 = req.body.end
    const c_id = req.body.ch_id
    var start = newdate1.split("-").reverse().join("-");
    var end = newdate2.split("-").reverse().join("-");
    try {
        const firstFloorbySearch = await report.firstFloorSearchbyAccount(start, end, c_id)
        console.log("firstFloorbySearch=", firstFloorbySearch)
        const SecondFloorbySearch = await report.SecondFloorSearchbyAccount(start, end, c_id)
        console.log("SecondFloorbySearch=", SecondFloorbySearch)
        const childrenFirstFloor = await report.reportbyaccountFirstFloor(start, end, c_id)
        console.log("childrenFirstFloor=", childrenFirstFloor)
        const childrenSecondFloor = await report.reportbyaccountSecondFloor(start, end, c_id)
        console.log("childrenSecondFloor=", childrenSecondFloor)
        return res.status(200).json({ firstFloor: firstFloorbySearch, SecondFloor: SecondFloorbySearch, childrenFirstFloor: childrenFirstFloor, childrenSecondFloor: childrenSecondFloor });


    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        })
    }
}
exports.reportbalanceSheet = async (req, res, next) => {
    try {
        const heading = await report.heading()

        const headingLibilities = await report.headingLibilities()

        const subject = await report.subject()

        const subjectOwner = await report.subjectOwner()

        const childrenFirstFloor = await report.childrenFirst()

        const childrenSecondFloor = await report.childrensecond()

        const firsttotal = await report.totalchidrenFirst()

        // const result = await report.insert()
        const secondtotal = await report.totalchidrenSecond();
        const subjecttotal = await report.totalsubject();
        const sumAsset = await report.sumAsset();
        const sumliabilitiesAndOwnerequity = await report.sumliabilitiesAndOwnerequity()
        const balancesheetandloss = await report.sumbalancesheetToprofitandlos()
        return res.status(200).json({
            result: heading,
            subject: subject,
            childrenFirstFloor: childrenFirstFloor,
            childrenSecondFloor: childrenSecondFloor,
            sumAsset: sumAsset,
            headingLibilities: headingLibilities,
            subjectOwner: subjectOwner,
            firsttotal: firsttotal,
            secondtotal: secondtotal,
            subjecttotal: subjecttotal,
            balancesheetandloss: balancesheetandloss,
            sumliabilitiesAndOwnerequity: sumliabilitiesAndOwnerequity
        });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.searchbalancesheet = async (req, res, next) => {
    try {
        const newdate1 = req.body.start
        const newdate2 = req.body.end
        var start = newdate1.split("-").reverse().join("-");
        var end = newdate2.split("-").reverse().join("-");
        const heading = await report.heading()
        const headingLibilities = await report.headingLibilities()
        const subject = await report.subject()
        const subjectOwner = await report.subjectOwner()
        const childrenFirstFloor = await report.searchChildrenfirst(start, end)
        const childrenSecondFloor = await report.searchchildrensecond(start, end)
        const firsttotal = await report.searchtotalchidrenFirst(start, end)
        const secondtotal = await report.searchtotalchidrenSecond(start, end);
        const sumAsset = await report.searchSumAsset(start, end);
        const balancesheetandloss = await report.searchsumbalancesheetToprofitandlos(start, end)
        const subjecttotal = await report.searchtotalsubject(start, end);

        return res.status(200).json({
            result: heading,
            subject: subject,
            subjectOwner: subjectOwner,
            childrenFirstFloor: childrenFirstFloor,
            childrenSecondFloor: childrenSecondFloor,
            headingLibilities: headingLibilities,
            firsttotal: firsttotal,
            secondtotal: secondtotal,
            subjecttotal: subjecttotal,
            balancesheetandloss: balancesheetandloss,
            sumAsset: sumAsset
        })

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}



exports.reportProfitandLoss = async (req, res, next) => {
    try {
        const heading = await report.headingIncomeandCost()
        const headingExpenses = await report.headingExpenses()
        const childrenFirstFloor = await report.childrenFirst()
        const childrenSecondFloor = await report.childrensecond()
        const firsttotal = await report.totalchidrenFirst()
        const secondtotal = await report.totalchidrenSecond();
        const balancesheetandloss = await report.sumbalancesheetToprofitandlos()
        const sumbalanceIncomeandcostofsale = await report.sumbalanceIncomeandcostofsale()
        return res.status(200).json({
            result: heading,
            headingEx: headingExpenses,
            childrenFirstFloor: childrenFirstFloor,
            childrenSecondFloor: childrenSecondFloor,
            firsttotal: firsttotal,
            secondtotal: secondtotal,
            balancesheetandloss: balancesheetandloss,
            sumbalanceIncomeandcostofsale: sumbalanceIncomeandcostofsale
        });

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.EnterExchangeRates = async (req, res, next) => {
    try {
        const EnterExchangeRates = await report.EnterExchangeRates()
        return res.status(200).json({
            result: EnterExchangeRates,
        })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.SelectgainAndLoss = async (req, res, next) => {
    try {
        const gain = await report.SelectgainAndLoss()
        return res.status(200).json({
            result: gain,
        })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.selectTotalgainandloss = async (req, res, next) => {
    try {
        const loss = await report.selectTotalgainandloss()
        return res.status(200).json({
            result: loss,
        })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.selectdateofexhangeRate = async (req, res, next) => {
    try {

        const newdate = req.params.date
        var date = newdate.split("/").reverse().join("/");
        const gain = await report.selectdateofexhangeRate(date)
        if (gain.length == 0) {
            return res.status(200).json({
                result: 0,
            })
        } else {
            return res.status(200).json({
                result: gain,
            })

        }

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.selectTransactiongainandloss = async (req, res, next) => {
    try {
        const gain = await report.selectTransactiongainandloss(date)
        return res.status(200).json({
            result: gain,
        })

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.transactiongainandloss = async (req, res, next) => {
    try {
        const gain = await report.transactiongainandloss()
        return res.status(200).json({
            result: gain,
        })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.CreategainAndloss = async (req, res, next) => {
    try {
        const data = req.body.data;
        const bank_id=req.body.bank_id;
        const newdate = req.body.defaultValue
        var date = newdate.split("/").reverse().join("/");
        await report.CreategainAndloss(data, date,bank_id)
        res.status(201).json({
            statusCode: 201,
            result: "Successuffuly"
        });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}


exports.insertJournal = async (req, res, next) => {
    try {
        const uid = uuid.v4();
        const journal_no = req.body.journal_no;
        const ExchangeRate = req.body.ExchangeRate;
        const newdate = req.body.tr_date;
        var tr_date = newdate.split("-").reverse().join("-");
        const debit = req.body.debit;
        const credit = req.body.credit;

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
exports.sumsubjectTotal = async (req, res, next) => {
    try {
        const { c_id } = req.body;
        const Total = await report.sumsubjectTotal(c_id)
        return res.status(200).json({
            data: Total
        });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}




