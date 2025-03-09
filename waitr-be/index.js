const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const authRouter = require("./auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
