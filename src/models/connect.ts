import mysql from 'mysql2';

const sslCert = process.env.MYSQL_CA_CERT
  ? Buffer.from(process.env.MYSQL_CA_CERT, 'base64')
  : undefined;

export default mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  ssl: sslCert ? { ca: sslCert } : undefined,
});
