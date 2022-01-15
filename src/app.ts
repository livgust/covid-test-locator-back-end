import dotenv from 'dotenv';
dotenv.config();

import express, {json, urlencoded} from 'express';
import {runMigrations} from './database/migrations';
import routes from './routes';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(json());
app.use(urlencoded({extended: true}));

app.use(routes);

runMigrations().then(() => {
  console.log('Migrations completed.');
  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
});
