export default {
  development: {
    username: 'root',
    database: 'database_development',
    storage: ':memory:',
    dialect: 'sqlite',
  },
  test: {
    username: 'root',
    database: 'database_test',
    storage: ':memory:',
    dialect: 'sqlite',
  },
  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_ENDPOINT,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
};
