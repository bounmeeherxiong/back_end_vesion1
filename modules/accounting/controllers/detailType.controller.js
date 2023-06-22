const Details = require('../models/detailType.model');
const detailModel = new Details();
const uuid = require('uuid');

exports.insertDetails = async (req, res, next) => {
    try {
        const uid = uuid.v4();
        const name_eng = req.body.name_eng;
        console.log(name_eng)
        const uri_eng = name_eng.trim();
        const ac_type = req.body.ac_type;
        var data = new Details(uid, uri_eng, name_eng, ac_type);
        const checkName = await detailModel.selectInsert(name_eng);
        name_eng == "" ? (
            res.status(400).json({
                statusCode: 400,
                mesage: "Can not null"
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

exports.selectAllDetail = async (req, res, next) => {
    const data = await detailModel.selectAll();
    res.status(200).json({
        statusCode: 200,
        message: "Success",
        result: data
    });
}

exports.selectOneDetail = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const data = await detailModel.selectOne(uid);
        !data ? (
            res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        ) : (
            res.status(200).json({
                statusCode: 200,
                message: "Success",
                result: data
            })
        );
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.editdetailType = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const data = await detailModel.editdetailType(uid)
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            result: data
        })

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}


exports.selectByType = async (req, res, next) => {
    try {
        const type = req.params.ac_type;
        const data = await detailModel.selectByAccountType(type);
        !data ? (
            res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        ) : (
            res.status(200).json({
                statusCode: 200,
                message: "Success",
                result: data
            })
        );
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.updateDetail = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const name_eng = req.body.name_eng;
        const uri_eng = name_eng.trim();
        const ac_type = req.body.ac_type;
        var data = new Details('', uri_eng, name_eng, ac_type);
        const getId = await detailModel.selectOne(uid);
        const checkName = await detailModel.selectUpdate(name_eng, uid);
        !getId ? (
            res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        ) : (
            name_eng == "" ? (
                res.status(400).json({
                    statusCode: 400,
                    message: "Can not null"
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
                        statusCode: 200,
                        message: "Updated"
                    })
                )
            )
        );
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.deleteDetails = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const getId = await detailModel.selectOne(uid);
        !getId ? (
            res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        ) : (
            detailModel.delete(uid),
            res.status(200).json({
                stastusCode: 200,
                message: "Deleted"
            })
        );
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}