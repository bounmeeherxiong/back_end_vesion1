const db = require('../../../configs/database');

class Details {
    constructor(
        uid, uri_eng, name_eng, ac_type
    ) {
        this.uid = uid;
        this.uri_eng = uri_eng;
        this.name_eng = name_eng;
        this.ac_type = ac_type;
    }

    insert() {
        let sql = "INSERT INTO accounting2022.detail_type (uid, uri_eng, name_eng, ac_type) VALUES (?, ?, ?, ?);";
        let data = [
            this.uid,
            this.uri_eng,
            this.name_eng,
            this.ac_type
        ];
        const query = db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async selectAll() {
        let sql = "SELECT d.id, d.uid, d.uri_eng, d.uri_lao, d.name_eng, d.name_lao, d.ac_type, a.uri_eng type_uri_eng, a.uri_lao type_uri_lao, d.dt_desc, d.created_by, d.created_at, d.modified_by, d.modified_at,a.name_eng accounts_name FROM accounting2022.detail_type d LEFT JOIN accounting2022.accounts_type a ON a.uid = d.ac_type;";
        const query = await db.query(sql);
        return query.length == 0 ? null : query[0];
    }

    async selectOne(uid) {
        let sql = "SELECT d.id, d.uid, d.uri_eng, d.uri_lao, d.name_eng, d.name_lao, d.ac_type, a.uri_eng type_uri_eng, a.uri_lao type_uri_lao, d.dt_desc, d.created_by, d.created_at, d.modified_by, d.modified_at FROM accounting2022.detail_type d LEFT JOIN accounting2022.accounts_type a ON a.uid = d.ac_type WHERE d.uid = ?;";
        let data = [uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0][0];
    }
    async editdetailType(uid){
        const query = await db.query("SELECT a.`id`,a.`uid`,a.`name_eng` FROM accounting2022.detail_type a WHERE a.`uid`= ? ",[uid]);
        return query.length == 0 ? null : query[0]
    }


    async selectByAccountType(ac_type) {
        let sql = "SELECT d.id, d.uid, d.uri_eng, d.uri_lao, d.name_eng, d.name_lao, d.ac_type, a.uri_eng type_uri_eng, a.uri_lao type_uri_lao, d.dt_desc, d.created_by, d.created_at, d.modified_by, d.modified_at FROM accounting2022.detail_type d LEFT JOIN accounting2022.accounts_type a ON a.uid = d.ac_type WHERE d.ac_type = ?;";
        let data = [ac_type];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async update(uid) {
        let sql = " UPDATE accounting2022.detail_type SET uri_eng =?, name_eng =?, ac_type =? WHERE uid =?;";
        let data = [
            this.uri_eng,
            this.name_eng,
            this.ac_type,
            uid
        ];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    delete(uid) {
        let sql = " DELETE FROM accounting2022.detail_type WHERE uid = ?;";
        let data = [uid];
        const query = db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async selectInsert(name_eng) {
        let sql = " SELECT * FROM accounting2022.detail_type WHERE name_eng =?;";
        let data = [name_eng];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async selectUpdate(name_eng, uid) {
        let sql = "SELECT * FROM accounting2022.detail_type WHERE name_eng =? AND uid NOT IN (?)";
        let data = [name_eng, uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }
}

module.exports = Details;