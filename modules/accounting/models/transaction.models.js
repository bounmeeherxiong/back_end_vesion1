const db = require('../../../configs/database');
class transaction {
    async selectall() {
        const query = await db.query("SELECT a.tr_id,a.tr_date datetimes,a.journal_no FROM accounting2022.transactions a;");
        return query.length == 0 ? null : query[0];
    }
    async getselectTransaction(id) {
        const query = await db.query("SELECT a.lg_id,a.ch_id as c_id,b.name_eng as name,a.debit,a.credit,a.lg_desc as description,a.currencystatus,a.amoutcurrency FROM  accounting2022.ledger_entries a INNER JOIN accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.tr_id= ?", [id]);
        return query.length == 0 ? null : query[0];
    }
    async getinsertAutoTransaction(id,statuscurrency) {
        const query = await db.query("SELECT a.debit,a.credit FROM  accounting2022.ledger_entries a INNER JOIN accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.tr_id=? and a.currencystatus=?", [id,statuscurrency]);
        const informdata=query[0]
        for (let data of informdata) {
            if(data?.debit =='0.00')
            {
                console.log("insert to debit")
            }else{
                console.log("insert to credit")
            }
        }
    }


}
module.exports = transaction;
