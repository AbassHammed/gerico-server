/* eslint-disable @typescript-eslint/no-namespace */
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
import Server from './routes';
import { ApiResponse } from './services/ApiResponse';
import path from 'path';

declare global {
  namespace Express {
    interface Response {
      sendResponse<T>(response: ApiResponse<T>): Response;
    }
  }
}

const app: Application = express();
const server: Server = new Server(app);
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/status', (req, res) => {
  res.sendResponse(ApiResponse.success(200, undefined, 'Tout va bien'));
});

app.listen(PORT, () => {
  logservice.info(`Express is listening at http://localhost:${PORT}`);
});
