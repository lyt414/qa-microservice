-- USE atelier;
-- \c atelier;
-- \i schema.sql;
DROP TABLE IF EXISTS answers_photos;
CREATE TABLE answers_photos (
    id SERIAL PRIMARY KEY,
    answer_id integer NOT NULL,
    photo_url varchar
);

DROP TABLE if exists answer;
CREATE TABLE answer (
    id SERIAL PRIMARY KEY,
    question_id integer NOT NULL,
    body varchar,
    date bigint,
    answerer_name varchar,
    answerer_email varchar,
    reported integer,
    helpful integer
);

DROP TABLE if exists questions;
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    product_id integer NOT NULL,
    question_body varchar,
    question_date bigint,
    asker_name varchar,
    asker_email varchar,
    reported integer,
    question_helfulness integer
);

-- import files
\copy answer from 'answers.csv' delimiter ',' csv header;
\copy questions from 'questions.csv' delimiter ',' csv header;
\copy answers_photos from 'answers_photos.csv' delimiter ',' csv header;
-- Create Index to optimize query
CREATE INDEX idx_ques ON answer(question_id);
CREATE INDEX idx_prod ON questions(product_id);
CREATE INDEX idx_ans ON answers_photos(answer_id);