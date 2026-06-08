function afterTaskCreate(colleagueId) {
    var atividade = getValue("WKNumState");
    var numSolicitacao = getValue("WKNumProces");

    hAPI.setCardValue("txtAtividadeAtual", atividade);

    log.info(">>> [ADMISSAO] afterTaskCreate: Atividade " + atividade + " | Solicitação " + numSolicitacao);

    // // ATIVIDADE 150: Envio do E-mail de Correção
    // // Este bloco só roda quando a tarefa 150 nasce (Vindo do Link de Correção)
    // if (atividade == 150) {
    //     log.info(">>> [ADMISSAO] Entrou no IF da Atividade 150. Preparando e-mail...");

    //     try {
    //         var nome = hAPI.getCardValue("txtNomeColaborador");
    //         var email = hAPI.getCardValue("txtEmail");
            
    //         // Tenta pegar do histórico primeiro (gravado no beforeStateEntry da ida)
    //         var parecerRH = hAPI.getCardValue("txtParecerHistoricoRH");
            
    //         // Fallback: Se não tiver histórico, pega do campo atual (mas cuidado, na volta isso pode estar sujo)
    //         if (!parecerRH || parecerRH == "") {
    //             parecerRH = hAPI.getCardValue("cpParecerAprovaAdmissao");
    //         }
            
    //         log.info(">>> [ADMISSAO] Parecer recuperado: " + parecerRH);

    //         if (email != null && email != "") {
    //             // Link da Widget
    //             var urlBase = getUrlConfiguracao("URL_PAGINA_CORRECAO");
    //             var linkCorrecao = urlBase + "?id_origem=" + numSolicitacao;

    //             var parametros = new java.util.HashMap();
    //             parametros.put("NOME_CANDIDATO", nome);
    //             parametros.put("LINK_ADMISSAO", linkCorrecao);
                
    //             var corpoMsg = "<b>O RH solicitou uma correção nos seus documentos:</b><br/><br/>" +
    //                            "<div style='background-color:#fff3cd; color:#856404; padding:15px; border-left:5px solid #ffc107;'>" + 
    //                            "<b>Motivo:</b> " + (parecerRH ? parecerRH : "Verifique os dados cadastrais.") + 
    //                            "</div><br/>" +
    //                            "Clique no botão abaixo para corrigir.";
                               
    //             parametros.put("CORPO_PERSONALIZADO", corpoMsg);
    //             parametros.put("subject", "Ação Necessária - Correção de Dados"); // Para templates genéricos
    //             parametros.put("SUBJECT", "Ação Necessária - Correção de Dados"); // Para alguns templates TOTVS
                
    //             // Campos dummy para evitar erro no template TPL_ADMISSAO_MASTER se ele exigir
    //             parametros.put("DATA_EXAME", " ");
    //             parametros.put("LOCAL_EXAME", " ");
    //             parametros.put("ENDERECO_EXAME", " ");

    //             var dest = new java.util.ArrayList();
    //             dest.add(email);
                
    //             // Dispara o e-mail
    //             notifier.notify("admin", "TPL_ADMISSAO_MASTER", parametros, dest, "text/html");
    //             log.info(">>> [ADMISSAO] SUCESSO: E-mail de correção enviado para " + email);
    //         } else {
    //             log.warn(">>> [ADMISSAO] AVISO: E-mail do candidato está vazio. Notificação não enviada.");
    //         }
    //     } catch (e) {
    //         log.error(">>> [ADMISSAO] ERRO CRÍTICO ao enviar e-mail na atv 150: " + e);
    //     }
    // }
}