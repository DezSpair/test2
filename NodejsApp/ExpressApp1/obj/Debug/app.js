
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var parseString = require('xml2js').parseString;
var xmlService = require('./Services/XmlService');
var dbService = require('./Services/DbService');
var fs = require("fs");
var file = "D:\\1\\test.db";
var exists = fs.existsSync(file);


var app = express();
app.set('port', 3000);
http.createServer(app).listen(
    app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    
    /*var sqlite3 = require("sqlite3").verbose();
    var db = new sqlite3.Database(file);
    db.serialize(function () {
        
            db.run("CREATE TABLE Stuff (thing TEXT)");
        
        var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");
        
        //Insert random data
        var rnd;
        for (var i = 0; i < 10; i++) {
            rnd = Math.floor(Math.random() * 10000000);
            stmt.run("Thing #" + rnd);
        }
        
        stmt.finalize();
    });*/
    
    
});


function anyBodyParser(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        req.rawBody = data;
        next();
    });
}

app.configure(function () {
    app.use(anyBodyParser);
});

app.post('/api/xml', function (req, res) {
    var result = {};
    
    parseString(req.rawBody, function (err, r) {
        result = r;
    });
    result = xmlService.XmlParse(result);
    var db = new dbService.DbService(file);
    db.CheckTable(result);
    res.send(result, 200);
});
