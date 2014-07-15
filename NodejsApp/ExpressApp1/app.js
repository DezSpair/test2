
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var parseString = require('xml2js').parseString;
var xmlService = require('./Services/XmlService');
var dbService = require('./Services/DbService');
var xml2js = require('xml2js');
var fs = require("fs");
var file = "./db/test.db";

var exists = fs.existsSync(file);
var sqlite3 = require('sqlite3').verbose();
var async = require('async');


var request = require('supertest');

var app = express();

function error(res, next) {
    return function(err, result) {
        if (err) {
            res.writeHead(500);
            res.end();
            console.log(err);
        } else {
            next(result);
        }
    };
}


app.set('port', 3000);
http.createServer(app).listen(
    app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));

        //  db.run("CREATE TABLE lorem (info TEXT)");
    });


function anyBodyParser(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
}

app.configure(function() {
    app.use(anyBodyParser);
});



app.post('/api/xml', function(req, res) {
    var result;

    parseString(req.rawBody, function(err, r) {
        result = r;
    });
    result = xmlService.XmlParse(result);
    var db = new dbService.DbService(file);
    var insertQueries = db.GetInsertQueries(result);
    var callback = function (queriesCreateTable) {
        db.ExecuteQueriesCreateTable(queriesCreateTable, function () {
            db.ExecuteQueriesInsertRows(insertQueries, function (report) {
                var builder = new xml2js.Builder();
                var xml = builder.buildObject(report);
                res.send(200, xml);
            });
        });
    };
    db.CheckOrCreateDb();
    db.CheckTable(result, callback);

});;;



