const options = {
  test: {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port: '5433',
      user : 'postgres',
      password : 'mysecretpassword',
      database : 'user-management-test'
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
  development: {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port: '5432',
      user : 'postgres',
      password : 'mysecretpassword',
      database : 'user-management'
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  }
};

const environment = process.env.NODE_ENV || 'development';
module.exports = options[environment];
