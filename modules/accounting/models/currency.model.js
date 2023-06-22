const db = require('../../../configs/database');

class Currency {
    constructor(
        uid, uri, name, cr_rate, cr_symbol, decimal_mark, cr_code, cr_precision, symbol_position, cr_separator, cr_enabled
    ) {
        this.uid = uid;
        this.uri = uri;
        this.name = name;
        this.rate = cr_rate;
        this.symbol = cr_symbol;
        this.decimal_mark = decimal_mark;
        this.code = cr_code;
        this.precision = cr_precision;
        this.symbol_position = symbol_position;
        this.separator = cr_separator;
        this.enabled = cr_enabled;
    }

    async insert() {
        let sql = " INSERT INTO accounting.tb_currency (uid, uri, name, cr_rate, cr_symbol, decimal_mark, cr_code, cr_precision, symbol_position, cr_separator, cr_enabled) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let data = [
            this.uid,
            this.uri,
            this.name,
            this.rate,
            this.symbol,
            this.decimal_mark,
            this.code,
            this.precision,
            this.symbol_position,
            this.separator,
            this.enabled
        ];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async selectAll() {
        let sql = "SELECT * FROM accounting2022.tb_currency";
        let query = await db.query(sql);
        return query.length == 0 ? null : query[0];
    }
   async selectstatus(id){
    const query = await db.query("SELECT a.`name` FROM accounting2022.tb_currency a WHERE a.`id`= ? ",[id]);
    return query.length == 0 ? null : query[0];
   }

    async selectOne(uid) {
        let sql = " SELECT cr.id, cr.uid, cr.uri, cr.name, cr.cr_rate, cr.cr_symbol, cr.decimal_mark, cr.cr_code, cd.name AS code, cr.cr_precision, cr.symbol_position, cr.cr_separator, cr.cr_enabled, cr.created_at, cr.modified_at FROM  accounting2022.tb_currency AS cr LEFT JOIN  accounting2022.currency_code AS cd ON cd.uid = cr.cr_code WHERE cr.uid = ?";
        let data = [uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0][0];
    }
    async editcurrency(id){
        const query = await db.query("SELECT a.id,a.name FROM accounting2022.tb_currency a WHERE a.id= ?",[id])
        return query.length == 0 ? null : query[0]
    }

    async update(uid) {
        let sql = "UPDATE  accounting2022.tb_currency SET uri =?, name =?, cr_rate =?, cr_symbol =?, decimal_mark =?, cr_code =?, cr_precision =?, symbol_position =?, cr_separator =?, cr_enabled =? WHERE uid =?";
        let data = [
            this.uri,
            this.name,
            this.rate,
            this.symbol,
            this.decimal_mark,
            this.code,
            this.precision,
            this.symbol_position,
            this.separator,
            this.enabled,
            uid
        ];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async delete(uid) {
        let sql = "DELETE FROM  accounting2022.tb_currency WHERE uid = ?";
        let data = [uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async checkName(uri) {
        let sql = "SELECT name FROM  accounting2022.tb_currency WHERE uri = ?";
        let data = [uri];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async CheckUpdate(name, uid) {
        let sql = " SELECT * FROM  accounting2022.tb_currency WHERE name = ? AND uid NOT IN(?)";
        let data = [name, uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }    
    async selectchecked_currency(uid) {
        const query = await db.query("SELECT b.`createstatus` FROM accounting2022.accounts_type a INNER JOIN accounting2022.accounts b ON b.`uid`=a.`main_type` WHERE a.uid= ?",[uid]);
        return query.length == 0 ? null : query[0];
    }
    async selectcurrencyLAK(lak){
        const query=await db.query("SELECT * FROM accounting2022.tb_currency a WHERE a.name= ? ",[lak]);
        return query.length == 0 ? null : query[0];
    }
    async selectcurrencystatus(currency){
        const query=await db.query("SELECT b.id,b.name FROM  accounting2022.chart_of_accounts a INNER JOIN accounting2022.tb_currency b on b.id=a.currencies_id WHERE a.c_id= ?;",[currency]);
        return query.length == 0 ? null : query[0];
    }
}

module.exports = Currency;