const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./middleware/socket");

const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const managerRouter = require("./routes/manager");
const customerRoutes = require("./routes/customer");

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
// initSocket(server);

app.use(cors());

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
app.use("/admin", adminRouter);
app.use("/manager", managerRouter);
app.use("/customer", customerRoutes);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
