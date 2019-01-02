const config = require('config');

const options = {
    client: config.get('client'),
    connection: {
      host : config.get('connection.host'),
      port: config.get('connection.port'),
      user : config.get('connection.user'),
      password : config.get('connection.password'),
      database : config.get('connection.database')
    },
    migrations: {
      directory: config.get('migrations.directory'),
    },
    seeds: {
      directory: config.get('seeds.directory'),
    },
}

module.exports = options;
