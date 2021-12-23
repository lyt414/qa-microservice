WITH answer_id AS (
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
      group by an.question_id