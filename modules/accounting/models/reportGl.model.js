const db = require('../../../configs/database');

class ReportGL {

    async firstFloorGL() {
        const query = await db.query("SELECT b.name_eng,a.c_id,b.parents FROM accounting2022.transactions_ledger_entries a INNER JOIN chart_of_accounts b ON b.c_id=a.c_id WHERE b.parents='0';");
        return query.length == 0 ? null : query[0];
    }
    async childrenFirstFloor() {
        await db.query("call delete_first_and_secod()")
        const list = await db.query("call childrenFirstFloor()")
        // const DataIn = await db.query("SELECT a.c_id FROM transactions_ledger_entries a WHERE a.parents = 0 GROUP BY a.c_id;");
        // const informdata = DataIn[0]
        // const list = [];
        // for (let data of informdata) {
        //     const query = await db.query("SELECT a.`lg_id`,`tr_id`,a.`ch_id`,a.`debit`,a.`credit`,a.`lg_desc`,a.`lg_name`,a.`journal_no`,a.`amout`,a.`createstatus`,a.`c_uid`,a.`createdate`,b.`name_eng`,a.`parents`,a.`BeginningBalance`, cast((@a.balance := @a.balance + a.`amout`) as decimal(16, 2)) as balances,a.`p_and_l`  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id JOIN (SELECT @a.balance := 0) as tmp where a.`ch_id`=? AND a.`p_and_l` is null;", [data?.c_id])
        //     if (query.length > 0) {
        //         list.push(...query[0])
        //     }
        // }
        return list.length == 0 ? null : list[0][0]
    }
    async childrenSecondFloor() {
        const list = await db.query("call childrenSecondFloor()")
        // const DataIn = await db.query("SELECT a.c_id FROM transactions_ledger_entries a WHERE a.parents <> 0 GROUP BY a.c_id;");
        // const informdata = DataIn[0]
        // const list = [];
        // for (let data of informdata) {
        //     const query = await db.query("SELECT a.`lg_id`,`tr_id`,a.`ch_id`,a.`debit`,a.`credit`,a.`lg_desc`,a.`lg_name`,a.`journal_no`,a.`amout`,a.`createstatus`,a.`c_uid`,a.`createdate`,b.`name_eng`,a.`parents`,a.`BeginningBalance`, cast((@a.balance := @a.balance + a.`amout`) as decimal(16, 2)) as balances  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id JOIN (SELECT @a.balance := 0) as tmp where a.`ch_id`=? AND a.`p_and_l` is null; ", [data?.c_id])
        //     if (query.length > 0) {
        //         list.push(...query[0])
        //     }
        // }
        return list.length == 0 ? null : list[0][0]
    }
    async SecondFloor() {
        //  const query = await db.query("SELECT a.`c_id`,a.`name_eng`,a.parents FROM  accounting2022.chart_of_accounts a WHERE a.parents <> 0;");
        const query = await db.query("SELECT a.c_id,a.account_id,b.name_eng,a.parents,sum(c.amout) as amout FROM  accounting2022.transactions_ledger_entries a LEFT JOIN chart_of_accounts b ON b.c_id=a.c_id LEFT JOIN accounting2022.ledger_entries c ON c.ch_id=a.c_id WHERE a.parents <> 0 GROUP BY a.c_id;");
        return query.length == 0 ? null : query[0];
    }
    async reportGlbalances() {
        const query = await db.query("SELECT b.`name_eng`,a.`balances`,a.`ch_id`  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id WHERE a.`createstatus`=1;");
        return query.length == 0 ? null : query[0];
    }


    async firstFloorSearchbyAccount(start, end, c_id) {
        const query = await db.query("SELECT b.`name_eng`,a.`ch_id`, b.`parents`, a.createdate FROM accounting2022.ledger_entries a INNER JOIN accounting2022.chart_of_accounts b WHERE a.ch_id= ? AND a.createdate BETWEEN ? AND ? GROUP BY a.`ch_id`;", [c_id, start, end]);
        const informdata = query[0]
        const list = [];
        for (let data of informdata) {
            const query = await db.query("WITH RECURSIVE cte(c_id, parents) as (SELECT c_id,parents FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?  UNION SELECT t1.c_id,t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.parents=t1.c_id ) SELECT u.c_id as c_id,u.parents as parents,c.name_eng FROM cte u INNER JOIN accounting2022.chart_of_accounts c ON c.c_id=u.c_id WHERE u.parents='0';", [data?.ch_id])
            if (query.length > 0) {
                list.push(...query[0])
            }
        }
        return list.length == 0 ? null : list
    }
    async SecondFloorSearchbyAccount(start, end, c_id) {
        const query = await db.query("SELECT b.`name_eng`,a.`ch_id`, b.`parents`, a.createdate FROM accounting2022.ledger_entries a INNER JOIN accounting2022.chart_of_accounts b WHERE a.ch_id= ? AND a.createdate BETWEEN ? AND ? GROUP BY a.`ch_id`;", [c_id, start, end]);
        const informdata = query[0]
        const list = [];
        for (let data of informdata) {
            const query = await db.query("WITH RECURSIVE cte(c_id, parents) as (SELECT c_id,parents FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?  UNION SELECT t1.c_id,t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.parents=t1.c_id ) SELECT u.c_id as c_id,u.parents as parents,c.name_eng FROM cte u INNER JOIN accounting2022.chart_of_accounts c ON c.c_id=u.c_id WHERE u.parents <> 0 GROUP BY u.c_id;", [data?.ch_id])
            if (query.length > 0) {
                list.push(...query[0])
            }
        }
        return list.length == 0 ? null : list
    }
    async firstFloorbydate(start, end) {
        const query = await db.query("SELECT a.ch_id FROM accounting2022.ledger_entries a WHERE a.`createdate` BETWEEN  ? AND ? GROUP BY a.ch_id;", [start, end]);
        const informdata = query[0]
        if (informdata == "") {
            const firstfloor = await db.query('SELECT a.c_id,a.parents,b.name_eng  FROM transactions_ledger_entries a INNER JOIN chart_of_accounts b ON b.c_id=a.c_id WHERE a.parents=0');
            return firstfloor.length == 0 ? null : firstfloor[0];
        } else {
            const list = [];
            for (let data of informdata) {
                const query = await db.query("WITH RECURSIVE cte(c_id, parents) as (SELECT c_id,parents FROM  accounting2022.transactions_ledger_entries WHERE c_id= ? UNION SELECT t1.c_id,t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.parents=t1.c_id ) SELECT u.c_id as c_id,u.parents as parents,c.name_eng FROM cte u INNER JOIN accounting2022.chart_of_accounts c ON c.c_id=u.c_id WHERE u.parents='0';", [data?.ch_id])
                if (query.length > 0) {
                    list.push(...query[0])
                }
            }
            return list.length == 0 ? null : list
        }

    }
    async SecondFloorbydate(start, end) {
        const query = await db.query("SELECT a.ch_id FROM accounting2022.ledger_entries a WHERE a.`createdate` BETWEEN  ? AND ? GROUP BY a.ch_id;", [start, end]);
        const informdata = query[0]
        if (informdata == "") {
            const secondfloor = await db.query('SELECT a.c_id,a.parents,b.name_eng  FROM transactions_ledger_entries a INNER JOIN chart_of_accounts b ON b.c_id=a.c_id WHERE a.parents <> 0');
            return secondfloor.length == 0 ? null : secondfloor[0];
        } else {
            const list = [];
            for (let data of informdata) {
                const query = await db.query("WITH RECURSIVE cte(c_id, parents) as (SELECT c_id,parents FROM  accounting2022.transactions_ledger_entries WHERE c_id= ? UNION SELECT t1.c_id,t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.parents=t1.c_id ) SELECT u.c_id as c_id,u.parents as parents,c.name_eng FROM cte u INNER JOIN accounting2022.chart_of_accounts c ON c.c_id=u.c_id WHERE u.parents <> 0", [data?.ch_id])
                if (query.length > 0) {
                    list.push(...query[0])
                }
            }
            return list.length == 0 ? null : list
        }

    }
    async reportbydateFirstFloor(start, end) {
        const condition = await db.query("SELECT a.createdate FROM accounting2022.ledger_entries a WHERE a.createdate BETWEEN ? AND ?;", [start, end])
        const inCondition = condition[0]
        if (inCondition == "") {
            await db.query('DELETE FROM accounting2022.replort_search');
            const list = await db.query('call AllBeginningBalance(?)', [start])
            return list.length == 0 ? null : list[0][0]
        } else {
            await db.query('DELETE FROM accounting2022.replort_search');
            await db.query('call BeginningBalance(?,?)', [start, end])
            const list = await db.query('call reportbydateFirstFloor(?,?)', [start, end])
            return list.length == 0 ? null : list[0][0]
        }

    }
    async reportbydateSecondFloor(start, end) {
        const condition = await db.query("SELECT a.createdate FROM accounting2022.ledger_entries a WHERE a.createdate BETWEEN ? AND ?;", [start, end])
        const inCondition = condition[0]
        if (inCondition == "") {
            const list = await db.query('call reportbydateSecondFloor')
            return list.length == 0 ? null : list[0][0]
        } else {
            const list = await db.query('call reportbydateSecondFloor')
            return list.length == 0 ? null : list[0][0]
        }
    }
    async reportbyaccountFirstFloor(start, end, c_id) {

        const DataIn = await db.query("SELECT a.c_id FROM transactions_ledger_entries a WHERE  a.c_id = ? ", [c_id]);
        const informdata = DataIn[0]
        const list = [];
        for (let data of informdata) {
            const query = await db.query("SELECT a.`lg_id`,`tr_id`,a.`ch_id`,a.`debit`,a.`credit`,a.`lg_desc`,a.`lg_name`,a.`journal_no`,a.`amout`,a.`createstatus`,a.`c_uid`,a.`createdate`,b.`name_eng`,a.`parents`,a.`BeginningBalance`, cast((@a.balance := @a.balance + a.`amout`) as decimal(16, 2)) as balances FROM accounting2022.ledger_entries a INNER JOIN accounting2022.chart_of_accounts b ON b.c_id=a.ch_id JOIN (SELECT @a.balance := 0) as tmp where a.`ch_id`= ? and a.createdate BETWEEN ? and ?;", [data?.c_id, start, end])
            if (query.length > 0) {
                list.push(...query[0])
            }
        }
        return list.length == 0 ? null : list
    }

    async reportbyaccountSecondFloor(start, end, c_id) {
        const DataIn = await db.query("SELECT a.c_id FROM transactions_ledger_entries a WHERE a.parents <> 0 AND a.c_id", [c_id]);
        const informdata = DataIn[0]
        const list = [];
        for (let data of informdata) {
            const query = await db.query("SELECT a.`lg_id`,`tr_id`,a.`ch_id`,a.`debit`,a.`credit`,a.`lg_desc`,a.`lg_name`,a.`journal_no`,a.`amout`,a.`createstatus`,a.`c_uid`,a.`createdate`,b.`name_eng`,a.`parents`,a.`BeginningBalance`, cast((@a.balance := @a.balance + a.`amout`) as decimal(16, 2)) as balances  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id JOIN (SELECT @a.balance := 0) as tmp where a.`ch_id`= ? and a.createdate BETWEEN  ? and ?;", [data?.c_id, start, end])
            if (query.length > 0) {
                list.push(...query[0])
            }
        }
        return list.length == 0 ? null : list
    }

    async sumTotal(c_id) {
        let amout = 0;
        const sql = await db.query("WITH RECURSIVE cte(c_id, parents) as (SELECT c_id,parents FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?  UNION SELECT t1.c_id,t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id1,u.parents as parents1,k.amout AS amout FROM cte u INNER JOIN accounting2022.ledger_entries k ON k.ch_id=u.c_id ORDER BY u.c_id;", [c_id]);

        const informdata = sql.length == 0 ? null : sql[0]

        for (let data of informdata) {
            amout += parseFloat(data?.amout)
        }
        await db.query("UPDATE accounting2022.transactions_ledger_entries SET balances= ? WHERE c_id= ?;", [amout, c_id])
        const query = await db.query("SELECT * FROM accounting2022.transactions_ledger_entries a WHERE a.`c_id`= ?;", [c_id]);
        return query.length == 0 ? null : query[0][0];
    }
    async sumTotalAccountBydate(c_id, start, end) {
        let amout = 0;
        const sql = await db.query("WITH RECURSIVE cte(c_id, parents) as (SELECT c_id,parents FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?  UNION SELECT t1.c_id,t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id1,u.parents as parents1,k.amout AS amout FROM cte u INNER JOIN accounting2022.ledger_entries k ON k.ch_id=u.c_id WHERE k.createdate BETWEEN ? AND ? ORDER BY u.c_id;", [c_id, start, end]);
        const informdata = sql.length == 0 ? null : sql[0]
        for (let data of informdata) {
            amout += parseFloat(data?.amout)
        }
        await db.query("UPDATE accounting2022.transactions_ledger_entries SET balances= ? WHERE c_id= ?;", [amout, c_id])
        const query = await db.query("SELECT * FROM accounting2022.transactions_ledger_entries a WHERE a.`c_id`= ?;", [c_id]);
        return query.length == 0 ? null : query[0][0];
    }

    async sumTotalCustomAndTodayBydate(c_id, start, end) {
        let amout = 0;
        const sql = await db.query("WITH RECURSIVE cte(c_id, parents) as (SELECT c_id,parents FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?  UNION SELECT t1.c_id,t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id1,u.parents as parents1,k.amout AS amout FROM cte u INNER JOIN accounting2022.ledger_entries k ON k.ch_id=u.c_id WHERE k.createdate BETWEEN ? AND ? ORDER BY u.c_id;", [c_id, start, end]);
        const informdata = sql.length == 0 ? null : sql[0]
        for (let data of informdata) {
            amout += parseFloat(data?.amout)
        }
        await db.query("UPDATE accounting2022.transactions_ledger_entries SET balances= ? WHERE c_id= ?;", [amout, c_id])
        const query = await db.query("SELECT * FROM accounting2022.transactions_ledger_entries a WHERE a.`c_id`= ?;", [c_id]);
        return query.length == 0 ? null : query[0][0];
    }
    async checkid(id) {
        const query = await db.query("SELECT a.c_id,a.parents FROM accounting2022.transactions_ledger_entries a WHERE a.parents= ?; ", [id]);
        return query.length == 0 ? null : query[0];
    }
    async sumTotalGL(c_id) {
        let amout = 0;
        const sql = await db.query("WITH RECURSIVE cte(c_id, parents) as (SELECT c_id,parents FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?  UNION SELECT t1.c_id,t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id1,u.parents as parents1,k.amout AS amout FROM cte u INNER JOIN accounting2022.ledger_entries k ON k.ch_id=u.c_id ORDER BY u.c_id;", [c_id]);
        const informdata = sql.length == 0 ? null : sql[0]


        for (let data of informdata) {
            amout += parseFloat(data?.amout)
        }
        await db.query("UPDATE accounting2022.transactions_ledger_entries SET balances= ? WHERE c_id= ?;", [amout, c_id])
        const query = await db.query("SELECT * FROM accounting2022.transactions_ledger_entries a WHERE a.`c_id`= ?;", [c_id]);
        return query.length == 0 ? null : query[0][0];
    }
    async firstFloor(c_id) {
        const query = await db.query("SELECT b.c_id, SUM(a.`amout`) as amout,b.name_eng  FROM  accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON  b.c_id= a.ch_id WHERE a.c_uid= ? GROUP BY a.ch_id;", [c_id]);
        return query.length == 0 ? null : query[0]
    }
    async children(c_id) {
        const query = await db.query("SELECT a.`lg_id`,`tr_id`,a.`ch_id`,a.`debit`,a.`credit`,a.`lg_desc`,a.`lg_name`,a.`journal_no`,a.`amout`,a.`createstatus`,a.`c_uid`,a.`createdate`,b.`name_eng`,a.`parents`,a.`BeginningBalance`, cast((@a.balance := @a.balance + a.`amout`) as decimal(16, 2)) as balances  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id JOIN (SELECT @a.balance := 0) as tmp WHERE a.c_uid= ?", [c_id])
        return query.length == 0 ? null : query[0]
    }
    async RunreportSeachBydate(c_id, start, end) {
        const query = await db.query("SELECT a.`lg_id`,`tr_id`,a.`ch_id`,a.`debit`,a.`credit`,a.`lg_desc`,a.`lg_name`,a.`journal_no`,a.`amout`,a.`createstatus`,a.`c_uid`,a.`createdate`,b.`name_eng`,a.`parents`,a.`BeginningBalance`, cast((@a.balance := @a.balance + a.`amout`) as decimal(16, 2)) as balances  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id JOIN (SELECT @a.balance := 0) as tmp WHERE a.c_uid= ? AND a.createdate BETWEEN ? and ? ;", [c_id, start, end])
        return query.length == 0 ? null : query[0]
    }

    async retportAllGL(c_id) {
        const query = await db.query("SELECT a.`lg_id`,`tr_id`,a.`ch_id`,a.`debit`,a.`credit`,a.`lg_desc`,a.`lg_name`,a.`journal_no`,a.`amout`,a.`createstatus`,a.`c_uid`,a.`createdate`,b.`name_eng`,a.`parents`,a.`BeginningBalance`, cast((@a.balance := @a.balance + a.`amout`) as decimal(16, 2)) as balances  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id JOIN (SELECT @a.balance := 0) as tmp WHERE a.ch_id= ?", [c_id]);
        return query.length == 0 ? null : query[0]
    }
    async retportAllGLbyDate(id, start, end) {
        const query = await db.query("SELECT a.`lg_id`,`tr_id`,a.`ch_id`,a.`debit`,a.`credit`,a.`lg_desc`,a.`lg_name`,a.`journal_no`,a.`amout`,a.`createstatus`,a.`c_uid`,a.`createdate`,b.`name_eng`,a.`parents`,a.`BeginningBalance`, cast((@a.balance := @a.balance + a.`amout`) as decimal(16, 2)) as balances  FROM accounting2022.ledger_entries a INNER JOIN  accounting2022.chart_of_accounts b ON b.c_id=a.ch_id JOIN (SELECT @a.balance := 0) as tmp WHERE  a.ch_id= ? and a.createdate BETWEEN ? and ?", [id, start, end]);
        return query.length == 0 ? null : query[0]
    }
    async heading() {
        const query = await db.query("SELECT a.id, a.`name_eng`,a.balances FROM accounting2022.accounts a WHERE a.`forstatus`=1;");
        return query.length == 0 ? null : query[0];
    }
    async headingIncomeandCost() {
        const query = await db.query('SELECT b.`subject_ID`,b.`subject_name`,SUM(d.`amout`) as balances,b.`createstatus`,b.`account_id` FROM  accounting2022.transactions_ledger_entries a  INNER JOIN accounting2022.subject b ON b.`subject_ID`=a.`subject_ID` INNER JOIN accounting2022.ledger_entries d ON d.`ch_id`=a.`c_id` WHERE b.`createstatus` =2 GROUP BY a.`subject_ID`;');
        return query.length == 0 ? null : query[0]
    }
    async headingExpenses() {
        const query = await db.query('SELECT b.`subject_ID`,b.`subject_name`,SUM(d.`amout`) as balances,b.`createstatus`,b.`account_id` FROM  accounting2022.transactions_ledger_entries a  INNER JOIN accounting2022.subject b ON b.`subject_ID`=a.`subject_ID` INNER JOIN accounting2022.ledger_entries d ON d.`ch_id`=a.`c_id` WHERE b.`createstatus` =3 GROUP BY a.`subject_ID`;');
        return query.length == 0 ? null : query[0]
    }
    async headingLibilities() {
        const query = await db.query("SELECT a.id, a.`name_eng`,a.balances FROM accounting2022.accounts a WHERE a.`forstatus`=2;");
        return query.length == 0 ? null : query[0];
    }
    async subject() {
        const query = await db.query("SELECT b.`subject_ID`,b.`subject_name`,b.`balances`,b.`createstatus`,b.`account_id` FROM  accounting2022.transactions_ledger_entries a  INNER JOIN accounting2022.subject b ON b.`subject_ID`=a.`subject_ID` WHERE b.createstatus <> 1  GROUP BY a.`subject_ID`;");
        return query.length == 0 ? null : query[0];
    }
    async subjectOwner() {
        const query = await db.query("SELECT * FROM accounting2022.subject a WHERE a.`createstatus`= 1;");
        return query.length == 0 ? null : query[0];
    }
    async sumAsset() {
        const query = await db.query('SELECT SUM(d.amout) AS balances,d.`account_id` FROM  accounting2022.accounts a INNER JOIN accounting2022.accounts_type b ON b.`main_type`=a.`uid` INNER JOIN accounting2022.chart_of_accounts c ON c.`ac_type`=b.`uid` INNER JOIN accounting2022.ledger_entries d ON `ch_id`=c.`c_id` GROUP BY d.`account_id`;')
        return query.length == 0 ? null : query[0];
    }
    async searchSumAsset(start, end) {
        const query = await db.query('SELECT SUM(d.amout) AS balances,d.`account_id` FROM  accounting2022.accounts a INNER JOIN accounting2022.accounts_type b ON b.`main_type`=a.`uid` INNER JOIN accounting2022.chart_of_accounts c ON c.`ac_type`=b.`uid` INNER JOIN accounting2022.ledger_entries d ON `ch_id`=c.`c_id`  WHERE d.`createdate` BETWEEN ? and ?  GROUP BY d.`account_id`;', [start, end])
        return query.length == 0 ? null : query[0];
    }
    async sumliabilitiesAndOwnerequity() {
        const query = await db.query('SELECT SUM(d.amout) AS balances,d.`account_id` FROM  accounting2022.accounts a INNER JOIN accounting2022.accounts_type b ON b.`main_type`=a.`uid` INNER JOIN accounting2022.chart_of_accounts c ON c.`ac_type`=b.`uid` INNER JOIN accounting2022.ledger_entries d ON `ch_id`=c.`c_id` WHERE d.`account_id`=2;')
        return query.length == 0 ? null : query[0];
    }



    async sumbalancesheetToprofitandlos() {
        await db.query('DELETE FROM accounting2022.fitandlossbalances;')
        const insert = await db.query('SELECT a.lg_id, b.c_id,a.amout  as amout,c.`createcondition` FROM accounting2022.ledger_entries a INNER JOIN accounting2022.chart_of_accounts b ON b.c_id=a.ch_id INNER JOIN accounting2022.accounts_type c ON c.uid=b.`ac_type` WHERE a.`account_id`=5;')
        let informdata = insert[0]
        for (let data of informdata) {
            await db.query('INSERT INTO accounting2022.fitandlossbalances(lg_id,c_id,balances,createstatus) VALUES(?,?,?,?)', [data?.lg_id, data?.c_id, data?.amout, data?.createcondition])
        }
        const inFor = await db.query('SELECT a.`lg_id`,a.`c_id`,(-1 * a.`balances` ) as balances ,a.`createstatus` FROM  accounting2022.fitandlossbalances a WHERE  a.`createstatus` =? OR a.`createstatus`=? OR a.createstatus= ?', ['Ex', 'OTE', 'CO'])
        let informdata1 = inFor[0]
        for (let data1 of informdata1) {
            await db.query('UPDATE accounting2022.fitandlossbalances SET  balances = ? WHERE lg_id = ? ', [data1?.balances, data1.lg_id])
        }
        const query = await db.query('SELECT SUM(a.`balances`) as balances FROM accounting2022.fitandlossbalances a;')
        return query.length == 0 ? null : query[0];
    }



    async searchsumbalancesheetToprofitandlos(start, end) {
        await db.query('DELETE FROM accounting2022.fitandlossbalances;')
        const insert = await db.query('SELECT a.lg_id, b.c_id,a.amout  as amout,c.`createcondition` FROM accounting2022.ledger_entries a INNER JOIN accounting2022.chart_of_accounts b ON b.c_id=a.ch_id INNER JOIN accounting2022.accounts_type c ON c.uid=b.`ac_type` WHERE a.`account_id`=5 and a.`createdate` BETWEEN ? and ?;', [start, end])
        let informdata = insert[0]
        for (let data of informdata) {
            await db.query('INSERT INTO accounting2022.fitandlossbalances(lg_id,c_id,balances,createstatus) VALUES(?,?,?,?)', [data?.lg_id, data?.c_id, data?.amout, data?.createcondition])
        }
        const inFor = await db.query('SELECT a.`lg_id`,a.`c_id`,(-1 * a.`balances` ) as balances ,a.`createstatus` FROM  accounting2022.fitandlossbalances a WHERE  a.`createstatus` =? OR a.`createstatus`=? OR a.createstatus= ?', ['Ex', 'OTE', 'CO'])
        let informdata1 = inFor[0]
        for (let data1 of informdata1) {
            await db.query('UPDATE accounting2022.fitandlossbalances SET  balances = ? WHERE lg_id = ? ', [data1?.balances, data1.lg_id])
        }
        const query = await db.query('SELECT SUM(a.`balances`) as balances FROM accounting2022.fitandlossbalances a;')
        return query.length == 0 ? null : query[0];

    }

    async EnterExchangeRates() {
        const query = await db.query('SELECT a.currency_code AS name, (0* a.c_id) as rate FROM accounting2022.chart_of_accounts a WHERE a.`currency_code` = ? OR a.`currency_code`= ? GROUP BY a.currency_code;', ['USD', 'THB'])
        return query.length == 0 ? null : query[0];
    }
    async CreategainAndloss(data, date, bank_id) {

        const Info = await db.query("SELECT * FROM accounting2022.exchange_rate WHERE createdate = ?", [date]);
        let dataIn = Info[0]
        await db.query('UPDATE  accounting2022.exchange_rate SET createstatus=2 WHERE  createstatus= ? ', [1])
        if (dataIn.length > 0) {
            for (let list of data) {
                await db.query('UPDATE accounting2022.exchange_rate set name=?, ExchangeRate = ? ,createdate= ? WHERE exchange_id=?', [list?.name, list?.rate, date, list?.exchange_id])
            }
        } else {
            for (let infordata of data) {

                await db.query('INSERT INTO accounting2022.exchange_rate(name,ExchangeRate,createdate,createstatus) VALUES(?,?,?,?) ', [infordata?.name, infordata?.rate, date, 1])
            }
        }


        const query = await db.query("call test(?)", [bank_id])
        
        // const inFor = await db.query('SELECT a.`c_id`,a.`name_eng`,a.`currency_code`,a.`c_balance`,a.`c_rate`, a.`total_balances` as current_balance FROM  accounting2022.chart_of_accounts a WHERE a.`bank_id`= ?', [bank_id])
        // let informdata = inFor[0]
        // for (let data of informdata) {
        //     await db.query("UPDATE accounting2022.transactionsgainandloss SET createstatus=2 WHERE c_id=? and createstatus=1", [data?.c_id])
        //     await db.query('INSERT INTO accounting2022.transactionsgainandloss(c_id,account,currency_code,foreigin_balance,Oldexchange_rate,Newexchange_rate,current_balance,createdates,createstatus) VALUES(?,?,?,?,?,?,?,?,?)', [data?.c_id, data?.name_eng, data?.currency_code, data?.c_balance, data?.c_rate, 0, data?.current_balance, date, 1])
        // }
        // for (let item of data) {
        //     await db.query('UPDATE accounting2022.transactionsgainandloss SET Newexchange_rate= ?  WHERE currency_code= ? and createstatus = 1', [item?.rate, item?.name])
        // }
        // const gain = await db.query('SELECT a.`trans_id`,a.`c_id`, a.`account`,a.`currency_code`,a.`foreigin_balance`,a.`Newexchange_rate`,(a.`foreigin_balance`*a.`Newexchange_rate`) as adjisted_balance,a.`current_balance`,(a.`foreigin_balance`*a.`Newexchange_rate`-a.`current_balance`) AS gain_Loss FROM  accounting2022.transactionsgainandloss a WHERE a.createstatus=1;')
        // let infgain = gain[0]
        // for (let loss of infgain) {
        //     query = await db.query('UPDATE accounting2022.transactionsgainandloss SET adjisted_balance= ?,gain_Loss= ?  WHERE trans_id= ? ', [loss?.adjisted_balance, loss?.gain_Loss, loss?.trans_id])
        // }
        // const segain = await db.query('SELECT a.c_id,a.gain_Loss FROM transactionsgainandloss a WHERE a.createstatus = 1;')
        // let gl = segain[0]
        // for (let datagl of gl) {
        //     let amout;
        //     let balance = datagl?.gain_Loss
        //     let usingObjectAssign = Object.assign([], balance);
        //     let conditons = usingObjectAssign[0]
        //     if (conditons === '-') {
        //         amout = -1 * parseFloat(datagl?.gain_Loss)
        //         await db.query('INSERT INTO accounting2022.ledger_entries(ch_id,amout,p_and_l) VALUES(?,?,?)', [122, amout, 0])
        //         const checkname_loss = await db.query("SELECT * FROM  accounting2022.transactions_ledger_entries a WHERE a.c_id= 122");
        //         const accountname_loss = checkname_loss.length == 0 ? null : checkname_loss[0]
        //         if (accountname_loss.length > 0) {
        //         } else {
        //             await db.query("INSERT INTO  accounting2022.transactions_ledger_entries(subject_ID,c_id,parents) VALUES(?,?,?)", [10, 122, 0]);
        //         }           
        //     } else {
        //         await db.query('INSERT INTO accounting2022.ledger_entries(ch_id,amout,p_and_l) VALUES(?,?,?)', [123, datagl?.gain_Loss, 0])
        //         const checkname_gain = await db.query("SELECT * FROM  accounting2022.transactions_ledger_entries a WHERE a.c_id= 123");
        //         const accountname_gain = checkname_gain.length == 0 ? null : checkname_gain[0]
        //         if (accountname_gain.length > 0) {
        //         } else {
        //             await db.query("INSERT INTO  accounting2022.transactions_ledger_entries(subject_ID,c_id,parents) VALUES(?,?,?)", [7, 123, 0]);
        //         }
        //     }
        //     await db.query('INSERT INTO accounting2022.ledger_entries(ch_id,amout,p_and_l) VALUES(?,?,?)', [datagl?.c_id, datagl?.gain_Loss, 0])
        // }
        return query.length == 0 ? null : query[0]
    }
    async SelectgainAndLoss() {
        const query = await db.query('SELECT a.c_id,a.`account`,a.`currency_code`,a.`foreigin_balance`,a.`Newexchange_rate`,(a.`foreigin_balance`*a.`Newexchange_rate`) as adjisted_balance,a.`current_balance`,(a.`foreigin_balance`*a.`Newexchange_rate`-a.`current_balance`) AS gain_Loss,a.createdates FROM  accounting2022.transactionsgainandloss a WHERE a.createstatus=1')
        return query.length == 0 ? null : query[0];
    }
    async selectTotalgainandloss() {
        const query = await db.query('SELECT SUM(a.`gain_Loss`) gain_Loss FROM accounting2022.transactionsgainandloss a;')
        return query.length == 0 ? null : query[0]
    }

    async selectdateofexhangeRate(date) {
        const query = await db.query('SELECT a.exchange_id, a.name, a.`ExchangeRate` as rate FROM accounting2022.exchange_rate a WHERE a.`createdate` = ?;', [date])
        return query.length == 0 ? null : query[0]
    }
    async transactiongainandloss() {
        const query = await db.query('SELECT * FROM  accounting2022.transactionsgainandloss ORDER by trans_id;')
        return query.length == 0 ? null : query[0]
    }
    async sumbalanceIncomeandcostofsale() {
        await db.query('DELETE FROM accounting2022.incomeandcostofsalebalances')
        const insert = await db.query('SELECT a.lg_id, b.c_id,a.amout  as amout,c.`createcondition` FROM accounting2022.ledger_entries a INNER JOIN accounting2022.chart_of_accounts b ON b.c_id=a.ch_id INNER JOIN accounting2022.accounts_type c ON c.uid=b.`ac_type` WHERE c.createcondition= ? OR c.createcondition= ?;', ['CO', 'IN'])
        let informdata = insert[0]
        for (let data of informdata) {
            await db.query('INSERT INTO accounting2022.incomeandcostofsalebalances(lg_id,c_id,balances,createstatus) VALUES(?,?,?,?)', [data?.lg_id, data?.c_id, data?.amout, data?.createcondition])
        }
        const inFor = await db.query('SELECT a.`lg_id`,a.`c_id`,(-1 * a.`balances` ) as balances ,a.`createstatus` FROM  accounting2022.incomeandcostofsalebalances a WHERE  a.`createstatus` = ?', ['CO'])
        let informdata1 = inFor[0]
        for (let data1 of informdata1) {
            await db.query('UPDATE accounting2022.incomeandcostofsalebalances SET  balances = ? WHERE lg_id = ? ', [data1?.balances, data1.lg_id])
        }
        const query = await db.query('SELECT SUM(a.`balances`) as balances FROM accounting2022.incomeandcostofsalebalances a;')
        return query.length == 0 ? null : query[0];

    }
    async childrenFirst() {
        const query = await db.query('SELECT a.`c_id` FROM  accounting2022.transactions_ledger_entries a WHERE a.`parents`= 0')
        let informdata = query[0]
        let dataList = []
        for (let data of informdata) {
            const query = await db.query("WITH RECURSIVE cte(c_id, parents,subject_ID) as (SELECT c_id,parents,subject_ID FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?  UNION SELECT t1.c_id,t1.parents,t1.subject_ID FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id,u.parents,u.subject_ID as parents,y.`name_eng`,SUM(k.amout) as balances,u.subject_ID FROM cte u LEFT JOIN accounting2022.ledger_entries k ON k.`ch_id`= u.c_id LEFT JOIN accounting2022.chart_of_accounts y ON y.c_id=u.c_id WHERE u.parents='0' GROUP BY u.c_id;", [data?.c_id])
            if (query.length > 0) {
                dataList.push(...query[0])
            }
        }
        return dataList.length == 0 ? null : dataList
    }
    async searchChildrenfirst(start, end) {
        const query = await db.query('SELECT a.`c_id` FROM  accounting2022.transactions_ledger_entries a WHERE a.`parents`= 0')
        let infordata = query[0]
        let dataList = []
        for (let data of infordata) {
            const query1 = await db.query('WITH RECURSIVE cte(c_id, parents,subject_ID) as (SELECT c_id,parents,subject_ID FROM  accounting2022.transactions_ledger_entries WHERE c_id= ? UNION SELECT t1.c_id,t1.parents,t1.subject_ID FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id,u.parents,u.subject_ID as parents,y.`name_eng`,SUM(k.amout) as balances,u.subject_ID FROM cte u LEFT JOIN accounting2022.ledger_entries k ON k.`ch_id`= u.c_id LEFT JOIN accounting2022.chart_of_accounts y ON y.c_id=u.c_id WHERE u.parents= 0 and k.`createdate` BETWEEN ? and ? GROUP BY u.c_id;', [data?.c_id, start, end])
            if (query1.length > 0) {
                dataList.push(...query1[0])
            }
        }
        return dataList.length == 0 ? null : dataList
    }
    async sumsubjectTotal(c_id) {
        const query = await db.query('WITH RECURSIVE cte(c_id, parents,subject_ID) as (SELECT c_id,parents,subject_ID FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?  UNION SELECT t1.c_id,t1.parents,t1.subject_ID FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id,u.parents,y.`name_eng`,SUM(k.amout) as balances,u.subject_ID FROM cte u LEFT JOIN accounting2022.ledger_entries k ON k.`ch_id`= u.c_id LEFT JOIN accounting2022.chart_of_accounts y ON y.c_id=u.c_id;', [c_id]);
        let balances = query[0][0].balances
        await db.query("UPDATE accounting2022.transactions_ledger_entries SET balances = ? WHERE c_id= ? ", [balances, c_id]);
        const sql = await db.query('SELECT balances FROM accounting2022.transactions_ledger_entries WHERE c_id= ?', [c_id])
        return sql.length == 0 ? null : sql[0][0]
    }
    async totalchidrenFirst() {
        const query = await db.query('SELECT a.`c_id` FROM  accounting2022.transactions_ledger_entries a WHERE a.`parents`= 0')
        let informdata = query[0]
        await db.query("DELETE FROM accounting2022.alltotal")
        for (let data of informdata) {
            await db.query("INSERT INTO accounting2022.alltotal(parents) VALUES(?) ", [data?.c_id]);
            const query = await db.query("WITH RECURSIVE cte(c_id, parents,subject_ID) as (SELECT c_id,parents,subject_ID FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?  UNION SELECT t1.c_id,t1.parents,t1.subject_ID FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id,u.parents,y.`name_eng`,SUM(k.amout) as balances,u.subject_ID FROM cte u LEFT JOIN accounting2022.ledger_entries k ON k.`ch_id`= u.c_id LEFT JOIN accounting2022.chart_of_accounts y ON y.c_id=u.c_id;", [data?.c_id])
            let balances = query[0][0].balances
            await db.query("UPDATE accounting2022.alltotal SET balances= ? WHERE parents=?", [balances, data?.c_id])
        }
        const data = await db.query('SELECT * FROM accounting2022.alltotal');
        return query.length == 0 ? null : data[0]
    }

    // async insert() {
    //     // const query = await db.query('SELECT a.`c_id` FROM  accounting2022.transactions_ledger_entries a WHERE a.`parents`= 0')
    //     // let informdata = query[0]
    //     // console.log("informdata=",informdata)
    //     // db.query('INSERT INTO accounting2022.total(c_id) VALUES ?',[informdata.map(item =>[item.c_id])])

    //     const values = [
    //         [1],
    //         [2],
    //         [3],
    //         [4]
    //     ];
    //     const sql = "INSERT INTO accounting2022.total(parents) VALUES ?";

    //     const query = db.query(sql, [values]);
    //     return query.length == 0 ? null : query[0]


    // }
    async searchtotalchidrenFirst(start, end) {
        const query = await db.query('SELECT a.`c_id` FROM  accounting2022.transactions_ledger_entries a WHERE a.`parents`= 0')
        let informdata = query[0]
        await db.query("DELETE FROM accounting2022.alltotal")
        for (let data of informdata) {
            await db.query("INSERT INTO accounting2022.alltotal(parents) VALUES(?)", [data?.c_id]);
            const query = await db.query("WITH RECURSIVE cte(c_id, parents,subject_ID) as (SELECT c_id,parents,subject_ID FROM  accounting2022.transactions_ledger_entries WHERE c_id= ? UNION SELECT t1.c_id,t1.parents,t1.subject_ID FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id,u.parents,y.`name_eng`,SUM(k.amout) as balances,u.subject_ID FROM cte u LEFT JOIN accounting2022.ledger_entries k ON k.`ch_id`= u.c_id LEFT JOIN accounting2022.chart_of_accounts y ON y.c_id=u.c_id WHERE k.`createdate` BETWEEN ? AND ?;", [data?.c_id, start, end])
            let balances = query[0][0].balances
            await db.query("UPDATE accounting2022.alltotal SET balances= ? WHERE parents=?", [balances, data?.c_id])
        }
        const data = await db.query('SELECT * FROM accounting2022.alltotal');
        return query.length == 0 ? null : data[0]
    }
    async totalchidrenSecond() {
        const query = await db.query('SELECT a.`c_id` FROM  accounting2022.transactions_ledger_entries a WHERE a.`parents` <> 0')
        let informdata = query[0]
        await db.query("DELETE FROM accounting2022.secondalltotal")
        for (let data of informdata) {
            await db.query("INSERT INTO accounting2022.secondalltotal(parents) VALUES(?)", [data?.c_id]);
            const query = await db.query("WITH RECURSIVE cte(c_id, parents,subject_ID) as (SELECT c_id,parents,subject_ID FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?  UNION SELECT t1.c_id,t1.parents,t1.subject_ID FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id,u.parents,y.`name_eng`,SUM(k.amout) as balances,u.subject_ID FROM cte u LEFT JOIN accounting2022.ledger_entries k ON k.`ch_id`= u.c_id LEFT JOIN accounting2022.chart_of_accounts y ON y.c_id=u.c_id;", [data?.c_id])
            let balances = query[0][0].balances
            await db.query("UPDATE accounting2022.secondalltotal SET balances= ? WHERE parents=?", [balances, data?.c_id])
        }
        const data = await db.query('SELECT * FROM accounting2022.secondalltotal');
        return query.length == 0 ? null : data[0]
    }
    async searchtotalchidrenSecond(start, end) {
        const query = await db.query('SELECT a.`c_id` FROM  accounting2022.transactions_ledger_entries a WHERE a.`parents` <> 0')
        let informdata = query[0]
        await db.query("DELETE FROM accounting2022.secondalltotal")
        for (let data of informdata) {
            await db.query("INSERT INTO accounting2022.secondalltotal(parents) VALUES(?)", [data?.c_id]);
            const query = await db.query("WITH RECURSIVE cte(c_id, parents,subject_ID) as (SELECT c_id,parents,subject_ID FROM  accounting2022.transactions_ledger_entries WHERE c_id= ? UNION SELECT t1.c_id,t1.parents,t1.subject_ID FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.c_id=t1.parents ) SELECT u.c_id as c_id,u.parents,y.`name_eng`,SUM(k.amout) as balances,u.subject_ID FROM cte u LEFT JOIN accounting2022.ledger_entries k ON k.`ch_id`= u.c_id LEFT JOIN accounting2022.chart_of_accounts y ON y.c_id=u.c_id WHERE k.`createdate` BETWEEN ? AND ?;", [data?.c_id, start, end])
            let balances = query[0][0].balances
            await db.query("UPDATE accounting2022.secondalltotal SET balances= ? WHERE parents=?", [balances, data?.c_id])
        }
        const data = await db.query('SELECT * FROM accounting2022.secondalltotal');
        return query.length == 0 ? null : data[0]
    }
    async totalsubject() {
        const query = await db.query('SELECT a.`subject_ID`, SUM(b.`amout`) as amout  FROM accounting2022.transactions_ledger_entries a INNER JOIN accounting2022.ledger_entries b ON b.`ch_id`=a.`c_id` GROUP BY a.`subject_ID`;')
        return query.length == 0 ? null : query[0]
    }
    async searchtotalsubject(start, end) {
        const query = await db.query('SELECT a.`subject_ID`, SUM(b.`amout`) as amout  FROM accounting2022.transactions_ledger_entries a INNER JOIN accounting2022.ledger_entries b ON b.`ch_id`=a.`c_id` WHERE b.`createdate` BETWEEN ? and ? GROUP BY a.`subject_ID`;', [start, end])
        return query.length == 0 ? null : query[0]
    }

    async childrensecond() {
        const query = await db.query('SELECT a.c_id,a.account_id,b.name_eng,a.parents,sum(c.amout) as balances FROM  accounting2022.transactions_ledger_entries a LEFT JOIN chart_of_accounts b ON b.c_id=a.c_id LEFT JOIN accounting2022.ledger_entries c ON c.ch_id=a.c_id WHERE a.parents <> 0 GROUP BY a.c_id;')
        return query.length == 0 ? null : query[0]
    }
    async searchchildrensecond(start, end) {
        const query = await db.query('SELECT a.c_id,a.account_id,b.name_eng,a.parents,sum(c.amout) as balances FROM  accounting2022.transactions_ledger_entries a LEFT JOIN chart_of_accounts b ON b.c_id=a.c_id LEFT JOIN accounting2022.ledger_entries c ON c.ch_id=a.c_id WHERE a.parents <> 0 and c.`createdate` BETWEEN ? and ? GROUP BY a.c_id;', [start, end]);
        return query.length == 0 ? null : query[0]
    }
}
module.exports = ReportGL;
