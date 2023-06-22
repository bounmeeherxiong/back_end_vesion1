const db = require('../../../configs/database');
class Company {
    constructor(
        uid, com_code, name, phone, email, address, com_desc
    ) {
        this.uid = uid;
        this.com_code = com_code;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.desc = com_desc;
    }

    insert() {
        let sql = " INSERT INTO accounting.companies (uid, com_code, name, phone, email, address, com_desc ) VALUES (?, ?, ?, ?, ?, ?, ?);";
        let data = [
            this.uid,
            this.com_code,
            this.name,
            this.phone,
            this.email,
            this.address,
            this.desc
        ];
        const query = db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async selectAll() {
        let sql = "SELECT * FROM accounting.companies";
        const query = await db.query(sql);
        return query.length == 0 ? null : query[0];
    }

    async checkName(name, email, code) {
        let sql = "SELECT * FROM accounting.companies WHERE name = ? AND email = ? AND com_code = ?";
        let data = [name, email, code];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async selectOne(uid) {
        let sql = "SELECT * FROM accounting.companies WHERE uid = ?";
        let data = [uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0][0];
    }

    async update(uid) {
        let sql = " UPDATE accounting.companies SET com_code =?, name =?, phone =?, email =?, address =?, com_desc =? WHERE uid =?";
        let data = [
            this.com_code,
            this.name,
            this.phone,
            this.email,
            this.address,
            this.desc,
            uid
        ];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async checkUpdate(name, email, uid) {
        let sql = " SELECT * FROM accounting.companies WHERE name = ? AND email = ? AND uid NOT IN (?)";
        let data = [name, email, uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    delete(uid) {
        let sql = " DELETE FROM accounting.companies WHERE uid = ?";
        let data = [uid];
        const query = db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }
}

module.exports = Company;