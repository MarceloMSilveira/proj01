import express from "express";
import bodyParser from "body-parser";
import pg from 'pg'
import 'dotenv/config'

const app = express();
const port = 3000;
const { Client } = pg;
let quiz = [];

const db = new Client ({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: process.env.db_pwd,
  port: 5432,
})

async function tryAcessData() {
  try {
    const result = await db.query('SELECT * FROM capitals'); 
    quiz = result.rows;
    console.log(`Sucess aquiring all data: ${JSON.stringify(quiz[0])} / got ${quiz.length} registers.`) 
  } catch (error) {
    console.error(`Erro ao tentar obter os dados da tabela capitals: ${error.message}`)
  }
  await db.end()
}

await db.connect();

await tryAcessData();
console.log(`Data returned test: ${JSON.stringify(quiz[1])}`);

// let quiz = [
//   { country: "France", capital: "Paris" },
//   { country: "United Kingdom", capital: "London" },
//   { country: "United States of America", capital: "New York" },
// ];

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(`current question: ${JSON.stringify(currentQuestion)}`);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  console.log(`user answer: ${JSON.stringify(req.body)}`)
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  console.log(`current question: ${JSON.stringify(currentQuestion)}`);
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
