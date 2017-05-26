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
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const server = new Hapi.Server({ debug: { request: ['error'] } });

server.connection({
  port: process.env.PORT,
  host: process.env.HOST
});

/**
 *
 * Mongo Info
 *
 **/
const mongoUrl = 'mongodb://'+ process.env.MLAB_USERNAME+':'+process.env.MLAB_PASSWORD+'@'+process.env.MLAB_URI;

//TODO send logs to db

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('go to documentation url to see how to use.')
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

//this does not feel right TODO look up module.exports and hapi
module.exports = server;