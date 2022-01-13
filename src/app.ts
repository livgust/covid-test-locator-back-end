import dotenv from 'dotenv';
dotenv.config();

import express, {json, urlencoded} from 'express';
import googlePassThrough from './routes/googlePassThrough';
import placesRouter from './routes/places';
import {runMigrations} from './database/migrations';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(json());
app.use(urlencoded({extended: true}));

app.use(googlePassThrough);
app.use(placesRouter);

runMigrations().then(() => {
  console.log('Migrations completed.');
  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
});
