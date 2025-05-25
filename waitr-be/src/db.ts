import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_DB,
  // password: process.env.DB_PASS,
  // port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  connectionString: process.env.DB_STRING,
  ssl: { rejectUnauthorized: false },
});



export default pool;
