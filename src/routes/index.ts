import express, { Application } from 'express';
import employeeRoutes from './employee';
import cors, { CorsOptions } from 'cors';

class Routes {
  constructor(app: Application) {
    app.use('/api', employeeRoutes);
  }
}

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      credentials: true,
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
}