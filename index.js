'use strict';

const express = require('express'),
      App     = express(),
      PORT    = process.env.PORT;
        
App.use(express.static(__dirname + "/public"));

App.get('/', (req, res) => {
    res.render('index.html');
});

App.get('/data/head', (req, res) => {
    let Heads = require('./dados/heads_model');
    res.send(Heads);
});

App.get('/data/list', (req, res) => {
    let List = require('./dados/mapaAlimentacao_model');
    res.send(List);
});

App.listen(PORT);