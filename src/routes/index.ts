import express, { Application } from 'express';
import usersRoutes from './users';
import issueReporterRoutes from './issueReporter';
import cors, { CorsOptions } from 'cors';
import companyInfoRoutes from './companyInfo';

class Routes {
  constructor(app: Application) {
    app.use('/api/v1/users', usersRoutes);
    app.use('/api/v1/issues', issueReporterRoutes);
    app.use('/api/v1/company', companyInfoRoutes);
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
