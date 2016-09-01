'use strict';

const express = require('express'),
      App     = express(),
      PORT    = process.env.PORT,
      IP      = process.env.IP;
        
App.use(express.static(__dirname + "/public"));

App.get('/', (req, res) => {
    res.render('index.html');
});

App.get('/data/head', (req, res) => {
    let Heads = require('./model/heads_model');
    res.send(Heads);
});

App.get('/data/list', (req, res) => {
    let List = require('./model/mapaAlimentacao_model');
    res.send(List);
});

App.get('/data/list/parse', (req, res) => {
   let List = require('./model/mapaAlimentacao_model');
   let ParseCorrige = require("./controller/parse")
   res.send( ParseCorrige(List) );
});


App.listen(PORT, IP);