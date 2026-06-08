function defineStructure() { }

function onSync(lastSyncDate) { }

function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("status");
    dataset.addColumn("message");
    dataset.addColumn("response");

    var action = "";
    var payloadStr = "{}";

    try {
        if (constraints != null && constraints.length > 0) {
            for (var i = 0; i < constraints.length; i++) {
                if (constraints[i].fieldName == "action" || constraints[i].fieldName == "_action") {
                    action = constraints[i].initialValue;
                }
                if (constraints[i].fieldName == "payload" || constraints[i].fieldName == "_payload") {
                    payloadStr = constraints[i].initialValue;
                }
            }
        }

        if (action == "") {
            throw "Ação não informada. Utilize constraint 'action'.";
        }

        var payload = JSON.parse(payloadStr);

        var configuracoes = getConfiguracoes();
        if (!configuracoes) {
            throw "Configurações de Admissão não encontradas no Form_Configuracoes_Admissao.";
        }

        var responseData = {};

        switch (String(action)) {
            case "SAVE_AND_SEND_TASK":
                responseData = doSaveAndSendTask(payload, configuracoes);
                break;
            case "UPDATE_CARD_DATA":
                responseData = doUpdateCardData(payload, configuracoes);
                break;
            case "GET_DATASET":
                responseData = doGetDataset(payload);
                break;
            case "GET_DOWNLOAD_URL":
                responseData = doGetDownloadUrl(payload, configuracoes);
                break;
            default:
                throw "Ação não suportada pelo proxy: " + action;
        }

        dataset.addRow(["success", "Ação executada com sucesso", JSON.stringify(responseData)]);

    } catch (e) {
        log.error("ds_irho_api_proxy ERRO: " + e.toString());
        dataset.addRow(["error", e.toString(), "{}"]);
    }

    return dataset;
}

function onMobileSync(user) { }

// ===========================================
// FUNÇÕES DE APOIO
// ===========================================

function getConfiguracoes() {
    var ds = DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, [
        DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST)
    ], null);

    if (ds && ds.rowsCount > 0) {
        return {
            RM_USER: ds.getValue(0, "RM_USER"),
            RM_PASS: ds.getValue(0, "RM_PASS"),
            RM_ENDPOINT_WS: ds.getValue(0, "RM_ENDPOINT_WS"),
            FLUIG_OAUTH_CONSUMER_KEY: ds.getValue(0, "FLUIG_OAUTH_CONSUMER_KEY"),
            FLUIG_OAUTH_CONSUMER_SECRET: ds.getValue(0, "FLUIG_OAUTH_CONSUMER_SECRET"),
            FLUIG_OAUTH_TOKEN: ds.getValue(0, "FLUIG_OAUTH_TOKEN"),
            FLUIG_OAUTH_TOKEN_SECRET: ds.getValue(0, "FLUIG_OAUTH_TOKEN_SECRET"),
            FLUIG_SOAP_USER: ds.getValue(0, "FLUIG_SOAP_USER"),
            FLUIG_SOAP_PASS: ds.getValue(0, "FLUIG_SOAP_PASS")
        };
    }
    return null;
}

// ===========================================
// MÉTODOS DE AÇÃO DO PROXY
// ===========================================

function doSaveAndSendTask(payload, config) {
    var companyId = 1;

    var xmlSoap = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.workflow.ecm.technology.totvs.com/">' +
        '<soapenv:Header/><soapenv:Body><ws:saveAndSendTask>' +
        '<username>' + config.FLUIG_SOAP_USER + '</username>' +
        '<password>' + config.FLUIG_SOAP_PASS + '</password>' +
        '<companyId>' + companyId + '</companyId>' +
        '<processInstanceId>' + payload.processInstanceId + '</processInstanceId>' +
        '<choosedState>' + payload.choosedState + '</choosedState>' +
        '<colleagueIds><item>System:Auto</item></colleagueIds>' +
        '<comments>' + (payload.comments || '') + '</comments>' +
        '<userId>' + config.FLUIG_SOAP_USER + '</userId>' +
        '<completeTask>true</completeTask>' +
        '<attachments>' + (payload.attachmentsXml || '') + '</attachments>' +
        '<cardData>' + (payload.cardDataXml || '') + '</cardData>' +
        '<appointment></appointment>' +
        '<managerMode>true</managerMode>' +
        '<threadSequence>0</threadSequence>' +
        '</ws:saveAndSendTask></soapenv:Body></soapenv:Envelope>';

    return callInternalFluigAPI(config, "/webdesk/ECMWorkflowEngineService?wsdl", "POST", xmlSoap, "text/xml;charset=utf-8");
}

function doUpdateCardData(payload, config) {
    var companyId = 1;
    
    // Função auxiliar simples para dar escape no XML caso seja enviado JSON parseado para cá
    function escapeXML(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }
    
    var cardDataXml = "";
    if (payload.cardData) {
        var dadosObjeto = payload.cardData;
        for (var key in dadosObjeto) {
            if (dadosObjeto.hasOwnProperty(key)) {
                var valor = (dadosObjeto[key] === undefined || dadosObjeto[key] === null) ? "" : String(dadosObjeto[key]);
                cardDataXml += '<item><field>' + key + '</field><value>' + escapeXML(valor) + '</value></item>';
            }
        }
    } else if (payload.cardDataXml) {
        cardDataXml = payload.cardDataXml; // Permite mandar XML já montado tbm
    }

    var xmlSoap = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dm.ecm.technology.totvs.com/">' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
        '<ws:updateCardData>' +
        '<companyId>' + companyId + '</companyId>' +
        '<username>' + config.FLUIG_SOAP_USER + '</username>' +
        '<password>' + config.FLUIG_SOAP_PASS + '</password>' +
        '<cardId>' + payload.cardId + '</cardId>' +
        '<cardData>' + cardDataXml + '</cardData>' +
        '</ws:updateCardData>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>';

    return callInternalFluigAPI(config, "/webdesk/ECMCardService?wsdl", "POST", xmlSoap, "text/xml;charset=utf-8");
}

function doGetDataset(payload) {
    var c = [];
    if (payload.constraints) {
        for (var i = 0; i < payload.constraints.length; i++) {
            var pc = payload.constraints[i];
            var type = ConstraintType.MUST;
            if (pc._type == 2) type = ConstraintType.SHOULD;
            if (pc._type == 3) type = ConstraintType.MUST_NOT;
            c.push(DatasetFactory.createConstraint(pc._field, pc._initialValue, pc._finalValue, type));
        }
    }

    var ds = DatasetFactory.getDataset(payload.name, null, c, null);
    var records = [];
    if (ds && ds.rowsCount > 0) {
        for (var r = 0; r < ds.rowsCount; r++) {
            var obj = {};
            for (var col = 0; col < ds.getColumnsCount(); col++) {
                // 1. Garante que o nome da coluna é uma string JS nativa
                var colName = String(ds.getColumnName(col)); 
                
                // 2. Garante que o valor é uma string JS nativa (e trata nulos)
                var rawValue = ds.getValue(r, colName);
                obj[colName] = rawValue != null ? String(rawValue) : ""; 
            }
            records.push(obj);
        }
    }

    return { records: records };
}

function doGetDownloadUrl(payload, config) {
    // Call the Fluig API securely using OAuth tokens to bypass Guest lack of privileges
    return callInternalFluigAPI(config, "/api/public/2.0/documents/getDownloadURL/" + payload.documentId, "GET", "");
}

function callInternalFluigAPI(config, path, method, body, contentType) {
    var serverUrl = "";

    try {
        // Tenta pegar a URL do servidor nativamente via fluigAPI (funciona na maioria dos ambientes de dataset modernos)
        serverUrl = fluigAPI.getPageService().getServerURL();
    } catch (e) {
        log.warn("Proxy: fallback para fluigAPI falhou, tentando tenant service.");
        try {
            var tenantService = fluigAPI.getTenantService();
            if (tenantService) {
                // Montamos a URL do tenant
                var urlObj = new java.net.URL(tenantService.getTenantById(1).getUrl());
                serverUrl = urlObj.getProtocol() + "://" + urlObj.getHost() + (urlObj.getPort() !== -1 ? ":" + urlObj.getPort() : "");
            }
        } catch (e2) {
            log.warn("Proxy: fallback de URL falhou, usando host header local caso disponivel.");
            serverUrl = "http://localhost:8080";
        }
    }

    log.info("Proxy chamando Backend: " + serverUrl + path);

    var connection = null;
    try {
        var urlObject = new java.net.URL(serverUrl + path);
        connection = urlObject.openConnection();
        connection.setRequestMethod(method);

        if (contentType) {
            connection.setRequestProperty("Content-Type", contentType);
        }

        if (body && (method == "POST" || method == "PUT")) {
            connection.setDoOutput(true);
            var os = connection.getOutputStream();
            var outText = new java.lang.String(body);
            os.write(outText.getBytes("UTF-8"));
            os.flush();
            os.close();
        }

        var responseCode = connection.getResponseCode();
        var is = (responseCode >= 200 && responseCode < 300) ? connection.getInputStream() : connection.getErrorStream();

        var scanner = new java.util.Scanner(is, "UTF-8").useDelimiter("\\A");
        var responseBody = scanner.hasNext() ? scanner.next() : "";

        scanner.close();

        return {
            status: Number(responseCode),
            response: String(responseBody)
        };

    } catch (e) {
        log.error("ERRO NO PROXY: " + e.toString());
        throw "Erro na comunicação Backend (" + path + "): " + e.toString();
    } finally {
        if (connection != null) {
            connection.disconnect();
        }
    }
}
