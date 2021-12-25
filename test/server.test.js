const request = require('supertest');
const _globals = require('@jest/globals');

const db = require('../Database/pg/Query.js');
const qa =  require('../server/server.js');
const {Pool} = require('pg');

// afterAll(async () => {
//   await Pool.end()
// })


afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('../Database/pg/Query.js', () => jest.fn())


const mockQuestion = {
  'product_id' : 1,
  'results': [
    {
      'question_id': 1,
      'question_body': 'test',
      'question_date': '2020-07-08T07:02:56Z',
      'asker_name' : 'Gina.Donnelly',
      'question_helpfulness': 25,
      'reported':false,
      'answers':{
        '1':{
          'id': 1,
          'body':'test',
          'date': '2020-07-08T07:02:56Z',
          'answerer_name': 'Prudence51',
          'helpfulness': 11,
          'photos': []
        }
      }
    }
  ]
};


const mockAnswer = {
  'question_id' : 1,
  'results': [
      {
          'answer_id': 1,
          'body':'test',
          'date': '2020-07-08T07:02:56Z',
          'answerer_name': 'Prudence51',
          'helpfulness': 11,
          'photos': []
      }
    ]
};

describe('GET Questions', () => {

  db.getQuestions = jest.fn();

  it('should get questions', async () => {
    db.getQuestions.mockResolvedValue({
      data: [
        mockQuestion
      ]
    })

    const response = await request(qa)
      .get('/questions')
      .query({ product_id: 1 })

    expect(db.getQuestions.mock).toBeTruthy();
    expect(db.getQuestions).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(200)
    expect(response.body.data[0].product_id).toBe(1)
  })

  it('should respond with a 500 status code', async () => {
    db.getQuestions.mockImplementation(() => {
      throw new Error('Fail to get questions');
    });

    const response = await request(qa)
      .get('/questions')
      .query({ product_id: 1 })

    expect(response.statusCode).toBe(500)
  })

})



describe('GET Answers', () => {

  db.getAnswers = jest.fn();

  it('should get answers', async () => {
    db.getAnswers.mockResolvedValue({
      data: [
        mockAnswer
      ]
    })

    const response = await request(qa)
      .get('/answers/1')
      .query({ question_id: 1 })

    expect(db.getAnswers.mock).toBeTruthy();
    expect(db.getAnswers).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(200)
    expect(response.body.data[0].question_id).toBe(1)
  })

  it('should respond with a 500 status code', async () => {
    db.getAnswers.mockImplementation(() => {
      throw new Error('Fail to get answers');
    });

    const response = await request(qa)
      .get('/answers/1')
      .query({ question_id: 1 })

    expect(response.statusCode).toBe(500)
  })

})



describe('POST questions', () => {

  db.postQuestion = jest.fn();

  it('should post a question with a 201 status code', async () => {
    db.postQuestion.mockResolvedValue('Posted')
    const response = await request(qa)
      .post('/questions')
      .send(mockQuestion)

    expect(db.postQuestion.mock).toBeTruthy();
    expect(db.postQuestion).toHaveBeenCalledTimes(1)
    expect(db.postQuestion.mock.calls[0][0].product_id).toBe(1)
    expect(response.statusCode).toBe(201)
    expect(response.text).toBe('Posted')

  })

  it('should respond with a 500 status code', async () => {
    db.postQuestion.mockImplementation(() => {
      throw new Error('Fail to post a question');
    });

    const response = await request(qa)
      .post('/questions')
      .send(mockQuestion)

    expect(response.statusCode).toBe(500)
  })

})


describe('POST answers', () => {

  db.postAnswer = jest.fn();

  it('should post a answer with a 201 status code', async () => {
    db.postAnswer.mockResolvedValue('Posted')
    const response = await request(qa)
      .post('/answers/1')
      .send(mockAnswer)

    expect(db.postAnswer.mock).toBeTruthy();
    expect(db.postAnswer).toHaveBeenCalledTimes(1)
    // expect(db.postAnswer.mock.calls[0][0].question_id).toBe(1)
    expect(response.statusCode).toBe(201)
    expect(response.text).toBe('Posted')

  })

  it('should respond with a 500 status code', async () => {
    db.postAnswer.mockImplementation(() => {
      throw new Error('Fail to post a answer');
    });

    const response = await request(qa)
      .post('/answers/1')
      .send(mockAnswer)

    expect(response.statusCode).toBe(500)
  })

})



describe('PUT answer', () => {


  db.putAnswerHelpful = jest.fn();
  db.putAnswerReport = jest.fn();


  it('helpful: should respond with a 204 status code', async () => {

    const response = await request(qa)
      .put('/answers/1/helpful')

    expect(db.putAnswerHelpful.mock).toBeTruthy();
    expect(db.putAnswerHelpful).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(204)

  })

  it('helpful: should respond with a 500 status code', async () => {
    db.putAnswerHelpful.mockImplementation(() => {
      throw new Error('Fail to update helpfulness');
    });

    const response = await request(qa)
      .put('/answers/1/helpful')

    expect(response.statusCode).toBe(500)

  })


  it('report: should respond with a 204 status code', async () => {

    const response = await request(qa)
      .put('/answers/1/reported')

    expect(db.putAnswerReport.mock).toBeTruthy();
    expect(db.putAnswerReport).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(204)

  })

  it('report: should respond with a 500 status code', async () => {
    db.putAnswerReport.mockImplementation(() => {
      throw new Error('Fail to report review');
    });

    const response = await request(qa)
      .put('/answers/1/reported')

    expect(response.statusCode).toBe(500)
  })

})



describe('PUT question', () => {


  db.putQuestionHelpful = jest.fn();


  it('helpful: should respond with a 204 status code', async () => {

    const response = await request(qa)
      .put('/questions/1/helpful')

    expect(db.putQuestionHelpful.mock).toBeTruthy();
    expect(db.putQuestionHelpful).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(204)

  })

  it('helpful: should respond with a 500 status code', async () => {
    db.putQuestionHelpful.mockImplementation(() => {
      throw new Error('Fail to update helpfulness');
    });

    const response = await request(qa)
      .put('/questions/1/helpful')

    expect(response.statusCode).toBe(500)

  })

})