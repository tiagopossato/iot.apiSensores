var restify = require('restify');
var fs = require('fs');
var central = require('./controls/CentralController');
var alarme = require('./controls/AlarmeController');

//===================== CRIAÇÃO DO SERVIDOR ==============================
var server = restify.createServer({
  //certificate: fs.readFileSync('certificados/server.crt'),
  //key: fs.readFileSync('certificados/server.key'),
  name: 'Api Sensores',
});

//===================== CONFIGURAÇÕES DO SERVIDOR ============================
server.use(restify.CORS({
  origins: ['*'], //['https://foo.com', 'http://bar.com', 'http://baz.com:8081s']
  headers: ['uuid'] // sets expose-headers
}));
//Mapeia os valores recebidos via POST para 'req.params'
server.use(restify.bodyParser({
  mapParams: true
}));

//middleware chamado antes de todas as solicitações nas rotas
server.use(function(req, res, next) {
  //autenticação na API pode ser feita aqui;
  next();
})

//===================== DEFINIÇÃO DAS ROTAS ==============================
/*Documentação*/
server.get(/\/api\/docs\/current\/?.*/, restify.serveStatic({
  directory: './documentos/v1',
  default: 'index.html'
}));

/*central*/
server.get('/api/central', central.getAll);
server.get('/api/central/:id', central.getOne);
server.post('/api/central', central.createNew);

/*Alarmes*/
server.get('/api/alarme', alarme.getAll);
server.get('/api/alarme/ativos', alarme.getAtivos);
server.post('/api/alarme', alarme.createNew);
server.put('/api/alarme', alarme.update);

/*Leituras*/
server.post('/api/leitura', central.validateKey, function(req, res, next) {
  return res.send(200, {
    error: false,
    message: "OK"
  });
});


//===================== INÍCIO DO SERVIDOR ==============================
server.listen(8080, '127.0.0.1', function() {
  console.log('%s listening at %s', server.name, server.url);
});
