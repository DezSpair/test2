var Enumerable = require('linq');
var fs = require("fs");
function DbService(dbPath) {
    this.dbPath = dbPath;
    this.sqlite3 = require("sqlite3").verbose();
    this.db = new this.sqlite3.Database(dbPath);

}

DbService.prototype.CheckOrCreateDb = function() {
    var exists = fs.existsSync(file);
    if (!exists) {
        console.log("Creating DB file.");
        fs.openSync(file, "w");
    }
};

DbService.prototype.CheckTable = function (tables) {
    var tablesName = this.GetAllTableName();
    tables.forEach(function (v, k) {
        var isTable = false;
        tablesName.forEach(function(v1, k1) {
            if (v1.toLowerCase() == v.toLowerCase())
                isTable = true;
            return;
        });
        if (!isTable) {
            var name = v.name;
            var fields = {};
            var result = Enumerable.from(v.rows)
                .select(function(row, index) { return { row: row.name, type: row.type }; });

        }
    });

};


DbService.prototype.GetAllTableName = function() {
    var tables = [];
    var self = this;

    
        self.db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;", function(err, all) {
            tables = all;
        });


    self.db.close();
    return tables;

};

DbService.prototype.Createtable = function (tableName, fields) {
    var queryString = "CREATE TABLE " + tableName;

};


exports.DbService = DbService;



