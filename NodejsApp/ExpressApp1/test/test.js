


var request = require('supertest');
var should = require('should');
var app = require('../app').app;
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var validXml = "./test_xml/valid.xml";
var errorXml = "./test_xml/errorr.xml";
var multiXml = "./test_xml/multixml.xml";
var fs = require("fs");
describe('Testing Post xml', function() {
    //... previous test
    it('should return allRecords == "2" && insertrecord == "2" && errors == "0"', function(done) {
        var url = "http://localhost:3000";
        fs.readFile(validXml, function (err, data) {
           
            parser.parseString(data, function (error, result) {
                var builder = new xml2js.Builder();
                var xml = builder.buildObject(result);
                requestFn(xml);


            });
        });
        var requestFn= function(xml) {
            request(url)
                .post('/api/xml')
                .send(xml)
                .end(function (err, res) {

                    should.not.exist(err);
                    parser.parseString(res.text, function(error, resultXml) {

                        var data = resultXml.root;
                        var allRecords = data.allRecord[0];
                        var insertrecord = data.insertrecord[0];
                        var errors = data.errors[0];
                        var b = false;
                        if (allRecords == "2" && insertrecord == "2" && errors == "0")
                            b = true;
                        should.not.exist(err);
                        true.should.equal(b);
                        done();

                    });
                });
        };
    });
    it('should return allRecords == "2" && insertrecord == "0" && errors == "2"', function (done) {
        var url = "http://localhost:3000";
        fs.readFile(errorXml, function (err, data) {
            
            parser.parseString(data, function (error, result) {
                var builder = new xml2js.Builder();
                var xml = builder.buildObject(result);
                requestFn(xml);


            });
        });
        var requestFn = function (xml) {
            request(url)
                .post('/api/xml')
                .send(xml)
                .end(function (err, res) {
                
                should.not.exist(err);
                parser.parseString(res.text, function (error, resultXml) {
                    
                    var data = resultXml.root;
                    var allRecords = data.allRecord[0];
                    var insertrecord = data.insertrecord[0];
                    var errors = data.errors[0];
                    var b = false;
                    if (allRecords == "2" && insertrecord == "0" && errors == "2")
                        b = true;
                    should.not.exist(err);
                    true.should.equal(b);
                    done();

                });
            });
        };
    });
   it('should return allRecords == "10" && insertrecord == "8" && errors == "2', function (done) {
        var url = "http://localhost:3000";
        fs.readFile(multiXml, function (err, data) {
            
            parser.parseString(data, function (error, result) {
                var builder = new xml2js.Builder();
                var xml = builder.buildObject(result);
                requestFn(xml);
            });
        });
        var requestFn = function (xml) {
            request(url)
                .post('/api/xml')
                .send(xml)
                .end(function (err, res) {
                should.not.exist(err);
                parser.parseString(res.text, function (error, resultXml) {
                    
                    var data = resultXml.root;
                    var allRecords = data.allRecord[0];
                    var insertrecord = data.insertrecord[0];
                    var errors = data.errors[0];
                    var b = false;
                    if (allRecords == "10" && insertrecord == "8" && errors == "2")
                        b = true;
                    should.not.exist(err);
                    true.should.equal(b);
                    done();

                });
            });
        };
    });
});
