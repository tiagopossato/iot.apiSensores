"use strict";
var bookshelf = require('bookshelf')(require('../banco/banco'));

var Alarme = bookshelf.Model.extend({
  tableName: 'Alarmes',
  idAttribute: 'id'
});

module.exports = Alarme;
