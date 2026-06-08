function VerifHierarquia(){
	var codGestor = hAPI.getCardValue('codGestor');
	var codDiretor = hAPI.getCardValue('codDiretor');
	var Solicitante = hAPI.getCardValue('cpLoginFluig');
	var retorno;
	
	if(codDiretor==Solicitante || codGestor==Solicitante){
		retorno=1;
	}else{
		retorno=3;
	}
	return retorno;
}

function Abertura(){

    var cpLoginFluig = hAPI.getCardValue('cpLoginFluig');
    var codGestorDestino = hAPI.getCardValue('codGestorDestino');
    var codGestorOrigem = hAPI.getCardValue('codGestorOrigem');
    var codDiretorOrigem = hAPI.getCardValue('codDiretorOrigem'); 
    
		if(cpLoginFluig!=codGestor &&  cpLoginFluig!=codDiretor!=""){
			retorno="GO";
			//passa gestor origem
		}
		if(cpLoginFluig==codGestor &&  cpLoginFluig!=codDiretor && codDiretor!=""){
			retorno="DO";
			//passa diretor origem
		}
		if(cpLoginFluig==codGestor &&  (cpLoginFluig==codDiretor || codDiretor=="") && CodNovaSecao!=""){
			retorno="GD";
			//passa gestor destino
		}
		if(cpLoginFluig==codGestor &&  (cpLoginFluig==codDiretor || codDiretor=="") && CodNovaSecao==""){
			retorno="RH";
			//passa RH
		}
}

function AprovaDiretor(){
	var Aprovacao = hAPI.getCardValue('cpAprovacaoDiretor');
	
	if(AprovacaoGestor=="1"){
		return true;
	}else{
		return false;
	}
}

function AprovaRH(){
	var Aprovacao = hAPI.getCardValue('cpAprovacaoRH');
	
	if(AprovacaoGestor=="1"){
		return true;
	}else{
		return false;
	}
}

function AprovaKit(){
	var Aprovacao = hAPI.getCardValue('cpAprovacaoKit');

	if(AprovacaoGestor=="1"){
		return true;
	}else{
		return false;
	}
}