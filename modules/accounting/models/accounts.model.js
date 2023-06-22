const db = require('../../../configs/database');

class Accounts {
    constructor(
        uid, uri_eng, name_eng
    ) {
        this.uid = uid;
        this.uri_eng = uri_eng;
        this.name_eng = name_eng;
    };

    insert() {
        let sql = "INSERT INTO accounting2022.accounts (uid, uri_eng, name_eng) VALUES (?, ?, ?)";
        let data = [
            this.uid,
            this.uri_eng,
            this.name_eng
        ];
        const query = db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async checkName(uri) {
        let sql = "SELECT * FROM accounting2022.accounts WHERE uri = ?";
        let data = [uri]
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async selectAll() {
        let sql = " SELECT * FROM accounting2022.accounts";
        const query = await db.query(sql);
        return query.length == 0 ? null : query[0];
    }

    async selectOne(uid) {
        let sql = " SELECT * FROM accounting2022.accounts WHERE uid = ?";
        let data = [uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0][0];
    }

    async update(uid) {
        let sql = " UPDATE accounting2022.accounts SET uri_eng =?, name_eng =? WHERE uid =?";
        let data = [
            this.uri_eng,
            this.name_eng,
            uid
        ];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async checkUpdateName(uri_eng, uid) {
        let sql = " SELECT * FROM accounting2022.accounts WHERE uri_eng = ? AND uid NOT IN (?)";
        let data = [uri_eng, uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async delete(uid) {
        let sql = "DELETE FROM accounting2022.accounts WHERE uid = ?";
        let data = [uid]
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }



    
}

module.exports = Accounts;