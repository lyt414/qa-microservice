const {Pool} = require('pg');
// const conString = "postgres://newuser:password@localhost:5432/atelier";

const credentials = {
  user: 'newuser',
  host: 'localhost',
  database: 'atelier',
  password:'password',
  port: 5432
}

const pool = new Pool(credentials);

// pool.connect()
// .then(() => console.log('Connected Succesfully'))
// .catch((err) => console.log(err));
execute();

// async
async function execute() {
  await pool.connect()
  console.log('Connected Succesfully')
}

module.exports = pool;