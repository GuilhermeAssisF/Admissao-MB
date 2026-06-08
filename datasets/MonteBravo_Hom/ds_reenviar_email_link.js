function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("status");
    dataset.addColumn("mensagem");

    var emailDestino = "";
    var nomeCandidato = "";
    var linkAcesso = "";

    // 1. Recupera os parâmetros enviados pelo formulário
    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "emailDestino") emailDestino = constraints[i].initialValue;
            if (constraints[i].fieldName == "nomeCandidato") nomeCandidato = constraints[i].initialValue;
            if (constraints[i].fieldName == "linkAcesso") linkAcesso = constraints[i].initialValue;
        }
    }

    // Validação básica
    if (emailDestino == "" || linkAcesso == "") {
        dataset.addRow(["ERRO", "E-mail ou Link não informados."]);
        return dataset;
    }

    try {
        // 2. Definição do Assunto e Corpo Personalizado para o Reenvio
        var assunto = "Reenvio de Acesso - Processo de Admissão";
        
        // Texto explicativo que aparecerá no corpo do template
        var corpoMensagem = "Recebemos uma solicitação para reenviar o seu link de acesso ao Portal de Admissão.<br><br>" +
                            "Por favor, utilize o botão abaixo para continuar o preenchimento dos seus dados.";

        // 3. Montagem dos Parâmetros para o Template TPL_ADMISSAO_MASTER
        // Referência: FLUIG-0002.afterProcessCreate.js
        var parametros = new java.util.HashMap();

        // Parâmetros Obrigatórios do Template
        parametros.put("NOME_CANDIDATO", nomeCandidato);
        parametros.put("LINK_ADMISSAO", linkAcesso);
        parametros.put("CORPO_PERSONALIZADO", corpoMensagem);

        // Campos de Exame Médico (Preenchemos com texto genérico pois é apenas um reenvio de link)
        // Isso evita que o template mostre "null" ou quebre se esperar valor
        parametros.put("DATA_EXAME", "Conforme informado anteriormente");
        parametros.put("LOCAL_EXAME", "Verificar orientações anteriores");
        parametros.put("ENDERECO_EXAME", "-");

        // Assunto (Requisito do Fluig para notifier)
        parametros.put("subject", assunto);
        parametros.put("SUBJECT", assunto);

        // 4. Configuração dos Destinatários
        var destinatarios = new java.util.ArrayList();
        destinatarios.add(emailDestino);

        // 5. Disparo do E-mail
        // O remetente "admin" pode ser alterado para um usuário específico se necessário
        notifier.notify("admin", "TPL_ADMISSAO_MASTER", parametros, destinatarios, "text/html");

        // Retorno de Sucesso
        dataset.addRow(["OK", "Email de reenvio disparado para " + emailDestino]);

    } catch (e) {
        // Retorno de Erro
        var erroMsg = e.toString();
        if (e.message) erroMsg = e.message;
        dataset.addRow(["ERRO", "Falha no envio: " + erroMsg]);
        log.error(">>> ERRO DATASET ds_reenviar_email_link: " + erroMsg);
    }

    return dataset;
}