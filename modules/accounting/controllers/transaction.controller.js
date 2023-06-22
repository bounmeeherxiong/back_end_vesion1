const tran = require('../models/transaction.models');
const transa = new tran();

exports.transaction = async (req, res, next) => {
    try {
        const all = await transa.selectall()
        return res.status(200).json({ result: all });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.getTransaction = async (req, res, next) => {
    const id = req.params.id;
    try {
        const data = await transa.getselectTransaction(id)
        // let keys = ['currencystatus'];
        // let values = ['USD', 'THB'];
        // let filtered_data = data.filter(d => {
        //     for (let key of keys) {
        //         for (let value of values) {
        //             if (d[key] == value) {
        //                 return true;
        //             }
        //         }
        //     }
        //     return false;
        // });
        // console.log(filtered_data)
        // const statuscurrency=filtered_data[0].currencystatus
        // await transa.getinsertAutoTransaction(id,statuscurrency)


        return res.status(200).json({ result: data })

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}


