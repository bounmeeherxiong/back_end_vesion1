const Currency = require('../models/currency.model');
const currencyModel = new Currency();
const uuid = require('uuid');

exports.insertCurrencies = async (req, res, next) => {
    try {
        const uid = uuid.v4();
        const name = req.body.name;
        let uri = name.trim();
        const rate = req.body.cr_rate;
        const symbol = req.body.cr_symbol;
        const decimal_mark = req.body.decimal_mark;
        const code = req.body.cr_code;
        const precision = req.body.cr_precision;
        const symbol_position = req.body.symbol_position;
        const separator = req.body.cr_separator;
        const enabled = req.body.cr_enabled;
        var validate = /^[0-9a-zA-Zก-๏ກ-ຮຽຳາຶື້່ິີູຸໍົັົ້ັ້່໋໊ຶ້ືໍຯຫຍເໆໝໜຫຼແະາໃໄ ]+$/;
        const checkName = await currencyModel.checkName(uri);
        const data = new Currency(uid, uri, name, rate, symbol, decimal_mark, code, precision, symbol_position, separator, enabled);
        name == "" ? (
            res.status(200).json({
                statusCode: 200,
                message: "Please enter name"
            })
        ) : (!name.match(validate)) ? (
            res.status(400).json({
                statusCode: 400,
                message: "Bad Request"
            })
        ) :
            checkName.length > 0 ? (
                res.status(409).json({
                    statusCode: 409,
                    message: "Conflict"
                })
            ) : (
                data.insert(),
                res.status(201).json({
                    statusCode: 201,
                    message: "Created"
                })
            );
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.selectAllCurrencies = async (req, res, next) => {
    const data = await currencyModel.selectAll();
    res.status(200).json({
        statusCode: 200,
        message: "Success",
        result: data
    });
}
exports.selectstatus = async (req, res, next) => {
    const id = req.params.id;
    const data = await currencyModel.selectstatus(id);
    return res.status(200).json({
        statusCode: 200,
        message: "Success",
        result: data
    })
}
exports.selectOneCurrencies = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const data = await currencyModel.selectOne(uid);
        data ? (
            res.status(200).json({
                statusCode: 200,
                message: "Success",
                result: data
            })
        ) :
            res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.updateCurrencies = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const name = req.body.name;
        let uri = name.trim();
        const rate = req.body.cr_rate;
        const symbol = req.body.cr_symbol;
        const decimal_mark = req.body.decimal_mark;
        const code = req.body.cr_code;
        const precision = req.body.cr_precision;
        const symbol_position = req.body.symbol_position;
        const separator = req.body.cr_separator;
        const enabled = req.body.cr_enabled;
        var validate = /^[0-9a-zA-Zก-๏ກ-ຮຽຳາຶື້່ິີູຸໍົັົ້ັ້່໋໊ຶ້ືໍຯຫຍເໆໝໜຫຼແະາໃໄ ]+$/;
        const checkId = await currencyModel.selectOne(uid);
        const checkName = await currencyModel.CheckUpdate(name, uid);
        const data = new Currency('', uri, name, rate, symbol, decimal_mark, code, precision, symbol_position, separator, enabled);
        checkId ? (
            name == "" || symbol == "" || decimal_mark == "" || code == "" ? (
                res.status(200).json({
                    statusCode: 200,
                    message: "Please enter data"
                })
            ) : (!name.match(validate)) ? (
                res.status(400).json({
                    statusCode: 400,
                    message: "Bad Request"
                })
            ) : (
                checkName.length > 0 ? (
                    res.status(409).json({
                        statusCode: 409,
                        message: "Conflict"
                    })
                ) :
                    await data.update(uid),
                res.status(200).json({
                    statusCode: 200,
                    message: "Updated"
                })
            )
        ) :
            res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.deleteCurrencies = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const checkId = await currencyModel.selectOne(uid);
        checkId ? (
            await currencyModel.delete(uid),
            res.status(200).json({
                statusCode: 200,
                message: "Success"
            })
        ) :
            res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        })
    }
}
exports.selectchecked_currency = async (req, res, next) => {
    try {
        const uid = req.params.ac_type;

        const data = await currencyModel.selectchecked_currency(uid)
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            result: data
        });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }

}
exports.editcurrency = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await currencyModel.editcurrency(id)
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            result: data
        });

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });

    }
}

exports.selectcurrencylak = async (req, res, next) => {

    try {
        const lak = req.params.lak;
        const data = await currencyModel.selectcurrencyLAK(lak)
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            result: data
        });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }

}
exports.selectcurrencystatus = async (req, res, next) => {
    try {
        const currency = req.params.c_id;
        const data = await currencyModel.selectcurrencystatus(currency)
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            result: data
        });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }

}