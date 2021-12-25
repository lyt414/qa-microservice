const express = require('express');
const qa = express();
let PORT = 5500;

const db = require('../Database/pg/Query.js');


qa.use(express.static('../Database'));
qa.use(express.json());
qa.use(express.urlencoded({ extended: true }));

qa.listen(PORT, () => {
  console.log(`QA-API is listening on ${PORT}`);
});


qa.get('/questions', async (req, res) => {
  const { product_id } = req.query
  try {
    const questions = await db.getQuestions(product_id);
    res.status(200).send(questions);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

qa.post('/questions', async (req, res) => {
  try {
    console.log(req.body);
    const newQuestion = await db.postQuestion(req.body);
    res.status(201).send('Posted');
  } catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

qa.get('/answers/:question_id', async (req, res) => {
  const { question_id } = req.params;
  console.log(question_id)
  try {
    const answers = await db.getAnswers(question_id)
    console.log('Answer:', answers)
    res.status(200).send(answers);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

qa.post('/answers/:question_id', async (req, res) => {
  const { question_id } = req.params;
  console.log(question_id);

  try {
    const newAnswer = await db.postAnswer(question_id, req.body);
    res.status(201).send('Posted');
  } catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

qa.put('/questions/:question_id/helpful', async(req, res) => {
  const { question_id } = req.params;
  console.log(question_id);

  try {
    const helpful = await db.putQuestionHelpful(question_id);
    res.status(204).send('Updated');
  } catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

qa.put('/answers/:answer_id/helpful', async(req, res) => {
  const { answer_id } = req.params;
  console.log(answer_id);

  try {
    const helpful = await db.putAnswerHelpful(answer_id);
    res.status(204).send('Updated');
  } catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

qa.put('/answers/:answer_id/reported', async(req, res) => {
  const { answer_id } = req.params;
  console.log(answer_id);

  try {
    const helpful = await db.putAnswerReport(answer_id);
    res.status(204).send('Updated');
  } catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = qa;