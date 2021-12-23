WITH question_list AS (
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
