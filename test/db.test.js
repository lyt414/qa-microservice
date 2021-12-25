const db = require('../Database/pg/Query.js');
const pool = require('../Database/pg/PG.js');

describe('GET Questions', () => {

  it('should get questions', async () => {
    const result = await db.getQuestions(1000000)
    // console.log(result);
    expect(result.product_id).toBe(1000000)
  })

  it('should get questions with results', async () => {
    const result = await db.getQuestions(1)
    // console.log(result);
    expect(result.results.length).toBe(6)
  })

})


describe('GET answers', () => {

  it('should get answers', async () => {
    const result = await db.getAnswers(1)
    // console.log(result);
    expect(result.question_id).toBe(1)
  })

  it('should get answers with results', async () => {
    const result = await db.getAnswers(1)
    // console.log(result);
    expect(result.results.length).toBe(5)
  })

})


describe('Post answers', () => {

  it('should post answers', async () => {
    const result = await db.postAnswer(553783, {
      body: "I don't know",
      name: 'testy',
      email: 'test@gmail.com',
      photos: [
        'https://res.cloudinary.com/dseonxo5o/image/upload/v1640278230/ketchup/islmhgwvztjjjtuvevkz.jpg'
      ]
    })
    // console.log(result);
    expect(result).toBe('Posted')

    // const to_delete  = await pool.query('DELETE FROM answer WHERE answerer_name = $1', ['testy']);
  })

})


describe('Post question', () => {

  it('should post Question', async () => {
    const result = await db.postQuestion({
      product_id: 1000,
      body: "I don't know",
      name: 'testy',
      email: 'test@gmail.com'
    })
    // console.log(result);
    expect(result).toBe('Posted')

    // const to_delete  = await pool.query('DELETE FROM questions WHERE asker_name = $1', ['testy']);
  })

})


describe('PUT answer', () => {

  it('should put Answer Helpful', async () => {
    const result = await db.putAnswerHelpful(1000)
    // console.log(result);
    expect(result).toBe('Updated')
  })

  it('should put Answer Reported', async () => {
    const result = await db.putAnswerReport(1000)
    // console.log(result);
    expect(result).toBe('Updated')
  })

})


describe('PUT question', () => {

  it('should put Question Helpful', async () => {
    const result = await db.putQuestionHelpful(1000)
    // console.log(result);
    expect(result).toBe('Updated')
  })


})