const Company = require('../models/company.model');
const companyModel = new Company();
const uuid = require('uuid');

exports.insertCompany = async(req, res, next) => {
    try {
        const uid = uuid.v4();
        const code = req.body.com_code;
        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email;
        const address = req.body.address;
        const desc = req.body.com_desc;
        const checkName = await companyModel.checkName(name, email, code);
        const data = new Company(uid, code, name, phone, email, address, desc);
        if (checkName.length > 0) {
            res.status(409).json({
                statusCode: 409,
                message: "Conflict"
            });
        } else {
            data.insert();
            res.status(201).json({
                statusCode: 201,
                message: "Created"
            });
        }
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.selectAllCompany = async(req, res, next) => {
    const data = await companyModel.selectAll();
    res.status(200).json({
        statusCode: 200,
        message: "Success",
        result: data
    });
}

exports.selectOneCompany = async(req, res, next) => {
    try {
        const uid = req.params.uid;
        const data = await companyModel.selectOne(uid);
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

exports.updateCompany = async(req, res, next) => {
    try {
        const uid = req.params.uid;
        const code = req.body.com_code;
        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email;
        const address = req.body.address;
        const desc = req.body.com_desc;
        const checkName = await companyModel.checkUpdate(name, email, uid);
        const getId = await companyModel.selectOne(uid);
        const data = new Company('', code, name, phone, email, address, desc);
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
                    message: "Updated",
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

exports.deleteCompany = async(req, res, next) => {
    try {
        const uid = req.params.uid;
        const getId = await companyModel.selectOne(uid);
        !getId ? (
            res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        ) : (
            companyModel.delete(uid),
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

exports.selectchecked_currency=async(req,res,next)=>{
    try {
        const uid = req.params.uid;
        const data = await companyModel.selectchecked_currency(uid)
       return res.status(200).json({
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