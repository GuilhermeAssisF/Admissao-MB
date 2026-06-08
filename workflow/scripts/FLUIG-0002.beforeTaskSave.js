function beforeTaskSave(colleagueId, nextSequenceId, userList) {
    var solicitacao = getValue("WKNumProces");
    var numState = getValue("WKNumState");
    
    log.info(">>> [ADMISSAO] beforeTaskSave executado na solicitação: " + solicitacao + " | Estado Atual: " + numState + " | Destino: " + nextSequenceId);

    // =========================================================================
    // AVISO DE ARQUITETURA
    // A geração de envelopes da TOTVS Assinatura Eletrônica (TAE) foi removida
    // do backend (servidor) para evitar falhas de transação no banco de dados.
    // Todo o fluxo de upload, envio de código e assinatura Headless acontece
    // agora exclusivamente no Front-end (Widget do Candidato).
    // =========================================================================
}