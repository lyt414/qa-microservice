const pool = require('./PG.js');
const fs = require('fs');

const getAnswerQuery = fs.readFileSync(__dirname + '/SQL/getAnswerQuery.sql').toString();
const getQuestionQuery = fs.readFileSync(__dirname + '/SQL/getQuestionQuery.sql').toString();

const getAnswers = async (q) => {
  const {rows} = await pool.query(getAnswerQuery,[q]);
  return rows[0];
};

const getQuestions = async (p) => {
  const {rows} = await pool.query(getQuestionQuery,[p]);
  console.log(rows[0]);
  return rows[0];
};


const postAnswer = async (question_id, ans_obj) => {

  const getMaxIDfromanswer = 'SELECT MAX(id) as id FROM answer';
  const insertAnswerQuery = `
    INSERT INTO answer(id, question_id, body, date, answerer_name, answerer_email, reported, helpful)
    VALUES($1, $2, $3, $4, $5, $6, $7,$8)
  `;

  const getMaxIDfromanswerphotos = 'SELECT MAX(id) as id FROM answers_photos';
  const insertPhotoquery = `INSERT INTO answers_photos(id, answer_id, photo_url)
    VALUES($1, $2, $3)
  `;

  let {rows} = await pool.query(getMaxIDfromanswer,[]);
  const newAnswerID = rows[0].id + 1;

  const postAnswer = await pool.query(insertAnswerQuery, [newAnswerID, question_id, ans_obj.body, new Date().getTime(), ans_obj.name, ans_obj.email, 0, 0]);
  console.log('Answer posted successfully');

  if(ans_obj.photos.length > 0) {
    let {rows} = await pool.query(getMaxIDfromanswerphotos, []);
    const maxPhotoId = rows[0].id;

    for(let i = 0; i< ans_obj.photos.length ; i++){
      const res = await pool.query(insertPhotoquery, [maxPhotoId+1+i, newAnswerID, ans_obj.photos[i]])
      console.log('Photo posted succesfully');
    };
  }
};

// const start = async() => {
//   await postAnswer(553783, {
//     body: "I don't know",
//     name: 'testy',
//     email: 'test@gmail.com',
//     photos: [
//       'https://res.cloudinary.com/dseonxo5o/image/upload/v1640278230/ketchup/islmhgwvztjjjtuvevkz.jpg'
//     ]
//   });
// }

// start();

const postQuestion = async (que_obj) => {

  const getMaxIDfromquestion = 'SELECT MAX(id) as id FROM questions';
  const insertQuestionQuery = `
    INSERT INTO questions(id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helfulness)
    VALUES($1, $2, $3, $4, $5, $6, $7,$8)
  `;

  const {rows} = await pool.query(getMaxIDfromquestion,[]);
  const maxId = rows[0].id;

  const res = await pool.query(insertQuestionQuery, [maxId+1, que_obj.product_id, que_obj.body, new Date().getTime(), que_obj.name, que_obj.email, 0, 0]);
  console.log('post Question is succesful');
  return res;
};

const putQuestionHelpful = async (question_id) => {
  const getQuestionRow = `
    SELECT
    *
    FROM questions
    WHERE id = $1
  `;

  const updateQuestionHelpful = `
    Update questions
    SET question_helfulness = $1
    Where id = $2
  `

  const {rows} = await pool.query(getQuestionRow, [question_id]);
  const currenthelpful = rows[0].question_helfulness;

  const res = await pool.query(updateQuestionHelpful, [currenthelpful+1, question_id]);
  console.log('Question helpful Updated!')
  return res;

};


const putAnswerHelpful = async (answer_id) => {

  const getAnswerRow = `
    SELECT
    *
    FROM answer
    WHERE id = $1
  `;

  const updateAnswerHelpful = `
    Update answer
    SET helpful = $1
    Where id = $2
  `

  const {rows} = await pool.query(getAnswerRow, [answer_id]);
  const currenthelpful = rows[0].helpful;

  const res = await  pool.query(updateAnswerHelpful, [currenthelpful+1, answer_id]);
  console.log('Answer helpful Updated!');
  return res;

};

const putAnswerReport = async (answer_id) => {

  const updateAnswerReport = `
    Update answer
    SET reported = 1
    Where id = $1
  `
  const res = await pool.query(updateAnswerReport, [answer_id])
  console.log('Answer Report Updated!')
  return res;
};


module.exports = {
  getAnswers,
  getQuestions,
  postAnswer,
  postQuestion,
  putQuestionHelpful,
  putAnswerHelpful,
  putAnswerReport
}