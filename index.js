'use strict';

const express = require('express'),
      App     = express(),
      PORT    = process.env.PORT,
      IP      = process.env.IP;


let ParseCorrige = require("./controller/parse")
        
App.use(express.static(__dirname + "/public"));


App.get('/', (req, res) => {
    res.render('index.html');
});


App.get('/data/head', (req, res) => {
    let Heads = require('./model/heads_model');
    res.send(Heads);
});

App.get('/data/head/mes', (req, res) => {
    let Heads = require('./model/heads_mes_model');
    res.send(Heads);
});

App.get('/data/list', (req, res) => {
    let List = require('./model/mapaAlimentacao_model');
    res.send(List);
});

App.get('/data/list/parse', (req, res) => {
   let List = require('./model/mapaAlimentacao_model');
   res.send( ParseCorrige(List) );
});

App.get('/data/list/mes', (req, res) => {
    let List = require("./model/mes_model");
    res.send( (List) );
}); 

App.listen(PORT, IP);