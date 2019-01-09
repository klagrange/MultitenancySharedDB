const { Model } = require('objection');
const Knex = require('knex');

const knexConfig = require('../knexfile');

const knex = Knex(knexConfig);

// https://github.com/tgriesser/knex/issues/407#issuecomment-52858626
knex.raw('select 1+1 as result')
  .then(() => {
    // console.log('connection established.');
  })
  .catch((e) => {
    if (e.code === 'ECONNREFUSED') {
      console.log('[FATAL] cannot establish connection to db.');
      console.log(e);
      knex.destroy();
      process.exit(1);
    }
  });

Model.knex(knex);

module.exports = knex;

// module.exports = {
//   Model,
//   knex,
// };
