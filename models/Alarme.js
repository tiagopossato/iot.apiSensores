"use strict";
var bookshelf = require('bookshelf')(require('../banco/banco'));
var Central = require('../models/Central');

var Alarme = bookshelf.Model.extend({
  tableName: 'Alarmes',
  idAttribute: ['idAlarme', 'idCentral'],
  central: function() {
    return this.belongsTo(Central);
  }
});

module.exports = Alarme;
