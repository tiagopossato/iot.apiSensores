"use strict";
var knexqb = require('knex');

var Alarme = require('../models/Alarme');

module.exports = {
  createNew: createNew,
  update: updateAlarm,
  getAll: getAll,
  getAtivos: getAtivos
};

function createNew(req, res, next) {
  //console.log(req.params);

  if (req.params.tempoAtivacao == null ||
    req.params.id == null ||
    isNaN(req.params.id)) {
    return res.send(400, {
      error: true,
      message: 'Informar pelo menos o tempo de ativação e o id do Alarme'
    });
  }

  var dados = {};

  dados.idAlarme = parseInt(req.params.id);
  dados.idCentral = req.params.idCentral;

  //verifica se foi recebida prioridade no alarme
  if (req.params.prioridade != null) {
    dados.prioridade = isNaN(parseInt(req.params.prioridade)) ?
      0 : parseInt(req.params.prioridade);
  } else {
    dados.prioridade = 0;
  }

  //verifica se foi recebida mensagem do alarme
  if (req.params.mensagem != null) {
    dados.mensagem = req.params.mensagem;
  }

  //verifica se foi enviado o estado do alarme
  if (req.params.ativo != null) {
    dados.ativo = req.params.ativo === 'True' ||
      req.params.ativo == 1 ||
      req.params.ativo == '1' ||
      req.params.ativo == true ||
      req.params.ativo == 'true';
  } else {
    dados.ativo = true;
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
    dados.reconhecido = req.params.reconhecido === 'True' ||
      req.params.reconhecido === 1 ||
      req.params.reconhecido === '1' ||
      req.params.reconhecido === 'true';
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
  console.log('-----------------------------------------------------------');
  console.log("Novo alarme: ");
  console.log(dados);
  console.log('-----------------------------------------------------------');

  Alarme.forge(dados)
    .save(null, {
      method: 'insert'
    })
    .then(function(alarme) {
      return res.send(201, {
        error: false
      });
    })
    .catch(function(err) {
      console.log('Erro alm-01:');
      console.log(err.message);
      try {
        return res.send(500, {
          error: true,
          message: err.message
        });
      } catch (e) {
        console.error(e);
      }
    });
}

function updateAlarm(req, res, next) {
  if (req.params.id == null || isNaN(req.params.id)) {
    return res.send(400, {
      error: true,
      message: 'Informar o id do Alarme'
    });
  }

  var alarmeId = {};
  var dados = {};

  //pega o id do alarme a ser editado
  alarmeId.idAlarme = parseInt(req.params.id);
  alarmeId.idCentral = req.params.idCentral;

  //verifica se foi enviado o estado do alarme
  if (req.params.ativo != null) {
    dados.ativo = req.params.ativo === 'True' ||
      req.params.ativo === 1 ||
      req.params.ativo === '1' ||
      req.params.ativo === 'true';
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
    dados.reconhecido = req.params.reconhecido === 'True' ||
      req.params.reconhecido === 1 ||
      req.params.reconhecido === '1' ||
      req.params.reconhecido === 'true';
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

  console.log('-----------------------------------------------------------');
  console.log("Editando alarme: ");
  console.log(alarmeId);
  console.log(dados);
  console.log('-----------------------------------------------------------');


  new Alarme(alarmeId)
    .where('idAlarme', '=', alarmeId.idAlarme)
    .where('idCentral', '=', alarmeId.idCentral)
    .save(dados, {
      method: 'update'
    })
    .then(function(alarme) {
      return res.send(201, {
        error: false
      });
    })
    .catch(function(err) {
      console.log('Erro alm-02:');
      console.log(err.message);
      return res.send(500, {
        error: true,
        message: err.message
      });
    });
}

function getAll(req, res, next) {
  Alarme.forge()
    .fetchAll()
    .then(function(dados) {
      if (dados == null) {
        return res.send(404, {
          error: false
        });
      } else {
        return res.send(200, {
          error: false,
          data: dados.toJSON()
        });
      }
    })
    .catch(function(err) {
      return res.send(500, {
        error: true,
        message: err.message
      });
    });
}

function getAtivos(req, res, next) {
  Alarme.forge().where('ativo', '=', 1)
    .fetchAll()
    .then(function(dados) {
      console.log('ativos');
      if (dados == null) {
        return res.send(404, {
          error: false
        });
      } else {
        return res.send(200, {
          error: false,
          data: dados.toJSON()
        });
      }
    })
    .catch(function(err) {
      return res.send(500, {
        error: true,
        message: err.message
      });
    });
}
