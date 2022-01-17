'use strict';
let PORT = 5500;
const { getAnswers,
  getQuestions,
  postAnswer,
  postQuestion,
  putQuestionHelpful,
  putAnswerHelpful,
  putAnswerReport } = require('../Database/pg/Query.js');
// fastify framework
const fastify = require('fastify')({
  logger: false
});

fastify.get('/loaderio-2d29d0cd88193d9ccb5496e296df079e/',  (req, res) => {
  res.send('loaderio-2d29d0cd88193d9ccb5496e296df079e')
});

const start = async () => {
  try {
    await fastify.listen(PORT,'0.0.0.0');
    fastify.log.info(`QA-API is listening on ${PORT}`);
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start();


fastify.get('/questions', async (req, res) => {
  const { product_id } = req.query
  try {
    const questions = await getQuestions(product_id);
    res.status(200).send(questions);
  } catch (err) {
    res.sendStatus(500);
  }
});

fastify.post('/questions', async (req, res) => {
  try {
    const newQuestion = await postQuestion(req.body);
    res.status(201).send('Posted');
  } catch(err){
    res.sendStatus(500);
  }
});

fastify.get('/answers/:question_id', async (req, res) => {
  const { question_id } = req.params;
  try {
    const answers = await getAnswers(question_id)
    res.status(200).send(answers);
  } catch (err) {
    res.sendStatus(500);
  }
});

fastify.post('/answers/:question_id', async (req, res) => {
  const { question_id } = req.params;

  try {
    const newAnswer = await postAnswer(question_id, req.body);
    res.status(201).send('Posted');
  } catch(err){
    res.sendStatus(500);
  }
});

fastify.put('/questions/:question_id/helpful', async(req, res) => {
  const { question_id } = req.params;
  // console.log(question_id);

  try {
    const helpful = await putQuestionHelpful(question_id);
    res.status(204).send('Updated');
  } catch(err){
    res.sendStatus(500);
  }
});

fastify.put('/answers/:answer_id/helpful', async(req, res) => {
  const { answer_id } = req.params;

  try {
    const helpful = await putAnswerHelpful(answer_id);
    res.status(204).send('Updated');
  } catch(err){
    res.sendStatus(500);
  }
});

fastify.put('/answers/:answer_id/reported', async(req, res) => {
  const { answer_id } = req.params;

  try {
    const helpful = await putAnswerReport(answer_id);
    res.status(204).send('Updated');
  } catch(err){
    res.sendStatus(500);
  }
});


// const db = require('../Database/pg/Query.js');

// express framework
// const express = require('express');
// const qa = express();

// // require('newrelic');

// const db = require('../Database/pg/Query.js');


// qa.use(express.static('../Database'));
// qa.use(express.json());
// qa.use(express.urlencoded({ extended: true }));

// qa.listen(PORT, () => {
//   console.log(`QA-API is listening on ${PORT}`);
// });


// qa.get('/questions', async (req, res) => {
//   const { product_id } = req.query
//   try {
//     const questions = await db.getQuestions(product_id);
//     res.status(200).send(questions);
//   } catch (err) {
//     res.sendStatus(500);
//   }
// });

// qa.post('/questions', async (req, res) => {
//   try {
//     const newQuestion = await db.postQuestion(req.body);
//     res.status(201).send('Posted');
//   } catch(err){
//     res.sendStatus(500);
//   }
// });

// qa.get('/answers/:question_id', async (req, res) => {
//   const { question_id } = req.params;
//   try {
//     const answers = await db.getAnswers(question_id)
//     res.status(200).send(answers);
//   } catch (err) {
//     res.sendStatus(500);
//   }
// });

// qa.post('/answers/:question_id', async (req, res) => {
//   const { question_id } = req.params;

//   try {
//     const newAnswer = await db.postAnswer(question_id, req.body);
//     res.status(201).send('Posted');
//   } catch(err){
//     res.sendStatus(500);
//   }
// });

// qa.put('/questions/:question_id/helpful', async(req, res) => {
//   const { question_id } = req.params;
//   // console.log(question_id);

//   try {
//     const helpful = await db.putQuestionHelpful(question_id);
//     res.status(204).send('Updated');
//   } catch(err){
//     res.sendStatus(500);
//   }
// });

// qa.put('/answers/:answer_id/helpful', async(req, res) => {
//   const { answer_id } = req.params;

//   try {
//     const helpful = await db.putAnswerHelpful(answer_id);
//     res.status(204).send('Updated');
//   } catch(err){
//     res.sendStatus(500);
//   }
// });

// qa.put('/answers/:answer_id/reported', async(req, res) => {
//   const { answer_id } = req.params;

//   try {
//     const helpful = await db.putAnswerReport(answer_id);
//     res.status(204).send('Updated');
//   } catch(err){
//     res.sendStatus(500);
//   }
// });

// module.exports = qa;