import mysql from "mysql2";

const db = mysql.createPool({
  host: "localhost",
  user: "root",            // 👈 IMPORTANT
  password: "akbs@2005",
  database: "academic_report_generator",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;
