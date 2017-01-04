"use strict";
var knexqb = require('knex');

var alarme = require('../models/Alarme');

module.exports = {
  createNew: createNew,
  update: updateAlarm,
  getAll: getAll
};

function createNew(req, res, next) {
  if (req.params.tempoAtivacao == null || req.params.id == null) {
    res.send(400, {
      error: true,
      message: 'Informar pelo menos o tempo de ativação e o id do Alarme'
    });
  }

  var dados = {};

  dados.id = req.params.id;

  //verifica se foi recebida prioridade no alarme
  if (req.params.prioridade != null) {
    dados.prioridade = req.params.prioridade;
  } else {
    dados.prioridade = 0;
  }

  //verifica se foi recebida mensagem do alarme
  if (req.params.mensagem != null) {
    dados.mensagem = req.params.mensagem;
  }

  //verifica se foi enviado o estado do alarme
  if (req.params.ativo != null) {
    dados.ativo = req.params.ativo;
  } else {
    dados.ativo = 'true';
  }

  //verifica se foi enviado o inicio do alarme
  if (req.params.tempoAtivacao != null) {
    dados.tempoAtivacao = req.params.tempoAtivacao;
  } else {
    dados.tempoAtivacao = 'NOW';
  }

  if (req.params.tempoInativacao != null) {
    dados.tempoInativacao = req.params.tempoInativacao;
  } else {
    //caso o alarme está sendo desativado e não foi recebido horário
    if (dados.ativo == false) {
      dados.tempoInativacao = knexqb.raw('CURRENT_TIMESTAMP');
    }
  }

  //verifica se está recebendo reconhecimento de alarme
  if (req.params.reconhecido != null) {
    dados.reconhecido = req.params.reconhecido;
    if (dados.reconhecido == 'true') {
      //verifica se recebeu mensagem de reconhecido
      if (req.params.mensagemReconhecido != null) {
        dados.mensagemReconhecido = req.params.mensagemReconhecido;
      }
      //verifica o tempo de reconhecido
      if (req.params.tempoReconhecido != null) {
        dados.tempoReconhecido = req.params.tempoReconhecido;
      } else {
        dados.tempoReconhecido = knexqb.raw('CURRENT_TIMESTAMP');
      }
    }
  } else {
    dados.reconhecido = false;
  }

  alarme.forge(dados)
    .save()
    .then(function(alarme) {
      res.send(201, {
        error: false
      });
    })
    .catch(function(err) {
      res.send(500, {
        error: true,
        message: err.message
      });
    });
}

function updateAlarm(req, res, next) {
  if (req.params.id == null) {
    res.send(400, {
      error: true,
      message: 'Informar o id do Alarme'
    });
  }

  var dados = {};

  //pega o id do alarme a ser editado
  dados.id = req.params.id;

  //verifica se foi enviado o estado do alarme
  if (req.params.ativo != null) {
    dados.ativo = req.params.ativo;
  }

  //verifica se está sendo enviado o horário de inativação do alarme
  if (req.params.tempoInativacao != null) {
    dados.tempoInativacao = req.params.tempoInativacao;
    dados.ativo = false;
  } else {
    //caso o alarme está sendo desativado e não foi recebido horário
    if (dados.ativo == false) {
      dados.tempoInativacao = knexqb.raw('CURRENT_TIMESTAMP');
    }
  }

  //verifica se está recebendo reconhecimento de alarme
  if (req.params.reconhecido != null) {
    dados.reconhecido = req.params.reconhecido;
    if (dados.reconhecido == 'true') {
      //verifica se recebeu mensagem de reconhecido
      if (req.params.mensagemReconhecido != null) {
        dados.mensagemReconhecido = req.params.mensagemReconhecido;
      }
      //verifica o tempo de reconhecido
      if (req.params.tempoReconhecido != null) {
        dados.tempoReconhecido = req.params.tempoReconhecido;
      } else {
        dados.tempoReconhecido = knexqb.raw('CURRENT_TIMESTAMP');
      }
    }
  }

  console.log(dados);

  alarme.forge({
      'id': dados.id
    })
    .save(dados)
    .then(function(alarme) {
      res.send(201, {
        error: false
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
  alarme.forge()
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
