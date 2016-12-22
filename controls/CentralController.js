"use strict";
const uuidV4 = require('uuid/v4');
var central = require('../models/Central');

module.exports = {
  createNew: createNew,
  getOne: getOne,
  getAll: getAll,
  validateKey: validateKey
};

function validateKey(req, res, next) {
  if (req.headers.uuid == null) {
    return res.send(203, {
      error: true,
      message: "Não autorizado"
    });
  }

  central.forge({
      uuid: req.headers.uuid
    })
    .fetch()
    .then(function(dados) {
      if (dados == null) {
        return res.send(203, {
          error: true,
          message: "Não autorizado"
        });
      } else {
        next();
      }
    })
    .catch(function(err) {
      res.send(500, {
        error: true,
        message: err.message
      });
    });
};

function getOne(req, res, next) {
  central.forge({
      id: req.params.id
    })
    .fetch()
    .then(function(dados) {
      if (dados == null) {
        return res.send(404, {
          error: false
        });
      }
      res.send(200, {
        error: false,
        central: dados.toJSON()
      });
    })
    .catch(function(err) {
      res.send(500, {
        error: true,
        message: err.message
      });
    });
}

function createNew(req, res, next) {
  if (req.params.nome == null || req.params.nome == "") {
    res.send(204, {
      error: true,
      message: "O nome deve ser informado!"
    });
  }

  var dados = {
    nome: req.params.nome,
    uuid: uuidV4()
  };

  central.forge(dados)
    .save()
    .then(function(central) {
      res.send(201, {
        error: false,
        central: central
      });
    })
    .catch(function(err) {
      res.send(500, {
        error: true,
        message: err.message
      });
    });
}

function getAll(req, res, next) {
  central.forge()
    .fetchAll()
    .then(function(dados) {
      if (dados == null) {
        res.send(404, {
          error: false
        });
      } else {
        res.send(200, {
          error: false,
          data: dados.toJSON()
        });
      }
    })
    .catch(function(err) {
      res.send(500, {
        error: true,
        message: err.message
      });
    });
}
