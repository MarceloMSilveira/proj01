import pg from "pg";
import 'dotenv/config'

const password = process.env.db_pwd;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: password,
  port: 5432,
});



await db.connect();

const result = await db.query('SELECT * FROM capitals');
console.log(result.rows[0])


await db.end();

