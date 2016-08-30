/**
 * @classe: CreateTable
 * @description: Classe para criação da tabela com cabeçalhos e dados dinamicos
 *				 com congelamento do cabeçalho e colunas 
 * @version: 0.0.1
 * 
*/
(function($){
	var CT = {};
	CT.existGroup = false;
	CT.Page = 1;
	CT.Params = "";
	CT.COlTotal = 0;
	CT.debug = true;
	
	var opt = {};
	
	var htmlTemplate = '<div class="ct-wrap">'+
						'<div class="ct-wraper">'+
							'<table>'+
								'<thead></thead>'+
								'<tbody></tbody>'+
							'</table>'+
						'</div>'+
					  '</div>';
					  
	var wrap   = $(htmlTemplate),
		wraper = wrap.find(".ct-wraper"),
		table  = wraper.find('table'),
		thead  = table.find("thead"),
		tbody  = table.find("tbody");
			

	/**
	 * Configurações padrões do plugin
	 *
	 */	
	var defaults = {
		urlDados: "",
		urlCabecalho: "",
		parametros: [],
		limite: 10,
		CorLinha: {par: "#f7f7f7", impar: "#e2e2e2"},
		corCabecalho: "#023646",
		Tamanhos: {
			celula: { width: 95, height: 30}, 
			PrimeiraCelula: { width: 150, height: 30},
			UltimaCelula: { width: 150, height: 30},
		},
		container: {
			width: 900,
			height: 528
		},
		colFixedLeft:  false,
		colFixedRight: false,
		classes: {
			fixedLeft: "fixed-left",
			fixedRight: "fixed-right",
			fixedCol: "fixed-col"
		}
	};
	
	
	/**
	 * Log Debug da construção da aplicação
	 *
	 */
	 var log = function(msg){
	 	if(CT.debug){
	 		console.log("[Inicio:]");
 	 		console.log("[" + new Date() + "]");
	 		console.debug("[" + msg + "]");
	 		console.log("[Fim!]");
	 		console.log("[" + new Date() + "]");
	 	}
	 };
	 var assert = function(test, msg){
	 	if(CT.debug){
	 		console.log("[Inicio:]");
	 		console.log("[" + new Date() + "]");
	 		console.assert(test, msg);
	 		console.log("[Fim!]");
	 		console.log("[" + new Date() + "]");
	 	}
	 }
	
	/**
	 * Carrega os cabeçalhos da tabela
	 * @param <string>url - Passa a url para chamada única de cabeçalhos na página
	 * @param <function>callback - executa após completar a requisição
	 */
	CT.getHead = function(url, callback){
		log("Carregado dados do Cabeçalho");
		$.ajax({
			url: url,
			method: "GET",
			async: false,
			success: function(res){
				log("Dados Carregados!")
				CT.checkExistGroup(res);
				callback(res);
			},
			error: function(err){
				throw new Error("Erro ao relizar o carregamento dos Cabeçalhos: " + err);
			}
		});
	};
	
	/**
	 * Faz o carregamento dos dados
	 * @param <string> url - Caminho para buscar caminhos conforme requisições
	 * @param <function> callback - chamada apóes requisição
	 */
	CT.getData = function(url, callback){
		log("Carregando dados das linhas")
		$.ajax({
			url: url + "?skip=" +  opt.limite + "&page=" +  CT.Page + CT.Params,
			method: "GET",
			success: function(res){
				log("dados carregados")
				if(callback) callback(res);
			},
			error: function(err){
				throw new Error("Erro ao relizar o carregamento dos dados: " + err);
			}
		});
	};
	
	/**
	 * Monta os parametros para serem usados na requisição dos dados
	 * @param <array> params - lista de parametros adicionados nas configurações padrões do plugin
	 */
	CT.mountParams = function(){
		if(CT.isArray(opt.parametros)){
			opt.parametros.forEach(function(item){
				CT.Params += item.nome + "=" + item.valor + "&";	
			});
			CT.Params = CT.Params.replace(/&$/, '').replace(/^(.*)/, "&$1");
		}
	};
	
	/**
	 * Metodo para ajustar tamanho da tabela
	 * @return <string>
	 */
	CT.DefineTableWidth = function(){
		return ((opt.Tamanhos.celula.width  * CT.COlTotal) + opt.Tamanhos.PrimeiraCelula + opt.Tamanhos.UltimaCelula ) + "px";
	};
	
	/**
	 * Faz a checagem do parametro passado para verificar se é um array
	 * @param <array> data
	 * @return <array|null>
	 */
	CT.isArray = function(data){
		if(Array.isArray(data) && data.length > 0){
			return data;
		}
		return null
	};
	
	/**
	 * Checa se terá grupo de cabeçalho para montar com duas linhas
	 * @param <array> data
	 * @return <boolean> - serve para parar o loop
	 */
	CT.checkExistGroup = function(data){
		assert(Array.isArray(data), "Dados do Cabeçalho é Array");
		log("Iniciando checagem dos grupos");
		log("Exiset dados no array: " + data.length);
		if(CT.isArray(data)){
			data.some(function(item){
				if(item.grupo.length){
					CT.existGroup = true;
					return true;	
				} 
			});
		}
	};
	
	/**
	 * Cria as linhas de cabeçalho
	 * @param <array> data - lista de cabeçalhos após requisição
	 * @return <array> - com as linhas tr preparadas
	 */
	CT.createHead = function(data){
		var trs = [];
		if(CT.existGroup){
			var trGroup = $('<tr/>');
			var trHead  = $('<tr/>');
			var tamW = opt.Tamanhos.celula.width;
			var tamH = opt.Tamanhos.celula.height;
			var leftFirsCol = opt.colFixedLeft ? opt.Tamanhos.PrimeiraCelula.width : tamW ;
			var calcPrevGroup = 0;
			
			data.forEach(function(el, i, arr){
				var th  = $('<th/>');
				if(el.grupo.length){
					log("Colunas inicio da linha: " + CT.COlTotal);
					th.html("<span>" + el.nome + "</span>");
					th.attr("colspan", el.grupo.length);
					th.css({
						width: tamW * el.grupo.length,
						height: tamH,
						left: i === 1 ? leftFirsCol * CT.COlTotal : calcPrevGroup,
						background: opt.corCabecalho
					});
					
					trGroup.append(th);
					
					el.grupo.forEach(function(item, j){
						var th2l = $("<th><span>"+item+"</span></th>");
						th2l.css({
							width: tamW, 
							height: tamH, 
							left: j > 0 ? parseInt(th.css("left")) + (opt.Tamanhos.celula.width * j) : th.css("left"), 
							top: tamH,
							background: opt.corCabecalho
						});
						trHead.append(th2l);
						CT.COlTotal++;
						log("Colunas no foreach do grupo: " + CT.COlTotal);
					});
					calcPrevGroup = parseInt(th.css("width")) +  parseInt(th.css("left"));
				} 
				else {
					th.css({
						width: opt.Tamanhos.PrimeiraCelula.width, 
						height: CT.existGroup ? tamH * 2 : tamH, 
						top: 0,
						zIndex: 3,
						background: opt.corCabecalho
					});
					(opt.colFixedRight && i === arr.length - 1 ? th.css({right: 0, wdth: opt.Tamanhos.UltimaCelula.width}) : th.css({left: tamW * i}));
					if(i === 0) th.css({wdth: opt.Tamanhos.PrimeiraCelula.width});
					th.html("<span>" + el.nome + "</span>");
					th.addClass(opt.classes.fixedCol);
					trGroup.append(th);
					CT.COlTotal++;
					log("Colunas caso não exista grupo: " + CT.COlTotal);
				}
			});
			
			trs.push(trGroup);
			trs.push(trHead);
		}else{
			data.forEach(function(el){
				trHead.append("<th><span>"+el.nome+"</span></th>");
			});
			trs.push(trHead);
		}
		return trs;
	};
	
	/**
	 * Metodo para posicionar grupo dos cabeçalhos
	 *
	 */
	 CT.positionGrupoHead = function(){
	 	
	 };
	
	
	/**
	 * Monta linha de cada elemento chamado na tabela
	 * @param <array> res - Lista de todos os elmentos para semrem inseridos
	 * @return <object type jQuery | string>
	 */
	 CT.creteLineData = function(res){
		if(CT.isArray(res)){
			var trs = [];
			res.forEach(function(item, i){
				var cor = i % 2 === 0 ? opt.CorLinha.par : opt.CorLinha.impar;
				var tr = $('<tr/>');
				var tdFirst = $('<td><span>' + item.indicador + '</span></td>');
				
				if(opt.colFixedLeft) tdFirst.addClass(opt.classes.fixedLeft);
				
				tdFirst.css( CT.ConfigFirstCell(i, cor) );
				tr.append(tdFirst);
	
				item.values.forEach(function(val, i, arr){
					var tdval = $('<td><span>'+ val +'</span></td>');
					tdval.css( CT.ConfigCell(cor) );
					tr.append(tdval);
					
					if(opt.colFixedRight && i === arr.length - 1) tdval.addClass(opt.classes.fixedRight).css( CT.ConfigLastCell() );
				});
				trs.push(tr);
			});
			return trs;
		}
		return '';
	 };
	
	
	/**
	 * Configurações padrões da primeira celula
	 * @param <number> i - Indice atual para calculo dos posições
	 * @param <string> bgColor - Recebe o hexadecimal da cor de background
	 * @return <object> - configuração definida da celula
	 */
	CT.ConfigFirstCell = function(i, bgColor){
		return {
			background: bgColor, 
			height: opt.Tamanhos.PrimeiraCelula.height, 
			width: opt.Tamanhos.PrimeiraCelula.width,
			minWidth: opt.Tamanhos.PrimeiraCelula.width,
			maxWidth: opt.Tamanhos.PrimeiraCelula.width,
			top: (opt.Tamanhos.celula.height * i) + (CT.existGroup ?  opt.Tamanhos.celula.height * 2 : opt.Tamanhos.celula.height) + i,
		};
	};
	
	
	/**
	 * Tamanho da ultima célula fixa
	 * @return <object>
	 */
	 CT.ConfigLastCell = function(){
	 	return {
	 		width: opt.Tamanhos.UltimaCelula.width,
			minWidth: opt.Tamanhos.UltimaCelula.width,
			maxWidth: opt.Tamanhos.UltimaCelula.width,
	 	};
	 };
	
	/**
	 * Configura as celulas com os dados
	 * @param <string> bgColor - Recebe o hexadecimal da cor de background
	 * @return <object>
	 */
	CT.ConfigCell = function(bgColor){
		return {
			background: bgColor, 
			height: opt.Tamanhos.celula.height, 
			width: opt.Tamanhos.celula.width,
			maxWidth: opt.Tamanhos.celula.width,
			minWidth: opt.Tamanhos.celula.width
		};
	};
	
	/**
	 * Montagem e inserção do cabeçalho
	 * @param <object> opt - objeto contendo as configurações do componente
	 * @param <object type jQuery> el - Elemento html de chamada do componete
	 */
	 CT.insertHead = function(el, callback){
		CT.getHead(opt.urlCabecalho, function(res){
			
			CT.createHead(res).forEach(function(el) {
			    thead.append($(el));
			});
			
			CT.getData(opt.urlDados, function(res){
				CT.creteLineData(res).forEach(function(el){
					tbody.append( el );
				});
				callback(el);
			});
		});	
	 };
	 
	 
	 /**
	  * Metodo para ajustar as colunas fixas e linhas a se movimentarem
	  *
	  */
	 CT.scrollEvent = function(){
  		
	  	wraper.on('scroll', function(e){
	  		var trs = tbody.find('tr');
	  		var fixedL = tbody.find('.' + opt.classes.fixedLeft);
	  		var fixedR = tbody.find('.' + opt.classes.fixedRight);
	  		var tds = trs.eq(0).find('td');
	  		var ths = thead.find('th').filter(function(){
	  			if( !$(this).hasClass(opt.classes.fixedCol) ) return this;
	  		});
	  		var thCell = ths.filter(function(){
	  			if( !$(this).attr('colspan') ) return this;
	  		});
	  		var thGroup = ths.filter(function(){
	  			if( $(this).attr('colspan') ) return this;
	  		});
	  		
	  		trs.each(function(i, item){
	  			var position = $(item).position();
	  			fixedL.eq(i).css("top", position.top);
	  			fixedR.eq(i).css("top", position.top);
	  		});
	  		
	  		tds.each(function(i,item){
	  			var position = $(item).position();
	  			var id = i - 1;
	  			var tempPosi = 0;
	  			
	  			$(thCell).eq(id).css('left', position.left);
	  			
	  			thGroup.each(function(j, item){
	  				if(id === tempPosi-1){
  						$(thGroup).eq(j).css('left', position.left);
  						tempPosi += parseInt($(thGroup).eq(j).attr("colspan"));
	  				}
	  				
	  			});
	  			
	  			// if( id === 0  || id === 4 || id === 8)
	  			// 	$(thGroup).eq(id === 0 ? 0 : id === 4 ? 1 : 2).css('left', position.left);
	  		});
	  		
	  	});
	  };
	
	/**
	 * Metodo para configurar tabela e inserir na página
	 *
	 */
	 CT.MountTable = function(el){
	 	CT.MountContainer();
		table.css({ width: CT.DefineTableWidth() });
		el.append(wrap);
	 };
	 
	 /**
	  * Monta o container que recebe a tabela
	  *
	  */
	 CT.MountContainer = function(){
	 	var heightGroup = !CT.existGroup ? opt.Tamanhos.celula.height : opt.Tamanhos.celula.height * 2;
	 	var widthPadding = !opt.colFixedLeft ? 0 : opt.Tamanhos.PrimeiraCelula.width;
	 	wrap.css({
	 		width: opt.container.width,
	 		height: opt.container.height,
	 		paddingLeft: widthPadding,
	 		paddingTop: heightGroup,
	 		background: opt.corCabecalho
	 	});
	 	wraper.css({
	 		width: opt.container.width - widthPadding,
	 		height: opt.container.height
	 	});
	 };
	
	/**
	 * Metodo para iniciar o componente
	 *
	 */
	CT.Init = function(){
		var that = this;
		CT.mountParams(opt.parametros);
		CT.insertHead(that, CT.MountTable);
		CT.scrollEvent();
	};
	
	/**
	 * Metodo que verifica configurações primárias para aplicação
	 * @return <boolean>
	 */
	 CT.BuildStartCheck = function(){
	 	if(!opt.urlDados && opt.urlDados !== "") throw new Error("Necessário informar url para buscar os dados");
	 	if(!opt.urlCabecalho && opt.urlCabecalho !== "") throw new Error("Necessário informar url para buscar os cabeçalhos");
	 	return true;
	 	
	 };
	
	$.fn.CreateTable = function(options){
		var that = this;
		opt = $.extend(defaults, options);
		
		try{
			if(CT.BuildStartCheck()){
				CT.Init.call(that);
			}
		}catch(err){
			console.error(err);
		}
		
		return this;
	};
})(jQuery);
