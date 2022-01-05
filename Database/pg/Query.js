const pool = require('./PG.js');
console.log = function() {};
// const getAnswerQuery = fs.readFileSync(__dirname + '/SQL/getAnswerQuery.sql').toString();
// const getQuestionQuery = fs.readFileSync(__dirname + '/SQL/getQuestionQuery.sql').toString();

const getAnswers = async (q) => {
  const getAnswerQuery = `WITH answer_id AS (
    select
    question_id,
    id,
    body,
    to_char(to_timestamp(date/1000)::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as new_date,
    answerer_name,
    helpful
    from answer
    WHERE question_id = $1
  ),
  photos AS (
      SELECT
      answer_id,
      json_agg(
          json_build_object(
              'id', a.id,
              'url', a.photo_url
          )
      ) as answers_agg
      FROM answers_photos a
      inner join answer_id b
      on a.answer_id = b.id
      GROUP BY answer_id
  )
  SELECT
    question_id,
    json_agg(
      json_build_object(
        'answer_id', an.id,
        'body', an.body,
        'date', an.new_date,
        'answerer_name', an.answerer_name,
        'helpfulness', an.helpful,
        'photos', coalesce(po.answers_agg,'[]'::json)
      )
    ) as results
  FROM answer_id an
  LEFT JOIN photos po
  on an.id = po.answer_id
  group by an.question_id`;

  try {
    const {rows} = await pool.query(getAnswerQuery,[q]);
    if (rows.length > 0){
      // console.log(rows[0])
      return rows[0]
    } else {
      // console.log({question_id: q})
      return {
        question_id: q,
        results:[]
      }
    }
  }
   catch (err) {
    console.log(err)
  }

};


const getQuestions = async (p) => {
  const getQuestionQuery = `WITH question_list AS (
    select
    id,
    product_id,
    question_body,
    to_char(to_timestamp(question_date/1000)::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as question_date,
    asker_name,
    case when reported = 1 then TRUE else FALSE end as reported,
    question_helfulness
    from questions
    WHERE product_id = $1
  ),
  answer_list AS (
    select
    a.id,
    a.question_id,
    a.body,
    to_char(to_timestamp(a.date/1000)::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as answer_date,
    a.answerer_name,
    a.helpful
    from answer a
    inner join question_list q
    on a.question_id = q.id
  ),
  photos AS (
    SELECT
    answer_id,
    json_agg(photo_url) as question_agg
    FROM answers_photos a
    inner join answer_list b
    on a.answer_id = b.id
    GROUP BY answer_id
  ),
  answers_agg AS (
    SELECT
    a.question_id,
    json_object_agg(
            a.id,
            json_build_object(
                'id', a.id,
                'body', a.body,
                'date', a.answer_date,
                'answerer_name', a.answerer_name,
                'helpfulness', a.helpful,
                'photos', coalesce(b.question_agg,'[]'::json)
            )
    ) as answers
    from answer_list a
    left join photos b
    on a.id = b.answer_id
    group by a.question_id
  )
  select
  q.product_id,
  json_agg(
      json_build_object(
          'question_id' , q.id,
          'question_body', q.question_body,
          'question_date', q.question_date,
          'asker_name', q.asker_name,
          'question_helpfulness', q.question_helfulness,
          'reported', q.reported,
          'answers', coalesce(a.answers, '{}'::json)
      )
  ) as results
  from question_list  q
  left join answers_agg a
  on q.id = a.question_id
  group by q.product_id
`;
try{
  const {rows} = await pool.query(getQuestionQuery,[p]);
  if(rows.length > 0){
    return rows[0];
  } else {
    return {
      product_id: p,
      results: []
    }
  }
} catch(err) {
  console.log(err)
}


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
  try {

    let {rows} = await pool.query(getMaxIDfromanswer,[]);
    const newAnswerID = rows[0].id + 1;

    const postAnswer = await pool.query(insertAnswerQuery, [newAnswerID, question_id, ans_obj.body, new Date().getTime(), ans_obj.name, ans_obj.email, 0, 0]);
    // console.log('Answer posted successfully');

    if(ans_obj.photos.length > 0) {
      let {rows} = await pool.query(getMaxIDfromanswerphotos, []);
      const maxPhotoId = rows[0].id;

      for(let i = 0; i< ans_obj.photos.length ; i++){
        const res = await pool.query(insertPhotoquery, [maxPhotoId+1+i, newAnswerID, ans_obj.photos[i]])
        // console.log('Photo posted succesfully');
      };
    }

    return 'Posted';
  } catch (err) {
    console.log(err)
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
try {

  const {rows} = await pool.query(getMaxIDfromquestion,[]);
  const maxId = rows[0].id;

  const res = await pool.query(insertQuestionQuery, [maxId+1, que_obj.product_id, que_obj.body, new Date().getTime(), que_obj.name, que_obj.email, 0, 0]);
  // console.log('post Question is succesful');

  return 'Posted';
} catch(err) {
  console.log(err)
}
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
try{

  const {rows} = await pool.query(getQuestionRow, [question_id]);
  const currenthelpful = rows[0].question_helfulness;

  const res = await pool.query(updateQuestionHelpful, [currenthelpful+1, question_id]);
  // console.log('Question helpful Updated!')

  return 'Updated';
} catch(err) {
  console.log(err)
}

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
try{

  const {rows} = await pool.query(getAnswerRow, [answer_id]);
  const currenthelpful = rows[0].helpful;

  const res = await  pool.query(updateAnswerHelpful, [currenthelpful+1, answer_id]);
  // console.log('Answer helpful Updated!');

  return 'Updated';
} catch(err) {
  console.log(err)
}

};

const putAnswerReport = async (answer_id) => {

  const updateAnswerReport = `
    Update answer
    SET reported = 1
    Where id = $1
  `
 try {

   const res = await pool.query(updateAnswerReport, [answer_id])
   // console.log('Answer Report Updated!')
   return 'Updated';
  } catch (err) {
    console.log(err)
  }
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