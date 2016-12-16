/**
 * Created by jmichelin on 11/11/16.
 */

//
// Example Question
//
/*
 {
 "_id": {
 "$oid": "58261635dcba0f326cc76251"
 },
 "genre": "behavioral",
 "title": "Past Experience",
 "timeToAnswer": "2",
 "questionText": "Tell me about your software engineering experience.",
 "answerText": "You\u2019re looking for some background on what they may have done prior (like management or design experience, school, tinkered with devices as a kid, etc.) but mainly the most relevant software engineering experience.  Lately they may have done front-end, back-end, or full stack development.  Make sure they discuss maybe two of their projects at least and ensure that at least one of them was done in a team setting.  All questions that follow will not work if there was not a team involved.  If they get hung up on a \u201csolo\u201d project where they alone did it, steer them towards a different project.  This should be 2 minutes max.",
 "status": "active"
 }
 */
'use strict';

const Boom = require('boom');
const Joi = require('joi');

const interviewIdSchema = Joi.string().min(24);
const statusParamSchema = Joi.string();

// _id: Joi.string().min(24),
const interviewQuestionSchema = Joi.object().keys({
  _id: interviewIdSchema,
  genre: Joi.string(),
  title: Joi.string(),
  timeToAnswer: Joi.number(),
  questionText: Joi.string(),
  answerText: Joi.string(),
  status: Joi.string()
});


exports.register = function (server, options, next) {
  let store;
  let ObjectID;

  server.dependency('hapi-mongodb', (depServer, after) => {
    store = depServer.plugins['hapi-mongodb'].db.collection('interview-questions');
    ObjectID = depServer.plugins['hapi-mongodb'].ObjectID;
    return after();
  });

  // getInterviewQuestionDetails
  const getInterviewQuestionDetails = function (questionId, callback) {
    store.findOne({ '_id': ObjectID(questionId) }, (err, result) => {

      if (!result) { return callback(Boom.notFound()); }

      result.id = result._id;
      delete result._id;
      return callback(null, result);

    });
  };

  // createInterviewQuestion
  const createInterviewQuestion = function (interviewQuestionDetails, callback) {
    const interviewQuestionId = new ObjectID();
    const interviewQuestion = {
      _id: interviewQuestionId,
      genre: interviewQuestionDetails.genre,
      title: interviewQuestionDetails.title,
      timeToAnswer: interviewQuestionDetails.timeToAnswer,
      questionText: interviewQuestionDetails.questionText,
      answerText: interviewQuestionDetails.answerText,
      status: interviewQuestionDetails.status
    };

    store.insertOne(interviewQuestion, (err, result) => {

      if (err) { callback(Boom.internal(err)); }

      getInterviewQuestionDetails(interviewQuestionId, callback);
    });

  };
  //updateInterviewQuestion
  const updateInterviewQuestion = function (interviewQuestionDetails, callback) {
    const updatedInterviewQuestion = {
      genre: interviewQuestionDetails.genre,
      title: interviewQuestionDetails.title,
      timeToAnswer: interviewQuestionDetails.timeToAnswer,
      questionText: interviewQuestionDetails.questionText,
      answerText: interviewQuestionDetails.answerText,
      status: interviewQuestionDetails.status
    };

    console.log('interviewQuestionDetails._id => ', interviewQuestionDetails._id, 'Type of => ', typeof interviewQuestionDetails._id);

    let interviewQuestionId = ObjectID.createFromHexString(interviewQuestionDetails._id);
    console.log('interviewQuestionId type of', typeof interviewQuestionId);

    store.update( { '_id': ObjectID.createFromHexString(interviewQuestionDetails._id) }, updatedInterviewQuestion,(err, result) => {
      if(err) { callback(Boom.internal(err)); }

      getInterviewQuestionDetails(interviewQuestionId, callback);
    });

  };
  // getInterviewQuestionList
  const getInterviewQuestionList = function (status, callback) {
    let statusFilter = {};
    if (status === 'active') {
      statusFilter = { 'status': status };
    }

    store.find(statusFilter, (err, result) => {
      if (!result) {
        console.log('No result');
        return callback(Boom.notFound());
      }

      if (err) {
        console.log('Error!');
        return callback(Boom.internal(err));
      }

      return callback(null, result);

    });
  };

  server.route([
    {
      method: 'GET',
      path: '/interview/question/display/{interviewQuestionId}',
      config: {
        validate: {
          params: {
            interviewQuestionId: interviewIdSchema.required()
          },
          query: false
        },
        handler: function (request, reply) {
          const interviewQuestionId = request.params.interviewQuestionId;
          getInterviewQuestionDetails(interviewQuestionId, (err, interviewQuestion) => {

            if (err) { return reply(Boom.notFound()); }

            return reply(interviewQuestion);
          });
        },
        description: 'Retrieve an Interview Question',
        tags: ['api']
      }
    },
    {
      method: 'POST',
      path: '/interview/question/add',
      config: {
        validate: {
          params: false,
          query: false,
          payload: interviewQuestionSchema
        },
        handler: function (request, reply) {
          const interviewQuestionDetails = request.payload;
          createInterviewQuestion(interviewQuestionDetails, (err, interviewQuestion) => {
            if (err) { return reply(Boom.badRequest(err)); }
            return reply(interviewQuestion);
          });
        },
        description: 'Create an interview Question',
        tags: ['api']
      }
    },
    {
      method: 'POST',
      path: '/interview/question/update',
      config: {
        validate: {
          params: false,
          query: false,
          payload: interviewQuestionSchema
        },
        handler: function (request, reply) {
          const interviewQuestionDetails = request.payload;
          updateInterviewQuestion(interviewQuestionDetails, (err, interviewQuestion) => {
            if (err) { return reply(Boom.badRequest(err)); }
            return reply(interviewQuestion);
          });
        },
        description: 'Update an interview Question',
        tags: ['api']
      }
    },
    {
      method: 'GET',
      path: '/interview/questions/list/{status?}',
      config: {
        cors: {
          origin: ['*'],
          headers: [
            'Accept',
            'Authorization',
            'Content-Type',
            'If-None-Match'
          ]
        },
        validate: {
          params: {
            status: statusParamSchema
          },
          query:false
        },
        handler: function (request, reply) {
          const interviewQuestionStatusFilter = request.params.status;
          getInterviewQuestionList(interviewQuestionStatusFilter, (err, questionList) => {
            //console.log('inside GET route', questionList);
            if (err) { return reply(Boom.notFound()); }

            return reply(questionList.toArray());

          });
        },
        description: 'List all questions based on status',
        tags: ['api']
      }
    }

  ]);

  server.expose({
    getInterviewQuestionDetails: getInterviewQuestionDetails,
    createInterviewQuestion: createInterviewQuestion,
    getInterviewQuestionList: getInterviewQuestionList,
    updateInterviewQuestion: updateInterviewQuestion
  });

  return next();
};

exports.register.attributes = {
  name: 'interview-question.store'
};

