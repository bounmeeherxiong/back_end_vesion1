const Types = require('../models/accountsType.model');
const typesModel = new Types();
const uuid = require('uuid');

exports.insertTypes = async (req, res, next) => {
    try {
        const uid = uuid.v4();
        const name_eng = req.body.name_eng;
        let uri_eng = name_eng.trim();
        const main_type = req.body.main_type;
        const data = new Types(uid, uri_eng, name_eng, main_type);
        const checkName = await typesModel.selectInsert(name_eng);
        checkName.length > 0 ? (
            res.status(409).json({
                statusCode: 409,
                message: "Conflict"
            })
        ) : (
            await data.insert(),
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

exports.selectALlTypes = async (req, res, next) => {
    const data = await typesModel.selectAll();
    res.status(200).json({
        statusCode: 200,
        message: "Success",
        result: data
    });
}

exports.selectOneTypes = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const data = await typesModel.selectOne(uid);
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

exports.updateTypes = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const name_eng = req.body.name_eng;
        const uri_eng = name_eng.trim();
        const main_type = req.body.main_type;
        const data = new Types('', uri_eng, name_eng, main_type);
        const checkName = await typesModel.selectUpdate(name_eng, uid);
        const getId = await typesModel.selectOne(uid);
        !getId ? (
            res.status(404).json({
                statusCode: 404,
                message: "Not Found"
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
        );
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.deleteTypes = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const getId = await typesModel.selectOne(uid);
        !getId ? (
            res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        ) : (
            typesModel.delete(uid),
            res.status(200).json({
                statusCode: 200,
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
exports.selecteEditaccounts_type = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await typesModel.selecteEditaccounts_type(id);
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