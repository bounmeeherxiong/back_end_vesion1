const Books = require('../models/books.model');
const bookModel = new Books();
const uuid = require('uuid');

exports.insertBooks = async(req, res, next) => {
    try {
        const uid = uuid.v4();
        const name = req.body.name;
        // const uri = name.split(' ').join('_');
        let uri = name.trim();
        var validate = /^[0-9a-zA-Zก-๏ກ-ຮຽຳາຶື້່ິີູຸໍົັົ້ັ້່໋໊ຶ້ືໍຯຫຍເໆໝໜຫຼແະາໃໄ ]+$/;
        const checkName = await bookModel.checkName(uri);
        const data = new Books(uid, uri, name);
        name == "" ? (
                res.status(200).json({
                    statusCode: 200,
                    message: "Please enter name"
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

exports.slectAllBooks = async(req, res, next) => {
    const data = await bookModel.selectAll();
    res.status(200).json({
        stastusCode: 200,
        message: "Success",
        result: data
    });
}

exports.selectOneBooks = async(req, res, next) => {
    try {
        const uid = req.params.uid;
        const data = await bookModel.selectOne(uid);
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

exports.updateBooks = async(req, res, next) => {
    try {
        const uid = req.params.uid;
        const name = req.body.name;
        const uri = name.split(' ').join('_');
        var validate = /^[0-9a-zA-Zก-๏ກ-ຮຽຳາຶື້່ິີູຸໍົັົ້ັ້່໋໊ຶ້ືໍຯຫຍເໆໝໜຫຼແະາໃໄ ]+$/;
        const checkUid = await bookModel.selectOne(uid);
        const checkName = await bookModel.checkUpdateName(uri, uid);
        const data = new Books('', uri, name)
        checkUid ? (
                name == "" ? (
                    res.status(200).json({
                        statusCode: 200,
                        message: "Please enter name"
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

exports.deleteBooks = async(req, res, next) => {
    try {
        const uid = req.params.uid;
        const checkUid = await bookModel.selectOne(uid);
        checkUid ? (
                bookModel.delete(uid),
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