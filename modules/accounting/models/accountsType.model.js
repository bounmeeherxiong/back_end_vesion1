const db = require('../../../configs/database');

class Types {
    constructor(
        uid, uri_eng, name_eng, main_type
    ) {
        this.uid = uid;
        this.uri_eng = uri_eng;
        this.name_eng = name_eng;
        this.main_type = main_type;
    }

    async insert() {
        let sql = "INSERT INTO accounting2022.accounts_type (uid, uri_eng, name_eng, main_type) VALUES (?, ?, ?, ?);";
        let data = [
            this.uid,
            this.uri_eng,
            this.name_eng,
            this.main_type
        ];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async selectAll() {
        let sql = "SELECT t.id type_id, t.uid type_uid, t.uri_eng type_uir_eng, t.uri_lao type_uir_lao, t.name_eng type_name_eng, t.name_lao type_name_lao, t.main_type main_uid, m.uri_eng main_uri_eng,t.main_type, m.uri_lao main_uri_lao, t.created_by, t.created_at, t.modified_by, t.modified_at,m.name_eng account_name FROM accounting2022.accounts_type t LEFT JOIN accounting2022.accounts m ON m.uid = t.main_type;";
        const query = await db.query(sql);
        return query.length == 0 ? null : query[0];
    }

    async selectOne(uid) {
        let sql = "SELECT t.id type_id, t.uid type_uid, t.uri_eng type_uir_eng, t.uri_lao type_uir_lao, t.name_eng type_name_eng, t.name_lao type_name_lao, t.main_type main_uid, m.uri_eng main_uri_eng, m.uri_lao main_uri_lao, t.created_by, t.created_at, t.modified_by, t.modified_at FROM accounting2022.accounts_type t LEFT JOIN accounting2022.accounts m ON m.uid = t.main_type WHERE t.uid = ?;";
        let data = [uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0][0];
    }

    async update(uid) {
        let sql = "UPDATE accounting2022.accounts_type SET uri_eng =?, name_eng =?, main_type =? WHERE uid =?;";
        let data = [
            this.uri_eng,
            this.name_eng,
            this.main_type,
            uid
        ];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    delete(uid) {
        let sql = "DELETE FROM accounting2022.accounts_type WHERE uid = ?;";
        let data = [uid];
        const query = db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async selectInsert(name_eng) {
        let sql = "SELECT * FROM accounting2022.accounts_type WHERE name_eng =?;";
        let data = [name_eng];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }
    async selecteEditaccounts_type(id){
        
        const query = await db.query("SELECT a.`name_eng`,a.`id`,a.`uid`,b.createstatus FROM accounting2022.accounts_type a INNER JOIN accounting2022.accounts b ON b.uid=a.main_type WHERE a.`id`= ?",[id]);
        return query.length == 0 ? null : query[0];
    }
    

    async selectUpdate(name_eng, uid) {
        let sql = "SELECT * FROM accounting2022.accounts_type WHERE name_eng =? AND uid NOT IN (?);";
        let data = [name_eng, uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }


}

module.exports = Types;