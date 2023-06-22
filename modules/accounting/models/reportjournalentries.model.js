const db = require('../../../configs/database');

class ReportJournal {
    async reportjournalentry() {
        let sql = "SELECT a.created_at,a.journal_no,a.lg_desc,b.name_eng,a.debit,a.credit FROM accounting2022.ledger_entries a INNER JOIN accounting2022.chart_of_accounts b ON b.c_id=a.ch_id";
        const query = await db.query(sql);
        return query.length == 0 ? null : query[0];
    }
    
    async reportfirst(ch_id) {
        let sql = await db.query("SELECT a.`c_id` FROM accounting2022.chart_of_accounts a WHERE a.`c_uid`= ?;", [ch_id]);
        let id = sql[0][0].c_id
        let first = await db.query("WITH RECURSIVE cte (c_id, parents) AS ( SELECT c_id, parents FROM accounting2022.transactions_ledger_entries WHERE c_id = ? UNION SELECT t1.c_id, t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.parents = t1.c_id ) SELECT u.c_id, u.parents,k.name_eng FROM cte u INNER JOIN accounting2022.chart_of_accounts k ON k.c_id=u.c_id WHERE u.parents='0' ORDER BY u.c_id", [id])
        return first.length == 0 ? null : first[0]
    }
    async reportbyid(ch_id) {
        let query = await db.query("SELECT a.`c_id` FROM accounting2022.chart_of_accounts a WHERE a.`c_uid`= ?;", [ch_id]);
        return query.length == 0 ? null : query[0]
    }
    async reportsecod(ch_id) {
        let sql = await db.query("SELECT a.`c_id` FROM accounting2022.chart_of_accounts a WHERE a.`c_uid`= ?;", [ch_id]);
        let id = sql[0][0].c_id
        let secode = await db.query("WITH RECURSIVE cte (c_id, parents) AS ( SELECT c_id, parents FROM accounting2022.transactions_ledger_entries WHERE c_id = ? UNION SELECT t1.c_id, t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.parents = t1.c_id ) SELECT u.c_id, u.parents,k.name_eng FROM cte u INNER JOIN accounting2022.chart_of_accounts k ON k.c_id=u.c_id WHERE u.parents <> 0  ORDER BY u.c_id;", [id])
        return secode.length == 0 ? null : secode[0]
    }

    async reportchildren(ch_id) {
        let sql = await db.query("SELECT a.`c_id` FROM accounting2022.chart_of_accounts a WHERE a.`c_uid`= ?;", [ch_id]);
        let id = sql[0][0].c_id

        let children = await db.query("SELECT * FROM accounting2022.ledger_entries a WHERE a.`ch_id`= ?;", [id]);
        return children.length == 0 ? null : children[0]
    }


    async reportmainaccount(ch_id) {
        const query = await db.query("SELECT  b.name_eng  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.c_uid=?", [ch_id]);
        return query.length == 0 ? null : query[0];
    }
    async reporttotalaccount(ch_id) {
        const query = await db.query("SELECT a.balances FROM accounting2022.ledger_entries a WHERE a.c_uid=? and a.createstatus='1'", [ch_id]);
        return query.length == 0 ? null : query[0];
    }

    async reportbyaccount(ch_id){
        let sql="SELECT a.lg_id,a.ch_id,b.name_eng,a.lg_desc,a.journal_no,a.amout,a.balances,a.createdate,a.ExchangeRate,a.amoutcurrency,a.balancescurrency,a.currencystatus,a.BeginningBalance,a.debit,a.credit,a.conditions FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.c_uid=? ORDER BY a.lg_id ";
        let data = [ch_id];
        const query = await db.query(sql,data);
        return query.length == 0 ? null : query[0];
    }


}
module.exports = ReportJournal;