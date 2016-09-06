/**
 * @class: ComplexityTable jQuery
 * @description: Classe para criação da tabela com cabeçalhos e dados dinamicos com congelamento do cabeçalho e colunas
 * @version: 1.0.2
 * @author: Thiago Adriano <thiago.s.adriano@gmail.com>
 * @copyright: Thiago Adriano ©2016
 * @license: MIT license
*/

//TODO: refatorar os metodos por conta de objetos nulos
//TODO: Corrigir cabeçalho sem grupo
//TODO: Fazzer ultima coluna rolar com scroll quando naõ existir coluna a direita fixa
//TODO: Ajustar para quando não tiver cabecalhos em grupo
//TODO: Finalizar o carregamento com scroll
//TODO: realizar o segundo cenário:
        //Duas linhas para cada indicador
        //Duas colunas fixas a esquerda
(function($) {
    'use strict';
    var CT = {};
    CT.existGroup = false;
    CT.Page = 1;
    CT.TotalRegistros = 0;
    CT.TotalPages = 0;
    CT.Params = "";
    CT.COlTotal = 0;
    CT.idContiner = null;
    CT.rowSpanData = false;
    var opt = {};

    var htmlTemplate =
        '<div class="ct-wrap">' +
            '<div class="ct-wraper">' +
                '<table>' +
                    '<thead></thead>' +
                    '<tbody></tbody>' +
                '</table>' +
            '</div>' +
        '</div>';

    var wrap = $(htmlTemplate),
        wraper = wrap.find(".ct-wraper"),
        table = wraper.find('table'),
        thead = table.find("thead"),
        tbody = table.find("tbody");


    /**
     * Configurações padrões do plugin
     *
     */
    var defaults = {
        urlDados: "",
        urlCabecalho: "",
        parametros: [],
        limite: 0,
        destacar: false,
        Tamanhos: {
            celula: {
                width: 95,
                height: 30
            },
            PrimeiraCelula: {
                width: 150,
                height: 30
            },
            UltimaCelula: {
                width: 150,
                height: 30
            }
        },
        container: {
            width: 900,
            height: 528
        },
        colFixedLeft: false,
        colTwoFixedLeft: false,
        colFixedRight: false,
        classes: {
            fixedLeft: "fixed-left",
            fixedRight: "fixed-right",
            fixedTwo : "fixed-two",
            fixedCol: "fixed-col",
            bgHeadColor: "head-bg-color",
            linhaPar: "odd-line",
            linhaImpar: "even-line",
            realce: "highlight",
            existeRealce: "hl-show"
        },
        nomePropriedades: {
            indicador: "indicador",
            valores: "status",
            registros: "totalRegistros",
            cabecalhos: "cabecalhos"
        },
        onClickLink: null
    };


    /**
     * Carrega os cabeçalhos da tabela
     * @param {string}url - Passa a url para chamada única de cabeçalhos na página
     * @param {function}callback - executa após completar a requisição
     */
    CT.getHead = function(url, callback) {
        $.ajax({
            url: url + CT.URLParams(),
            method: "GET",
            async: false,
            success: function(res) {
                if (CT.CheckIntegrityProperty(res, opt.nomePropriedades.cabecalhos) &&
                    CT.CheckIntegrityProperty(res, opt.nomePropriedades.registros)) {

                    CT.TotalRegistros = res[opt.nomePropriedades.registros];
                    CT.setTotalPages();
                    CT.checkExistGroup(res[opt.nomePropriedades.cabecalhos]);
                    callback(res[opt.nomePropriedades.cabecalhos]);
                }

            },
            error: function(err, e, w, r) {
                CT.ExceptionError("Erro inesperado aconteceu ao carregar as informações de cabeçalhos.<br>" + "<br>" + err.statusText + "<br>" + err.responseText).show();
                console.error(err);
                throw new Error(err.responseText);
            }
        });
    };

    /**
     * Faz o carregamento dos dados
     * @param {string} url - Caminho para buscar caminhos conforme requisições
     * @param {function} callback - chamada apóes requisição
     */
    CT.getData = function(url, callback) {
        $.ajax({
            url: url + CT.URLParams(),
            method: "GET",
            success: function(res) {
                CT.CheckFirstCellRowSpanData(res[0].status);
                callback(res);
            },
            error: function(err) {
                CT.ExceptionError("Erro inesperado aconteceu ao carregar as informações.<br>" + "<br>" + err.statusText + "<br>" + err.responseText).show();
                console.error(err);
                throw new Error(err.responseText);
            }
        });
    };

    /**
     * Correção dos parametros dependendo da existencia do limite
     * @return {string}
     */
    CT.URLParams = function() {
        if (opt.limite > 0) {
            return "?skip=" + opt.limite + "&page=" + CT.Page + CT.Params;
        }
        else {
            return "?" + CT.Params.replace(/^&/, '');
        }
    };

    /**
     * Verifica a existencia de paginação e quantas págins tera
     */
    CT.setTotalPages = function() {
        if (opt.limite > 0 && CT.TotalRegistros > 0) {
            CT.TotalPages = Math.ceil(CT.TotalRegistros / opt.limite);
        }
    };

    /**
     * Monta os parametros para serem usados na requisição dos dados
     */
    CT.mountParams = function() {
        if (CT.isArray(opt.parametros)) {
            opt.parametros.forEach(function(item) {
                for (var j in item) {
                    CT.Params += j + "=" + item[j] + "&";
                }
            });
            CT.Params = CT.Params.replace(/&$/, '').replace(/^(.*)/, "&$1");
        }
    };

    /**
     * Metodo para ajustar tamanho da tabela
     * @return {string}
     */
    CT.DefineTableWidth = function() {
        return ((opt.Tamanhos.celula.width * CT.COlTotal) + opt.Tamanhos.PrimeiraCelula + opt.Tamanhos.UltimaCelula) + "px";
    };

    /**
     * Faz a checagem do parametro passado para verificar se é um array
     * @param {Array} data  - Array de checagem
     * @return {Array|null}
     */
    CT.isArray = function(data) {
        if (Array.isArray(data) && data.length > 0) {
            return data;
        }
        return null;
    };

    /**
     * Checa se terá grupo de cabeçalho para montar com duas linhas
     * @param {Array} data - dados de carregamento do ajax
     * @return {boolean} - serve para parar o loop
     */
    CT.checkExistGroup = function(data) {
        if (CT.isArray(data)) {
            data.forEach(function(item) {
                if (item.grupo !== null && item.grupo.length) {
                    CT.existGroup = true;
                    return true;
                }
            });
        }
    };

    /**
     * Cria as linhas de cabeçalho
     * @param {Array} data - lista de cabeçalhos após requisição
     * @return {Array} - com as linhas tr preparadas
     */
    CT.createHead = function(data) {
        var trs = [],
            trHead = $('<tr/>');
        if (CT.existGroup) {
            var trGroup = $('<tr/>'),
                tamW = opt.Tamanhos.celula.width,
                tamH = opt.Tamanhos.celula.height,
                leftFirsCol = opt.colFixedLeft ? opt.Tamanhos.PrimeiraCelula.width : tamW,
                calcPrevGroup = 0;

            data.forEach(function(el, i, arr) {
                var th = $('<th/>');

                if (el.grupo !== null && el.grupo.length > 0) {
                    CT.HeadTreatment(th, el, tamW, tamH, leftFirsCol, calcPrevGroup, i);
                    trGroup.append(th);
                    CT.HeadSubGroup(el, trHead, tamW, tamH, th);
                    calcPrevGroup = parseInt(th.css("width"), 10) + parseInt(th.css("left"), 10);
                }
                else {
                    CT.MountHeadNoGroup(th, tamH, el, i, el.nome.value);
                    CT.ConfCheckLastCell(i, arr, th, calcPrevGroup);
                    CT.setFirstCellWidth(i, th);
                    trGroup.append(th);
                    CT.COlTotal++;
                }
            });

            trs.push(trGroup);
            trs.push(trHead);
        }
        else {
            data.forEach(function(el) {
                trHead.append("<th><span>" + el.nome.value + "</span></th>");
            });
            trs.push(trHead);
        }
        return trs;
    };

    /**
     * Tratamento para grupo de cabeçalhos
     * @param {object} th - Objeto jQuery com a celula atual do
     * @param {object} el - Elemento atual do array
     * @param {number} tamW - largura calculada da celula
     * @param {number} tamH - altura calculada da celula
     * @param {number} leftFirsCol - largura da primeira coluna
     * @param {number} calcPrevGroup - calculo para posicionamento do proximo grupo
     * @param {number} i - indice atual do array
     */
    CT.HeadTreatment = function(th, el, tamW, tamH, leftFirsCol, calcPrevGroup, i) {
        th.html("<span>" + el.nome.value + "</span>")
            .attr("colspan", el.grupo.length)
            .addClass(opt.classes.bgHeadColor)
            .css(CT.configCellGroup(el, tamW, tamH, leftFirsCol, calcPrevGroup, i));
        CT.MountLink(el.nome, th, el.nome.value);
    };

    /**
     * Monta e configura os filhos de um grupo
     * @param {object} el - Elemento atual do array
     * @param {object} trHead - Objeto jQuery com a linha do cabeçalho
     * @param {number} tamW - largura calculada da celula
     * @param {number} tamH - altura calculada da celula
     * @param {object} th - Objeto jQuery com a celula atual do cabeçalho
     */
    CT.HeadSubGroup = function(el, trHead, tamW, tamH, th) {
        el.grupo.forEach(function(item, j) {
            var th2l = $("<th><span>" + item.value + "</span></th>");
            th2l.css(CT.configCellChildrenGroup(tamW, tamH, th, j))
                .addClass(opt.classes.bgHeadColor);
            CT.MountLink(item, th2l, item.value);
            trHead.append(th2l);
            CT.COlTotal++;
        });
    };

    /**
     * Monta e configura a celula de cabeçalho sem grupo
     * @param {object} th - Objeto jQuery com a celula atual do cabeçalho
     * @param {number} tamH - altura calculada da celula
     * @param {object} el - Elemento atual do array
     * @param {number} i - indice do array
     * @param {string} indicador - nome do primeiro item da linha
     */
    CT.MountHeadNoGroup = function(th, tamH, el, i, indicador) {
        th.css(CT.configCellNoGroup(tamH, i))
            .html("<span>" + el.nome.value + "</span>")
            .addClass(opt.classes.bgHeadColor);

        if((i === 1 && opt.colTwoFixedLeft) || (i === 0 && opt.colFixedLeft)) th.addClass(opt.classes.fixedCol);
        CT.MountLink(el.nome, th, indicador);
    };

    /**
     * Função para corrigir array com valores faltantes em realção ao cabeçalho
     * @param {Array} arr - array atual do grupo
     *
     */
    CT.NormalizeArray = function(arr) {
        var totalColunasSemPrimeira = CT.COlTotal - 1;
        if (totalColunasSemPrimeira > arr.length) {
            var diff = totalColunasSemPrimeira - arr.length;
            for (var i = 0; i < diff; i++) {
                arr.push({
                    value: '--'
                });
            }
        }
        return arr;
    };

    /**
     * Seta o tamanho da primeira celula
     * @param {number} i - indice do array
     * @param {object} th - objeto da celula atual
     */
    CT.setFirstCellWidth = function(i, th) {
        if (i === 0 || (opt.colTwoFixedLeft && i === 1))
            th.css({
                width: i === 1 ? opt.Tamanhos.celula.width : opt.Tamanhos.PrimeiraCelula.width,
                left: i === 1 ? opt.Tamanhos.PrimeiraCelula.width * i : opt.Tamanhos.celula.width * i
            });

    };

    /**
     * Verifica existencia da ultima coluna se será fixa
     * @param {number} i - indice do array
     * @param {Array} arr - array de objetos jQuery
     * @param {object} th - objeto da  celula atual
     * @constructor
     */
    CT.ConfCheckLastCell = function(i, arr, th) {
        if (i === arr.length - 1) {
            if (opt.colFixedRight && i === arr.length - 1)
                th.css({
                    right: 0,
                    width: opt.Tamanhos.UltimaCelula.width
                }).addClass(opt.classes.fixedCol);
            else
                th.css({
                    left: (opt.Tamanhos.celula.width * CT.COlTotal) + (opt.Tamanhos.PrimeiraCelula.width - opt.Tamanhos.celula.width),
                    width: opt.Tamanhos.celula.width
                });
        }


    };

    /**
     * Configuração da celula sem grupo
     * @param {number} tamH - Altura da celula
     * @param {number} i - indice do array
     * @returns {object} - objeto de configuração
     */
    CT.configCellNoGroup = function(tamH, i) {
        return {
            width: i < 1 ? opt.Tamanhos.PrimeiraCelula.width : opt.Tamanhos.celula.width,
            height: CT.existGroup ? tamH * 2 : tamH,
            top: 0,
            zIndex: i < 1 ? 4 : 3
        };
    };

    /**
     * Configuração dos filhos do grupo de cabeçalho
     * @param {number} tamW - largura da celula
     * @param {number} tamH - altura da celula
     * @param {object} th - elemento jquery
     * @param j {number} - indice do array
     * @returns {{width: *, height: *, left: number, top: *}} - objeto com as configurações
     */
    CT.configCellChildrenGroup = function(tamW, tamH, th, j) {
        return {
            width: tamW,
            height: tamH,
            left: j > 0 ? parseInt(th.css("left")) + (opt.Tamanhos.celula.width * j) : th.css("left"),
            top: tamH
        };
    };

    /**
     * Configuração padrão da celula de grupo do cabeçalho
     * @param {object} el - Elemento html do array
     * @param {number} tamW - largura da celula
     * @param {number} tamH - altura da celula
     * @param {number} leftFirsCol - largura da primeira celula
     * @param {number} calcPrevGroup - numero de colunas do grupo anterior
     * @param {number} i - indice do array
     * @return {{width: *, height: *, left: number}} - objeto com as configurações
     */
    CT.configCellGroup = function(el, tamW, tamH, leftFirsCol, calcPrevGroup, i) {
        return {
            width: tamW * el.grupo.length,
            height: tamH,
            left: i === 1 && !opt.colTwoFixedLeft ? leftFirsCol * CT.COlTotal :
                    i === 2 && opt.colTwoFixedLeft ? leftFirsCol + tamW  : calcPrevGroup
        };
    };

    /**
     * Monta linha de cada elemento chamado na tabela
     * @param {Array} res - Lista de todos os elmentos para semrem inseridos
     * @return {object | string}
     */
    CT.creteLineData = function(res) {
        if (CT.isArray(res)) {
            var trs = [];
            res.forEach(function(item, i) {
                var jumpClasse = i % 2 === 0 ? opt.classes.linhaPar : opt.classes.linhaImpar;

                if(CT.rowSpanData){
                    var voltas = 0;
                   item.status.forEach(function(el){
                        var tr = $('<tr/>');
                        CT.HighlightEvent(tr);
                        CT.InsertCellFirstData(item, jumpClasse, tr, i, res, voltas);
                        CT.InsertValues(el, jumpClasse, tr, item[opt.nomePropriedades.indicador].value);
                        trs.push(tr);
                        voltas++;
                   });
                }else{
                   var tr = $('<tr/>');
                    CT.HighlightEvent(tr);
                    CT.InsertCellFirstData(item, jumpClasse, tr, i, res);
                    CT.InsertValues(item, jumpClasse, tr, item[opt.nomePropriedades.indicador].value);
                    trs.push(tr);
                }
            });
            return trs;
        }
        return [];
    };

    /**
     * Realiza a inserção da primeira celula dos dados
     * @param {string} item - item da coleção de valores
     * @param {string} jumpClasse - mudança na classe para cor de pulo de linha
     * @param {object} tr - linha atual da tabela
     * @param {number} i - indice do array
     * @param {array} arr - array de objetos
     */
    CT.InsertCellFirstData = function(item, jumpClasse, tr, i, arr, voltas) {
        if (CT.CheckIntegrityProperty(item, opt.nomePropriedades.indicador)) {
            var voltas = voltas || 0;
            var tdFirst = $('<td><span>' + item[opt.nomePropriedades.indicador].value + '</span></td>');
            CT.checkInsertLink(item, tdFirst, true, item[opt.nomePropriedades.indicador].value);
            if (opt.colFixedLeft) tdFirst.addClass(opt.classes.fixedLeft);
            if(CT.rowSpanData) tdFirst.attr('rowspan', 2);
            if(voltas > 0) tdFirst.css({visibility: "hidden", opacity: 0, top:0, zIndex: -1});
            tdFirst.css(CT.ConfigFirstCell(i, arr)).addClass(jumpClasse);
            tr.append(tdFirst);
        }
    };

    /**
     * Realiza a inserção dos demais valores do array
     * @param {string} item - item da coleção de valores
     * @param {string} jumpClasse - mudança na classe para cor de pulo de linha
     * @param {object} tr - linha atual da tabela
     */
    CT.InsertValues = function(item, jumpClasse, tr, indicador) {
        var list = $.isArray(item) ? item : item.status;
        list = CT.NormalizeArray(list);
        list.forEach(function(val, i, arr) {
            var tdval = $('<td><span>' + val.value + '</span></td>');
            CT.checkInsertLink(val, tdval, false, indicador);
            tdval.css(CT.ConfigCell()).addClass(jumpClasse);
            CT.setFixedCollineData(i, arr, tdval);
            CT.FixedTwoCol(tdval, i);
            tr.append(tdval);
        });

    };

    /**
     * Criar link quando o objeto tiver tal opção
     * @param {object} item - interação atual do array
     * @param {object} tdFirst - objeto jquery com a primeira celula
     *
     */
    CT.checkInsertLink = function(itemCol, tdFirst, firstCol, indicador) {
        var item = itemCol instanceof Object && !firstCol ? itemCol : firstCol ? itemCol[opt.nomePropriedades.indicador] : itemCol[opt.nomePropriedades.valores];
        if (Array.isArray(item)) {
            for (var i in item) {
                CT.MountLink(item[i], tdFirst, indicador);
            }
        }
        else {
            CT.MountLink(item, tdFirst, indicador);
        }
    };

    /**
     * Cria e monta os links dos valores
     * @param {object} item - elemento da coleção da matrix
     * @param {object} celula - elemento td atual
     * @param {string} indicador - nome do primeiro item da linha
     */
    CT.MountLink = function(item, celula, indicador) {
        if (item !== undefined && item.hasOwnProperty('link') && item.link !== "#" && item.link !== "" && !!opt.onClickLink) {
            var td = celula;
            var span = td.find('span');
            var text = span.text();
            var a = $('<a>' + text + '</a>');
            a.on('click', function(event){
                event.preventDefault();
                opt.onClickLink(event, opt.parametros, item.link, indicador);
            }).css({cursor: "pointer", textDecoration: "underline"});
            span.html('');
            span.append(a);


        }
    };

    /**
     * Seta a ultima coluna fixa das linhas de dados
     * @param {number} i - Indice atual do array
     * @param {Array} arr - Array de valores da linha
     * @param {object} tdval - objeto atual
     */
    CT.setFixedCollineData = function(i, arr, tdval) {
        if (opt.colFixedRight && i === arr.length - 1)
            tdval.addClass(opt.classes.fixedRight).css(CT.ConfigLastCell());
    };

    /**
     * Seta a segunda coluna fixa
     * @param {object} td - elemento jquery
     * @param {number} i - indice do array
     *
     */
    CT.FixedTwoCol = function(td, i){
        if(opt.colTwoFixedLeft && i === 0){
            td.addClass(opt.classes.fixedLeft).addClass(opt.classes.fixedTwo).css({left: opt.Tamanhos.PrimeiraCelula.width});
        }
    }

    /**
     * Configurações padrões da primeira celula
     * @param {number} i - Indice atual para calculo dos posições
     * @return {object} - configuração definida da celula
     * @param {array} arr - array de objetos
     */
    CT.ConfigFirstCell = function(i, arr) {
        return {
            height: CT.rowSpanData ? opt.Tamanhos.celula.height * 2 + 2: opt.Tamanhos.PrimeiraCelula.height,
            width: opt.Tamanhos.PrimeiraCelula.width,
            minWidth: opt.Tamanhos.PrimeiraCelula.width,
            maxWidth: opt.Tamanhos.PrimeiraCelula.width,
            top: (CT.rowSpanData ? (opt.Tamanhos.celula.height * 2) * i + i : opt.Tamanhos.celula.height * i) +
                 (CT.existGroup ? opt.Tamanhos.celula.height * 2 : opt.Tamanhos.celula.height) + i
        };
    };


    /**
     * Verifica se a primeira célula será dupla
     * @param {array} array - array de objetos
     *
     */
    CT.CheckFirstCellRowSpanData = function(array){
        if(array.length === 2 && Array.isArray(array[0])){
            CT.rowSpanData = true;
        }
    };

    /**
     * Tamanho da ultima célula fixa
     * @return {object}
     */
    CT.ConfigLastCell = function() {
        return {
            width: opt.Tamanhos.UltimaCelula.width,
            minWidth: opt.Tamanhos.UltimaCelula.width,
            maxWidth: opt.Tamanhos.UltimaCelula.width,
        };
    };

    /**
     * Configura as celulas com os dados
     * @return {object}
     */
    CT.ConfigCell = function() {
        return {
            height: opt.Tamanhos.celula.height,
            width: opt.Tamanhos.celula.width,
            maxWidth: opt.Tamanhos.celula.width,
            minWidth: opt.Tamanhos.celula.width
        };
    };

    /**
     * Montagem e inserção do cabeçalho
     * @param {object} el - Elemento html de chamada do componete
     * @param {function} callback - chamada de função pos processo
     */
    CT.insertHead = function(el, callback) {
        CT.getHead(opt.urlCabecalho, function(res) {

            CT.createHead(res).forEach(function(el) {
                thead.append($(el));
            });

            CT.getData(opt.urlDados, function(res) {
                CT.creteLineData(res).forEach(function(el) {
                    tbody.append(el);
                });
                callback(el);
            });
        });
    };

    /**
     * Metodo para ajustar as colunas fixas e linhas a se movimentarem
     *
     */
    CT.scrollEvent = function() {
        wraper.on('scroll', function(e) {
            var trs = tbody.find('tr'),
                fixedL = tbody.find('.' + opt.classes.fixedLeft),
                fixedR = tbody.find('.' + opt.classes.fixedRight),
                fixed2 = tbody.find('.' + opt.classes.fixedTwo),
                tds = trs.eq(0).find('td');
            var ths = thead.find('th').filter(function() {
                if (!$(this).hasClass(opt.classes.fixedCol)) return this;
            });
            var thCell = [];
            var thGroup = [];

            ths.filter(function() {
                if (!$(this).attr('colspan') && !$(this).hasClass(opt.classes.fixedCol))
                    thCell.push(this);
                else
                    thGroup.push(this);
            });

            var tempPosi = 1,
                totalGrupo = thGroup.length,
                grupoPercorrido = 0;

            trs.each(function(i, item) {
                var position = $(item).position();
                fixedL.eq( opt.colTwoFixedLeft ? i  * 2 : i ).css("top", position.top);
                fixedR.eq(i).css("top", position.top);
                if(opt.colTwoFixedLeft) fixed2.eq(i).css("top", position.top);
            });

            tds.each(function(i, item) {
                var move = opt.colTwoFixedLeft ? tds[i + 1 >= tds.length ? tds.length - 1 : i + 1] : item;
                var position = $(move).position();
                var id = i - 1 ;

                $(thCell).eq(id).css('left', position.left);

                if (i === tempPosi && grupoPercorrido < totalGrupo) {
                    $(thGroup).eq(grupoPercorrido).css('left', position.left);
                    tempPosi += parseInt($(thGroup).eq(grupoPercorrido).attr("colspan"));
                    grupoPercorrido++;
                }

            });

            CT.getDataScroll(e);

        });
    };

    /**
     * Carrega os dados conforme muda o scroll
     * @param {object} e - captura dos eventos do navegador
     */
    CT.getDataScroll = function(e) {
        //TODO: concluir comportamento de carregamento por scroll
        var temptr = table.find('tbody tr');
        var posiLasttr = temptr.eq(temptr.length - 1).offset().top;
        var posi = e.currentTarget.offsetTop + parseInt(wraper.height(), 10);
        if (opt.limite > 0 && posi >= posiLasttr && CT.Page <= CT.TotalPages) {
            CT.getData(opt.urlDados, function(res) {
                CT.Page++;
            });
        }
    };

    /**
     * Cria a ação de pintar a linha conforme clica
     * @param el
     * @constructor
     */
    CT.HighlightEvent = function(el) {
        if (opt.destacar) {
            el.addClass(opt.classes.existeRealce);
            el.on('click', function(e) {
                if(e.target.tagName.toLowerCase() !== "a"){
                    if ($(this).hasClass(opt.classes.realce)) {
                        $(this).removeClass(opt.classes.realce);
                    }
                    else {
                        $(this).addClass(opt.classes.realce);
                    }
                    
                    CT.lineHighligthRowSpan(e, $(this));
                }
            });
        }

    };
    
    
    
    /**
     * Caso tenha RowSpan realiza o higthlight na linha
     * @param {object} event - objeto de evento global do browser
     * @param {object} element - linha atual para tratamento
     */
     
     CT.lineHighligthRowSpan = function(event, element){
        if(CT.rowSpanData){
            var index = event.currentTarget.rowIndex - 2;
            var line = element.find("td").eq(0).css("visibility") === "visible" ? index + 1 : index - 1;
            var tr  = $('table tbody').find('tr');
            
            if (tr.eq(line).hasClass(opt.classes.realce)) {
                tr.eq(line).removeClass(opt.classes.realce);
            }
            else {
                tr.eq(line).addClass(opt.classes.realce);
            }
        }
     }


    /**
     * Fixa as configurações do container principal
     * @param {object} el - recebe o elemento this que chama o construtor
     */
    CT.MountPrincipalContainer = function(el) {
        $(el).css({
            position: "relative",
            width: opt.container.width,
            height: opt.container.height,
            marginLeft: "auto",
            marginRight: "auto"
        });
    };

    /**
     * Metodo para configurar tabela e inserir na página
     *
     */
    CT.MountTable = function(el) {
        CT.MountContainer();
        table.css({
            width: CT.DefineTableWidth()
        });
        el.append(wrap);
        CT.Loading().hide();
        CT.Alert("Dados carregados com sucesso!", 1).showInterval(2000);
    };

    /**
     * Monta o container que recebe a tabela
     *
     */
    CT.MountContainer = function() {
        var heightGroup = !CT.existGroup ? opt.Tamanhos.celula.height : opt.Tamanhos.celula.height * 2;
        var widthPadding = !opt.colFixedLeft ? 0 : opt.Tamanhos.PrimeiraCelula.width;
        var widthfixColRigth = !opt.colFixedRight ? 0 : opt.Tamanhos.UltimaCelula.width;

        wrap.css({
            width: opt.colTwoFixedLeft ? (opt.container.width - widthPadding) - opt.Tamanhos.celula.width : opt.container.width - widthPadding,
            height: opt.container.height - heightGroup,
            paddingLeft: opt.colTwoFixedLeft ? widthPadding + opt.Tamanhos.celula.width : widthPadding,
            paddingTop: heightGroup,
            background: opt.corCabecalho
        });
        wraper.css({
            width: opt.colTwoFixedLeft ? (opt.container.width - (widthPadding + widthfixColRigth)) - opt.Tamanhos.celula.width :
                    opt.container.width - (widthPadding + widthfixColRigth),
            height: opt.container.height - heightGroup
        });
    };

    /**
     * Imagem de load do carregamento
     * @return {object} funções de apoio para visualizar e retirar a mensagem
     */
    CT.Loading = function(el) {
        var template = $("<div class='ct-loader'><p>Aguarde, Carregando...</p></div>");
        return {
            show: function() {
                $(el).append(template);
            },
            hide: function() {
                $(".ct-loader").fadeOut("1000", function() {
                    $(this).remove();
                });
            }
        };
    };

    /**
     * Colocar exceção na tela com erro informando ao usuário o procedimento
     * @param {string} msg - mensagem da exceção
     */
    CT.ExceptionError = function(msg) {
        var template = $("<div id='ct-exception'><h2>Erro na aplicação</h2><p></p></div>");
        var p = template.find('p');
        p.html(msg);
        return {
            show: function() {
                $("#" + CT.idContiner).find('div').remove();
                $("#" + CT.idContiner).html('');
                $("#" + CT.idContiner).append(template);
            },
            hide: function() {
                $("#ct-exception").fadeOut("1000", function() {
                    $(this).remove();
                });
            }
        };
    };

    /**
     * Alerta para eventos durante o processo
     * @param {string} name - recebe a mensagem para passar no alerta
     * @param {number} type - seleção do tipo de mensagem:
     * @param {number} type == 1 - comportamento de layout de mensagem de sucesso
     * @param {number} type == 2 - comportamento de layout de mensagem de alerta tipo warning
     * @param {number} default type  - comportamento de layout de mensagem de erro
     * @return {object} - retorna as funções de controle
     * @return {function} object.show
     * @return {function} object.close
     * @return {function} object.showInterval
     */
    CT.Alert = function(msg, type) {
        var typeEvent = type === 1 ? "ct-success" : type === 2 ? "ct-warning" : "ct-error";
        var id = "ct-info";
        var template = $('<div id="' + id + '" class="' + typeEvent + '" >' +
            '<button type="button">X</button>' +
            '<p></p>' +
            '</div>');
        var p = template.find('p');
        var button = template.find('button');
        var txtMsg = msg !== null && msg !== "" && msg !== undefined ? msg : "Erro ao realizar o procedimento.";

        p.text(txtMsg);

        var clicked = function() {
            button.on('click', function() {
                _close();
            });
        };

        var _show = function() {
            if ($("#" + id).is(':visible')) $("#" + id).remove();
            clicked();
            $('body').append(template);
        };

        var _close = function() {
            $("#" + id).fadeOut(800, function() {
                $(this).remove();
            });
        };

        var _showInterval = function(time) {
            var timer = time || 5000;
            _show();
            setTimeout(_close, timer);
        };

        return {
            show: _show,
            close: _close,
            showInterval: _showInterval
        };
    };

    /**
     * Metodo para iniciar o componente
     *
     */
    CT.Init = function() {
        var that = this;
        CT.Loading(that).show();
        CT.mountParams(opt.parametros);
        CT.insertHead(that, CT.MountTable);
        CT.scrollEvent();
    };

    /**
     * Metodo que verifica configurações primárias para aplicação
     * @return {boolean}
     */
    CT.BuildStartCheck = function() {
        if (!opt.urlCabecalho && opt.urlCabecalho === "") {
            CT.Alert("A URL para buscar os  cabecalhos a serem inseridos não foi informada.", 2).show();
            throw new Error("Necessário informar url para buscar os cabeçalhos");
        }

        if (!opt.urlDados && opt.urlDados === "") {
            CT.Alert("A URL para buscar os valores a serem inseridos não foi informada.", 2).show();
            throw new Error("Necessário informar url para buscar os dados");

        }

        if(opt.colTwoFixedLeft && !opt.colFixedLeft) opt.colFixedLeft = true;

        return true;
    };

    /**
     * Checa a integridade dos campos/propriedades do objeto
     * @param {object} data - Objeto para teste
     * @param {string} prop - nome da propriedade
     * @returns {boolean} - caso passe
     * @constructor
     */
    CT.CheckIntegrityProperty = function(data, prop) {
        try {
            if (!data.hasOwnProperty(prop)) {
                throw new Error("A propriedade: <strong>" + prop + "</strong>, não faz parte dos dados. <br>" + JSON.stringify(data));
            }
        }
        catch (e) {
            CT.ExceptionError("Os dados possuem inconsistência<br><br>" + e).show();
            console.error(e);
        }
        return true;
    };

    /**
     * Construtor do plugin jQuery
     * @param {object} options - Configurações para utilização do plugin
     * @returns {object} $.fn.ComplexityTable
     * @constructor
     */
    $.fn.ComplexityTable = function(options) {
        var that = this;
        opt = $.extend(defaults, options);

        try {
            if (CT.BuildStartCheck()) {
                CT.idContiner = that.attr("id");
                CT.MountPrincipalContainer(that);
                CT.Init.call(that);
            }

        }
        catch (err) {
            console.error(err);
        }

        return this;
    };
})(jQuery);