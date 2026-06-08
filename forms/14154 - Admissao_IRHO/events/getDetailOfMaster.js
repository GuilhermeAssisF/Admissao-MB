/**
 * M?todo para listar os filhos de um pai x filho
 * @param form: Refer?ncia da ficha
 * @param fields: Array dos campos que pertencem ao pai x filho
 * @returns {Array[][]} Array de String com as chaves e valores
 */
function getDetailOfMaster(fields, form) {
  var cardData = form.getCardData();
  if (cardData.keySet() == null) {
    return new Array();
  }
  var it = cardData.keySet().iterator();
  var listaFilho = new Array();
  var fieldTemp = fields[0];

  while (it.hasNext()) {
    var key = it.next();
    var campo = key.split("___");

    if (key.indexOf("___") >= 0 && campo[0] == fieldTemp) {
      var idx = campo[1];
      var row = new Object();

      for (var i = 0; i < fields.length; i++) {
        var name = fields[i] + "___" + idx;
        row[fields[i]] = { value: form.getValue(name), idx: idx, name: name };
      }
      listaFilho.push(row);
    }
  }
  return listaFilho;
}

/**
 * Habilita/Desabilita campo via evento do formul?rio.
 * Usar gera??o de enableFields.js via TotvsFormUtils
 * @param fields: Lista de campos que ser?o tratados
 * @param form: Refer?ncia da ficha
 * @param enable: true/false
 *
 * @deprecated
 */
function enableMasterDetailFields(fields, form, enable) {
  var fields = consultaDadosPaiFilho(fields, form);
  for (var i = 0; i < fields.length; i++) {
    form.setEnabled(fields[i].name, enable);
  }
}
