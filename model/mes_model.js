'use strict';
let meses =[
  {"indicador": "IQGoperação", "status": ["mês anterior", "EE", "EE", "EE", "EE", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "A"]},
  {"indicador": "IQGoperação", "status": ["mês atual",  "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "NA"]},
  {"indicador": "IEFP", "status": ["mês anterior", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "AR"]},
  {"indicador": "IEFP", "status": ["mês atual", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "IEC", "status": ["mês anterior", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "IEC", "status": ["mês atual", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "IRIF", "status": ["mês anterior", "EE", "N/A", "N/A", "EE", "N/A", "EE", "N/A", "EE", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "EE", "EE", "N/A"]},
  {"indicador": "IEPoperação", "status": ["mês atual", "EE", "N/A", "N/A", "EE", "N/A", "EE", "N/A", "EE", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "EE", "EE", "N/A"]},
  {"indicador": "IEPoperação", "status": ["mês anterior", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "AA"]},
  {"indicador": "TPerf C1 (0 - 500 m)", "status": ["mês atual", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "TPerf C1 (0 - 500 m)", "status": ["mês anterior", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "GOG (US$)", "status": ["mês atual", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "AA"]},
  {"indicador": "GOG (US$)", "status": ["mês anterior", "EE", "EE", "EE", "EE", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "IROI - MM US$", "status": ["mês atual", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "IROI - MM US$", "status": ["mês anterior", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "GOG", "status": ["mês atual", "EE", "EE", "EE", "EE", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "GOG", "status": ["mês anterior", "EE", "N/A", "N/A", "EE", "N/A", "EE", "N/A", "EE", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "EE", "EE", "N/A"]},
  {"indicador": "IPAP", "status": ["mês atual", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "IPAP", "status": ["mês anterior", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "Tperf Presal Extra-BS", "status": ["mês atual", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "Tperf Presal Extra-BS", "status": ["mês anterior", "N/A", "N/A", "N/A", "N/A", "A", "N/A", "A", "A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]},
  {"indicador": "PROCOP", "status": ["mês atual", "EE", "N/A", "N/A", "EE", "N/A", "EE", "N/A", "EE", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "EE", "EE", "N/A"]},
 ];

module.exports = [{"indicador": {"link": "#","value": "IQGoperação"}, 
  "status": [
      [{"link": "#", "value": "mês anterior"}, {"link": "#", "value": "EE"}, {"link": "#", "value": "EE"}, {"link": "#", "value": "EE"}, {"link": "#", "value": "EE"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "A"}],
      [{"link": "#", "value": "mês atual"},  {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "A"}, {"link": "#", "value": "A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}, {"link": "#", "value": "N/A"}]
    ]
}];




