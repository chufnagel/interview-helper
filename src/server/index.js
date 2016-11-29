/**
 * Created by jmichelin on 11/11/16.
 */
'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const HapiMongo = require('hapi-mongodb');
const interviewStore = require('./stores/interview-question.store');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const Open = require('open');
require('dotenv').config();

const server = new Hapi.Server();

server.connection({ port: process.env.PORT, host: process.env.HOST });

/**
 *
 * Mongo Info
 *
 **/
const mongoUrl = 'mongodb://'+ process.env.MLAB_USERNAME+':'+process.env.MLAB_PASSWORD+'@'+process.env.MLAB_URI;

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('hello world')
  }
});

server.register([
  {
    register: HapiMongo,
    options: {
      url: mongoUrl
    }
  },
  interviewStore,
  Blipp,
  Inert,
  Vision,
  HapiSwagger
], (err) => {

  if (err) { throw err; }

  server.start( (err) => {
    if (err) { throw err; }

    console.log(`Server running at ${server.info.uri}`);
    //Open(server.info.uri);
  });
});

module.exports = server;