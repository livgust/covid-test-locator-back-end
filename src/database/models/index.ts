import fs from 'fs';
import path from 'path';
import {Options, Sequelize} from 'sequelize';
import configFile from '../config/config.json';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = (configFile as {[key: string]: Options})[env];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = {};

const sequelize = new Sequelize(
  config.database!,
  config.username!,
  config.password,
  config
);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file)).default(
      sequelize,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Sequelize as any).DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
