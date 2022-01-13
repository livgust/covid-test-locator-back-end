import fs from 'fs';
import path from 'path';
import {Options, Sequelize} from 'sequelize';
import configFile from '../config/config.json';
import Place from './place';
import Report from './report';
import ReportValidation from './reportvalidation';

const models = [Place, Report, ReportValidation];

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

models.forEach(model => {
  model(
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
