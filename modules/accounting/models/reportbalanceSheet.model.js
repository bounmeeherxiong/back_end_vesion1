const db = require('../../../configs/database');

class reportbalanceSheet {
    async heading() {
        const query = await db.query("SELECT a.id, a.`name_eng`,a.balances FROM accounting2022.accounts a WHERE a.`forstatus`=1;");
        return query.length == 0 ? null : query[0];
    }
}
module.exports = reportbalanceSheet;