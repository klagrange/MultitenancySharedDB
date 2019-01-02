const options = {
  development: {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'mysecretpassword',
      database : 'postgres'
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
