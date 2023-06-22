const Accounts = require('../models/accounts.model');
const accountsModel = new Accounts();
const uuid = require('uuid');

exports.insertAccounts = async (req, res, next) => {
    try {
        const uid = uuid.v4();
        const name_eng = req.body.name_eng;
        const uri_eng = name_eng.trim();
        var validate = /^[0-9a-zA-Zก-๏ກ-ຮຽຳາຶື້່ິີູຸໍົັົ້ັ້່໋໊ຶ້ືໍຯຫຍເໆໝໜຫຼແະາໃໄ ]+$/;
        
        const checkName = await accountsModel.checkName(uri);

        const data = new Accounts(uid, uri_eng, name_eng);
        name_eng == "" ? (
            res.status(200).json({
                statusCode: 200,
                message: "Please enter name"
            })
        ) : (!name_eng.match(validate)) ? (
            res.status(400).json({
                stastusCode: 400,
                mesage: "Bad Request"
            })
        ) : (
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
            )
        );
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.slectAllAccounts = async (req, res, next) => {
    const data = await accountsModel.selectAll();
    res.status(200).json({
        stastusCode: 200,
        message: "Success",
        result: data
    });
}

exports.selectOneAccounts = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const data = await accountsModel.selectOne(uid);
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

exports.updateAccounts = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const name_eng = req.body.name_eng;
        const uri_eng = name_eng.trim();
        var validate = /^[0-9a-zA-Zก-๏ກ-ຮຽຳາຶື້່ິີູຸໍົັົ້ັ້່໋໊ຶ້ືໍຯຫຍເໆໝໜຫຼແະາໃໄ ]+$/;
        const checkUid = await accountsModel.selectOne(uid);

        const checkName = await accountsModel.checkUpdateName(uri_eng, uid);
        
        const data = new Accounts('', uri_eng, name_eng);
        checkUid ? (
            name_eng == "" ? (
                res.status(200).json({
                    statusCode: 200,
                    message: "Please enter name"
                })
            ) : (!name_eng.match(validate)) ? (
                res.status(400).json({
                    stastusCode: 400,
                    mesage: "Bad Request"
                })
            ) : (
                checkName.length > 0 ? (
                    res.status(409).json({
                        statusCode: 409,
                        message: "Conflict"
                    })
                ) : (
                    await data.update(uid),
                    res.status(200).json({
                        stastusCode: 200,
                        message: "Updated"
                    })
                )
            )
        ) :
            res.status(404).json({
                stastusCode: 404,
                message: "Not Found"
            });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.deleteAccounts = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const checkUid = await accountsModel.selectOne(uid);
        checkUid ? (
            accountsModel.delete(uid),
            res.status(200).json({
                statusCode: 200,
                message: "Success"
            })
        ) :
            res.status(404).json({
                stastusCode: 404,
                message: "Not Found"
            })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}