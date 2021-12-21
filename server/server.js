const express = require('express');
const qa = express();
let PORT = 3000;

qa.use(express.static('../Database'));
qa.use(express.json());
qa.use(express.urlencoded({ extended: true }));

qa.listen(PORT, () => {
  console.log(`QA-API is listening on ${PORT}`);
});
//"@types/pg": "^8.6.1",