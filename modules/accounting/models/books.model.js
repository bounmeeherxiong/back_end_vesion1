const db = require('../../../configs/database');

class Books {
    constructor(
        uid, uri, name
    ) {
        this.uid = uid;
        this.uri = uri;
        this.name = name;
    }

    insert() {
        let sql = " INSERT INTO accounting.journal_books (uid, uri, name) VALUES (?, ?, ?)";
        let data = [
            this.uid,
            this.uri,
            this.name
        ];
        const query = db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async checkName(uri) {
        let sql = " SELECT * FROM accounting.journal_books WHERE uri = ?";
        let data = [uri];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async selectAll() {
        let sql = " SELECT * FROM accounting.journal_books";
        const query = await db.query(sql);
        return query.length == 0 ? null : query[0];
    }

    async selectOne(uid) {
        let sql = " SELECT * FROM accounting.journal_books WHERE uid = ?";
        let data = [uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0][0];
    }

    async update(uid) {
        let sql = " UPDATE accounting.journal_books SET uri =?, name =? WHERE uid =?";
        let data = [
            this.uri,
            this.name,
            uid
        ];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async checkUpdateName(uri, uid) {
        let sql = " SELECT * FROM accounting.journal_books WHERE uri = ? AND uid NOT IN (?)";
        let data = [uri, uid];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

    async delete(uid) {
        let sql = "DELETE FROM accounting.journal_books WHERE uid = ?";
        let data = [uid]
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }

}

module.exports = Books;