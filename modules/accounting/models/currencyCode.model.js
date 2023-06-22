const db = require('../../../configs/database');

class Codes {
    constructor(
        uid, uri, name, enabled
    ) {
        this.uid = uid;
        this.uri = uri;
        this.name = name;
        this.enabled = enabled;
    }
    insert() {
        let sql = " INSERT INTO accounting2022.currency_code (uid, uri, name, enabled) VALUES (?, ?, ?, ?)";
        let data = [
            this.uid,
            this.uri,
            this.name,
            this.enabled
        ];
        const query = db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }
    async checkName(uri) {
        let sql = " SELECT * FROM accounting2022.currency_code WHERE uri = ?";
        let data = [uri]
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }
    async selectAll() {
        let sql = " SELECT * FROM accounting2022.currency_code";
        const query = await db.query(sql);
        return query.length == 0 ? null : query[0];
    }
    async selectOne(uid) {
        let sql = " SELECT * FROM accounting2022.currency_code WHERE uid = ?";
        let data = [uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0][0];
    }
    async update(uid) {
        let sql = " UPDATE accounting2022.currency_code SET uri =?, name =?, enabled =? WHERE uid =?";
        let data = [
            this.uri,
            this.name,
            this.enabled,
            uid
        ];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }
    async checkUpdateName(uri, uid) {
        let sql = " SELECT * FROM accounting2022.currency_code WHERE uri = ? AND uid NOT IN (?)";
        let data = [uri, uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }
    async delete(uid) {
        let sql = "DELETE FROM accounting2022.currency_code WHERE uid = ?";
        let data = [uid]
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }
}

module.exports = Codes;