(function(w, $){
	/**
	 * Classe para leitura dos dados retornados por json 
	 * @project PDE2
	 * @author Thiago Adriano<thiago.s.adriano@gmail.com>
	 * @version 0.0.1
	 * @namespace ParseData
	 * @param {Array} Lista de objetos com os dados vindo de um ajax 
	 */
	//{urlHead: "", urlData: "", Parameters: [{param: "", dataParam: ""}]
	var ParseData = w.ParseData = function(url, method, []){
		this.url = url;
		this.method = method;
		this.dados = null;
		this.indicadores = [];
		this.paineis = [];
		this.status = [];
		
		try{
			if(!$) throw new Error("Necessário carregamento da biblioteca jQuery");
			this.Request();	
		}catch(e){
			console.error(e);
		}
		
		
	};
	
	
	ParseData.version = '0.0.1';
	
	/**
	 * Realiza a requisição na instanciação do objeto
	 *
	 */
	ParseData.prototype.Request = function(){
		var that = this;
		$.ajax({
			url: this.url,
			method: this.method,
			success: function(data){
				if(Array.isArray(data) && data.length > 0){
					that.dados = data;
				}
				alert("Carregou");
			},
			erro: function(err){
				console.error("Não foi possível executar o carregamento: " + err);
				alert("Deu merda");
			}
		});
	}
	
	/**
	 * Mapeia os cabeçalhos informados no objeto
	 *
	 */
	ParseData.prototype.parseHeads = function(){
		return [

		];
	};

	/**
	 * Retorna o grupo total de cabeçalhos
	 * @return {Array}
	 */
	 
	ParseData.prototype.AllHeads = function(){
		return [];
	};
	
	/**
	 * Informa se terá cabeçalho com gurpos
	 * @return {Boolean}
	 */
	ParseData.prototype.isGroupHead = function(){
		
	};


	return ParseData;
})(window || {}, jQuery);