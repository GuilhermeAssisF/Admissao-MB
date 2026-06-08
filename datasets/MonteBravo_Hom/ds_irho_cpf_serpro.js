function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();
    log.info("### ADMISSÃO - NOVO DATASET SERPRO DIRETO | INICIO ###");

    // 1. Definição das colunas de retorno (Idêntico ao padrão esperado pelo view.js)
    dataset.addColumn("error");
    dataset.addColumn("response_code");
    dataset.addColumn("response_message");
    dataset.addColumn("cpf");
    dataset.addColumn("nome_completo");
    dataset.addColumn("dt_nascimento");
    dataset.addColumn("cod_situacao");
    dataset.addColumn("desc_situacao");

    var cpf = "";

    // 2. Leitura das Constraints (Filtros)
    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "cpf") {
                cpf = constraints[i].initialValue;
            }
        }
    }

    // Validação básica do CPF
    if (cpf == "" || cpf == null) {
        dataset.addRow(new Array("true", "0", "CPF não informado ou inválido", "", "", "", "", ""));
        return dataset;
    }

    // Limpa qualquer coisa que não seja número (pontos, traços, espaços)
    cpf = String(cpf).replace(/\D/g, "");
    
    // Força o CPF a ter 11 dígitos, preenchendo com zeros à esquerda caso o Fluig tenha cortado
    cpf = ("00000000000" + cpf).slice(-11);

    // ====================================================================================
    // INFORME AQUI AS SUAS NOVAS CREDENCIAIS DA SERPRO (Fornecidas na contratação)
    // ====================================================================================
    var consumerKey = "fHfjsdHwroMA01AYrtrybptkAt0a"; 
    var consumerSecret = "12f9vMaMShXWlcRoVan6rM1Q_MUa"; 
    // ====================================================================================

    var isr = null;
    var la = null;
    var connection = null;

    try {
        // --------------------------------------------------------------------------------
        // PASSO 1: GERAR O TOKEN DE ACESSO (OAUTH2)
        // --------------------------------------------------------------------------------
        var urlToken = "https://gateway.apiserpro.serpro.gov.br/token?grant_type=client_credentials";
        var strAuth = new java.lang.String(consumerKey + ":" + consumerSecret);
        var tokenLogin = java.util.Base64.getEncoder().encodeToString(strAuth.getBytes("utf-8"));
        
        var url = new java.net.URL(urlToken);
        connection = url.openConnection();
        connection.setDoOutput(true);
        connection.setConnectTimeout(10000);
        connection.setReadTimeout(10000);
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Authorization", "Basic " + tokenLogin);
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        var os = connection.getOutputStream();
        os.flush();

        var codRetornoToken = connection.getResponseCode();
        var msgRetornoToken = connection.getResponseMessage();
        var tokenApi = "";

        if (codRetornoToken == 200) {
            isr = new java.io.InputStreamReader(connection.getInputStream());
            la = new java.io.BufferedReader(isr);
            var responseString = "";
            var outputString = "";
            while ((responseString = la.readLine()) != null) {
                outputString += responseString;
            }
            
            var loginData = JSON.parse(outputString);
            tokenApi = loginData.access_token;
            
            if (isr != null) isr.close();
            if (la != null) la.close();
            if (connection != null) connection.disconnect();
        } else {
            dataset.addRow(new Array("true", codRetornoToken, "Erro Autenticação SERPRO - " + msgRetornoToken, "", "", "", "", ""));
            log.error("### ADMISSÃO - ERRO GERAR TOKEN SERPRO: " + codRetornoToken + " - " + msgRetornoToken);
            return dataset;
        }

        // --------------------------------------------------------------------------------
        // PASSO 2: CONSULTAR O CPF NA BASE DA RECEITA
        // --------------------------------------------------------------------------------
        if (tokenApi != "") {
            var serviceUrl = "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/" + cpf;
            url = new java.net.URL(serviceUrl);
            connection = url.openConnection();
            connection.setConnectTimeout(15000);
            connection.setReadTimeout(15000);
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Authorization", "Bearer " + tokenApi);
            connection.setRequestProperty("x-request-tag", "fluig_admissao");

            var codRetornoCpf = connection.getResponseCode();
            var msgRetornoCpf = connection.getResponseMessage();

            if (codRetornoCpf == 200) {
                isr = new java.io.InputStreamReader(connection.getInputStream(), "UTF-8");
                la = new java.io.BufferedReader(isr);
                var responseStringCpf = "";
                var outputStringCpf = "";
                while ((responseStringCpf = la.readLine()) != null) {
                    outputStringCpf += responseStringCpf;
                }

               var result = JSON.parse(outputStringCpf);

                // Tratamento seguro da Data de Nascimento (Tenta ler 'nascimento' ou 'dtNascimento')
                var dtNascBruta = result.nascimento || result.dtNascimento || result.dt_nascimento || "";
                var dtNascimentoFormatada = String(dtNascBruta);
                
                // Se a Serpro devolver DDMMAAAA (8 dígitos sem barras)
                if (dtNascimentoFormatada.length === 8 && dtNascimentoFormatada.indexOf("/") === -1) {
                    dtNascimentoFormatada = dtNascimentoFormatada.substring(0, 2) + "/" + 
                                            dtNascimentoFormatada.substring(2, 4) + "/" + 
                                            dtNascimentoFormatada.substring(4, 8);
                }

                // Populando o dataset com sucesso
                dataset.addRow(new Array(
                    "false", 
                    String(codRetornoCpf), 
                    "Sucesso", 
                    String(result.ni || result.cpf || ""), 
                    String(result.nome || result.nome_completo || ""), 
                    dtNascimentoFormatada, 
                    String(result.situacao ? result.situacao.codigo : ""), 
                    String(result.situacao ? result.situacao.descricao : "")
                ));

                log.info("### ADMISSÃO - SUCESSO CONSULTA CPF SERPRO ###");

            } else {
                // Tratamento de falhas do Serpro
                var erroFormatado = "ERRO API SERPRO - " + msgRetornoCpf;
                if (codRetornoCpf == 400) erroFormatado = "CPF informado não é válido (Serpro).";
                else if (codRetornoCpf == 404) erroFormatado = "CPF não foi encontrado na receita federal (Serpro).";
                else if (codRetornoCpf == 422) erroFormatado = "CPF informado é de um menor de idade, informe manualmente NOME e DATA NASCIMENTO.";

                dataset.addRow(new Array("true", String(codRetornoCpf), erroFormatado, "", "", "", "", ""));
                log.error("### ADMISSÃO - ERRO CONSULTA CPF: " + codRetornoCpf);
            }
        }

    } catch (e) {
        dataset.addRow(new Array("true", "500", "Erro na execução do script: " + e.message, "", "", "", "", ""));
        log.error("### ADMISSÃO - CATCH ERRO SERPRO: " + e.message);
    } finally {
        // Garantir que as conexões sejam sempre fechadas
        try { if (isr != null) isr.close(); } catch (ex) {}
        try { if (la != null) la.close(); } catch (ex) {}
        try { if (connection != null) connection.disconnect(); } catch (ex) {}
    }

    return dataset;
}

function onMobileSync(user) {}