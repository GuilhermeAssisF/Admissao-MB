function afterTaskSave(colleagueId, nextSequenceId, userList) {
    var atividadeAtual = getValue("WKNumState");
    var numSolicitacao = getValue("WKNumProces");

    log.info("### ADMISSAO DIGITAL [" + numSolicitacao + "]: Iniciando afterTaskSave. Atv Atual: " + atividadeAtual + " -> Destino: " + nextSequenceId);

    // =========================================================================
    // BLOCO 1: CONVERSÃO DE ANEXOS (Vindo da Página Pública ou Widget Assinatura)
    // =========================================================================
    var origem = hAPI.getCardValue("origem_dados");

    if (origem == "pagina_publica" || origem == "widget_saveAndSendTask") {
        log.info("### ADMISSAO DIGITAL: Origem pública detectada. Verificando anexos Base64.");

        // Lista de campos que podem conter arquivos Base64
        var docsParaProcessar = [
            ["cand_doc_rg_base64", "cand_doc_rg_nome"],
            ["cand_doc_titulo_base64", "cand_doc_titulo_nome"],
            ["cand_doc_escolaridade_base64", "cand_doc_escolaridade_nome"],
            ["cand_doc_residencia_base64", "cand_doc_residencia_nome"],
            ["cand_doc_banco_base64", "cand_doc_banco_nome"],
            ["cand_doc_nascimento_base64", "cand_doc_nascimento_nome"],
            ["cand_doc_cpf_base64", "cand_doc_cpf_nome"],
            ["cand_doc_reservista_base64", "cand_doc_reservista_nome"],
            ["cand_doc_cnh_base64", "cand_doc_cnh_nome"],
            ["cand_doc_ctps_base64", "cand_doc_ctps_nome"],
            ["cand_doc_pis_base64", "cand_doc_pis_nome"],
            ["cand_foto_base64", "cand_foto_nome"]
            // Nota: O comprovante de assinatura já vem via <attachments> no SOAP, 
            // então não precisa estar nesta lista se usar a widget nova corretamente.
        ];

        for (var i = 0; i < docsParaProcessar.length; i++) {
            var campoBase64 = docsParaProcessar[i][0];
            var campoNome = docsParaProcessar[i][1];

            try {
                processarAnexoBase64(campoBase64, campoNome);
            } catch (erroDoc) {
                log.error("### ADMISSAO DIGITAL: Erro ao anexar " + campoNome + ": " + erroDoc);
            }
        }

        // Limpa a flag para não processar novamente sem necessidade
        hAPI.setCardValue("origem_dados", "processado_fluig");
    }

    // =========================================================================
    // BLOCO 2: E-MAIL DE BOAS-VINDAS (Início do Processo)
    // =========================================================================
    if (atividadeAtual == 0 || atividadeAtual == 4 || atividadeAtual == 41) {
        var nomeColaborador = hAPI.getCardValue("txtNomeColaborador");
        var emailDestino = hAPI.getCardValue("txtEmail");

        if (emailDestino != null && emailDestino != "") {
            try {
                var parametros = new java.util.HashMap();
                parametros.put("NOME_CANDIDATO", nomeColaborador);
                parametros.put("NUM_SOLICITACAO", numSolicitacao);
                parametros.put("subject", "Confirmação de Recebimento - Solicitação " + numSolicitacao);

                var destinatarios = new java.util.ArrayList();
                destinatarios.add(emailDestino);

                notifier.notify("admin", "TPL_ADMISSAO_BOASVINDAS", parametros, destinatarios, "text/html");
            } catch (e) {
                log.warn("### ADMISSAO DIGITAL: Erro no envio de Boas Vindas: " + e);
            }
        }
    }

    // =========================================================================
    // BLOCO 3: E-MAIL DE CORREÇÃO (Saída do RH - Atv 97 -> Correção)
    // =========================================================================
    if (atividadeAtual == 97) {
        var decisaoRH = hAPI.getCardValue("cpAprovacaoAdmissao"); // 1=Aprovar, 2=Reprovar, 3=Corrigir

        if (decisaoRH == "3" || decisaoRH == "Corrigir") {
            try {
                enviarEmailCorrecao(numSolicitacao);
            } catch (e) {
                log.error("### ADMISSAO DIGITAL: Erro ao enviar e-mail de correção: " + e);
            }
        }
    }

    // =========================================================================
    // BLOCO 4: E-MAIL DE ASSINATURA DE CONTRATO (Saída do Kit - Atv 128 -> Assinatura)
    // =========================================================================
    if (atividadeAtual == 128) {
        var decisaoKitRaw = hAPI.getCardValue("cpAprovacaoKit");

        // 1. Blindagem contra nulo e padronização (Tudo maiúsculo e sem espaços)
        var decisaoKit = (decisaoKitRaw != null) ? String(decisaoKitRaw).toUpperCase().trim() : "";

        // LOG PARA DEBUG: Vai imprimir no server.log EXATAMENTE o que o Fluig está lendo
        log.info("### ADMISSAO [ASSINATURA]: Atv 128 salva. Valor do cpAprovacaoKit lido: [" + decisaoKit + "]");

        // 2. Abordagem ampla: aceita as variações comuns de aprovação
        if (decisaoKit == "1" || decisaoKit == "APROVADO" || decisaoKit == "APROVAR" || decisaoKit == "SIM") {
            log.info("### ADMISSAO [ASSINATURA]: Condição validada! Chamando enviarEmailAssinatura()...");
            try {
                enviarEmailAssinatura(numSolicitacao);
            } catch (e) {
                log.error("### ADMISSAO [ASSINATURA]: ERRO Fatal ao tentar enviar e-mail: " + e);
            }
        } else {
            log.warn("### ADMISSAO [ASSINATURA]: A decisão foi [" + decisaoKit + "]. Como não é Aprovar, o e-mail não será enviado.");
        }
    }

    // =========================================================================
    // BLOCO 5: DOCUMENTOS DO CANDIDATO (Ao sair da Admissão RH 97 -> 138)
    // =========================================================================
    if (atividadeAtual == 97) {
        var pastaCandidato = hAPI.getCardValue("cpIdPastaDocsCandidato");
        moverAnexosParaSubpasta(pastaCandidato, numSolicitacao, atividadeAtual);
    }

    // =========================================================================
    // BLOCO 6: DOCUMENTOS GERADOS DO KIT (Ao sair da Validação 128 -> 129)
    // =========================================================================
    if (atividadeAtual == 128) {
        var pastaKit = hAPI.getCardValue("cpIdPastaDocsGerados");
        moverAnexosParaSubpasta(pastaKit, numSolicitacao, atividadeAtual);
    }

    // =========================================================================
    // BLOCO 7: DOCUMENTOS ASSINADOS (Ao sair da Assinatura 129 -> 104)
    // =========================================================================
    if (atividadeAtual == 129) {
        var pastaAssinados = hAPI.getCardValue("cpIdPastaDocsAssinados");
        moverAnexosParaSubpasta(pastaAssinados, numSolicitacao, atividadeAtual);
    }

}

// =============================================================================
// FUNÇÕES AUXILIARES (FORA DO ESCOPO DA afterTaskSave)
// =============================================================================

// Esta função envia um e-mail para o candidato com um link direto para a Widget Pública de Assinatura. O link é personalizado com o número da solicitação para facilitar a navegação do usuário.
function enviarEmailAssinatura(numSolicitacao) {
    var nome = hAPI.getCardValue("txtNomeColaborador");
    var emailRaw = hAPI.getCardValue("txtEmail");

    if (emailRaw != null && emailRaw != "") {
        // Limpa espaços vazios invisíveis que causam o erro "Invalid Addresses"
        var email = String(emailRaw).trim();

        // URL da Widget Pública de Assinatura
        var urlBase = getUrlConfiguracao("URL_PAGINA_ASSINATURA");
        var linkAssinatura = urlBase + "?id_origem=" + numSolicitacao;

        var parametros = new java.util.HashMap();
        parametros.put("NOME_CANDIDATO", nome);
        parametros.put("LINK_ASSINATURA", linkAssinatura);
        parametros.put("LINK_ADMISSAO", linkAssinatura);

        var corpoMsg = "Parabéns! Sua admissão foi aprovada e seu contrato gerado com sucesso.<br/><br/>" +
            "O último passo é realizar a <b>Assinatura Digital</b> dos seus documentos.<br/>" +
            "Acesse o portal de forma segura clicando no botão abaixo.";

        parametros.put("CORPO_PERSONALIZADO", corpoMsg);

        parametros.put("subject", "Ação Necessária - Assinatura de Contrato");
        parametros.put("SUBJECT", "Ação Necessária - Assinatura de Contrato");

        var dest = new java.util.ArrayList();
        // Usamos a variável limpa diretamente
        dest.add(email);

        notifier.notify("admin", "TPL_ADMISSAO_CANDIDATO_REDUZIDO", parametros, dest, "text/html");

        log.info("### ADMISSAO DIGITAL: Convite de assinatura inserido na fila para " + email);
    } else {
        log.warn("### ADMISSAO DIGITAL: E-mail não preenchido. Convite de assinatura cancelado.");
    }
}

// Esta função envia um e-mail para o candidato solicitando correção de dados, com um link direto para a Widget Pública de Correção. O motivo da correção é destacado no corpo do e-mail.
function enviarEmailCorrecao(numSolicitacao) {
    var nome = hAPI.getCardValue("txtNomeColaborador");
    var email = hAPI.getCardValue("txtEmail");
    var parecerRH = hAPI.getCardValue("cpParecerAprovaAdmissao");

    if (email != null && email != "") {
        // Link da Widget Pública de Correção
        var urlBase = getUrlConfiguracao("URL_PAGINA_CORRECAO");
        var linkCorrecao = urlBase + "?id_origem=" + numSolicitacao;

        var parametros = new java.util.HashMap();
        parametros.put("NOME_CANDIDATO", nome);
        parametros.put("LINK_ADMISSAO", linkCorrecao);

        var corpoMsg = "<b>O RH solicitou uma correção nos seus documentos:</b><br/><br/>" +
            "<div style='background-color:#fff3cd; color:#856404; padding:15px; border-left:5px solid #ffc107;'>" +
            "<b>Motivo:</b> " + (parecerRH ? parecerRH : "Verifique os dados cadastrais.") +
            "</div><br/>" +
            "Clique no botão abaixo para acessar o formulário e corrigir.";

        parametros.put("CORPO_PERSONALIZADO", corpoMsg);
        parametros.put("subject", "Ação Necessária - Correção de Dados");

        var dest = new java.util.ArrayList();
        dest.add(email);

        notifier.notify("admin", "TPL_ADMISSAO_CANDIDATO_REDUZIDO", parametros, dest, "text/html");
    }
}

// Esta função processa um campo Base64, cria um arquivo temporário, publica no GED e anexa à solicitação. Depois tenta apagar o arquivo temporário de forma segura.
function processarAnexoBase64(campoBase64, campoNomeArquivo) {
    var base64 = hAPI.getCardValue(campoBase64);
    var nomeArquivo = hAPI.getCardValue(campoNomeArquivo);

    if (base64 != null && base64 != "" && nomeArquivo != null && nomeArquivo != "") {
        // Remove cabeçalho data:image/png;base64, se existir
        if (base64.indexOf(",") > -1) {
            base64 = base64.split(",")[1];
        }

        try {
            // 1. Decodifica o Base64
            var decodedBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64);

            // 2. Cria um arquivo físico na pasta temporária do servidor Fluig
            var tempDir = java.lang.System.getProperty("java.io.tmpdir");
            var tempFile = new java.io.File(tempDir + java.io.File.separator + nomeArquivo);
            var fos = new java.io.FileOutputStream(tempFile);
            fos.write(decodedBytes);
            fos.flush();
            fos.close();

            // Substitua as linhas do idPastaDestino por isto:
            var pastaDocsCand = hAPI.getCardValue("cpIdPastaDocsCandidato");
            var idPastaDestino = (pastaDocsCand != null && pastaDocsCand != "") ? parseInt(pastaDocsCand) : parseInt(hAPI.getCardValue("cpIdPastaGedCandidato"));

            var dto = fluigAPI.getDocumentService().buildDocumentVO();
            dto.setDocumentDescription(nomeArquivo);
            dto.setParentDocumentId(idPastaDestino);
            dto.setPhisicalFile(tempFile.getAbsolutePath());

            var docVO = fluigAPI.getDocumentService().createDocument(dto, "", false);
            var idDocumentoGED = docVO.getDocumentId();

            // 4. Anexa o documento efetivamente à solicitação Workflow
            hAPI.attachDocument(idDocumentoGED);

            // 5. Atualiza o campo base64 no formulário
            hAPI.setCardValue(campoBase64, "[ANEXADO]");

            // 6. Tenta apagar o arquivo temporário de forma segura
            try {
                // Força o Java a apagar quando a rotina terminar, caso esteja em uso
                tempFile.deleteOnExit();

                // Tenta apagar imediatamente usando a classe NIO do Java (mais segura que o .delete comum)
                var path = java.nio.file.Paths.get(tempFile.getAbsolutePath());
                java.nio.file.Files.deleteIfExists(path);

            } catch (erroDelete) {
                log.warn("### ADMISSAO DIGITAL: Não foi possível apagar o arquivo temporário agora. Ele será limpo pelo sistema depois. Arquivo: " + tempFile.getAbsolutePath());
            }
            hAPI.setCardValue(campoBase64, "[ANEXADO]");

        } catch (e) {
            throw "Falha na conversão e anexo do Base64 (" + nomeArquivo + "): " + e;
        }
    }
}

function getUrlConfiguracao(campo) {
    try {
        var ds = DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, [
            DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST)
        ], null);
        if (ds && ds.rowsCount > 0) {
            return ds.getValue(0, campo);
        }
    } catch (e) { log.error("Erro ao ler Form_Configuracoes_Admissao: " + e); }
    return "URL_NAO_CONFIGURADA";
}

// Função auxiliar para mover os anexos soltos para a respectiva subpasta
function moverAnexosParaSubpasta(idPastaDestino, numSolicitacao, atividadeAtual) {
    if (idPastaDestino == null || idPastaDestino.trim() == "") {
        log.warn("### ADMISSAO DIGITAL ALERTA [" + numSolicitacao + "]: ID da subpasta destino não encontrado.");
        return;
    }

    // NOVA CONSULTA: Lê a atividade de assinatura configurada globalmente
    var atvAssinatura = 129;
    try {
        var dsConfig = DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, [
            DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST)
        ], null);
        if (dsConfig && dsConfig.rowsCount > 0) {
            var confAssinatura = dsConfig.getValue(0, "ATIVIDADE_CANDIDATO_ASSINATURA");
            if (confAssinatura != null && confAssinatura != "") {
                atvAssinatura = parseInt(confAssinatura);
            }
        }
    } catch (e) { log.error("Erro ao buscar config da atv de assinatura: " + e); }

    try {
        var codigoPasta = java.lang.Integer.valueOf(idPastaDestino.trim());
        var dataAtual = java.util.Calendar.getInstance().getTime();
        var docs = hAPI.listAttachments();

        // Mapeia onde estão as nossas 4 gavetas de organização (incluindo a raiz)
        var idPastaPrincipal = parseInt(hAPI.getCardValue("cpIdPastaGedCandidato") || "0");
        var idSub1 = parseInt(hAPI.getCardValue("cpIdPastaDocsCandidato") || "0");
        var idSub2 = parseInt(hAPI.getCardValue("cpIdPastaDocsGerados") || "0");
        var idSub3 = parseInt(hAPI.getCardValue("cpIdPastaDocsAssinados") || "0");

        if (docs != null && docs.size() > 0) {
            for (var i = 0; i < docs.size(); i++) {
                var doc = docs.get(i);
                if (doc == null) continue;

                var parentId = doc.getParentDocumentId();
                var nomeAnexo = String(doc.getDocumentDescription());
                var tipoAnexo = String(doc.getDocumentType());

                // ==========================================================
                // REGRA DE OURO V3: Protege as pastas, com exceções controladas
                // ==========================================================
                if (parentId == idSub1 || parentId == idSub2 || parentId == idSub3 || parentId == idPastaPrincipal) {

                    // Exceção 1: Na Assinatura (129), permite puxar os "Assinados" para a Subpasta 3
                    if (atividadeAtual == 129 && nomeAnexo.indexOf("Assinado") > -1 && parentId != idSub3) {
                        // Deixa passar
                    }
                    // Exceção 2: Na Admissão RH (97), permite organizar o que estiver solto na Raiz para a Subpasta 1
                    else if (atividadeAtual == 97 && parentId == idPastaPrincipal) {
                        // Deixa passar
                    }
                    else {
                        continue; // Está seguro na estrutura, pula para o próximo!
                    }
                }

                // Efetua a movimentação do arquivo solto para a gaveta certa
                if (tipoAnexo == "2" || tipoAnexo == "7" || tipoAnexo == "1") {
                    doc.setParentDocumentId(codigoPasta);
                    doc.setExpires(false);
                    doc.setCreateDate(dataAtual);
                    doc.setInheritSecurity(true);
                    doc.setTopicId(1);
                    doc.setUserNotify(false);
                    doc.setValidationStartDate(dataAtual);
                    doc.setVersionOption("0");
                    doc.setUpdateIsoProperties(true);

                    hAPI.publishWorkflowAttachment(doc);
                    log.info("### ADMISSAO DIGITAL [" + numSolicitacao + "]: Arquivo '" + nomeAnexo + "' organizado na pasta " + codigoPasta);
                }
            }
        }
    } catch (e) {
        log.error("### ADMISSAO DIGITAL ERRO AO ORGANIZAR ANEXOS [" + numSolicitacao + "]: " + e);
    }
}

/**
 * Função auxiliar para buscar a URL parametrizada no dataset de configurações
 */
function getUrlConfiguracao(campo) {
    try {
        var ds = DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, [
            DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST)
        ], null);
        if (ds && ds.rowsCount > 0) return ds.getValue(0, campo);
    } catch (e) { log.error("Erro config URL: " + e); }
    return "URL_NAO_CONFIGURADA";
}