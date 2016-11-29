/**
 * Created by jmichelin on 11/29/16.
 */
'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Code = require('code');

const server = require('../src/server/');

console.log('server => ', JSON.stringify(server));

lab.experiment("API Endpoint Tests", function () {

  lab.test("GET  / (endpoint test)", function(done) {
    let options = {
      method: "GET",
      url: "/"
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.have.length(11);
      //Code.expect(response.result).to.be.an.object();
      server.stop(done);
    });

  });

  lab.test("GET /interview/questions/list/", function(done) {
    let options = {
      method: "GET",
      url: "/interview/questions/list/"
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });

  });

});