const fs = require('fs');
const fastcsv = require('fast-csv');
const copyFrom = require('pg-copy-streams').from;
const path = require('path');
const Readable = require('stream').Readable;
const pool = require('./PG.js');

// use fs and fast-csv read CSV into Database
// this is working but very slow...

let stream1 = fs.createReadStream(__dirname + "/../../Data/answers_photos.csv");
let csvData1 = [];
let csvStream1 = fastcsv
  .parse()
  .on("data", function(data) {
    csvData1.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData1.shift();
    // connect to the Postgresql database
    // save csvData
    const query = "INSERT INTO answers_photos(id, answer_id, photo_url) VALUES ($1, $2, $3)";

    try {
      csvData1.forEach(row => {
        pool.query(query, row, (err, res) => {
          if(err){
            console.log(err.stack)
          }
        })
      })
    } catch(err) {
      console.log(err)
    }

  });

stream1.pipe(csvStream1);


// option2: use COPYFROM
// if in postgresl: \copy answers_photos from 'answers_photos.csv' delimiter ',' csv header;