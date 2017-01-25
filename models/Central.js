"use strict";
var bookshelf = require('bookshelf')(require('../banco/banco'));
var Alarme = require('../models/Alarme');

var Central = bookshelf.Model.extend({
  tableName: 'Central',
  idAttribute: 'id',
  hidden: ['updated_at', 'updated_at'],
  alarmes: function() {
    return this.hasMany(Alarme);
  }
});

module.exports = Central;
