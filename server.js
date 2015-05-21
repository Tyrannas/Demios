
var express  = require('express');
var app = express(),
    server = require('http').createServer(app);
var neo4j = require('neo4j');
var queries = require ('./queries.js');
//var neo4js = require('./neo4js.js')
var io = require('socket.io').listen(server);
var db = new neo4j.GraphDatabase('http://neo4j:Lesbubulles24@localhost:7474');

 app.use("/public", express.static(__dirname + '/public'));
// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/main.html');
});

var test = [];
test = queries.findNode('a');

io.sockets.on('connection', function (socket) {
    console.log('coucou');
    socket.on('devNode',function(oData){
        console.log('oh, une requete');
        queries.devNode(oData.m1);
    });
    socket.on('addRel',function(oData){
        console.log('oh, une requete complexe');
        queries.addRelation(oData.m1,oData.m2,oData.r);
        console.log('gg!');
    });
});
server.listen(8080);