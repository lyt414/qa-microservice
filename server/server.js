'use strict';
const PORT = 5500;

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
const redis = require('redis');
const client = redis.createClient(6379, 'redis-api.mftwpq.0001.use2.cache.amazonaws.com');

client.connect()

client.on('error', err => {
  console.log('Redis error ' + err);
});


fastify.get('/loaderio-73026e8f0a3fdc105132a2da4fb0f2a3/',  (req, res) => {
  res.send('loaderio-73026e8f0a3fdc105132a2da4fb0f2a3')
});

const start = async () => {
  try {
    await fastify.listen(PORT,'0.0.0.0');
    console.log(`QA-API is listening on ${PORT}`);
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start();

// only need to add Cache for Get routes
fastify.get('/questions', async (req, res) => {
  const { product_id } = req.query
  const redisQuestion = await client.get(`questions?product_id=${product_id}`)
  if(redisQuestion){
    res.code(200).send(JSON.parse(redisQuestion))
  } else {
    try {
      const questions = await getQuestions(product_id);
      client.set(`questions?product_id=${product_id}`, JSON.stringify(questions));
      res.code(200).send(questions);
    } catch (err) {
      res.code(500);
    }
  }
});


fastify.get('/answers/:question_id', async (req, res) => {
  const { question_id } = req.params;
  const redisAnswer = await client.get(`/answers/${question_id}`);
  if(redisAnswer) {
    res.code(200).send(JSON.parse(redisAnswer))
  } else {
    try {
      const answers = await getAnswers(question_id);
      client.set(`/answers/${question_id}`, JSON.stringify(answers));
      res.code(200).send(answers);
    } catch (err) {
      res.statusCode(500);
    }
  }
});


fastify.post('/questions', async (req, res) => {
  try {
    const newQuestion = await postQuestion(req.body);
    res.code(201).send('Posted');
  } catch(err){
    res.statusCode(500);
  }
});

fastify.post('/answers/:question_id', async (req, res) => {
  const { question_id } = req.params;

  try {
    const newAnswer = await postAnswer(question_id, req.body);
    res.code(201).send('Posted');
  } catch(err){
    res.statusCode(500);
  }
});

fastify.put('/questions/:question_id/helpful', async(req, res) => {
  const { question_id } = req.params;
  // console.log(question_id);

  try {
    const helpful = await putQuestionHelpful(question_id);
    res.code(204).send('Updated');
  } catch(err){
    res.statusCode(500);
  }
});

fastify.put('/answers/:answer_id/helpful', async(req, res) => {
  const { answer_id } = req.params;

  try {
    const helpful = await putAnswerHelpful(answer_id);
    res.code(204).send('Updated');
  } catch(err){
    res.statusCode(500);
  }
});

fastify.put('/answers/:answer_id/reported', async(req, res) => {
  const { answer_id } = req.params;

  try {
    const helpful = await putAnswerReport(answer_id);
    res.code(204).send('Updated');
  } catch(err){
    res.statusCode(500);
  }
});



// express framework
// const express = require('express');
// const qa = express();

// // require('newrelic');
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


// qa.get('/answers/:question_id', async (req, res) => {
//   const { question_id } = req.params;
//   try {
//     const answers = await db.getAnswers(question_id)
//     res.status(200).send(answers);
//   } catch (err) {
//     res.sendStatus(500);
//   }
// });

// qa.get('/', (req, res) => {
//   res.status(200).send('hello')
// })

// qa.get('/questions', async (req, res) => {
//   const { product_id } = req.query
//   const redisQuestion = await client.get(`questions?product_id=${product_id}`)
//   if(redisQuestion){
//     res.status(200).send(JSON.parse(redisQuestion))
//   } else {
//     try {
//       const questions = await getQuestions(product_id);
//       client.set(`questions?product_id=${product_id}`, JSON.stringify(questions));
//       res.status(200).send(questions);
//     } catch (err) {
//       res.sendStatus(500);
//     }
//   }
// });


// qa.get('/answers/:question_id', async (req, res) => {
//   const { question_id } = req.params;
//   console.log(question_id)
//   const redisAnswer = await client.get(`/answers/${question_id}`);
//   console.log('redis answer: ', redisAnswer);
//   if(redisAnswer) {
//     console.log('code is in redis path');
//     res.status(200).send(JSON.parse(redisAnswer))
//   } else {
//     console.log('code is in database path');
//     try {
//       const answers = await getAnswers(question_id);
//       client.set(`/answers/${question_id}`, JSON.stringify(answers));
//       res.status(200).send(answers);
//     } catch (err) {
//       res.sendStatus(500);
//     }
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