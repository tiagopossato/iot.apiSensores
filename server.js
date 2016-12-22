var restify = require('restify');
var fs = require('fs');
var central = require('./controls/CentralController');

//===================== CRIAÇÃO DO SERVIDOR ==============================
var server = restify.createServer({
  certificate: fs.readFileSync('certificados/server.crt'),
  key: fs.readFileSync('certificados/server.key'),
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
/*central*/
server.get('/central', central.getAll);
server.get('/central/:id', central.getOne);
server.post('/central', central.createNew);

/*Leituras*/
server.post('/leitura', central.validateKey, function(req, res, next) {
  return res.send(200, {
    error: false,
    message: "OK!"
  });
});

//===================== INÍCIO DO SERVIDOR ==============================
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

//
// var server2 = restify.createServer({
//   name: 'server 2'
// });
// server2.get('/hello/:name', function(req, res, next) {
//     res.send(req.params);
// });
// server2.listen(8081, function() {
//     console.log('%s listening at %s', server2.name, server2.url);
// });
