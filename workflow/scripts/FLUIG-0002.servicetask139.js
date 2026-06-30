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

        function removerAcentosIntegracao(texto) {
            var mapa = {
                "Á": "A", "À": "A", "Â": "A", "Ã": "A", "Ä": "A",
                "É": "E", "È": "E", "Ê": "E", "Ë": "E",
                "Í": "I", "Ì": "I", "Î": "I", "Ï": "I",
                "Ó": "O", "Ò": "O", "Ô": "O", "Õ": "O", "Ö": "O",
                "Ú": "U", "Ù": "U", "Û": "U", "Ü": "U",
                "Ç": "C", "Ñ": "N"
            };

            return String(texto || "").replace(/[ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]/g, function (letra) {
                return mapa[letra] || letra;
            });
        }

        function normalizarTextoIntegracao(v) {
            if (v === null || v === undefined) return "";

            var texto = String(v).trim();

            if (texto === "") return "";

            texto = texto.toUpperCase();
            texto = removerAcentosIntegracao(texto);

            texto = texto
                .replace(/&/g, " E ")
                .replace(/[ªº°]/g, "")
                .replace(/[´`'"]/g, "")
                .replace(/[“”‘’]/g, "")
                .replace(/[–—]/g, "-")
                .replace(/[^A-Z0-9 @._,\-\/:;]+/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            return texto;
        }

        function tag(n, v) {
            var texto = normalizarTextoIntegracao(v);
            if (texto === "") return "";
            return "<" + n + ">" + escapeXML(texto) + "</" + n + ">";
        }

        function tagRaw(n, v) {
            if (v === null || v === undefined || String(v).trim() === "") return "";
            return "<" + n + ">" + escapeXML(String(v).trim()) + "</" + n + ">";
        }

        function escapeXML(str) {
            return String(str || "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function formatarDataRM(d) {
            if (!d || d == "") return "";

            var p = String(d).split("/");

            if (p.length == 3) {
                return p[2] + "-" + p[1] + "-" + p[0] + "T00:00:00";
            }

            return d;
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
        var RM_CONTEXTO = "CODCOLIGADA=" + COLIGADA + ";CODSISTEMA=" + SISTEMA + ";CODUSUARIO=" + RM_USER;

        var nomeEmergencia = getStr("txtNomeEmergencia");
        var parentescoEmergencia = getStr("txtParentescoEmergencia");
        var telefoneEmergencia = getStr("txtTelefoneEmergencia");

        // Se todos os campos estiverem vazios, não há necessidade de chamar o RM
        function extrairCodigoPlano(valor) {
            var texto = String(valor || "").trim();

            if (!texto) return "";

            var textoNormalizado = texto.toLowerCase();

            if (
                textoNormalizado.indexOf("selecione") > -1 ||
                textoNormalizado.indexOf("não opto") > -1 ||
                textoNormalizado.indexOf("nao opto") > -1 ||
                textoNormalizado === "000000"
            ) {
                return "";
            }

            if (texto.indexOf(" - ") > -1) {
                texto = texto.split(" - ")[0].trim();
            }

            // Proteção: códigos de plano no RM devem ser curtos.
            // Evita mandar descrições como "Selecione o plano odontológico..."
            if (texto.length > 10) {
                return "";
            }

            return texto;
        }

        function normalizarTextoComplementar(valor) {
            var texto = String(valor || "").trim();

            if (!texto) return "";

            var textoNormalizado = texto.toLowerCase();

            if (
                textoNormalizado.indexOf("selecione") > -1 ||
                textoNormalizado === "null" ||
                textoNormalizado === "undefined"
            ) {
                return "";
            }

            return texto;
        }

        function normalizarNivelIngles(valor) {
            var texto = String(valor || "").trim();

            if (!texto) return "";

            try {
                texto = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            } catch (e) { }

            texto = texto.toUpperCase();

            if (
                texto === "SELECIONE" ||
                texto === "NULL" ||
                texto === "UNDEFINED"
            ) {
                return "";
            }

            if (texto === "NAO INFORMADO") return "NAO INFORMADO";
            if (texto === "BASICO") return "BASICO";
            if (texto === "INTERMEDIARIO") return "INTERMEDIARIO";
            if (texto === "AVANCADO") return "AVANCADO";
            if (texto === "FLUENTE") return "FLUENTE";

            return "";
        }

        function resultadoErroNivelIngles(result) {
            var texto = String(result || "").toUpperCase();

            return (
                texto.indexOf("NIVEL_INGLES") > -1 ||
                texto.indexOf("NIVEL INGLES") > -1 ||
                texto.indexOf("NÍVEL INGLÊS") > -1 ||
                texto.indexOf("INGLES") > -1 ||
                texto.indexOf("INGLÊS") > -1
            );
        }

        function normalizarModeloTrabalho(valor) {
            var texto = String(valor || "").trim();

            if (!texto) return "";

            if (texto.indexOf(" - ") > -1) {
                texto = texto.split(" - ")[0].trim();
            }

            var normalizado = texto.toLowerCase();

            try {
                normalizado = normalizado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            } catch (e) { }

            if (normalizado.indexOf("selecione") > -1) return "";

            if (normalizado === "1" || normalizado === "presencial") return "1";
            if (normalizado === "2" || normalizado === "hibrido") return "2";
            if (normalizado === "3" || normalizado === "home office" || normalizado === "homeoffice") return "3";

            return "";
        }

        var planoAM = extrairCodigoPlano(
            getStr("cpPlanoAM") ||
            getStr("TxtIncPlanoSaudeTipoCod")
        );

        var planoAO = extrairCodigoPlano(
            getStr("cpPlanoAO") ||
            getStr("TxtIncPlanoOdontoTipoCod")
        );

        var dataInclusaoAM = getStr("cpDataInclusaoAM");
        var dataInclusaoAO = getStr("cpDataInclusaoAO");

        var clawback = getStr("cpPrazoClawback");
        var nivelIngles = normalizarNivelIngles(getStr("cpNivelIngles"));

        var modeloTrabalho = normalizarModeloTrabalho(
            getStr("cpModeloTrabalho") ||
            getStr("cpModeloDeTrabalho") ||
            getStr("MODELODETRABALHO")
        );

        var formacaoFuncionario = normalizarTextoComplementar(
            getStr("cpFormacaoFuncionario") ||
            getStr("cpFormacao") ||
            getStr("FORMACAO")
        );

        // Se todos os campos estiverem vazios, não há necessidade de chamar o RM
        if (
            nomeEmergencia === "" &&
            parentescoEmergencia === "" &&
            telefoneEmergencia === "" &&
            planoAM === "" &&
            planoAO === "" &&
            dataInclusaoAM === "" &&
            dataInclusaoAO === "" &&
            clawback === "" &&
            nivelIngles === "" &&
            modeloTrabalho === "" &&
            formacaoFuncionario === ""
        ) {
            log.info("### NENHUM DADO COMPLEMENTAR PARA INTEGRAR. IGNORANDO TASK 139...");
            return true;
        }

        // =========================================================================
        // 4. MONTAGEM DE INTEGRAÇÃO DO XML (PFCOMPL E VPCOMPL SEPARADAS)
        // =========================================================================
        var xmlCompl = "";
        xmlCompl += "<FopFunc>\n";

        var possuiBlocoComplementar = false;

        // A tag PFunc é enviada apenas com as chaves para que o RM saiba qual funcionário atualizar
        xmlCompl += "  <PFunc>\n";
        xmlCompl += tag("CODCOLIGADA", COLIGADA);
        xmlCompl += tag("CHAPA", CHAPA);
        xmlCompl += "  </PFunc>\n";

        if (
            planoAM !== "" ||
            planoAO !== "" ||
            dataInclusaoAM !== "" ||
            dataInclusaoAO !== "" ||
            clawback !== "" ||
            nivelIngles !== "" ||
            modeloTrabalho !== "" ||
            formacaoFuncionario !== ""
        ) {
            xmlCompl += "  <PFCOMPL>\n";
            xmlCompl += tag("CODCOLIGADA", COLIGADA);
            xmlCompl += tag("CHAPA", CHAPA);

            if (planoAM !== "") {
                xmlCompl += tag("ASSMEDICA", planoAM);
            }

            if (dataInclusaoAM !== "") {
                xmlCompl += tag("DTINCASSITMED", formatarDataRM(dataInclusaoAM));
            }

            if (planoAO !== "") {
                xmlCompl += tag("ASSODONTO", planoAO);
            }

            if (dataInclusaoAO !== "") {
                xmlCompl += tag("DTINCASSITODO", formatarDataRM(dataInclusaoAO));
            }

            if (clawback !== "") {
                xmlCompl += tag("CLAWBACK", formatarDataRM(clawback));
            }

            var xmlTagNivelIngles = "";

            if (nivelIngles !== "") {
                xmlTagNivelIngles = tag("NIVEL_INGLES", nivelIngles);
                xmlCompl += xmlTagNivelIngles;
            }

            if (modeloTrabalho !== "") {
                xmlCompl += tag("MODELODETRABALHO", modeloTrabalho);
            }

            if (formacaoFuncionario !== "") {
                xmlCompl += tag("FORMACAO", formacaoFuncionario);
            }

            xmlCompl += "  </PFCOMPL>\n";

            possuiBlocoComplementar = true;
        }

        // // Tabela VPCOMPL (Emergência) - Ligação EXCLUSIVA por CODPESSOA (conforme documentação do RM)
        // Tabela VPCOMPL (Emergência) - Ligação EXCLUSIVA por CODPESSOA
        if (nomeEmergencia !== "" || parentescoEmergencia !== "" || telefoneEmergencia !== "") {
            if (!CODPESSOA || CODPESSOA === "") {
                log.warn("### Contato de emergência ignorado: CODPESSOA não foi localizado.");
            } else {
                xmlCompl += "  <VPCOMPL>\n";
                xmlCompl += tag("CODPESSOA", CODPESSOA);

                if (nomeEmergencia !== "") {
                    xmlCompl += tag("CONTATO_EMERGENCIA", nomeEmergencia);
                }

                if (parentescoEmergencia !== "") {
                    xmlCompl += tag("GRAU_PAR_EMER", parentescoEmergencia);
                }

                if (telefoneEmergencia !== "") {
                    xmlCompl += tag("TELEFONE_EMERGENCIA", telefoneEmergencia);
                }

                xmlCompl += "  </VPCOMPL>\n";

                possuiBlocoComplementar = true;
            }
        }

        if (!possuiBlocoComplementar) {
            log.info("### TASK 139 SEM BLOCOS COMPLEMENTARES ATIVOS. INTEGRAÇÃO IGNORADA.");
            return true;
        }

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

        if (
            result &&
            result.indexOf("===") != -1 &&
            xmlTagNivelIngles !== "" &&
            resultadoErroNivelIngles(result)
        ) {
            log.warn("### RM rejeitou o nível de inglês. Reprocessando complementares sem NIVEL_INGLES para não bloquear a admissão.");

            xmlCompl = xmlCompl.replace(xmlTagNivelIngles, "");
            xmlTagNivelIngles = "";

            result = authService.saveRecord("FopFuncData", xmlCompl, RM_CONTEXTO);
            log.info("### RETORNO RM SEM NÍVEL DE INGLÊS: " + result);
        }

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