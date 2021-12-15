-- USE atelier;
-- \c atelier;
-- \i schema.sql;

TRUNCATE answers_photos;
DROP TABLE IF EXISTS answers_photos;
CREATE TABLE answers_photos (
    id integer NOT NULL PRIMARY KEY,
    answer_id integer NOT NULL,
    photo_url varchar
);

DROP TABLE if exists answers;
CREATE TABLE answers (
    id integer NOT NULL PRIMARY KEY,
    question_id integer NOT NULL,
    body varchar,
    date varchar,
    answerer_name varchar,
    answerer_email varchar,
    reported integer,
    helpful integer
);

DROP TABLE if exists questions;
CREATE TABLE questions (
    id integer NOT NULL PRIMARY KEY,
    product_id integer NOT NULL,
    question_body varchar,
    question_date varchar,
    asker_name varchar,
    asker_email varchar,
    reported integer,
    question_helfulness integer
);