import express, {json, urlencoded} from 'express';
import googlePassThrough from './routes/googlePassThrough';
import placesRouter from './routes/places';
import {runMigrations} from './database/migrations';

const app = express();
const port = 3000;

app.use(json());
app.use(urlencoded({extended: true}));

app.use(googlePassThrough);
app.use('/places', placesRouter);

runMigrations().then(() => {
  console.log('Migrations completed.');
  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
});
