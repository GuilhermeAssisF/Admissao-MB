function afterProcessCreate(processId) {
    // Grava o número do processo no formulário para referência futura
    hAPI.setCardValue("idProcessoFluig", processId);
    hAPI.setCardValue("cpNumeroSolicitacao", processId);

    log.info(">>> ADMISSAO (AFTER PROCESS CREATE): Iniciando envio de E-mail de Boas Vindas. ID: " + processId);

    try {
        var nomeCandidato = hAPI.getCardValue("txtNomeColaborador");
        var emailRaw = hAPI.getCardValue("txtEmail");
        var emailCandidato = (emailRaw != null) ? String(emailRaw).trim() : "";

        // =========================================================================
        // ENVIO DO E-MAIL DE BOAS VINDAS COM O LINK DO PORTAL
        // =========================================================================
        var dataExame = hAPI.getCardValue("cpDataHoraExame");
        var localExame = hAPI.getCardValue("cpNomeClinica");
        var endExame = hAPI.getCardValue("cpEnderecoClinica");
        var assuntoEmail = hAPI.getCardValue("hidden_mail_assunto");
        var corpoEmail = hAPI.getCardValue("hidden_mail_corpo");

        if (assuntoEmail == null || assuntoEmail == "") {
            assuntoEmail = "Processo de Admissão - Monte Bravo";
        }

        var baseUrl = getUrlConfiguracao("URL_PAGINA_CANDIDATO");
        var linkPortal = baseUrl + "?id_origem=" + processId;

        if (corpoEmail == null || corpoEmail == "") {
            corpoEmail = "Seja bem-vindo(a)! Para seguir com o processo admissional, acesse o portal pelo botão abaixo e conclua as etapas solicitadas.";
        } else {
            corpoEmail = String(corpoEmail);
        }

        corpoEmail = aplicarVariaveisTemplateEmail(corpoEmail, {
            "NOME": nomeCandidato,
            "NOME_CANDIDATO": nomeCandidato,
            "LINK_ADMISSAO": linkPortal,
            "DATA_EXAME": dataExame ? dataExame : "A ser agendado",
            "LOCAL_EXAME": localExame ? localExame : "A ser informado",
            "ENDERECO_EXAME": endExame ? endExame : "A ser informado",
            "NUMERO_SOLICITACAO": processId
        });

        corpoEmail = normalizarCorpoEmailConfigurado(corpoEmail);

        if (emailCandidato != null && emailCandidato != "") {
            var parametros = new java.util.HashMap();
            parametros.put("NOME_CANDIDATO", nomeCandidato);

            // Link para subir documentos no portal
            parametros.put("LINK_ADMISSAO", linkPortal);

            parametros.put("DATA_EXAME", dataExame ? dataExame : "A ser agendado");
            parametros.put("LOCAL_EXAME", localExame ? localExame : "A ser informado");
            parametros.put("ENDERECO_EXAME", endExame ? endExame : "A ser informado");
            parametros.put("CORPO_PERSONALIZADO", corpoEmail);
            parametros.put("subject", assuntoEmail);
            parametros.put("SUBJECT", assuntoEmail);

            var destinatarios = new java.util.ArrayList();
            destinatarios.add(emailCandidato);

            notifier.notify("admin", "TPL_ADMISSAO_MASTER", parametros, destinatarios, "text/html");
            log.info(">>> ADMISSAO: E-mail enviado com sucesso para: " + emailCandidato);
        } else {
            log.warn(">>> ADMISSAO: E-mail do candidato está vazio. E-mail não enviado.");
        }

    } catch (e) {
        log.error(">>> ADMISSAO: ERRO NO AFTER PROCESS CREATE: " + e);
    }
}

/**
 * Função para buscar a URL base parametrizada no dataset de configurações
 */
function getUrlConfiguracao(campo) {
    try {
        var ds = DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, [
            DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST)
        ], null);
        if (ds && ds.rowsCount > 0) return ds.getValue(0, campo);
    } catch (e) { log.error("Erro config: " + e); }
    return "URL_NAO_CONFIGURADA";
}

function aplicarVariaveisTemplateEmail(texto, variaveis) {
    var resultado = String(texto || "");

    for (var chave in variaveis) {
        if (variaveis.hasOwnProperty(chave)) {
            var valor = variaveis[chave] == null ? "" : String(variaveis[chave]);

            resultado = resultado.split("${" + chave + "}").join(valor);
            resultado = resultado.split("{{" + chave + "}}").join(valor);
        }
    }

    return resultado;
}

function normalizarCorpoEmailConfigurado(corpoEmail) {
    var corpo = String(corpoEmail || "");

    // Se o corpo já vier como HTML, não converte quebras de linha em <br>.
    // Isso evita espaçamentos enormes causados pela indentação do HTML salvo no dataset.
    var contemHtml = /<\/?[a-z][\s\S]*>/i.test(corpo);

    if (contemHtml) {
        return corpo
            .replace(/\r/g, "")
            .replace(/\n\s*\n/g, "\n")
            .replace(/>\s+</g, "><")
            .trim();
    }

    // Se for texto puro, aí sim converte quebra de linha em <br>.
    return corpo
        .replace(/\r/g, "")
        .replace(/\n/g, "<br>")
        .trim();
}