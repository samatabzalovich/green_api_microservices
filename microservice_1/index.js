// m1.js
const express = require('express');
const app = express();
const port = 3000;
const producer = require('./producer');
app.use(express.json());

app.post('/process', (req, res)  =>  {
  // Логика обработки задачи
  const jsonBody = req.body.inputNumber;
  // Отправка сообщения в очередь
  producer(jsonBody);
  res.json({ "result": "Запрос принят на обработку" });
});


app.listen(port, () => {
  console.log(`M1 listening at http://localhost:${port}`);
});