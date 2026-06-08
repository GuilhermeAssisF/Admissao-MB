var BSE_FIM_APROVADO = 74;

function beforeStateEntry(sequenceId) {
	var numSolicitacao = getValue("WKNumProces");
	log.info('>>> ADMISSAO (beforeStateEntry): Processo ' + numSolicitacao + ' -> Indo para atividade: ' + sequenceId);

	// =========================================================================
	// 1. LÓGICA EXISTENTE: FIM APROVADO (INTEGRAÇÃO) - ATIVIDADE 74
	// =========================================================================
	if (sequenceId == BSE_FIM_APROVADO) {
		log.warn("AVISO: Datasets de integração (DS_FLUIG_0041 e ds_connector) não foram encontrados.");
		log.warn("AVISO: A integração com o RM e o envio de e-mail via TBC foram PULADOS para permitir o avanço do processo.");

		// montaXMLFunc();
		// montaXMLDependente();
	}

	// =========================================================================
	// 2. NOVA LÓGICA: ENVIO DE CORREÇÃO PARA O CANDIDATO - ATIVIDADE 150
	// =========================================================================
	// ATIVIDADE 150: Preparação de dados para a Correção (Entrada)
	if (sequenceId == 150) {
		log.info(">>> ADMISSAO (beforeStateEntry): Preparando dados para correção. Destino: 150");

		try {
			// Recupera o parecer digitado pelo RH na atividade anterior
			var parecerRH = hAPI.getCardValue("cpParecerAprovaAdmissao");

			// GRAVA NO CAMPO DE HISTÓRICO (Fundamental para a Widget Pública ler)
			hAPI.setCardValue("txtParecerHistoricoRH", parecerRH);

			// Limpa a resposta anterior do candidato
			hAPI.setCardValue("txtRespostaCorrecaoCandidato", "");

			log.info(">>> ADMISSAO: Dados de histórico gravados para a solicitação " + numSolicitacao);

		} catch (e) {
			log.error(">>> ADMISSAO: Erro ao gravar histórico no beforeStateEntry: " + e);
		}
	}

}





function montaXMLFunc() {
	// Função mantida no código para uso futuro, mas não será executada agora.
	log.info("Iniciando estrutura de montaXMLFunc (Inativa)...");

	log.info("Iniciando montaXMLFunc...");
	var CONNECT = DatasetFactory.getDataset("ds_connector", null, null, null);
	var USUARIO = CONNECT.getValue(0, "INTEGRADOR");
	var SENHA = CONNECT.getValue(0, "SENHA");

	log.info("Recuperou usuario e senha do ds_connector...");

	var formatoInput = new java.text.SimpleDateFormat("dd/MM/yyyy");
	var formatoOutput = new java.text.SimpleDateFormat("yyyy-MM-dd'T'00:00:00");

	var DatAdm = formatoInput.parse(hAPI.getCardValue("txtAdmissao"));
	DTAdmissao = formatoOutput.format(DatAdm);

	//DATA DE NASCIMENTO
	var Nasc = hAPI.getCardValue("dtDataNascColaborador");
	if (Nasc != "") {

		var DataNascimento = formatoInput.parse(hAPI.getCardValue("dtDataNascColaborador"));
		DTNASC = formatoOutput.format(DataNascimento);
	} if (Nasc == "") {
		DTNASC = "";
	}
	log.info("#### DTNASC: " + DTNASC);

	// DATE DE EMISSAO DA IDENTIDADE
	var dtEmRG = hAPI.getCardValue("DTEMISSAOIDENT");
	if (dtEmRG != "") {

		var DataRG = formatoInput.parse(hAPI.getCardValue("DTEMISSAOIDENT"));
		DTRG = formatoOutput.format(DataRG);
	} if (dtEmRG == "") {
		DTRG = "";
	}
	log.info("#### DTRG: " + DTRG);

	// DATA DE TITULO DE ELEITOR
	var DtTitu = hAPI.getCardValue("DTTITELEITOR");
	if (DtTitu != "") {

		var DataTitu = formatoInput.parse(hAPI.getCardValue("DTTITELEITOR"));
		DataTitulo = formatoOutput.format(DataTitu);
	} if (DtTitu == "") {
		DataTitulo = "";
	}
	log.info("#### DTRG: " + DTRG);

	// DATA DE EMISSAO DO CTPS
	var EmCarttrabDt = hAPI.getCardValue("dtDataEmissaoCartTrab");
	if (EmCarttrabDt != "") {

		var dtDataEmissaoCartTrab = formatoInput.parse(hAPI.getCardValue("dtDataEmissaoCartTrab"));
		DTCTPS = formatoOutput.format(dtDataEmissaoCartTrab);
	} if (EmCarttrabDt == "") {
		DTCTPS = "";
	}
	log.info("#### DTCTPS: " + DTCTPS);

	// DATA DE VENCIMENTO DA CNH
	var dtVencCNH = hAPI.getCardValue("DTVENCHABILIT");
	if (dtVencCNH != "") {

		var DTVENCHABILIT = formatoInput.parse(hAPI.getCardValue("DTVENCHABILIT"));
		DTCNH = formatoOutput.format(DTVENCHABILIT);
	} if (dtVencCNH == "") {
		DTCNH = "";
	}
	log.info("#### DTCNH: " + DTCNH);

	// DATA DE EMISSAO DA CNH
	var DtCNHEm = hAPI.getCardValue("DTEMISSAOCNH");
	if (DtCNHEm != "") {

		var DTEMISSAOCNH = formatoInput.parse(hAPI.getCardValue("DTEMISSAOCNH"));
		DTEMICNH = formatoOutput.format(DTEMISSAOCNH);
	} if (DtCNHEm == "") {
		DTEMICNH = "";
	}
	log.info("#### DTEMICNH: " + DTEMICNH);

	// DATA DE EMISSAO DO RIC
	var RICDt = hAPI.getCardValue("DtEmRIC");
	if (RICDt != "") {

		var DtEmRIC = formatoInput.parse(hAPI.getCardValue("DtEmRIC"));
		DtEMRIC = formatoOutput.format(DtEmRIC);
	} if (RICDt == "") {
		DtEMRIC = "";
	}
	log.info("#### DtEMRIC: " + DtEMRIC);

	// DATA DE EMISSAO DO RNE
	var RNEDt = hAPI.getCardValue("DTRNE");
	if (RNEDt != "") {

		var DTRNE = formatoInput.parse(hAPI.getCardValue("DTRNE"));
		DtRNE = formatoOutput.format(DTRNE);
	} if (RNEDt == "") {
		DtRNE = "";
	}
	log.info("#### DtRNE: " + DtRNE);

	// DATA DE CHEGADA NO BRASIL
	var chegada = hAPI.getCardValue("DtChegBras");
	if (chegada != "") {

		var DtChegBras = formatoInput.parse(hAPI.getCardValue("DtChegBras"));
		DTChegBRASIL = formatoOutput.format(DtChegBras);
	} if (chegada == "") {
		DTChegBRASIL = "";
	}
	log.info("#### DTChegBRASIL: " + DTChegBRASIL);

	// DATA DE EMISSAO DA primeira via CNH
	var EmCNH = hAPI.getCardValue("DTEmPrimCNH");
	if (EmCNH != "") {

		var EmCNH2 = formatoInput.parse(hAPI.getCardValue("DTEmPrimCNH"));
		EmCNH22 = formatoOutput.format(EmCNH2);
	} if (EmCNH == "") {
		EmCNH22 = "";
	}
	log.info("#### EmCNH22: " + EmCNH22);

	// DATA CONT SINDICAL
	var DtContSindical = hAPI.getCardValue("TxtDtContSind");
	if (DtContSindical != "") {

		var DtSin = formatoInput.parse(hAPI.getCardValue("TxtDtContSind"));
		DTTContSindical = formatoOutput.format(DtSin);
	} if (DtContSindical == "") {
		DTTContSindical = "";
	}
	log.info("#### DTTContSindical: " + DTTContSindical);


	var xmlFunc = '';

	xmlFunc += '	<FopFunc>	';
	xmlFunc += '	<PFunc>	';
	xmlFunc += '	<CODCOLIGADA>' + hAPI.getCardValue("txtCodcoligada") + '</CODCOLIGADA>	';
	xmlFunc += '	<CHAPA>' + hAPI.getCardValue("TxtChapa") + '</CHAPA>	';
	xmlFunc += '	<NROFICHAREG></NROFICHAREG>	';
	xmlFunc += '	<CODRECEBIMENTO>M</CODRECEBIMENTO>	';
	xmlFunc += '	<CODSITUACAO>A</CODSITUACAO>	';
	xmlFunc += '	<CODTIPO>N</CODTIPO>	';
	xmlFunc += '	<CODSECAO>' + hAPI.getCardValue("txtCentroCusto") + '</CODSECAO>	';
	xmlFunc += '	<CODFUNCAO>' + hAPI.getCardValue("txtCodFuncao") + '</CODFUNCAO>	';
	xmlFunc += '	<CODSINDICATO>' + hAPI.getCardValue("TxtC odSind") + '</CODSINDICATO>	';
	xmlFunc += '	<CODHORARIO>' + hAPI.getCardValue("TxtCodHor") + '</CODHORARIO>	';
	xmlFunc += '	<NRODEPIRRF>0</NRODEPIRRF>	';
	xmlFunc += '	<NRODEPSALFAM>0</NRODEPSALFAM>	';
	xmlFunc += '	<DTBASE>' + DTAdmissao + '</DTBASE>	';
	xmlFunc += '	<SALARIO>' + hAPI.getCardValue("txtSalario") + '</SALARIO>	';
	xmlFunc += '	<SITUACAOFGTS>2</SITUACAOFGTS>	';
	xmlFunc += '	<CONTRIBSINDICAL>J</CONTRIBSINDICAL>	';
	xmlFunc += '	<APOSENTADO>0</APOSENTADO>	';
	xmlFunc += '	<TEMMAIS65ANOS>0</TEMMAIS65ANOS>	';
	xmlFunc += '	<DATAADMISSAO>' + DTAdmissao + '</DATAADMISSAO>	';
	xmlFunc += '	<TIPOADMISSAO>' + hAPI.getCardValue("TxtCodTPADM") + '</TIPOADMISSAO>	';
	xmlFunc += '	<MOTIVOADMISSAO>' + hAPI.getCardValue("TxtCodMotADM") + '</MOTIVOADMISSAO>	';
	xmlFunc += '	<TEMPRAZOCONTR>1</TEMPRAZOCONTR>	';
	xmlFunc += '	<FIMPRAZOCONTR>' + DTAdmissao + '</FIMPRAZOCONTR>	';
	xmlFunc += '	<DTVENCFERIAS>' + DTAdmissao + '</DTVENCFERIAS>	';
	xmlFunc += '	<NDIASLICREM1>0.00</NDIASLICREM1>	';
	xmlFunc += '	<NDIASLICREM2>0.00</NDIASLICREM2>	';
	xmlFunc += '	<MEDIASALMATERN>0.00</MEDIASALMATERN>	';
	xmlFunc += '	<SITUACAORAIS>1</SITUACAORAIS>	';
	xmlFunc += '	<MEMBROSINDICAL>0</MEMBROSINDICAL>	';
	xmlFunc += '	<VINCULORAIS>7</VINCULORAIS>	';
	xmlFunc += '	<MUDOUADMISSAO>0</MUDOUADMISSAO>	';
	xmlFunc += '	<MUDOUDTOPCAO>1</MUDOUDTOPCAO>	';
	xmlFunc += '	<PISPARAFGTS>' + hAPI.getCardValue("PIS") + '</PISPARAFGTS>	';
	xmlFunc += '	<ULTIMORECALCULODATA>' + DTAdmissao + '</ULTIMORECALCULODATA>	';
	xmlFunc += '	<ULTIMORECALCULOHORA>' + DTAdmissao + '</ULTIMORECALCULOHORA>	';
	xmlFunc += '	<DESCONTAAVISOPREVIO>0</DESCONTAAVISOPREVIO>	';
	xmlFunc += '	<CODFILIAL>1</CODFILIAL>	';
	xmlFunc += '	<NOME>' + hAPI.getCardValue("txtNomeColaborador") + '</NOME>	';
	xmlFunc += '	<INDINICIOHOR>1</INDINICIOHOR>	';
	xmlFunc += '	<PISPASEP>' + hAPI.getCardValue("PIS") + '</PISPASEP>	';
	xmlFunc += '	<CODPESSOA>0</CODPESSOA>	';
	xmlFunc += '	<CODBANCOPAGTO>999</CODBANCOPAGTO>	';
	xmlFunc += '	<CODBANCOPIS>104</CODBANCOPIS>	';
	xmlFunc += '	<RESCISAOCALCULADA>0</RESCISAOCALCULADA>	';
	xmlFunc += '	<MEMBROCIPA>0</MEMBROCIPA>	';
	xmlFunc += '	<USASALCOMPOSTO>0</USASALCOMPOSTO>	';
	xmlFunc += '	<REGATUAL>1</REGATUAL>	';
	xmlFunc += '	<JORNADAMENSAL>13200</JORNADAMENSAL>	';
	xmlFunc += '	<CODOCORRENCIA>0</CODOCORRENCIA>	';
	xmlFunc += '	<CODCATEGORIA>11</CODCATEGORIA>	';
	xmlFunc += '	<ESUPERVISOR>0</ESUPERVISOR>	';
	xmlFunc += '	<USACONTROLEDESALDO>0</USACONTROLEDESALDO>	';
	xmlFunc += '	<MUDOUCI>0</MUDOUCI>	';
	xmlFunc += '	<FGTSMESANTRECOLGRFP>0</FGTSMESANTRECOLGRFP>	';
	xmlFunc += '	<TRABALHOUNADEMISSAO>0</TRABALHOUNADEMISSAO>	';
	xmlFunc += '	<SITUACAOINSS>1</SITUACAOINSS>	';
	xmlFunc += '	<TEMDEDUCAOCPMF>1</TEMDEDUCAOCPMF>	';
	xmlFunc += '	<NRODIASFERIASCORRIDOS>0</NRODIASFERIASCORRIDOS>	';
	xmlFunc += '	<NRODIASABONOCORRIDOS>0</NRODIASABONOCORRIDOS>	';
	xmlFunc += '	<POSICAOABONO>0</POSICAOABONO>	';
	xmlFunc += '	<QUERADIANTAMENTO>0</QUERADIANTAMENTO>	';
	xmlFunc += '	<SEXO>' + hAPI.getCardValue("txtSexo") + '</SEXO>	';
	xmlFunc += '	<NACIONALIDADE>10</NACIONALIDADE>	';
	xmlFunc += '	<GRAUINSTRUCAO>' + hAPI.getCardValue("GRAUINSTRUCAOCod") + '</GRAUINSTRUCAO>	';
	xmlFunc += '	<NATURALIDADE>' + hAPI.getCardValue("txtNaturalidade") + '</NATURALIDADE>	';
	xmlFunc += '	<APELIDO>' + hAPI.getCardValue("txtNomeColaborador") + '</APELIDO>	';
	xmlFunc += '	<DTNASCIMENTO>' + DTNASC + '</DTNASCIMENTO>	';
	xmlFunc += '	<CARTIDENTIDADE>' + hAPI.getCardValue("TxtRg") + '</CARTIDENTIDADE>	';
	xmlFunc += '	<ORGEMISSORIDENT>' + hAPI.getCardValue("ORGAOCARTIDENTIDADE") + '</ORGEMISSORIDENT>	';
	xmlFunc += '	<UFCARTIDENT>' + hAPI.getCardValue("CODUFCARTIDENTIDADE") + '</UFCARTIDENT>	';
	xmlFunc += '	<CARTEIRATRAB>' + hAPI.getCardValue("txtCartTrab") + '</CARTEIRATRAB>	';
	xmlFunc += '	<SERIECARTTRAB>' + hAPI.getCardValue("txtSerieCart") + '</SERIECARTTRAB>	';
	xmlFunc += '	<UFCARTTRAB>' + hAPI.getCardValue("CODUFCTPS") + '</UFCARTTRAB>	';
	xmlFunc += '	<TITULOELEITOR>' + hAPI.getCardValue("TITULOELEITOR") + '</TITULOELEITOR>	';
	xmlFunc += '	<CERTIFRESERV>' + hAPI.getCardValue("CERTIFRESERV") + '</CERTIFRESERV>	';


	log.info("#### CPF: " + hAPI.getCardValue("cpfcnpj"));
	log.info("#### CPF VALUE: " + hAPI.getCardValue("cpfcnpjValue"));

	xmlFunc += '	<CPF>' + hAPI.getCardValue("cpfcnpjValue") + '</CPF>	';
	xmlFunc += '	<RUA>' + hAPI.getCardValue("txtRUA") + '</RUA>	';
	xmlFunc += '	<NUMERO>' + hAPI.getCardValue("txtNUMERO") + '</NUMERO>	';
	xmlFunc += '	<BAIRRO>' + hAPI.getCardValue("txtBAIRRO") + '</BAIRRO>	';
	xmlFunc += '	<CIDADE>' + hAPI.getCardValue("txtNOMEMUNICIPIO") + '</CIDADE>	';
	xmlFunc += '	<ESTADO>' + hAPI.getCardValue("txtCODETD") + '</ESTADO>	';
	xmlFunc += '	<PAIS>' + hAPI.getCardValue("txtPAIS") + '</PAIS>	';
	xmlFunc += '	<CEP>' + hAPI.getCardValue("txtCEP") + '</CEP>	';
	xmlFunc += '	<NOMEBANCOPGTO>Cheque</NOMEBANCOPGTO>	';
	xmlFunc += '	<NOMEPAI>CARLOS MAIA DE OLIVEIRA</NOMEPAI>	';
	xmlFunc += '	<NOMEMAE>DIRCE POLICARPO DE OLIVEIRA</NOMEMAE>	';
	xmlFunc += '	<CODIGO>0</CODIGO>	';
	xmlFunc += '	<Jornada_Mensal>220:00</Jornada_Mensal>	';
	xmlFunc += '	<Hora>91190.91</Hora>	';
	xmlFunc += '	<DEFICIENTEFISICO>0</DEFICIENTEFISICO>	';
	xmlFunc += '	<DEFICIENTEAUDITIVO>0</DEFICIENTEAUDITIVO>	';
	xmlFunc += '	<DEFICIENTEFALA>0</DEFICIENTEFALA>	';
	xmlFunc += '	<DEFICIENTEVISUAL>0</DEFICIENTEVISUAL>	';
	xmlFunc += '	<DEFICIENTEMENTAL>0</DEFICIENTEMENTAL>	';
	xmlFunc += '	<BRPDH>0</BRPDH>	';
	xmlFunc += '	<HSTAFT_ESTTEMPOSERVICO>false</HSTAFT_ESTTEMPOSERVICO>	';
	xmlFunc += '	<INDICADORSINDICALIZADO>0</INDICADORSINDICALIZADO>	';
	xmlFunc += ' <NOMEFUNC>' + hAPI.getCardValue("txtNomeColaborador") + '</NOMEFUNC>	';
	xmlFunc += '	<CORRACA>' + hAPI.getCardValue("CORRACA") + '</CORRACA>	';
	xmlFunc += '	<ESTADOCIVIL>' + hAPI.getCardValue("txtEstCivilCod") + '</ESTADOCIVIL>	';
	xmlFunc += '	<ESTADONATAL>' + hAPI.getCardValue("ESTADONatalCod") + '</ESTADONATAL>	';
	xmlFunc += '	<CANDIDATO>1</CANDIDATO>	';
	xmlFunc += ' <CODTIPOBAIRRO>' + hAPI.getCardValue("txtCODTIPOBAIRRO") + '</CODTIPOBAIRRO>	';
	xmlFunc += '	<CODTIPORUA>' + hAPI.getCardValue("txtCODTIPORUA") + '</CODTIPORUA>	';
	xmlFunc += '	<TPREGIMEPREV>1</TPREGIMEPREV>	';
	xmlFunc += '	<DEFICIENTEINTELECTUAL>0</DEFICIENTEINTELECTUAL>	';
	xmlFunc += '	<CODMUNICIPIO>' + hAPI.getCardValue("txtCODMUNICIPIO") + '</CODMUNICIPIO>	';
	xmlFunc += '	<SITUACAOIRRF>1</SITUACAOIRRF>	';
	xmlFunc += '	<CARREGOUAVISOPREVIO>0</CARREGOUAVISOPREVIO>	';
	xmlFunc += '	<RECEBSEGDESEMP>0</RECEBSEGDESEMP>	';
	xmlFunc += '	<INDPAGTOJUIZO>0</INDPAGTOJUIZO>	';
	xmlFunc += '	<CODIGORECEITA3533>0</CODIGORECEITA3533>	';
	xmlFunc += '	<IDADE>27</IDADE>	';
	xmlFunc += '	<CODCATEGORIAESOCIAL>101</CODCATEGORIAESOCIAL>	';
	xmlFunc += '	<ESOCIALFUNCAOCONF>0</ESOCIALFUNCAOCONF>	';
	xmlFunc += '	<FUMANTE>0</FUMANTE>	';
	xmlFunc += '	<FERIASDIASUTEIS>0</FERIASDIASUTEIS>	';
	xmlFunc += '	<Periodo_Aquisitivo></Periodo_Aquisitivo>	';
	xmlFunc += '	<Limite_Ferias_Dobro></Limite_Ferias_Dobro>	';
	xmlFunc += '	<DiasFaltasFeriasNormais>0</DiasFaltasFeriasNormais>	';
	xmlFunc += '	<CONJUGEBRASIL>0</CONJUGEBRASIL>	';
	xmlFunc += '	<NATURALIZADO>0</NATURALIZADO>	';
	xmlFunc += '	<FILHOSBRASIL>0</FILHOSBRASIL>	';
	xmlFunc += '	<INVESTTREINANT>0.00</INVESTTREINANT>	';
	xmlFunc += '	<AJUSTATAMANHOFOTO>0</AJUSTATAMANHOFOTO>	';
	xmlFunc += '	<DATAAPROVACAOCURR></DATAAPROVACAOCURR>	';
	xmlFunc += '	<ESTELEIT xml:space="preserve"> </ESTELEIT>	';
	xmlFunc += '	<ESTADOROW>0</ESTADOROW>	';
	xmlFunc += '	<ROWVALIDA>0</ROWVALIDA>	';
	xmlFunc += '	<ALUNO>0</ALUNO>	';
	xmlFunc += '	<PROFESSOR>0</PROFESSOR>	';
	xmlFunc += '	<USUARIOBIBLIOS>0</USUARIOBIBLIOS>	';
	xmlFunc += '	<FUNCIONARIO>0</FUNCIONARIO>	';
	xmlFunc += '	<EXFUNCIONARIO>1</EXFUNCIONARIO>	';
	xmlFunc += '	<CODNATURALIDADE>04805</CODNATURALIDADE>	';

	// DATAS
	xmlFunc += '	<DTMUDANCASALARIO>' + DTAdmissao + '</DTMUDANCASALARIO>	';
	xmlFunc += '	<DTMUDANCAFUNCAO>' + DTAdmissao + '</DTMUDANCAFUNCAO>	';
	xmlFunc += '	<HSTSIT_DATAMUDANCA>' + DTAdmissao + '</HSTSIT_DATAMUDANCA>	';
	xmlFunc += '	<DTMUDANCASECAO>' + DTAdmissao + '</DTMUDANCASECAO>	';
	xmlFunc += '	<DTMUDANCACONTRIBSINDICAL>' + DTAdmissao + '</DTMUDANCACONTRIBSINDICAL>	';
	xmlFunc += '	<HSTSEFIP_DTMUDANCA>' + DTAdmissao + '</HSTSEFIP_DTMUDANCA>	';
	xmlFunc += '	<HSTBANCO_DTMUDANCA>' + DTAdmissao + '</HSTBANCO_DTMUDANCA>	';
	xmlFunc += '	<DTMUDANCAHORARIO>' + DTAdmissao + '</DTMUDANCAHORARIO>	';

	// MOTIVOS
	xmlFunc += '	<MOTMUDANCASALARIO>01</MOTMUDANCASALARIO>	';
	xmlFunc += '	<MOTMUDANCASECAO>01</MOTMUDANCASECAO>	';
	xmlFunc += '	<MOTMUDANCAFUNCAO>1</MOTMUDANCAFUNCAO>	';
	xmlFunc += '	<HSTSIT_MOTIVO>01</HSTSIT_MOTIVO>	';

	xmlFunc += '	</PFunc>	';
	xmlFunc += '	<PFCOMPL>	';
	xmlFunc += '	<CODCOLIGADA>' + hAPI.getCardValue("txtCodcoligada") + '</CODCOLIGADA>	';
	xmlFunc += '	<CHAPA>' + hAPI.getCardValue("TxtChapa") + '</CHAPA>	';
	xmlFunc += '	<PROPAY_50>01</PROPAY_50>	';
	xmlFunc += '	<PROPAY_112>1 - PRESIDENCIA E DIRETORIA</PROPAY_112>	';
	xmlFunc += '	<PROPAY_117>01</PROPAY_117>	';
	xmlFunc += '	<PROPAY_132>01</PROPAY_132>	';
	xmlFunc += '	</PFCOMPL>	';
	xmlFunc += '	<VPCOMPL>	';
	xmlFunc += '	<CODPESSOA>0</CODPESSOA>	';
	xmlFunc += '	</VPCOMPL>	';
	xmlFunc += '	</FopFunc>	';

	log.info("#### xmlFunc: " + xmlFunc);

	/*
	- Campo DTMUDANCASALARIO - Data da Mudança do Salário é obrigatório na inclusão do funcionário
	- Campo DTMUDANCAFUNCAO - Data da Mudança da Função é obrigatório na inclusão do funcionário
	- Campo HSTSIT_DATAMUDANCA - Data da Mudança da Situação é obrigatório na inclusão do funcionário
	- Campo DTMUDANCASECAO - Data de Mudança da Seção é obrigatório na inclusão do funcionário
	- Campo DTMUDANCACONTRIBSINDICAL - Data da Mudança da Contribuição Sindical é obrigatório na inclusão do funcionário
	- Campo HSTSEFIP_DTMUDANCA - Data da Mudança do SEFIP é obrigatório na inclusão do funcionário
	- Campo HSTBANCO_DTMUDANCA - Data da Mudança do Banco Principal é obrigatório na inclusão do funcionário
	- Campo DTMUDANCAHORARIO - Data da Mudança do Horário é obrigatório na inclusão do funcionário
	*/

	var CONNECT = DatasetFactory.getDataset("ds_connector", null, null, null);
	var USUARIO = CONNECT.getValue(0, "INTEGRADOR");
	var SENHA = CONNECT.getValue(0, "SENHA");
	var NOME_SERVICO = "WSDATASERVER";
	var CAMINHO_SERVICO = "com.totvs.WsDataServer";

	var servico = ServiceManager.getServiceInstance(NOME_SERVICO);
	log.info("#### instanciou servico...");

	var serviceHelper = servico.getBean();
	log.info("#### instanciou serviceHelper...");

	var instancia = servico.instantiate(CAMINHO_SERVICO);
	log.info("#### criou a instancia: " + CAMINHO_SERVICO);

	var ws = instancia.getRMIwsDataServer();

	var authenticatedService = serviceHelper.getBasicAuthenticatedClient(ws, "com.totvs.IwsDataServer", USUARIO, SENHA);

	log.info("#### Criou authenticatedService e vai chamar saveRecordEmail::FopFuncData");

	try {
		var result = authenticatedService.saveRecordEmail('FopFuncData', xmlFunc, 'CODCOLIGADA=1;CODSISTEMA=P', "suportesoter@consultoriainterativa.com.br");

		log.info("#### Resultado da comunicação com o TOTVS TBC: " + result);

		if ((result != null) && (result.indexOf("===") != -1)) {
			var msgErro = result.substring(0, result.indexOf("==="));
			log.info("#### Erro na comunicação com o TOTVS TBC: " + msgErro);
			throw msgErro;

		}
		else {
			log.info("#### Nao houve erro. Integracao FUNC realizada com SUCESSO!");
		}
	}
	catch (e) {
		if (e == null) {
			e = "Erro desconhecido; verifique o log do AppServer";
		}

		var mensagemErro = "Erro na comunicação com o TOTVS TBC: " + e;
		log.error(mensagemErro + " ---> " + xmlFunc);
		throw mensagemErro;
	}

}

function montaXMLDependente() {
	// Função mantida no código para uso futuro, mas não será executada agora.
	log.info("Iniciando estrutura de montaXMLDependente (Inativa)...");

	log.info("Iniciando montaXMLDependente...");
	//Para cada campo de data tenho que fazer a conversão dela.
	var formatoInput = new java.text.SimpleDateFormat("dd/MM/yyyy");
	var formatoOutput = new java.text.SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");


	var indexes = getIndexes('txtNomDepen');
	log.info("indexes Depente" + indexes);
	var Tamanho = indexes.size();
	log.info("Tamanho Depente" + Tamanho);
	var iterator = indexes.iterator();
	log.info("iterator Depente" + iterator);
	var Seq = 0;
	var SeqParentesco = 0;

	while (iterator.hasNext()) {
		Seq++;
		var index = iterator.next();
		log.info("index Depente" + index);
		var Next = iterator.hasNext();
		log.info("Next Depente" + Next);
		//var SeqEstoque = 0;

		var NOME = hAPI.getCardValue("txtNomDepen___" + index);
		log.info("index NOME" + NOME);
		var PARENTESCO = hAPI.getCardValue("codParentesco___" + index);
		log.info("index PARENTESCO" + PARENTESCO);
		var SEXO = hAPI.getCardValue("txtSexoDepen___" + index);
		var CHAPA = hAPI.getCardValue("TxtChapa");
		var INCSALFAM = hAPI.getCardValue("TxtIncSalFamilia___" + index);
		var INCIRRF = hAPI.getCardValue("TxtIncIRRF___" + index);
		var INCINSS = hAPI.getCardValue("TxtIncINSS___" + index);
		var INCPENSAO = hAPI.getCardValue("TxtIncPensao___" + index);
		var INCASSMED = hAPI.getCardValue("TxtIncMedica___" + index);
		var CARTORIO = hAPI.getCardValue("TxtCartorio___" + index);
		var REGISTRO = hAPI.getCardValue("TxtRegistro___" + index);
		var LIVRO = hAPI.getCardValue("TxtLivro___" + index);
		var FOLHA = hAPI.getCardValue("TxtFolha___" + index);
		var cpfDepend = hAPI.getCardValue("TxtCPFDep___" + index);
		//var CARTVACINA = hAPI.getCardValue("TxtEntVacina___"+index);  
		//var FREQESCOL = hAPI.getCardValue("TxtEscolar___"+index);   



		var DTNASCIMENTO = hAPI.getCardValue("txtDtNascDepen___" + index);
		log.info("indexAndre" + index);
		log.info("DTNASCIMENTOandre" + DTNASCIMENTO);
		if (DTNASCIMENTO != "") {

			var DataNascimento = formatoInput.parse(hAPI.getCardValue("txtDtNascDepen___" + index));
			DTNAS = formatoOutput.format(DataNascimento);
		} if (DTNASCIMENTO == "") {
			DTNAS = "";
		}

		if (NOME != "" && PARENTESCO != "") {


			SeqParentesco++;

			log.info("SeqParentesco" + SeqParentesco);

			var xmldepen = '';

			xmldepen += '<PFDepend>';
			xmldepen += '<CODCOLIGADA>1</CODCOLIGADA>';
			xmldepen += '<CHAPA>' + CHAPA + '</CHAPA>';
			xmldepen += '<NRODEPEND>' + SeqParentesco + '</NRODEPEND>';
			xmldepen += '<NOME>' + NOME + '</NOME>';
			xmldepen += '<CPF>' + cpfDepend + '</CPF>';
			xmldepen += '<DTNASCIMENTO>' + DTNAS + '</DTNASCIMENTO>';
			xmldepen += '<SEXO>' + SEXO + '</SEXO>';
			xmldepen += '<ESTADOCIVIL>O</ESTADOCIVIL>';
			xmldepen += '<INCIRRF>' + INCIRRF + '</INCIRRF>';
			xmldepen += '<INCINSS>' + INCINSS + '</INCINSS>';
			xmldepen += '<INCASSISTMEDICA>' + INCASSMED + '</INCASSISTMEDICA>';
			xmldepen += '<INCPENSAO>' + INCPENSAO + '</INCPENSAO>';
			xmldepen += '<GRAUPARENTESCO>' + PARENTESCO + '</GRAUPARENTESCO>';
			//xmldepen += '<CARTAOVACINA>'+CARTVACINA+'</CARTAOVACINA>';
			xmldepen += '<PERCENTUAL>0.00</PERCENTUAL>';
			xmldepen += '<BRUTO>0</BRUTO>';
			//xmldepen += '<FREQESCOLAR>'+FREQESCOL+'</FREQESCOLAR>';
			xmldepen += '<UNIVERSITARIO>0</UNIVERSITARIO>';
			xmldepen += '<INCSALFAM>' + INCSALFAM + '</INCSALFAM>';
			xmldepen += '<CARTORIO>' + CARTORIO + '</CARTORIO>';
			xmldepen += '<NROREGISTRO>' + REGISTRO + '</NROREGISTRO>';
			xmldepen += '<NROLIVRO>' + LIVRO + '</NROLIVRO>';
			xmldepen += '<NROFOLHA>' + FOLHA + '</NROFOLHA>'
			xmldepen += '</PFDepend>';

			xmldepen += '<PFDEPENDCOMPL>';
			xmldepen += '  <CODCOLIGADA>1</CODCOLIGADA>';
			xmldepen += '  <CHAPA>' + CHAPA + '</CHAPA>';
			xmldepen += '  <NRODEPEND>' + SeqParentesco + '</NRODEPEND>';
			xmldepen += '  <PLANOSAUDE>00</PLANOSAUDE>';
			xmldepen += '</PFDEPENDCOMPL>';

		}

		var CONNECT = DatasetFactory.getDataset("ds_connector", null, null, null);
		var USUARIO = CONNECT.getValue(0, "INTEGRADOR");
		var SENHA = CONNECT.getValue(0, "SENHA");
		var NOME_SERVICO = "WSDATASERVER";
		var CAMINHO_SERVICO = "com.totvs.WsDataServer";
		var servico = ServiceManager.getServiceInstance(NOME_SERVICO);
		var serviceHelper = servico.getBean();
		var instancia = servico.instantiate(CAMINHO_SERVICO);
		var ws = instancia.getRMIwsDataServer();
		var authenticatedService = serviceHelper.getBasicAuthenticatedClient(ws, "com.totvs.IwsDataServer", USUARIO, SENHA);

		//var inicioxml="<FopFunc>";
		//var FimXML = "</FopFunc>";
		var xml = xmldepen;
		var inicioxml = "<FopDepend>";
		var FimXML = "</FopDepend>";


		try {
			//var result = authenticatedService.saveRecordEmail('FopDependData', inicioxml + xml + FimXML, 'CODCOLIGADA=1;CODSISTEMA=P',"andre.oliveirabpit@gmail.com"); //"suportesoter@consultoriainterativa.com.br"
			var result = authenticatedService.saveRecord('FopDependData', inicioxml + xml + FimXML, 'CODCOLIGADA=1;CODSISTEMA=P');

			if ((result != null) && (result.indexOf("===") != -1)) {
				var msgErro = result.substring(0, result.indexOf("==="));

				throw msgErro;

			}
			else {
				log.info("#### Nao houve erro. Integracao Dependente realizada com SUCESSO!");
			}
		}
		catch (e) {
			if (e == null) {
				e = "Erro desconhecido; verifique o log do AppServer";
			}

			var mensagemErro = "Erro na comunicação com o TOTVS TBC: " + e;
			log.error(mensagemErro + " ---> " + xml);

			throw mensagemErro;
		}

	}
}


