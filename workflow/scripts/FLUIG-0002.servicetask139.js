function servicetask139(attempt, message) {
    log.info("### Admissão SOAP RM (Campos Complementares e Emergência) - INICIO ###");

    try {
        // =========================================================================
        // 1. FUNÇÕES AUXILIARES DE FORMATAÇÃO E LEITURA
        // =========================================================================
        var getStr = function (name) {
            var v = hAPI.getCardValue(name);
            if (v == null || v == undefined) return "";
            return String(v).trim();
        };

        function tag(n, v) {
            if (v === null || v === undefined || String(v).trim() === "") return "";
            return "<" + n + ">" + escapeXML(v) + "</" + n + ">";
        }

        function escapeXML(str) {
            return String(str || "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        // =========================================================================
        // 2. CONFIGURAÇÕES DO WEBSERVICE (VIA DATASET SECURIZADO)
        // =========================================================================
        var dsConfig = DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, [
            DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST)
        ], null);

        if (!dsConfig || dsConfig.rowsCount === 0) {
            throw "ERRO FATAL: Configurações de Integração não encontradas no dataset Form_Configuracoes_Admissao.";
        }

        var NOME_SERVICO_FLUIG = "WSDATASERVER";
        var SISTEMA = "P";
        var RM_USER = dsConfig.getValue(0, "RM_USER");
        var RM_PASS = dsConfig.getValue(0, "RM_PASS");
        var ENDPOINT_URL = dsConfig.getValue(0, "RM_ENDPOINT_WS");

        // =========================================================================
        // 3. EXTRAÇÃO DAS CHAVES E CAMPOS COMPLEMENTARES
        // =========================================================================
        // Captura as chaves primárias geradas na task 138
        var COLIGADA = getStr("FUN_EMPRESA");
        var CHAPA = getStr("FUN_CHAPA") || getStr("TxtChapa");
        var CODPESSOA = getStr("FUN_CODPESSOA") || getStr("txtCodigoPeExist");

        if (!COLIGADA || COLIGADA === "") throw "Coligada não informada.";
        if (!CHAPA || CHAPA === "") throw "Chapa não informada. A integração principal (138) falhou ou não gerou a chapa.";
        if (!CODPESSOA || CODPESSOA === "") throw "Código da Pessoa (CODPESSOA) não foi gravado pela etapa 138. É obrigatório para atualizar a tabela de emergência (VPCOMPL).";

        var RM_CONTEXTO = "CODCOLIGADA=" + COLIGADA + ";CODSISTEMA=" + SISTEMA + ";CODUSUARIO=" + RM_USER;

        var tamanhoCamisa = getStr("txtTamanhoCamisa");
        var tamanhoCalcado = getStr("txtTamanhoCalcado");
        
        var nomeEmergencia = getStr("txtNomeEmergencia");
        var parentescoEmergencia = getStr("txtParentescoEmergencia");
        var telefoneEmergencia = getStr("txtTelefoneEmergencia");

        // Se todos os campos estiverem vazios, não há necessidade de chamar o RM
        if (tamanhoCamisa === "" && tamanhoCalcado === "" && nomeEmergencia === "" && parentescoEmergencia === "" && telefoneEmergencia === "") {
            log.info("### NENHUM DADO COMPLEMENTAR PARA INTEGRAR. IGNORANDO TASK 139...");
            return true;
        }

        // =========================================================================
        // 4. MONTAGEM DE INTEGRAÇÃO DO XML (PFCOMPL E VPCOMPL SEPARADAS)
        // =========================================================================
        var xmlCompl = "";
        xmlCompl += "<FopFunc>\n";
        
        // A tag PFunc é enviada apenas com as chaves para que o RM saiba qual funcionário atualizar
        xmlCompl += "  <PFunc>\n";
        xmlCompl += tag("CODCOLIGADA", COLIGADA);
        xmlCompl += tag("CHAPA", CHAPA);
        xmlCompl += "  </PFunc>\n";

        // Tabela PFCOMPL (Tamanhos e Fardamento) - Ligação por Coligada e Chapa
        if (tamanhoCamisa !== "" || tamanhoCalcado !== "") {
            xmlCompl += "  <PFCOMPL>\n";
            xmlCompl += tag("CODCOLIGADA", COLIGADA);
            xmlCompl += tag("CHAPA", CHAPA);
            
            if (tamanhoCamisa !== "") xmlCompl += tag("TAMANHO_CAMISA", tamanhoCamisa);
            if (tamanhoCalcado !== "") xmlCompl += tag("CALCADO", tamanhoCalcado);
            
            xmlCompl += "  </PFCOMPL>\n";
        }

        // // Tabela VPCOMPL (Emergência) - Ligação EXCLUSIVA por CODPESSOA (conforme documentação do RM)
        // if (nomeEmergencia !== "" || parentescoEmergencia !== "" || telefoneEmergencia !== "") {
        //     xmlCompl += "  <VPCOMPL>\n";
        //     xmlCompl += tag("CODPESSOA", CODPESSOA); 
            
        //     if (nomeEmergencia !== "") xmlCompl += tag("CONTATO_EMERGENCIA", nomeEmergencia);
        //     if (parentescoEmergencia !== "") xmlCompl += tag("GRAU_PAR_EMER", parentescoEmergencia);
        //     if (telefoneEmergencia !== "") xmlCompl += tag("TELEFONE_EMERGENCIA", telefoneEmergencia);
            
        //     xmlCompl += "  </VPCOMPL>\n";
        // }

        xmlCompl += "</FopFunc>";

        log.info("### XML DE INTEGRAÇÃO MONTADO (COMPLEMENTARES): \n" + xmlCompl);

        // =========================================================================
        // 5. CONSUMO DO WEBSERVICE SOAP DO RM
        // =========================================================================
        var serviceProvider = ServiceManager.getService(NOME_SERVICO_FLUIG);
        var serviceLocator = serviceProvider.instantiate("com.totvs.WsDataServer");
        var authService = serviceLocator.getRMIwsDataServer();

        var client = authService;
        var bindingProvider = client;
        var requestContext = bindingProvider.getRequestContext();
        requestContext.put("javax.xml.ws.security.auth.username", RM_USER);
        requestContext.put("javax.xml.ws.security.auth.password", RM_PASS);

        try {
            requestContext.put("javax.xml.ws.service.endpoint.address", ENDPOINT_URL);
        } catch (e) {
            log.warn("Aviso Endpoint RM: " + e);
        }

        // Executa a gravação. O RM fará o UPDATE nas tabelas correspondentes.
        var result = authService.saveRecord("FopFuncData", xmlCompl, RM_CONTEXTO);
        log.info("### RETORNO RM (COMPLEMENTARES): " + result);

        if (result && result.indexOf("===") != -1) {
            throw "Erro ao integrar os dados complementares: " + result;
        } else {
            log.info("### SUCESSO! DADOS COMPLEMENTARES INTEGRADOS NA CHAPA " + CHAPA + " E PESSOA " + CODPESSOA);
        }

    } catch (e) {
        log.error("### ERRO FATAL NA INTEGRAÇÃO RM (Task 139): " + e);
        throw e;
    }
}