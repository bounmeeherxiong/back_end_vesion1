const ChartofAccounts = require('../models/chartofAccounts.model');
const accountModel = new ChartofAccounts();
const uuid = require('uuid');


exports.insertchartofaccount = async (req, res, next) => {

    try {
        const uid = uuid.v4();
        const ac_type = req.body.ac_type;
        const detail_type = req.body.detail_type;
        const name_eng = req.body.name_eng;
        const c_desc = req.body.c_desc;
        let parents = req.body.parents;
        const accountid = req.body.accountid;
        const currencies_id = req.body.currencies_id;
        const checked = req.body.checked;
        const beginningBalance = req.body.beginningBalance;
        const debit = req.body.debit;
        const credit = req.body.credit;
        const balancecurrecies = req.body.balance;
        const balancelak = req.body.balancelak;
        const createdate = req.body.createdate;
        const exchangeRate = req.body.exchangeRate;
        const currencystatus = req.body.currencystatus;  
        const bank_id=req.body.bank_id
       
        const name = name_eng.trim();
        const checkName = await accountModel.checkAccountName(name)
        if (checkName.length > 0) {
            res.status(409).json({
                statusCode: 409,
                message: "Conflict"
            })
        } else {
         await accountModel.insertchartofaccounts(uid, ac_type, detail_type, name_eng, c_desc, parents, accountid, currencies_id, checked, beginningBalance, debit, credit, balancecurrecies.replaceAll(",", ''), balancelak, createdate, exchangeRate.replaceAll(",", ''), currencystatus,bank_id);        
            res.status(201).json({
                statusCode: 201,
                message: "Created"
            })
        }
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        })
    }
}
exports.Updatechartofaccount = async (req, res, next) => {  
    try {
        const currencystatus = req.body.currencystatus    
        const id = req.body.getid; 
        const ac_type = req.body.ac_type;
        const name_eng = req.body.name_eng;
        const c_desc = req.body.c_desc;
        const parents = req.body.parents;
        const currencies_id = req.body.currencies_id;
        const checked = req.body.checked;
        const beginningBalance = req.body.beginningBalance;
        const ledgerid = req.body.ledgerid;
        const debit = req.body.debit;
        const credit = req.body.credit;
        const balancecurrecies = req.body.balance.replaceAll(",",'')
        const balancelak = req.body.balancelak;
        const exchangeRate = req.body.exchangeRate.replaceAll(",",'')
        await accountModel.Updatechartofaccount(id, ac_type, name_eng, c_desc, parents, currencies_id, beginningBalance, checked, debit, credit, currencystatus,ledgerid,balancecurrecies,balancelak,exchangeRate);
        return res.status(200).json({
            stastusCode: 200,
            message: "Updated"
        })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}

exports.selectallparents = async (req, res, next) => {
    const c_id = req.params.c_id;

    const parent = await accountModel.selectAllParents(c_id)
    const onlyparent = await accountModel.selectOnlyoneparents(c_id)
    const parrentToinsert = await accountModel.selectparrentToinsert(c_id)
    const condition = await accountModel.selectconditions(c_id)
    const checksubject= await accountModel.selectChecksubject(c_id)
    const createstatus = await accountModel.selectCreateStutas(c_id)
    const asset= await accountModel.selectStatusAccount(c_id)
    const checkAccount= await accountModel.checkaccounts_type(c_id)
   
    return res.status(200).json({ message: parent, result: onlyparent, parent: parrentToinsert,condition:condition,createstatus:createstatus,checksubject:checksubject,asset:asset,checkAccount:checkAccount });
}
exports.slectAllchartofaccount = async (req, res, next) => {
    const data = await accountModel.selectAll();
    res.status(200).json({
        stastusCode: 200,
        message: "Success",
        result: data
    });
}
exports.selectcreatestutes= async(req,res,next)=>{
    const c_id=req.params.c_id;

    const data= await accountModel.selectcreatestutes(c_id);
    
    res.status(200).json({
        stastusCode:200,
        message:"Success",
        result:data
    })
}
exports.selectallbyid = async (req, res, next) => {
    const ac_type = req.params.ac_type;
    const data = await accountModel.selectallByid(ac_type);
    return res.status(200).json({
        result: data
    })
}
exports.selectAllaccount = async (req, res, next) => {
    try {
        
        const firstFloor = await accountModel.selectallaccountname();
        const children = await accountModel.selecttallaccountchildren();

        return res.status(200).json({ message: firstFloor, children: children });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        })
    }
}
exports.selectaccountType = async (req, res, next) => {
    try {
        const ac_type = req.params.ac_type;
        const getac_type = await accountModel.selectaccoutType(ac_type)
        res.status(200).json({
            statusCode: 200,
            result: getac_type
        })
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        })
    }
}
exports.editchartBeginning = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await accountModel.editchartBeginning(id)
        res.status(200).json({
            stastusCode: 200,
            result: data
        })

    } catch (e) {
        res.status(500).json({
            stastusCode: 500,
            message: e.message
        })
    }
}
exports.selectaccount = async (req, res, next) => {
    try {
        const getaccount = await accountModel.selectaccount()
        res.status(200).json({
            statusCode: 200,
            result: getaccount
        })
    } catch (e) {
        res.status(500).json({
            stastusCode: 500,
            message: e.message
        })
    }
}
exports.selectbank = async (req, res, next) => {
    try {
        const bank = await accountModel.selectbank()
        res.status(200).json({
            statusCode: 200,
            result: bank
        })
    } catch (e) {
        res.status(500).json({
            stastusCode: 500,
            message: e.message
        })
    }
}


