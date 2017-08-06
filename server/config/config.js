require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: null,
    database: 'DMS',
    host: '127.0.0.1',
    port: '5444',
    dialect: 'postgres'
  },
  test: {
    username: 'postgres',
    password: null,
    database: 'test',
    host: '127.0.0.1',
    port: '5444',
    dialect: 'postgres'
  },
  // test: {
  //   use_env_variable: 'TEST_DB'
  // },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};
