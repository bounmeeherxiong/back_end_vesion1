const db = require('../../../configs/database');
class ChartofAccounts {
    constructor(
        c_uid, ac_type, detail_type, name_eng, c_desc, parents, accountid, currencies_id) {
        this.c_uid = c_uid;
        this.ac_type = ac_type;
        this.detail_type = detail_type;
        this.name_eng = name_eng;
        this.c_desc = c_desc;
        this.parents = parents;
        this.accountid = accountid;
        this.currencies_id = currencies_id
    }
    async insertchartofaccounts(uid, ac_type, detail_type, name_eng, c_desc, parents, accountid, currencies_id, checked, beginningBalance, debit, credit, balancecurrecies, balancelak, createdate, exchangeRate, currencystatus,bank_id) {
        if (beginningBalance == false) {
            const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?, ?, ?,?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, accountid, currencies_id]);
            return query.length == 0 ? null : query[0]
        } else {
            if (checked == "As" || checked == "Ex") {
                let debitbalance = balancecurrecies;
                let creditbalance = -balancecurrecies;
                let debitbalancelak = balancelak.replaceAll(',','');
                let creditbalancelak = -balancelak.replaceAll(',','');
                if (debit == "debit") {
                    if (currencystatus == "LAK") {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, debitbalance,debitbalance, accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?)", [id, debitbalance, debitbalance, '1', uid, createdate, currencystatus, 'Beginning', debit])
                        return query.length == 0 ? null : query[0]
                    } else if (currencystatus == "USD" || currencystatus == "THB") {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?, ?, ?,?, ?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, debitbalance,debitbalancelak, accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [id, debitbalancelak, debitbalancelak, '1', uid, createdate, exchangeRate, debitbalance, debitbalance, currencystatus, 'Beginning', debit]);
                        return query.length == 0 ? null : query[0]
                    } else {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?, ?,?,?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, debitbalance, debitbalance,accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?)", [id, debitbalance, debitbalance, '1', uid, createdate, currencystatus, 'Beginning', debit])
                        return query.length == 0 ? null : query[0]
                    }
                } else if (credit == "credit") {
                    if (currencystatus == "LAK") {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?, ?, ?,?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, creditbalance,creditbalance, accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?)", [id, creditbalance, creditbalance, '1', uid, createdate, currencystatus, 'Beginning', credit])

                    } else if (currencystatus == "USD" || currencystatus == "THB") {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?, ?,?, ?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, creditbalance,creditbalancelak, accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [id, creditbalancelak, creditbalancelak, '1', uid, createdate, exchangeRate, creditbalance, creditbalance, currencystatus, 'Beginning', credit]);
                        return query.length == 0 ? null : query[0]
                    } else {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?,?, ?, ?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, creditbalance,creditbalance, accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?)", [id, creditbalance, creditbalance, '1', uid, createdate, currencystatus, 'Beginning', credit])
                    }
                }
            } else if (checked == "li" || checked == "In" || checked == "Eq") {
                let debitbalance = -balancecurrecies;
                let creditbalance = balancecurrecies;
                let debitbalancelak = -balancelak;
                let creditbalancelak = balancelak;
                if (debit == "debit") {
                    if (currencystatus == "LAK") {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?,?, ?, ?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, debitbalance,debitbalance, accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?)", [id, debitbalance, debitbalance, '1', uid, createdate, currencystatus, 'Beginning', debit])

                    } else if (currencystatus == "USD" || currencystatus == "THB") {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?, ?,?, ?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, debitbalance,debitbalance, accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [id, debitbalancelak, debitbalancelak, '1', uid, createdate, exchangeRate, debitbalance, debitbalance, currencystatus, 'Beginning', debit]);
                        return query.length == 0 ? null : query[0]
                    } else {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?,?, ?, ?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, debitbalance,debitbalance, accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?)", [id, debitbalance, debitbalance, '1', uid, createdate, currencystatus, 'Beginning', debit])
                    }
                } else if (credit == "credit") {
                    if (currencystatus == "LAK") {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?,?, ?, ?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, creditbalance,creditbalance, accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?)", [id, creditbalance, creditbalance, '1', uid, createdate, 'Beginning', credit])
                    } else if (currencystatus == "USD" || currencystatus == "THB") {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?,?, ?, ?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, creditbalance, creditbalance,accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [id, creditbalancelak, creditbalancelak, '1', uid, createdate, exchangeRate, creditbalance, creditbalance, currencystatus, 'Beginning', credit]);
                        return query.length == 0 ? null : query[0]
                    } else {
                        const query = await db.query("INSERT INTO accounting2022.chart_of_accounts(bank_id,c_uid,ac_type,detail_type,name_eng,c_desc,parents,c_balance,total_balances,account_id,currencies_id) VALUES (?,?, ?, ?, ?, ?, ?,?, ?,?, ?)", [bank_id,uid, ac_type, detail_type, name_eng, c_desc, parents, creditbalance,creditbalance, accountid, currencies_id]);
                        const id = query[0].insertId
                        await db.query("INSERT INTO accounting2022.ledger_entries(ch_id,amout,balances,createstatus,c_uid,createdate,currencystatus,BeginningBalance,debit_and_credit) VALUES(?,?,?,?,?,?,?,?,?)", [id, creditbalance, creditbalance, '1', uid, createdate, currencystatus, 'Beginning', credit])
                    }
                }
            }
        }
    }
    async Updatechartofaccount(id, ac_type, name_eng, c_desc, parents, currencies_id, beginningBalance, checked, debit, credit, currencystatus, ledgerid, balancecurrecies, balancelak, exchangeRate) {
        if (beginningBalance == false) {
            const query = await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, currencies_id, id]);
            return query.length == 0 ? null : query[0]
        } else {
            if (checked == "As" || checked == "Ex") {
                let debitbalance = balancecurrecies;
                let creditbalance = -balancecurrecies;
                let debitbalancelak = balancelak;
                let creditbalancelak = -balancelak;
                if (debit == "debit") {
                    if (currencystatus == "LAK") {
                        await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?,c_balance= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, debitbalance, currencies_id, id]);
                        const query = await db.query("UPDATE accounting2022.ledger_entries SET amout = ?, balances = ?,debit_and_credit=?  WHERE lg_id = ?", [debitbalance, debitbalance, debit, ledgerid])
                        return query.length == 0 ? null : query[0]
                    } else if (currencystatus == "USD" || currencystatus == "THB") {
                        console.log(debitbalancelak)
                        await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?,c_balance= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, debitbalance, currencies_id, id]);
                        const query = await db.query("UPDATE accounting2022.ledger_entries set amout =?, balances= ?,ExchangeRate = ?,amoutcurrency= ?,balancescurrency= ?, debit_and_credit= ? WHERE  lg_id = ?", [debitbalancelak, debitbalancelak, exchangeRate, debitbalance, debitbalance, debit, ledgerid]);
                        return query.length == 0 ? null : query[0]
                    } else {
                        const query = await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, currencies_id, id]);
                        return query.length == 0 ? null : query[0]
                    }
                } else if (credit == "credit") {
                    if (currencystatus == "LAK") {
                        await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?,c_balance= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, creditbalance, currencies_id, id]);
                        const query = await db.query("UPDATE accounting2022.ledger_entries SET amout = ?, balances = ? ,debit_and_credit = ? WHERE lg_id = ?", [creditbalance, creditbalance, credit, ledgerid])
                        return query.length == 0 ? null : query[0]
                    } else if (currencystatus == "USD" || currencystatus == "THB") {
                        await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?,c_balance= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, creditbalance, currencies_id, id]);
                        const query = await db.query("UPDATE accounting2022.ledger_entries set amout =?, balances= ?,ExchangeRate = ?,amoutcurrency= ?,balancescurrency= ?, debit_and_credit= ? WHERE  lg_id = ?", [creditbalancelak, creditbalancelak, exchangeRate, creditbalance, creditbalance, credit, ledgerid]);
                        return query.length == 0 ? null : query[0]
                    } else {
                        const query = await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, currencies_id, id]);
                        return query.length == 0 ? null : query[0]
                    }
                }
            } else if (checked == "li" || checked == "In" || checked == "Eq") {

                let debitbalance = -balancecurrecies;
                let creditbalance = balancecurrecies;
                let debitbalancelak = -balancelak;
                let creditbalancelak = balancelak;
                if (debit == "debit") {
                    if (currencystatus == "LAK") {
                        console.log("lak=mm")
                        await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?,c_balance= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, debitbalance, currencies_id, id]);
                        const query = await db.query("UPDATE accounting2022.ledger_entries SET amout = ?, balances = ? ,debit_and_credit = ? WHERE lg_id = ?", [debitbalance, debitbalance, debit, ledgerid])
                        return query.length == 0 ? null : query[0]
                    } else if (currencystatus == "USD" || currencystatus == "THB") {
                        await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?,c_balance= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, debitbalancelak, currencies_id, id]);
                        const query = await db.query("UPDATE accounting2022.ledger_entries set amout =?, balances= ?,ExchangeRate = ?,amoutcurrency= ?,balancescurrency= ?, debit_and_credit= ? WHERE  lg_id = ?", [debitbalancelak, debitbalancelak, exchangeRate, debitbalance, debitbalance, debit, ledgerid]);
                        return query.length == 0 ? null : query[0]
                    } else {
                        const query = await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, currencies_id, id]);
                        return query.length == 0 ? null : query[0]
                    }
                } else if (credit == "credit") {
                    if (currencystatus == "LAK") {
                        await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?,c_balance= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, creditbalance, currencies_id, id]);
                        const query = await db.query("UPDATE accounting2022.ledger_entries SET amout = ?, balances = ? ,debit_and_credit = ? WHERE lg_id = ?", [creditbalance, creditbalance, credit, ledgerid])
                        return query.length == 0 ? null : query[0]
                    } else if (currencystatus == "USD" || currencystatus == "THB") {
                        await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?,c_balance= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, creditbalancelak, currencies_id, id]);
                        const query = await db.query("UPDATE accounting2022.ledger_entries set amout =?, balances= ?,ExchangeRate = ?,amoutcurrency= ?,balancescurrency= ?, debit_and_credit= ? WHERE  lg_id = ?", [creditbalancelak, creditbalancelak, exchangeRate, creditbalance, creditbalance, credit, ledgerid]);
                        return query.length == 0 ? null : query[0]
                    } else {
                        const query = await db.query("UPDATE  accounting2022.chart_of_accounts SET ac_type = ? , name_eng= ? , c_desc= ?,parents= ?, currencies_id = ? WHERE c_id = ? ", [ac_type, name_eng, c_desc, parents, currencies_id, id]);
                        return query.length == 0 ? null : query[0]
                    }
                }
            }
        }
    }
    async transactionlegerintery(id) {
        const parent = await db.query("WITH RECURSIVE cte (c_id, c_uid, ac_type, name_eng, parents,account_id,currencies_id) AS ( SELECT c_id, c_uid, ac_type, name_eng, parents,account_id,currencies_id FROM accounting2022.chart_of_accounts WHERE c_id = ? UNION SELECT t1.c_id, t1.c_uid, t1.ac_type, t1.name_eng, t1.parents,t1.account_id,t1.currencies_id FROM accounting2022.chart_of_accounts t1 INNER JOIN cte t2 ON t2.parents = t1.c_id ) SELECT c_id, c_uid, ac_type, name_eng, parents,account_id,currencies_id FROM cte ORDER BY c_id", [id]);
        const parents = parent[0]
        parents.map(async (data2) => {
            const checkname = await db.query("SELECT * FROM  accounting2022.transactions_ledger_entries a WHERE a.c_id= ? and a.parents=?", [data2?.c_id, data2?.parents]);
            const accountname = checkname.length == 0 ? null : checkname[0]
            if (accountname.length > 0) {
            } else {
                if (data2?.parents == 0) {
                    await db.query("INSERT INTO  accounting2022.transactions_ledger_entries(c_id,account_id,parents) VALUES(?,?,?)", [data2?.c_id, data2?.account_id, data2?.parents]);
                } else {
                    await db.query("INSERT INTO  accounting2022.transactions_ledger_entries(c_id,account_id,parents) VALUES(?,?,?)", [data2?.c_id, data2?.account_id, data2?.parents]);
                }
            }
        })
        return parents.length == 0 ? null : parents[0]
    }
    async selectAllParents(c_id) {
        const parent = await db.query("WITH RECURSIVE cte (c_id, c_uid, ac_type, detail_type, name_eng, parents,account_id,currencies_id,currency_code) AS ( SELECT c_id, c_uid, ac_type, detail_type, name_eng, parents,account_id,currencies_id,currency_code FROM accounting2022.chart_of_accounts WHERE c_id = ? UNION SELECT t1.c_id, t1.c_uid, t1.ac_type, t1.detail_type, t1.name_eng, t1.parents,t1.account_id,t1.currencies_id,t1.currency_code FROM accounting2022.chart_of_accounts t1 INNER JOIN cte t2 ON t2.parents = t1.c_id ) SELECT c_id, c_uid, ac_type, detail_type, name_eng, parents,account_id,currencies_id,currency_code FROM cte;", [c_id]);
        return parent.length == 0 ? null : parent[0]
    }
    async selectChecksubject(c_id) {
        console.log("c_id=",c_id)
        const query = await db.query('SELECT c.`createcondition`,d.id FROM accounting2022.chart_of_accounts a INNER JOIN accounting2022.accounts_type c ON c.`uid`=a.`ac_type` INNER JOIN accounting2022.accounts d ON d.`uid`=c.`main_type` WHERE a.c_id= ?', [c_id]);
        let checkData = query[0][0].createcondition
        console.log("checkData=",checkData)
        let dataList;
        if (checkData == 'CA') {
            dataList = await db.query('SELECT a.`subject_ID` FROM  accounting2022.subject a WHERE a.`subject_ID`= 1;')
        } else if (checkData == 'LT') {
            dataList = await db.query('SELECT a.`subject_ID` FROM  accounting2022.subject a WHERE a.`subject_ID`= 2;')
            console.log("dataList=",dataList)
        } else if (checkData == 'CL') {
            dataList = await db.query('SELECT a.`subject_ID` FROM  accounting2022.subject a WHERE a.`subject_ID`= 3;')
        } else if (checkData == 'NC') {
            dataList = await db.query('SELECT a.`subject_ID` FROM  accounting2022.subject a WHERE a.`subject_ID`= 4;')
        } else if (checkData == 'OW') {
            dataList = await db.query('SELECT a.`subject_ID` FROM  accounting2022.subject a WHERE a.`subject_ID`= 5;')
        } else if (checkData == 'IN') {
            dataList = await db.query('SELECT a.`subject_ID` FROM  accounting2022.subject a WHERE a.`subject_ID`= 6;')
        } else if (checkData == 'OT') {
            dataList = await db.query('SELECT a.`subject_ID` FROM  accounting2022.subject a WHERE a.`subject_ID`= 7;')
        } else if (checkData == 'CO') {
            dataList = await db.query('SELECT a.`subject_ID` FROM  accounting2022.subject a WHERE a.`subject_ID`= 8;')
        } else if (checkData == 'EX') {
            dataList = await db.query('SELECT a.`subject_ID` FROM  accounting2022.subject a WHERE a.`subject_ID`= 9;')
        } else if (checkData == 'OTE') {
            dataList = await db.query('SELECT a.`subject_ID` FROM  accounting2022.subject a WHERE a.`subject_ID`= 10;')
        }
        return dataList.length == 0 ? null : dataList[0]
    }
    async selectStatusAccount(c_id) {
        let query;
        const check = await db.query('SELECT c.`createcondition`,d.id FROM accounting2022.chart_of_accounts a INNER JOIN accounting2022.accounts_type c ON c.`uid`=a.`ac_type` INNER JOIN accounting2022.accounts d ON d.`uid`=c.`main_type` WHERE a.c_id= ?', [c_id]);
        let checkData = check[0][0].createcondition
 
        if (checkData == 'OW') {
            query = await db.query('SELECT a.id FROM accounting2022.accounts a WHERE a.`createstatus`= ?', ['li']);
        } else if (checkData == 'CO' || checkData == null) {
            query = await db.query('SELECT a.id FROM accounting2022.accounts a WHERE a.`createstatus`= ?', ['In']);
        } else {
            query = await db.query('SELECT d.id FROM accounting2022.chart_of_accounts a INNER JOIN accounting2022.accounts_type c ON c.`uid`=a.`ac_type` INNER JOIN accounting2022.accounts d ON d.`uid`=c.`main_type` WHERE a.c_id= ?', [c_id]);
        }
        return query.length == 0 ? null : query[0]
    }
    async checkaccounts_type(c_id){
        const condition = await db.query("SELECT a.createcondition FROM accounting2022.accounts_type a INNER JOIN accounting2022.chart_of_accounts b ON b.ac_type=a.uid INNER JOIN accounting2022.accounts c ON c.uid= a.main_type WHERE b.c_id= ?;", [c_id]);
        return condition.length == 0 ? null : condition[0]
    }
    async selectconditions(c_id) {
        const condition = await db.query("SELECT a.conditions,c.createstatus FROM accounting2022.accounts_type a INNER JOIN accounting2022.chart_of_accounts b ON b.ac_type=a.uid INNER JOIN accounting2022.accounts c ON c.uid= a.main_type WHERE b.c_id= ?;", [c_id]);
        return condition.length == 0 ? null : condition[0]
    }

    async selectCreateStutas(c_id) {
        const createstutas = await db.query("SELECT c.`createstatus`FROM  accounting2022.chart_of_accounts a INNER JOIN  accounting2022.accounts_type b ON b.`uid`=a.`ac_type` INNER JOIN accounting2022.accounts c ON c.uid=b.`main_type` WHERE a.c_id= ?;", [c_id]);
        return createstutas.length == 0 ? null : createstutas[0]
    }
    async selectcreatestutes(c_id) {
        const createstutes = await db.query("SELECT c.createstatus FROM accounting2022.accounts_type a INNER JOIN accounting2022.chart_of_accounts b ON b.ac_type=a.uid INNER JOIN accounting2022.accounts c ON c.uid= a.main_type WHERE b.c_id= ?;", [c_id]);
        return createstutes.length == 0 ? null : createstutes[0]
    }
    async selectOnlyoneparents(c_id) {
        const parent = await db.query("WITH RECURSIVE cte (c_id, c_uid, ac_type, detail_type, name_eng, parents,account_id,currencies_id) AS ( SELECT c_id, c_uid, ac_type, detail_type, name_eng, parents,account_id,currencies_id FROM accounting2022.chart_of_accounts WHERE c_id = ? UNION SELECT t1.c_id, t1.c_uid, t1.ac_type, t1.detail_type, t1.name_eng, t1.parents,t1.account_id,t1.currencies_id FROM accounting2022.chart_of_accounts t1 INNER JOIN cte t2 ON t2.parents = t1.c_id ) SELECT c_id, c_uid, ac_type, detail_type, name_eng, parents,account_id,currencies_id FROM cte WHERE parents='0';", [c_id]);
        return parent.length == 0 ? null : parent[0]
    }
    async selectparrentToinsert(c_id) {
        const parent = await db.query("WITH RECURSIVE cte (c_id,  ac_type, detail_type, name_eng, parents,account_id) AS ( SELECT c_id, ac_type, detail_type, name_eng, parents,account_id FROM accounting2022.chart_of_accounts WHERE c_id = ?  UNION SELECT t1.c_id, t1.ac_type, t1.detail_type, t1.name_eng, t1.parents,t1.account_id FROM accounting2022.chart_of_accounts t1 INNER JOIN cte t2 ON t2.parents = t1.c_id ) SELECT c_id, ac_type, detail_type, name_eng, parents,account_id FROM cte ORDER BY c_id;", [c_id]);
        return parent.length == 0 ? null : parent[0]
    }
    async selectparent(parent_id_checking) {
        const parent = await db.query("SELECT a.c_id,a.c_uid,a.ac_type,a.detail_type,a.name_eng,a.parents FROM accounting2022.chart_of_accounts a where a.c_id = ?", [parent_id_checking]);
        return parent.length == 0 ? null : parent[0]
    }
    async selectAll() {
        const query = await db.query('SELECT * FROM `view_chart_of_accounts`');
        return query.length == 0 ? null : query[0];
    }
    async selectallByid(ac_type) {
        const query = await db.query("SELECT a.name_eng, a.c_id,b.`name` as currencies_name  FROM accounting2022.chart_of_accounts a INNER JOIN accounting2022.tb_currency b ON b.`id`=a.`currencies_id` WHERE a.ac_type=?", [ac_type]);
        return query.length == 0 ? null : query[0];
    }

    async editchartBeginning(id) {
        const query = await db.query("SELECT a.`lg_id`,a.`ExchangeRate`,a.`createdate`,a.`balances`,a.`balancescurrency`,a.`currencystatus`,a.`BeginningBalance`,a.`debit_and_credit` FROM  accounting2022.ledger_entries a WHERE a.`ch_id`= ? and a.`BeginningBalance`='Beginning';", [id]);
        return query.length == 0 ? null : query[0];
    }

    async selectaccoutType(ac_type) {
        const query = await db.query("SELECT * FROM accounting2022.detail_type a where a.ac_type=?", [ac_type]);
        return query.length == 0 ? null : query[0]
    }
    async selectaccount() {
        const query = await db.query("SELECT `id`,`uid`,`main_type` FROM accounting2022.accounts_type;");
        return query.length == 0 ? null : query[0]
    }
    async selectbank(){
        const query= await db.query("SELECT * FROM accounting2022.bank");
        return query.length == 0 ? null : query[0]
    }
    async selectallaccountname(page, pagelimit) {
        const query = await db.query("SELECT b.`id` as ac_ty_id,c.`id` as det_id, a.c_id,a.name_eng account_name,a.c_desc,a.c_balance,d.id as currencies_id,d.name as currencesname,b.uid as type_id,b.name_eng accounttype_name, c.uid as detail_type_id,c.name_eng detailtypename,a.parents,a.c_uid,e.createstatus FROM accounting2022.chart_of_accounts a  LEFT JOIN accounting2022.accounts_type b ON b.uid=a.ac_type LEFT JOIN accounting2022.detail_type c ON c.uid=a.detail_type LEFT JOIN accounting2022.tb_currency d ON d.id= a.currencies_id LEFT JOIN accounting2022.accounts e ON e.uid=b.main_type WHERE a.parents= ? ", [0]);
        return query.length == 0 ? null : query[0]
    }
    async selecttallaccountchildren() {
        const children = await db.query("SELECT b.`id` as ac_ty_id,c.`id` as det_id, a.c_id,a.name_eng account_name,a.c_desc,a.c_balance,d.id as currencies_id,d.name as currencesname,b.uid as type_id,b.name_eng accounttype_name, c.uid as detail_type_id,c.name_eng detailtypename,a.parents,a.c_uid,e.createstatus FROM accounting2022.chart_of_accounts a  LEFT JOIN accounting2022.accounts_type b ON b.uid=a.ac_type LEFT JOIN accounting2022.detail_type c ON c.uid=a.detail_type LEFT JOIN accounting2022.tb_currency d ON d.id= a.currencies_id LEFT JOIN accounting2022.accounts e ON e.uid=b.main_type WHERE a.parents <> ?", [0]);
        return children.length == 0 ? null : children[0]
    }
    async checkAccountName(name) {
        const checkname = await db.query("SELECT * FROM accounting2022.chart_of_accounts a WHERE a.name_eng= ?", [name]);
        return checkname.length == 0 ? null : checkname[0]
    }
}
module.exports = ChartofAccounts;