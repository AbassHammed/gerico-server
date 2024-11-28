/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from 'dotenv';
// The env variables needs to be configured here before importing any other file in the app entry
// this allows each imported file that uses the env vars to have access to them
// i.e if you do something like this :
// import connection from './models/connect'
// import dotenv from 'dotenv'
// dotenv.config()
// the process.env vars used in the './models/connect' file will be undefined which will cause connection errors
dotenv.config();
import express, { Application } from 'express';
import { logservice } from './services/loggerService';
import employee from './repositories/users';
import Server from './routes';

const app: Application = express();
const server: Server = new Server(app);
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Server</title>
        <style>
            body {
                font-family: sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
            }
            h1 {
                font-size: 2.5rem;
                color: #007BFF; /* Example color - customize as needed */
            }
            p {
                font-size: 1.2rem;
            }
        </style>
    </head>
    <body>
        <h1>Server is Running!</h1>
        <p>Everything is working correctly.</p>
    </body>
    </html>
  `;

  res.send(htmlContent);
});

app.get('/test', (req, res) => {
  (async () => {
    const result2 = await employee.retrieveByEmail('john.doe@example.com');
    return res.json({ result2 });
  })();
});

app.listen(PORT, () => {
  logservice.info(`Express is listening at http://localhost:${PORT}`);
});
