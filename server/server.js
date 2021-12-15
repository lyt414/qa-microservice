const express = require('express');
const app = express();
let PORT = 3000;

app.use(express.static('../Database'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`QA-API is listening on ${PORT}`);
});
//"@types/pg": "^8.6.1",