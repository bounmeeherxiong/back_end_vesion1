const db = require('../../../configs/database');

class ReportJournal {
    async reportbydate(id, start, end) {
        const query = await db.query("SELECT a.lg_id,a.ch_id,b.name_eng,a.lg_desc,a.journal_no,a.amout,a.balances,a.createdate FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.createdate BETWEEN ? and ? and  a.c_uid=?;", [start, end, id]);
        return query.length == 0 ? null : query[0];
    }
    async reportbybalance(id, start, end) {
        const query = await db.query("SELECT a.balances FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.createdate BETWEEN ? and ? and  a.c_uid=?;", [start, end, id]);
        return query.length == 0 ? null : query[0];
    }
    async reportTrialbalace() {
        const query = await db.query("SELECT b.c_id,b.name_eng,SUM(a.`amout`) as balances,d.createstatus,b.parents FROM accounting2022.ledger_entries a INNER JOIN accounting2022.chart_of_accounts b ON b.c_id=a.ch_id INNER JOIN accounting2022.accounts_type c ON c.uid=b.ac_type INNER JOIN accounting2022.accounts d ON d.uid=c.main_type WHERE a.p_and_l is null GROUP BY a.ch_id ORDER BY a.ch_id;");
        return query.length == 0 ? null : query[0];
    }
    async reportfirsttrialbalnce() {
        const query = await db.query("SELECT b.name_eng,a.c_id,a.parents FROM accounting2022.transactions_ledger_entries a  INNER JOIN accounting2022.chart_of_accounts b ON b.c_id=a.c_id ORDER BY a.c_id;")
        return query.length == 0 ? null : query[0]
    }
    async reportTrialbalanceBydate() {
        const query = await db.query("SELECT b.c_id,b.name_eng,SUM(a.debit) debit ,SUM(a.credit) credit FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.createdate BETWEEN  ? and ?  GROUP BY a.ch_id ORDER BY SUM(a.debit),SUM(a.credit);", [start, end]);
        return query.length == 0 ? null : query[0]
    }
    async reporttotalTrialbalance() {
        const query = await db.query("SELECT SUM(a.debit) debit ,SUM(a.credit) credit FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id;");
        return query.length == 0 ? null : query[0]
    }
    async reportsearchBydateTriabalnce(start, end) {
        const query = await db.query("SELECT b.c_id,b.name_eng,SUM(a.debit) debit ,SUM(a.credit) credit FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.createdate BETWEEN  ? and ?  GROUP BY a.ch_id ORDER BY SUM(a.debit),SUM(a.credit);", [start, end]);
        return query.length == 0 ? null : query[0]
    }
    async reportsearchBytotalTriabalance(start, end) {
        const query = await db.query("SELECT SUM(a.debit) debit ,SUM(a.credit) credit FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.createdate BETWEEN ? and ?;", [start, end]);
        return query.length == 0 ? null : query[0]
    }
}
module.exports = ReportJournal;
