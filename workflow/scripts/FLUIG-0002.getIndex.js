/**
 * Recupera os indices das linhas de um pai x filho.
 * 
 * @param fieldReference: id de um campo do pai x filho. Util para quando o formulario possui mais de um pai x filho.
 * @returns {java.util.TreeSet}: indice das linhas.
 */
function getIndexes(fieldReference){
	var regex = new RegExp(fieldReference+'___');
	var map = hAPI.getCardData(parseInt(getValue('WKNumProces')));
	var iterator = map.keySet().iterator();
	var indexes = new java.util.TreeSet();	
	
	while(iterator.hasNext()){
		var id = iterator.next();
		
		if(id.match(regex) == null) continue;
		else indexes.add(id.split('___')[1]);
	}
	
	return indexes;
}