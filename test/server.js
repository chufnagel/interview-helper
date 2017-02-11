/**
 * Created by jmichelin on 11/29/16.
 */
'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Code = require('code');

const server = require('../src/server/');
const server2 = require('../src/server/');

lab.experiment("Verify Entry Point Configuration", function () {
  //Verify Mongo connection
  //console.log('server.registrations[hapi-mongodb].name => ',  server.registrations['hapi-mongodb'].name);
  lab.test("verify mongo", function(done) {
    Code.expect(server.registrations['hapi-mongodb'].name).to.equal('hapi-mongodb');
    Code.expect(server.registrations['hapi-mongodb'].version).to.equal('6.2.0');
    done();
  });

  lab.test("verify dotenv", function(done){
    //console.log('process.env.NODE_ENV=> ', process.env.NODE_ENV);
    Code.expect(process.env.NODE_ENV).to.equal('test');
    Code.expect(process.env.HOST).to.equal('127.0.0.1');
    done();
  });
});

lab.experiment("Verify Route", function(){
  lab.test("Testing for initial GET route", function(done){
    let options = {
      method: 'GET',
      url: '/'
    };
    server.inject(options, function(response){
      let result = response.result;
      Code.expect(result).to.equal("go to documentation url to see how to use.")
      done();
    })
  });
});

lab.experiment("Verify Error on Route", function(){
  lab.test("Testing for initial GET route", function(done){
    let options = {
      method: 'GET',
      url: '/not/a/route'
    };
    server.inject(options, function(response){
      let result = response.result;
      Code.expect(result.statusCode).to.equal(404);
      done();
    })
  });
});