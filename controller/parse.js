'use strict';
const linksPossiveis = require("../model/linksPossiveis");

let arrayRandomLink = function(arrayLinks){
    var indice = Math.floor( Math.random() * arrayLinks.length);
    return arrayLinks[indice];
};

let ParseCorrige = function(arr){
    var listResult = [];
    for(var a = 0; a < arr.length; a++){
        var objResul = {};
        var arrayValResults = [];
        for(var i in arr[a]){
            if(i === "indicador"){
                objResul[i] = {link: arrayRandomLink(linksPossiveis), value: arr[a][i]};
            }else if( Array.isArray(arr[a][i]) ){
                for(var j in arr[a][i]){
                    arrayValResults.push( { link: arr[a][i][j] === "N/A" ? "#" : arrayRandomLink(linksPossiveis), value: arr[a][i][j] } );
                }
                objResul[i] = arrayValResults;
            }
        }
        listResult.push(objResul);
    }
    return listResult;
};

module.exports = ParseCorrige;
