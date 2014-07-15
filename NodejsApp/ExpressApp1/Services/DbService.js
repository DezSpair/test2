var fs = require("fs");
var async = require('async');
var sqlite3 = require('sqlite3').verbose();

function DbService(dbPath) {
    this.dbPath = dbPath;
}

DbService.prototype.CheckOrCreateDb = function() {
    var exists = fs.existsSync(this.dbPath);
    if (!exists) {
        console.log("Creating DB file.");
        fs.openSync(this.dbPath, "w");
    }
};

DbService.prototype.CheckTable = function(tables, returnCallback) {
    var self = this;
    var callback = function(tablesName) {
        var arrStr = [];
        tables.forEach(function(v, k) {
            var isTable = false;
            tablesName.forEach(function(v1, k1) {
                if (v1.name.toLowerCase() == v.name.toLowerCase())
                    isTable = true;
                return;
            });
            if (!isTable) {
                var name = v.name;
                var fields = {};
                var result = [];
                v.records.forEach(function(record, index) {
                    record.forEach(function(row, n) {
                        result.push({ row: row.name, type: row.type });
                    });
                });
                fields = result.getUnique();

                var res = self.Createtable(name, fields);
                arrStr.push(res);
            }
        });
        returnCallback(arrStr);

    };
    self.GetAllTableName(callback);
};


DbService.prototype.GetAllTableName = function(callback) {
    var db = new sqlite3.Database(this.dbPath);
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;", function(err, all) {

        callback(all);
    });
};

DbService.prototype.ExecuteQueriesCreateTable = function(queries, callback) {
    var db = new sqlite3.Database(this.dbPath);
    db.serialize(function() {
        queries.forEach(function(v, k) {
            db.prepare(v).run().finalize(function() {});
        });
    });
    db.close(function(err, rese) {
        callback();
    });

};

DbService.prototype.ExecuteQueriesInsertRows = function(queries, callback) {
    var db = new sqlite3.Database(this.dbPath);
    var all = queries.length;
    var count = 0;
    var errArr = [];
    var errCount = 0;
    var arrFn = [];
    db.serialize(function() {
        db.parallelize(function() {
            queries.forEach(function(query, k) {
                arrFn.push(function(cbc) {
                    db.prepare(query, function(err, res1) {
                            if (err) {
                                errCount++;
                                errArr.push(err);
                                cbc(res1, null);

                            } else {
                                count++;
                                cbc(null, true);
                            }
                        })
                        .run()
                        .finalize(function(err, res2) {
                        });
                });

            });
            async.parallel(arrFn, function(err, r) {
                var errMsg = [];
                if (errArr.length > 0) {
                    errArr.forEach(function(error, k) {
                        errMsg.push({ code: error.code, message: error.message });
                    });
                }
                var report = { allRecord: all, insertrecord: count, errors: errCount, errmsg: errMsg };
                callback(report);
            });
        });
    });

};

DbService.prototype.Createtable = function(tableName, fields) {

    var self = this;
    var queryString = "CREATE TABLE " + tableName;
    var fieldsString = "", typeString = "";
    fields.forEach(function(v, k) {
        var fl = "";
        for (var f in v) {
            fl += " " + v[f] + " ";
        }
        if (fieldsString == "") {
            fieldsString += " " + fl + " ";
        } else {
            fieldsString += " ," + fl + " ";
        }
    });
    queryString += " ( " + fieldsString + " ) ";
    return queryString;
    //self.db.close();

};

DbService.prototype.GetInsertQueries = function(tables) {
    var insertQuery = [];
    tables.forEach(function(v, k) {
        v.records.forEach(function(record, index) {
            var names = "", values = "";
            record.forEach(function(row, n) {
                if (names == "")
                    names += " " + row.name;
                else
                    names += " ," + row.name;

                if (values == "")
                    values += " '" + row.value + "'";
                else
                    values += " ,'" + row.value + "'";

            });
            var query = " INSERT INTO " + v.name + " (" + names + ") values ( " + values + " );";
            insertQuery.push(query);

        });

    });
    return insertQuery;
};


exports.DbService = DbService;

Array.prototype.getUnique = function() {

    var unique = {};
    var distinct = [];
    for (var i = 0; i <= this.length - 1; i++) {
        if (typeof (unique[this[i].row]) == "undefined") {
            distinct.push(this[i]);
        }
        unique[this[i].row] = 0;
    }
    return distinct;
};