import {Umzug, SequelizeStorage} from 'umzug';
import db from '../models';

const umzug = new Umzug({
  migrations: {
    glob: ['*.ts', {ignore: 'index.ts', cwd: 'src/database/migrations'}],
  },
  context: db.sequelize.getQueryInterface(),
  storage: new SequelizeStorage({sequelize: db.sequelize}),
  logger: console,
});

export async function runMigrations() {
  return umzug.up();
}

export default umzug;
