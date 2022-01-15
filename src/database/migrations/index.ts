import path from 'path';
import {Umzug, SequelizeStorage} from 'umzug';
import db from '../models';
const scriptName = path.basename(__filename);

const umzug = new Umzug({
  migrations: {
    glob: [
      '!(*.d).[j|t]s',
      {ignore: scriptName, cwd: path.dirname(__filename)},
    ],
  },
  context: db.sequelize.getQueryInterface(),
  storage: new SequelizeStorage({sequelize: db.sequelize}),
  logger: console,
});

export async function runMigrations() {
  return umzug.up();
}

export default umzug;
