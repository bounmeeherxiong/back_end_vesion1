const Codes = require('../models/currencyCode.model');
const codeModel = new Codes();
const uuid = require('uuid');

exports.insertCodes = async(req, res, next) => {
    try {
        const uid = uuid.v4();
        const name = req.body.name;
        const enabled = req.body.enabled;
        const uri = name.split(' ').join('_');
        let tr_name = name.trim();
        var validate = /^[0-9a-zA-Zก-๏ກ-ຮຽຳາຶື້່ິີູຸໍົັົ້ັ້່໋໊ຶ້ືໍຯຫຍເໆໝໜຫຼແະາໃໄ ]+$/;
        const checkName = await codeModel.checkName(uri);
        const data = new Codes(uid, uri, tr_name, enabled)
        name == "" ? (
                res.status(200).json({
                    statusCode: 200,
                    message: "Please enter name"
                })
            ) : (!name.match(validate)) ? (
                res.status(400).json({
                    stastusCode: 400,
                    mesage: "Bad Request"
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

exports.slectAllCodes = async(req, res, next) => {
    const data = await codeModel.selectAll();
    res.status(200).json({
        stastusCode: 200,
        message: "Success",
        result: data
    });
}

exports.selectOneCodes = async(req, res, next) => {
    try {
        const uid = req.params.uid;
        const data = await codeModel.selectOne(uid);
        data ? (
                res.status(200).json({
                    statusCode: 200,
                    message: "Success",
                    result: data
                })
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

exports.updateCodes = async(req, res, next) => {
    try {
        const uid = req.params.uid;
        const name = req.body.name;
        const enabled = req.body.enabled;
        const uri = name.split(' ').join('_');
        var validate = /^[0-9a-zA-Zก-๏ກ-ຮຽຳາຶື້່ິີູຸໍົັົ້ັ້່໋໊ຶ້ືໍຯຫຍເໆໝໜຫຼແະາໃໄ ]+$/;
        const checkUid = await codeModel.selectOne(uid);
        const checkName = await codeModel.checkUpdateName(uri, uid);
        const data = new Codes('', uri, name, enabled);
        checkUid ? (
                name == "" ? (
                    res.status(200).json({
                        statusCode: 200,
                        message: "Please enter name"
                    })
                ) : (!name.match(validate)) ? (
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

exports.deleteCodes = async(req, res, next) => {
    try {
        const uid = req.params.uid;
        const checkUid = await codeModel.selectOne(uid);
        checkUid ? (
                codeModel.delete(uid),
                res.status(200).json({
                    statusCode: 200,
                    message: "Success"
                })
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