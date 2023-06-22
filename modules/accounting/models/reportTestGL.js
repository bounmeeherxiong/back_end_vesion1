const db = require('../../../configs/database');

class ReportTestGL {
    async firstFloor() {
        const query = await db.query("SELECT b.c_id,b.name_eng,a.ch_id,SUM(a.`amout`) amout FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.parents=0   GROUP BY a.ch_id;");
        return query.length == 0 ? null : query[0];
    }
    async children() {
        const query = await db.query("SELECT a.`lg_id`,`tr_id`,a.`ch_id`,a.`debit`,a.`credit`,a.`lg_desc`,a.`lg_name`,a.`journal_no`,a.`amout`,a.`balances`,a.`createstatus`,a.`c_uid`,a.`createdate`,b.`name_eng`  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id;");
        return query.length == 0 ? null : query[0];
    }
    async reportGlbalances() {
        const query = await db.query("SELECT b.`name_eng`,a.`balances`,a.`ch_id`  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.`createstatus`=1;");
        return query.length == 0 ? null : query[0];
    }
    async firstFloorbydate(start,end) {
        const query = await db.query("SELECT b.c_id,b.name_eng,a.ch_id,SUM(a.amout) amout FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.createdate BETWEEN ? and ? GROUP BY a.ch_id;",[start,end]);
        return query.length == 0 ? null : query[0];
    }

    async reportbydate(start,end) {
        const query = await db.query("SELECT a.lg_id,tr_id,a.ch_id,a.debit,a.credit,a.lg_desc,a.lg_name,a.journal_no,a.amout,a.balances,a.createstatus,a.c_uid,a.createdate,b.name_eng  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.createdate BETWEEN ? and ? ;",[start,end]);
        console.log(query[0])
        return query.length == 0 ? null : query[0];
    }
}

module.exports = ReportTestGL;
