module.exports = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: 'banco/banco.sqlite'
  },
  debug: true,
  useNullAsDefault: true
});
