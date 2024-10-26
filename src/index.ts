import express from 'express';
const app = express();
import dotenv from 'dotenv';
import { logservice } from './services/loggerService';

dotenv.config();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Server Status</title>
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

app.listen(PORT, () => logservice.info(false, `Express is listening at http://localhost:${PORT}`));
