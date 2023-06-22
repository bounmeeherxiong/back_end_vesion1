const db = require('../../../configs/database');
const moment = require('moment');
class JournalEntries {
    constructor(
        tr_uid, journal_no, tr_date, debit, credit
    ) {
        this.uid = tr_uid;
        this.no = journal_no;
        this.date = tr_date;
        this.debit = debit;
        this.credit = credit;
    }
    async insertDoubleEntries() {
        let sql = "INSERT INTO accounting2022.transactions(tr_uid, journal_no,tr_date,totaldebit,totalcredit) VALUES (?, ?, ?,?,?);";
        let data = [
            this.uid,
            this.no,
            this.date,
            this.debit,
            this.credit,
        ];
        const query = await db.query(sql, data);
        return query[0]
    }

    async checkJournalEntries(informdata) {
        const groupB = [{ name: "USD" }, { name: "THB" },];
        for (let data of informdata) {
            if (data?.c_id != undefined) {
                const checkjo = await db.query("SELECT a.id,a.name FROM  accounting2022.tb_currency a WHERE a.id= ?", [data?.currencies_id])
                const check = checkjo[0]
                let keys = ['name'];
                let values = ['USD', 'THB'];
                let filtered_data = check.filter(d => {
                    for (let key of keys) {
                        for (let value of values) {
                            if (d[key] == value) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
                const boolean = groupB.every(obj => filtered_data.find(aObj => obj.name === aObj.name));
      

            }
        }
    }
    async insertcounting() {
        let sql = "UPDATE accounting2022.countnumber SET number =number+1 WHERE status=1";
        const query = await db.query(sql);
        return query[0]
    }
    async insertledgerEntries(id, informdata, journal_no, tr_date, ExchangeRate, currency) {
        try {
            if (currency == "LAK") {
                for (let data of informdata) {                    
                    if (data?.c_id != undefined) {
                        const checkcurrency = await db.query("SELECT a.id, a.name,a.createstatus FROM accounting2022.tb_currency a WHERE a.id= ?", [data?.currencies_id]);
                        let createstatus = checkcurrency[0][0].createstatus
                        const account = await db.query("SELECT createstatus FROM accounting2022.accounts WHERE uid=?", [data.account_id]);
                        let checkaccount = account[0][0].createstatus;
                        const query = await db.query("SELECT a.balances,a.balancescurrency FROM accounting2022.ledger_entries a WHERE a.ch_id=? and a.createstatus=1", [data.c_id]);
                        const checkBanlance = query[0].length == 0 ? null : query[0];
                        const ac_type = await db.query("SELECT createcondition FROM accounting2022.accounts_type WHERE createcondition=?", [data?.checkAccount]);
                        let check_ac_type = ac_type[0][0].createcondition;

                        let newB;
                        let balancecu;
                        let des;
                        let lg;
                        let amout;
                        let amoutcurrency;
                        if (checkaccount == "As" || checkaccount == "Ex") {
                            if (data?.credit) {
                                if (ExchangeRate != 0) {
                                    if (createstatus == "LAK") {
                                        let credit = data?.credit.replaceAll(",", '');
                                        let exchangecredit = parseFloat(credit) / parseFloat(ExchangeRate)
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0;
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) - parseFloat(credit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(exchangecredit)

                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) - parseFloat(credit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(exchangecredit)
                                        }
                                        amout = -exchangecredit
                                        amoutcurrency = -data?.credit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', data?.credit.replaceAll(",", ''), des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, ExchangeRate, exchangecredit, balancecu, createstatus, data?.conditions])
                                    } else if (createstatus == "USD" || createstatus == "THB") {
                                        let credit = data?.credit.replaceAll(",", '');
                                        let exchangecredit = parseFloat(credit) / parseFloat(ExchangeRate)
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0;
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) - parseFloat(credit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(exchangecredit);
                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) - parseFloat(credit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(exchangecredit)
                                        }
                                        amout = -exchangecredit
                                        amoutcurrency = -data?.credit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [balancecu,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', data?.credit.replaceAll(",", ''), des, lg, journal_no, amoutcurrency, newB, '1', data?.c_uid, tr_date, ExchangeRate, exchangecredit, balancecu, createstatus, data?.conditions])
                                    }

                                } else {
                                    if (data?.description == undefined || data?.Employee == undefined) {
                                        des = "";
                                        lg = "";
                                    } else {
                                        des = data?.description
                                        lg = data?.Employee
                                    }
                                    if (checkBanlance == null) {
                                        let balances = 0
                                        newB = parseFloat(balances) - parseFloat(data?.credit.replaceAll(",", ''));
                                    } else {
                                        let balances = query[0][0].balances

                                        newB = parseFloat(balances) - parseFloat(data?.credit.replaceAll(",", ''));
                                    }
                                    amout = -data?.credit.replaceAll(",", '')
                                    await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ? WHERE c_id=?", [newB, data.c_id])
                                    await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                    await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id, parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', data?.credit.replaceAll(",", ''), des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, createstatus, data?.conditions])
                                }
                            } else if (data?.debit) {
                                if (ExchangeRate != 0) {
                                    if (createstatus == "LAK") {
                                        let debit = data?.debit.replaceAll(",", '');
                                        let exchangedebit = parseFloat(debit) / parseFloat(ExchangeRate)
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) + parseFloat(debit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(exchangedebit)

                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) + parseFloat(debit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(exchangedebit)
                                        }
                                        amout = exchangedebit
                                        amoutcurrency = data?.debit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, data?.debit.replaceAll(",", ''), '0', des, lg, journal_no, amoutcurrency, newB, '1', data?.c_uid, tr_date, ExchangeRate, exchangedebit, balancecu, createstatus, data?.conditions])

                                    } else if (createstatus == "USD" || createstatus == "THB") {
                                        let debit = data?.debit.replaceAll(",", '');
                                        let exchangedebit = parseFloat(debit) / parseFloat(ExchangeRate)
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) + parseFloat(debit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(exchangedebit)


                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) + parseFloat(debit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(exchangedebit)
                                        }
                                        amout = exchangedebit
                                        amoutcurrency = data?.debit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances WHERE c_id=?", [balancecu,balances, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id, parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, data?.debit.replaceAll(",", ''), '0', des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, ExchangeRate, exchangedebit, balancecu, createstatus, data?.conditions])
                                    }
                                } else {
                                    if (data?.description == undefined || data?.Employee == undefined) {
                                        des = "";
                                        lg = "";
                                    } else {
                                        des = data?.description
                                        lg = data?.Employee
                                    }
                                    if (checkBanlance == null) {
                                        let balances = 0
                                        newB = parseFloat(balances) + parseFloat(data?.debit.replaceAll(",", ''));
                                    } else {
                                        let balances = query[0][0].balances

                                        newB = parseFloat(balances) + parseFloat(data?.debit.replaceAll(",", ''));
                                    }
                                    amout = data?.debit.replaceAll(",", '')
                                    await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                    await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                    await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, data?.debit.replaceAll(",", ''), '0', des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, createstatus, data?.conditions])
                                }
                            }
                        }
                        if (checkaccount == "li" || checkaccount == "In" || checkaccount == "Eq") {

                            if (data?.credit) {
                                if (ExchangeRate != 0) {
                                    if (createstatus == "LAK") {
                                        let credit = data?.credit.replaceAll(",", '');
                                        let exchangecredit = parseFloat(credit) / parseFloat(ExchangeRate)
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) + parseFloat(credit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(exchangecredit)

                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency

                                            newB = parseFloat(balances) + parseFloat(credit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(exchangecredit);

                                        }
                                        amout = exchangecredit
                                        amoutcurrency = data?.credit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', data?.credit.replaceAll(",", ''), des, lg, journal_no, amoutcurrency, newB, '1', data?.c_uid, tr_date, ExchangeRate, exchangecredit, balancecu, createstatus, data?.conditions])

                                    } else if (createstatus == "USD" || createstatus == "THB") {
                                        let credit = data?.credit.replaceAll(",", '');
                                        let exchangecredit = parseFloat(credit) / parseFloat(ExchangeRate)

                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) + parseFloat(credit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(exchangecredit)
                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) + parseFloat(credit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(exchangecredit);
                                        }
                                        amout = exchangecredit
                                        amoutcurrency = data?.credit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [balancecu,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', data?.credit.replaceAll(",", ''), des, lg, journal_no, amoutcurrency, newB, '1', data?.c_uid, tr_date, ExchangeRate, exchangecredit, balancecu, createstatus, data?.conditions])

                                    }
                                } else {
                         

                                    let asset = data?.asstet_id
                                    if (data?.description == undefined || data?.Employee == undefined) {
                                        des = "";
                                        lg = "";
                                    } else {
                                        des = data?.description
                                        lg = data?.Employee
                                    }
                                    if (checkBanlance == null) {
                                        let balances = 0
                                        if (check_ac_type == 'CO') {
                                            newB = parseFloat(balances) - parseFloat(data?.credit.replaceAll(",", ''));
                                        } else {
                                            newB = parseFloat(balances) + parseFloat(data?.credit.replaceAll(",", ''));
                                        }

                                    } else {
                                        let balances = query[0][0].balances
                                        if (check_ac_type == 'CO') {
                                            newB = parseFloat(balances) - parseFloat(data?.credit.replaceAll(",", ''));
                                        } else {
                                            newB = parseFloat(balances) + parseFloat(data?.credit.replaceAll(",", ''));
                                        }
                                    }
                                    if (check_ac_type == 'CO') {
                
                                        amout = -data?.credit.replaceAll(",", '')
                                    } else {
                                        amout = +data?.credit.replaceAll(",", '')
                                    }
                                    await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ? WHERE c_id=?", [newB, data.c_id])
                                    await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                    await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id, account_id, parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, asset, data?.parents, '0', data?.credit.replaceAll(",", ''), des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, createstatus, data?.conditions])

                                }
                            } else if (data?.debit) {
                                if (ExchangeRate != 0) {
                                    if (createstatus == "LAK") {
                                        let debit = data?.debit.replaceAll(",", '');
                                        let exchangedebit = parseFloat(debit) / parseFloat(ExchangeRate)
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) - parseFloat(debit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(exchangedebit)
                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) - parseFloat(debit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(exchangedebit)
                                        }
                                        amout = -exchangedebit
                                        amoutcurrency = -data?.debit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, data?.debit.replaceAll(",", ''), '0', des, lg, journal_no, amoutcurrency, newB, '1', data?.c_uid, tr_date, ExchangeRate, exchangedebit, balancecu, createstatus, data?.conditions])
                                    } else if (createstatus == "USD" || createstatus == "THB") {
                                        let debit = data?.debit.replaceAll(",", '');
                                        let exchangedebit = parseFloat(debit) / parseFloat(ExchangeRate)
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) - parseFloat(debit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(exchangedebit)
                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) - parseFloat(debit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(exchangedebit)
                                        }
                                        amout = -exchangedebit
                                        amoutcurrency = -data?.debit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [balancecu,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, data?.debit.replaceAll(",", ''), '0', des, lg, journal_no, amoutcurrency, newB, '1', data?.c_uid, tr_date, ExchangeRate, exchangedebit, balancecu, createstatus, data?.conditions])
                                    }
                                } else {
                                    if (data?.description == undefined || data?.Employee == undefined) {
                                        des = "";
                                        lg = "";
                                    } else {
                                        des = data?.description
                                        lg = data?.Employee
                                    }
                                    if (checkBanlance == null) {
                                        let balances = 0

                                        if (check_ac_type == 'CO') {
                                            newB = parseFloat(balances) + parseFloat(data?.debit.replaceAll(",", ''));
                                        } else {
                                            newB = parseFloat(balances) - parseFloat(data?.debit.replaceAll(",", ''));
                                        }
                                    } else {
                                        let balances = query[0][0].balances
                                        if (check_ac_type == 'CO') {
                                            newB = parseFloat(balances) + parseFloat(data?.debit.replaceAll(",", ''));
                                        } else {
                                            newB = parseFloat(balances) - parseFloat(data?.debit.replaceAll(",", ''));
                                        }
                                    }
                                    if (check_ac_type == 'CO') {
                                        amout = data?.debit.replaceAll(",", '')
                                    } else {
                                        amout = -data?.debit.replaceAll(",", '')
                                    }
                                    await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ? WHERE c_id=?", [newB, data.c_id])
                                    await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                    await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, data?.debit.replaceAll(",", ''), '0', des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, createstatus, data?.conditions])
                                }
                            }
                        }
                    }
                }
            } else {
                for (let data of informdata) {            
                    if (data?.c_id != undefined) {
                        const checkcurrency = await db.query("SELECT a.id, a.name,a.createstatus FROM accounting2022.tb_currency a WHERE a.id= ?", [data?.currencies_id]);
                        let createstatus = checkcurrency[0][0].createstatus
                        const account = await db.query("SELECT createstatus FROM accounting2022.accounts WHERE uid=?", [data.account_id]);
                        let checkaccount = account[0][0].createstatus;
                        const query = await db.query("SELECT a.balances,a.balancescurrency FROM accounting2022.ledger_entries a WHERE a.ch_id=? and a.createstatus=1", [data.c_id]);
                        const ac_type = await db.query("SELECT createcondition FROM accounting2022.accounts_type WHERE createcondition=?", [data?.checkAccount]);
                        let check_ac_type = ac_type[0][0].createcondition;
                        const checkBanlance = query[0].length == 0 ? null : query[0];
                        let newB;
                        let balancecu;
                        let des;
                        let lg;
                        let amout;
                        let amoutcurrency;
                        if (checkaccount == "As" || checkaccount == "Ex") {
                            if (data?.credit) {
                                if (ExchangeRate != 0) {
                                    if (createstatus == "LAK") {
                                        let credit = data?.credit.replaceAll(",", '');
                                        let exchangecredit = credit * ExchangeRate
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0;
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) - parseFloat(exchangecredit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(credit)

                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) - parseFloat(exchangecredit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(credit)
                                        }
                                        amout = -exchangecredit
                                        amoutcurrency = data?.credit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', exchangecredit, des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, ExchangeRate, amoutcurrency, balancecu, createstatus, data?.conditions])
                                    } else if (createstatus == "USD" || createstatus == "THB") {                            
                                        let credit = data?.credit.replaceAll(",", '');
                                        let exchangecredit = credit * ExchangeRate
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0;
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) - parseFloat(exchangecredit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(credit)

                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) - parseFloat(exchangecredit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(credit)
                                        }
                                        amout = -exchangecredit
                                        amoutcurrency = data?.credit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=?,c_rate=? WHERE c_id=?", [balancecu,newB,ExchangeRate, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', exchangecredit, des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, ExchangeRate, amoutcurrency, balancecu, createstatus, data?.conditions])
                                    }
                                } else {

                                    if (data?.description == undefined || data?.Employee == undefined) {
                                        des = "";
                                        lg = "";
                                    } else {
                                        des = data?.description
                                        lg = data?.Employee
                                    }
                                    if (checkBanlance == null) {
                                        let balances = 0
                                        newB = parseFloat(balances) - parseFloat(data?.credit.replaceAll(",", ''));
                                    } else {
                                        let balances = query[0][0].balances

                                        newB = parseFloat(balances) - parseFloat(data?.credit.replaceAll(",", ''));
                                    }
                                    amout = -data?.credit.replaceAll(",", '')
                                    await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                    await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                    await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', data?.credit.replaceAll(",", ''), des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, createstatus, data?.conditions])
                                }

                            } else if (data?.debit) {
                          
                                if (ExchangeRate != 0) {
                                    if (createstatus == "LAK") {

                                        let debit = data?.debit.replaceAll(",", '');
                                        let exchangedebit = debit * ExchangeRate

                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) + parseFloat(exchangedebit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(debit)

                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) + parseFloat(exchangedebit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(debit)
                                        }
                                        amout = exchangedebit
                                        amoutcurrency = data?.debit.replaceAll(",", '');
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, exchangedebit, '0', des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, ExchangeRate, amoutcurrency, balancecu, createstatus, data?.conditions])

                                    } else if (createstatus == "USD" || createstatus == "THB") {
                                        let debit = data?.debit.replaceAll(",", '');
                                        let exchangedebit = debit * ExchangeRate
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) + parseFloat(exchangedebit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(debit)
                                        } else {
                                            let balances = query[0][0].balances

                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) + parseFloat(exchangedebit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(debit)
                                        }
                                        amout = exchangedebit
                                        amoutcurrency = data?.debit.replaceAll(",", '');
                                    
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=?,c_rate= ? WHERE c_id=?", [balancecu,newB,ExchangeRate, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data.parents, exchangedebit, '0', des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, ExchangeRate, amoutcurrency, balancecu, createstatus, data?.conditions])
                                    }
                                } else {

                                    if (data?.description == undefined || data?.Employee == undefined) {
                                        des = "";
                                        lg = "";
                                    } else {
                                        des = data?.description
                                        lg = data?.Employee
                                    }
                                    if (checkBanlance == null) {
                                        let balances = 0
                                        newB = parseFloat(balances) + parseFloat(data?.debit.replaceAll(",", ''));
                                    } else {
                                        let balances = query[0][0].balances

                                        newB = parseFloat(balances) + parseFloat(data?.debit.replaceAll(",", ''));
                                    }
                                    amout = data?.debit.replaceAll(",", '')
                                    await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                    await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                    await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, data?.debit.replaceAll(",", ''), '0', des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, createstatus, data?.conditions])

                                }
                            }
                        }
                        if (checkaccount == "li" || checkaccount == "In" || checkaccount == "Eq") {
 
                            if (data?.credit) {
                                if (ExchangeRate != 0) {
                           
                                    if (createstatus == "LAK") {
                        
                                        let credit = data?.credit.replaceAll(",", '');
                                        let exchangecredit = credit * ExchangeRate
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) + parseFloat(exchangecredit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(credit)
                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency

                                            newB = parseFloat(balances) + parseFloat(exchangecredit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(credit);
                                        }
                                        if(check_ac_type == 'CO'){
                                            amout = -exchangecredit
                                            amoutcurrency = -data?.credit.replaceAll(",", '');
                                        }else{
                                            amout = exchangecredit
                                            amoutcurrency = data?.credit.replaceAll(",", '');
                                        }                   
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', exchangecredit, des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, ExchangeRate, amoutcurrency, balancecu, createstatus, data?.conditions])

                                    } else if (createstatus == "USD" || createstatus == "THB") {
                                       

                                        let credit = data?.credit.replaceAll(",", '');
                                        let exchangecredit = credit * ExchangeRate

                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) + parseFloat(exchangecredit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(credit)
                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) + parseFloat(exchangecredit);
                                            balancecu = parseFloat(balancescurrency) + parseFloat(credit);
                                        }
        
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=?,c_rate=? WHERE c_id=?", [balancecu,newB,ExchangeRate, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', exchangecredit, des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, ExchangeRate, amoutcurrency, balancecu, createstatus, data?.conditions])
                                    }
                                } else {
                                    if (data?.description == undefined || data?.Employee == undefined) {
                                        des = "";
                                        lg = "";
                                    } else {
                                        des = data?.description
                                        lg = data?.Employee
                                    }
                                    if (checkBanlance == null) {
                                        let balances = 0
                                        newB = parseFloat(balances) + parseFloat(data?.credit.replaceAll(",", ''));
                                    } else {
                                        let balances = query[0][0].balances
                                        newB = parseFloat(balances) + parseFloat(data?.credit.replaceAll(",", ''));
                                    }
                                    if (check_ac_type == 'CO') {
                                        amout = -data?.credit.replaceAll(",", '')
                                    } else {
                                        amout = data?.credit.replaceAll(",", '')
                                    }

                                    await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, '0', data?.credit.replaceAll(",", ''), des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, createstatus, data?.conditions])
                                    await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                    await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])

                                }
                            } else if (data?.debit) {
                                if (ExchangeRate != 0) {
                                    if (createstatus == "LAK") {
                                        let debit = data?.debit.replaceAll(",", '');
                                        let exchangedebit = debit * ExchangeRate
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) - parseFloat(exchangedebit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(debit)
                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) - parseFloat(exchangedebit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(debit)
                                        }
                                        if(check_ac_type == 'CO'){
                                            amout = exchangedebit
                                            amoutcurrency = data?.debit.replaceAll(",", '');
                                        }else{
                                            amout = -exchangedebit
                                            amoutcurrency = -data?.debit.replaceAll(",", '');
                                        }
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, exchangedebit, '0', des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, ExchangeRate, data?.debit.replaceAll(",", ''), balancecu, createstatus, data?.conditions])

                                    } else if (createstatus == "USD" || createstatus == "THB") {
                                        let debit = data?.debit.replaceAll(",", '');
                                        let exchangedebit = debit * ExchangeRate
                                        if (data?.description == undefined || data?.Employee == undefined) {
                                            des = "";
                                            lg = "";
                                        } else {
                                            des = data?.description
                                            lg = data?.Employee
                                        }
                                        if (checkBanlance == null) {
                                            let balances = 0
                                            let balancescurrency = 0;
                                            newB = parseFloat(balances) - parseFloat(exchangedebit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(debit)
                                        } else {
                                            let balances = query[0][0].balances
                                            let balancescurrency = query[0][0].balancescurrency
                                            newB = parseFloat(balances) - parseFloat(exchangedebit);
                                            balancecu = parseFloat(balancescurrency) - parseFloat(debit)
                                        }
               
                                        if(check_ac_type == 'CO'){
                                            amout = exchangedebit
                                            amoutcurrency = data?.debit.replaceAll(",", '');
                                        }else{
                                            amout = -exchangedebit
                                            amoutcurrency = -data?.debit.replaceAll(",", '');
                                        }
                                        await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=?,c_rate=? WHERE c_id=?", [balancecu,newB,ExchangeRate, data.c_id])
                                        await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                        await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,ExchangeRate,amoutcurrency,balancescurrency,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, exchangedebit, '0', des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, ExchangeRate, data?.debit.replaceAll(",", ''), balancecu, createstatus, data?.conditions])
                                    }
                                } else {
                                    if (data?.description == undefined || data?.Employee == undefined) {
                                        des = "";
                                        lg = "";
                                    } else {
                                        des = data?.description
                                        lg = data?.Employee
                                    }
                                    if (checkBanlance == null) {
                                        let balances = 0
                                        newB = parseFloat(balances) - parseFloat(data?.debit.replaceAll(",", ''));
                                    } else {
                                        let balances = query[0][0].balances
                                  
                                        newB = parseFloat(balances) - parseFloat(data?.debit.replaceAll(",", ''));
                                    }
                                    if (check_ac_type == 'CO') {
                                        amout = data?.credit.replaceAll(",", '')
                                    } else {
                                        amout = -data?.debit.replaceAll(",", '')
                                    }
                                    await db.query("UPDATE accounting2022.chart_of_accounts SET c_balance= ?,total_balances=? WHERE c_id=?", [newB,newB, data.c_id])
                                    await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                                    await db.query("INSERT INTO accounting2022.ledger_entries(tr_id,ch_id,account_id,parents,debit,credit,lg_desc,lg_name,journal_no,amout,balances,createstatus,c_uid,createdate,currencystatus,conditions) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, data?.c_id, data?.asstet_id, data?.parents, data?.debit.replaceAll(",", ''), '0', des, lg, journal_no, amout, newB, '1', data?.c_uid, tr_date, createstatus, data?.conditions])
                                }
                            }
                        }

                    }
                }

            }


        } catch (err) {
            console.log({ err })
        }
    }
    async updatechartofaccount(informdata, ExchangeRate) {
        for (let data of informdata) {
            if (data?.c_id != undefined) {
                const checkcurrency = await db.query("SELECT a.id, a.name,a.createstatus FROM accounting2022.tb_currency a WHERE a.id= ?", [data?.currencies_id]);
                let createstatus = checkcurrency[0][0].createstatus

                const account = await db.query("SELECT createstatus FROM accounting2022.accounts WHERE uid=?", [data.account_id]);
                let checkaccount = account[0][0].createstatus;
                const parent = await db.query("WITH RECURSIVE cte (c_id,c_balance,parents) AS ( SELECT c_id,c_balance,parents FROM accounting2022.chart_of_accounts WHERE c_id = ? UNION SELECT t1.c_id,t1.c_balance,t1.parents FROM accounting2022.chart_of_accounts t1 INNER JOIN cte t2 ON t2.parents = t1.c_id ) SELECT c_id, c_balance,parents  FROM cte ORDER BY c_id;", [data?.c_id]);
                const parents = parent[0]

                if (checkaccount == "As" || checkaccount == "Ex") {
                    if (data?.credit) {
                        if (ExchangeRate != 0) {
                            if (createstatus == "LAK") {
                            } else if (createstatus == "USD" || createstatus == "THB") {
                                console.log("USD AND THB")
                            }
                        } else {

                        }
                    } else if (data?.debit) {
                        if (ExchangeRate != 0) {
                            if (createstatus == "LAK") {
                            } else if (createstatus == "USD" || createstatus == "THB") {
                                console.log("USD AND THB")
                            }
                        } else {

                        }
                    }
                }
                if (checkaccount == "li" || checkaccount == "In" || checkaccount == "Eq") {
                    if (data?.credit) {
                        if (ExchangeRate != 0) {
                            if (createstatus == "LAK") {

                            } else if (createstatus == "USD" || createstatus == "THB") {
                                console.log("USD AND THB")
                            }
                        } else {

                        }
                    } else if (data?.debit) {
                        if (ExchangeRate != 0) {

                            if (createstatus == "LAK") {

                            } else if (createstatus == "USD" || createstatus == "THB") {
                                console.log("USD AND THB")
                            }
                        } else {
                        }
                    }
                }

            }
        }
    }
    async deleteledger(id) {
        try {
            const query = await db.query("SELECT a.`tr_id` FROM accounting2022.ledger_entries a  WHERE a.`ch_id`= ?;", [id]);
            const tra_id = query[0][0].tr_id;
            await db.query("DELETE FROM  accounting2022.transactions WHERE tr_id= ?", [tra_id]);
            const ledger = await db.query("DELETE FROM accounting2022.ledger_entries WHERE `ch_id` = ?;", [id]);
            return ledger.length == 0 ? null : ledger[0];
        } catch (err) {
            console.log({ err })
        }
    }
    async deleteledger2(id) {
        try {
            const query = await db.query("WITH RECURSIVE cte (c_id, parents) AS ( SELECT c_id, parents FROM accounting2022.transactions_ledger_entries WHERE c_id = ? UNION SELECT t1.c_id, t1.parents FROM accounting2022.transactions_ledger_entries t1 INNER JOIN cte t2 ON t2.parents = t1.c_id ) SELECT c_id FROM cte ORDER BY c_id;", [id]);
            const info = query[0]
            info.map(async (item) => {
                await db.query("DELETE FROM  accounting2022.transactions_ledger_entries WHERE c_id= ?", [item?.c_id])
            })
            const sql = await db.query("SELECT a.`tr_id` FROM accounting2022.ledger_entries a  WHERE a.`ch_id`= ?;", [id]);
            const tra_id = sql[0][0].tr_id;
            await db.query("DELETE FROM  accounting2022.transactions WHERE tr_id= ?", [tra_id]);
            const ledger = await db.query(" DELETE FROM accounting2022.ledger_entries WHERE `ch_id` = ?; ", [id]);
            return ledger.length == 0 ? null : ledger[0];
        } catch (err) {
            console.log({ err })
        }
    }

    async checkid(id) {
        const query = await db.query("SELECT a.c_id,a.parents FROM accounting2022.transactions_ledger_entries a WHERE a.parents= ?; ", [id]);
        return query.length == 0 ? null : query[0];
    }
    async updateStatus(informdata) {
        try {
            for (let data of informdata) {
                const query = await db.query("UPDATE accounting2022.ledger_entries SET createstatus=2 WHERE ch_id=? and createstatus=1", [data.c_id])
                return query.length == 0 ? null : query[0]
            }

        } catch (err) {
            console.log({ err })
        }
    }
    async insertTransaction_ledger_entries(informdata, id,) {
        try {
            for (let data of informdata) {
                if (data?.c_id != undefined) {
                    const parent = await db.query("WITH RECURSIVE cte (c_id, c_uid, ac_type, detail_type, name_eng, parents,account_id,currencies_id) AS ( SELECT c_id, c_uid, ac_type, detail_type, name_eng, parents,account_id,currencies_id FROM accounting2022.chart_of_accounts WHERE c_id = ? UNION SELECT t1.c_id, t1.c_uid, t1.ac_type, t1.detail_type, t1.name_eng, t1.parents,t1.account_id,t1.currencies_id FROM accounting2022.chart_of_accounts t1 INNER JOIN cte t2 ON t2.parents = t1.c_id ) SELECT c_id, c_uid, ac_type, detail_type, name_eng, parents,account_id,currencies_id FROM cte ORDER BY c_id", [data?.c_id]);
                    const parents = parent[0]
                    parents.map(async (data2) => {
                        const checkname = await db.query("SELECT * FROM  accounting2022.transactions_ledger_entries a WHERE a.c_id= ? and a.parents=?", [data2?.c_id, data2?.parents]);
                        const accountname = checkname.length == 0 ? null : checkname[0]
                        if (accountname.length > 0) {
                        } else {
                            if (data2?.parents == 0) {
                                await db.query("INSERT INTO  accounting2022.transactions_ledger_entries(subject_ID,transaction_id,c_id,account_id,parents) VALUES(?,?,?,?,?)", [data.subject_ID, id, data2?.c_id, data2?.account_id, data2?.parents]);
                            } else {
                                await db.query("INSERT INTO  accounting2022.transactions_ledger_entries(subject_ID,transaction_id,c_id,account_id,parents) VALUES(?,?,?,?,?)", [data.subject_ID, id, data2?.c_id, data2?.account_id, data2?.parents]);
                            }
                        }
                    })
                }
            }

        } catch (err) {
            console.log(err)
        }
        return;

    }
    async updateAmount(tr_id1, tr_id2) {
        let sql = "UPDATE accounting.transactions SET tr_amounts = (SELECT SUM(debit) debit FROM accounting2022.ledger_entries WHERE tr_id = ?) WHERE tr_id = ?;";
        let data = [tr_id1, tr_id2];
        const query = await db.query(sql, data);
        return query.length == 0 ? null : query[0];
    }
    async selectcountnumber() {
        let sql = "SELECT * FROM accounting2022.countnumber a where a.status=1";
        const query = await db.query(sql);
        return query.length == 0 ? null : query[0];
    }


}

module.exports = JournalEntries;