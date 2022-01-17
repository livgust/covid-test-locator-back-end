import dotenv from 'dotenv';
dotenv.config();

import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from 'express';
import {runMigrations} from './database/migrations';
import routes from './routes';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(json());
app.use(urlencoded({extended: true}));

app.use(routes);

// final `use`: the default error responder
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  const status = 500;
  const message = error.message || 'Something went wrong';
  res.status(status).send({
    status,
    message,
  });
});

runMigrations().then(() => {
  console.log('Migrations completed.');
  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
});
