export default {
  development: {
    username: 'postgres',
    database: 'postgres',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
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
