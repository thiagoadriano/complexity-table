/* global jQuery, ParseJSON */
/**
 * Classe para tratamento do JSON Vindo do server
 */
(function(w, $){		
	var ParseJSON = w.ParseJSON = function(){
		this.result = [];
		this.Heads = [];
		this.TotalHeads = 0;
	};
	
	ParseJSON.prototype.Uniq = function(prop){
		var temp = [],
			uniq = {},
			l = this.length,
			i = 0;
		for(; i < l; i++){
			if(uniq.hasOwnProperty(this[i][prop])) continue;
			uniq[this[i][prop]] = true;
			temp.push(this[i]);
		}
		return temp;
	};

	ParseJSON.prototype.parsePrepare = function(obj){
		var parse = JSON.parse(JSON.stringify(obj));

		for(var i = 0, l = parse.length; i < l; i++){
			var atual = parse[i];
			var objResult = this.checkInResult(atual); 
			if(objResult){
				objResult.children.push( this.MapObject(atual) );

			}else{
				this.result.push( this.MapIndicador(atual) );
			}
		}
	}; 

	ParseJSON.prototype.checkInResult = function(obj){
		for(var i in this.result){
			if(this.result[i].indicador === obj.indicador){
				return this.result[i];
			}
		}
		return false;
	}; 
	
	ParseJSON.prototype.MapObject =  function(objSrc){
		return {
			head: objSrc.painel,
			value: objSrc.status,
			group: objSrc.group
		};
	};
	
	ParseJSON.prototype.MapIndicador = function(obj){
		return {
			indicador: obj.indicador,
			children: []
		};	
	};

	ParseJSON.prototype.CheckHead = function(obj){
		var noInsert = true;
		this.Heads.forEach(function(el){
			if(el.group === obj.group){
				el.children.push(obj);
				noInsert = false;
				return;
			}
		});
		if(noInsert){
			this.Heads.push({
				group: obj.group,
				children: [obj]
			});	
		}
	};
	
	ParseJSON.prototype.MountHead = function(){
		var that = this;
		for(var i = 0, l = this.result.length; i < l; i++){
			var objAtual = this.result[i].children;
			
			objAtual.forEach(function(item){
				 that.CheckHead(item);
			});
		}
		this.formatHeadsUniq();
	};
	
	ParseJSON.prototype.Sort = function(array){
		
	};
	
	ParseJSON.prototype.countHead = function(){
		var that = this;
		this.Heads.forEach(function(el) {
		    that.TotalHeads += el.children.length;
		})	
	};

})(window, jQuery);

