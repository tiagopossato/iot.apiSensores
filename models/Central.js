"use strict";
var bookshelf = require('bookshelf')(require('../banco/banco'));

var Central = bookshelf.Model.extend({
  tableName: 'Central',
  idAttribute: 'id',
  hidden: ['updated_at', 'updated_at']
});

module.exports = Central;
