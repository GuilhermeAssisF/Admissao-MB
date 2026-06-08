function displayFields(form, customHTML) {
    form.setShowDisabledFields(true);
    form.setHidePrintLink(true);

    // =========================================================================
    // 1. INJEÇÃO DE VARIÁVEIS GLOBAIS
    // =========================================================================
    customHTML.append("<script>function getWKNumState(){ return " + getValue("WKNumState") + "; }</script>");
    customHTML.append("<script>function getTodayDate(){ return " + new java.util.Date().getTime() + "; }</script>");
    customHTML.append("<script>function getFormMode(){ return '" + form.getFormMode() + "'; }</script>");
    customHTML.append("<script>function getUser(){ return '" + getValue("WKUser") + "'; }</script>");
    customHTML.append("<script>function getCompany(){ return " + getValue("WKCompany") + "; }</script>");

    var wkNumState = getValue("WKNumState");
    var atividade = (wkNumState != null && wkNumState != "") ? parseInt(wkNumState) : 0;
    var modo = form.getFormMode();

    // =========================================================================
    // 2. REGRAS DE BACKEND (Setar valores e Responsaveis)
    // =========================================================================
    if (form.getFormMode() != "VIEW" && (atividade == 0 || atividade == 1 || atividade == 4)) {
        var hoje = new Date();
        var dia = ("0" + hoje.getDate()).slice(-2);
        var mes = ("0" + (hoje.getMonth() + 1)).slice(-2);
        var ano = hoje.getFullYear();

        form.setValue("cpDataAbertura", dia + "/" + mes + "/" + ano);

        var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);
        var dsUser = DatasetFactory.getDataset("colleague", null, [c1], null);
        if (dsUser.rowsCount > 0) {
            form.setValue("cpNomeSolicitante", dsUser.getValue(0, "colleagueName"));
            form.setValue("cpEmailSolicitante", dsUser.getValue(0, "mail"));
        }
    }

    if (atividade == 7) { form.setValue("cpRespGestor", getValue("WKUser")); }
    if (atividade == 8) { form.setValue("cpRespDiretor", getValue("WKUser")); }
    if (atividade == 74) { form.setValue("cpRespRH", getValue("WKUser")); }
    if (atividade == 89) { form.setValue("cpAnalistaBPO", getValue("WKUser")); }
    if (atividade == 135) { form.setValue("cpRespGerarKit", getValue("WKUser")); }
    if (atividade == 128) { 
        form.setValue("cpRespValidaKit", getValue("WKUser"));
        var decisaoAtual = form.getValue("cpAprovacaoKit");
        if (decisaoAtual == "3" || decisaoAtual == "Corrigir") {
            form.setValue("cpAprovacaoKit", "");
            form.setValue("cpParecerValidaKit", "");
        }
    }
    if (atividade == 97) {
        form.setValue("cpRespAdmissao", getValue("WKUser"));
        var decisaoAtual = form.getValue("cpAprovacaoAdmissao");
        if (decisaoAtual == "3" || decisaoAtual == "Corrigir") {
            form.setValue("cpAprovacaoAdmissao", "");
            form.setValue("cpParecerAprovaAdmissao", "");
        }
        form.setEnabled("cpAprovacaoAdmissao", true);
        form.setEnabled("cpParecerAprovaAdmissao", true);
    }

    // CONVERSÃO DE DATAS
    var formatoInput = new java.text.SimpleDateFormat("yyyy-MM-dd");
    var formatoOutput = new java.text.SimpleDateFormat("dd/MM/yyyy");

    function converterDataIsoParaBr(campo) {
        var valor = form.getValue(campo);
        if (valor != null && valor.indexOf("-") > 0) {
            try {
                var dataObj = formatoInput.parse(valor);
                form.setValue(campo, formatoOutput.format(dataObj));
            } catch (e) { log.error("Erro ao converter data: " + e); }
        }
    }

    var camposData = ["txtAdmissao", "dtDataNascColaborador", "DTEMISSAOIDENT", "DTTITELEITOR", "dtDataEmissaoCartTrab", "DTVENCHABILIT", "DTEMISSAOCNH", "DtEmRIC", "DTRNE", "DtChegBras", "DTEmPrimCNH", "TxtDtContSind"];
    for (var i = 0; i < camposData.length; i++) { converterDataIsoParaBr(camposData[i]); }

    // =========================================================================
    // 3. REGRAS DE FRONT-END (Consolidadas em um único $(document).ready)
    // =========================================================================
    customHTML.append("<script>");
    customHTML.append("$(document).ready(function() { ");

    // Oculta todos os painéis condicionais por padrão para evitar piscar tela
    customHTML.append("  $('#panelAtividade_7, #panelAtividade_8, #panelAtividade_74, #panelAtividade_89, #panelAtividade_97').hide(); ");
    customHTML.append("  $('#painelGerarKit, #divValidarKit, #divReenviarEmailCandidato, #painelAnexarASO, #painelAprovacaoRH, #painelCorrecaoCandidato').hide(); ");
    
    // Regras de Atividades (Aprovações)
    if (atividade == 7 || atividade == 8 || atividade == 74 || atividade == 97) { customHTML.append("  $('#panelAtividade_7').show(); "); }
    if (atividade == 8 || atividade == 74 || atividade == 97) { customHTML.append("  $('#panelAtividade_8').show(); "); }
    if (atividade == 74 || atividade == 89) { customHTML.append("  $('#panelAtividade_74').show(); "); }
    if (atividade == 89) { customHTML.append("  $('#panelAtividade_89').show(); "); }
    if (atividade == 97 || atividade == 74) { customHTML.append("  $('#panelAtividade_97').show(); "); }

    // Regras Específicas
    if (atividade == 122 || atividade == 150 || atividade == 129) { customHTML.append("  $('#divReenviarEmailCandidato').show(); "); }
    if (atividade == 97) { 
        customHTML.append("  $('#divReabertura').hide(); "); 
        customHTML.append("  $('#painelAprovacaoRH').show(); ");
    }
    if (atividade == 128) { customHTML.append("  $('#divValidarKit').show(); "); }

    // Painéis Base do RH / Colaborador
    if (atividade == 0 || atividade == 1 || atividade == 4 || atividade == 41 || atividade == "") {
        customHTML.append("  $('#divPreenchimentoRH, #painelInfoAdicionais, #painelEtapasProcesso, #divDadosComplementaresColaborador, #painelDocumentos').hide(); ");
    } else {
        customHTML.append("  $('#divPreenchimentoRH, #painelInfoAdicionais, #painelEtapasProcesso, #divDadosComplementaresColaborador, #painelDocumentos, #div_valor_hora').show(); ");
    }

    // Painéis de ASO e KIT (135, 128, 129)
    customHTML.append("  $('#panelDocumentosAssinatura').show(); "); // Sempre visível
    if (atividade == 135 || atividade == 128 || atividade == 129) {
        customHTML.append("  $('#painelAnexarASO, #painelGerarKit').show(); ");
        if (atividade != 135) {
            customHTML.append("  $('#btn_upload_aso').prop('disabled', true); ");
            customHTML.append("  $('#btn_enviar_aso, #aviso_aso').hide(); ");
        }
    }

    // Verificações baseadas em valores de campos preenchidos
    var respostaCandidato = form.getValue("txtRespostaCorrecaoCandidato");
    if (respostaCandidato != null && respostaCandidato != "") { customHTML.append("  $('#painelCorrecaoCandidato').show(); "); }

    if (form.getValue("cpIdPastaGedCandidato") != "") {
        customHTML.append("  $('#btnGedCandidato').prop('disabled', false); ");
        customHTML.append("  $('#aviso_bloqueio_ged').hide(); ");
        customHTML.append("  $('#cpIdPastaGedCandidato').val('" + form.getValue("cpIdPastaGedCandidato") + "'); ");
        customHTML.append("  $('#btnAbrirPastaGerarKit').show(); ");
    }

    // Botões de Visualização do Kit (Liberados se tiver ID)
    var botoesVerKit = [
        { idCampo: "id_pdf_kit_proposta_admissao", idBtn: "#btn_ver_kit_proposta_admissao" },
        { idCampo: "id_pdf_kit_lgpd_admissao", idBtn: "#btn_ver_kit_lgpd_admissao" },
        { idCampo: "id_pdf_kit_contrato_clt", idBtn: "#btn_ver_kit_contrato_clt" },
        { idCampo: "id_pdf_kit_ponto_excecao", idBtn: "#btn_ver_kit_ponto_excecao" },
        { idCampo: "id_pdf_kit_uso_veiculo", idBtn: "#btn_ver_kit_uso_veiculo" },
        { idCampo: "id_pdf_kit_nda", idBtn: "#btn_ver_kit_nda" },
        { idCampo: "id_pdf_kit_tce", idBtn: "#btn_ver_kit_tce" },
        { idCampo: "id_pdf_kit_comp_horas", idBtn: "#btn_ver_kit_comp_horas" },
        { idCampo: "id_pdf_kit_prorrog_horas", idBtn: "#btn_ver_kit_prorrog_horas" },
        { idCampo: "id_pdf_kit_renuncia_vt", idBtn: "#btn_ver_kit_renuncia_vt" },
        { idCampo: "id_pdf_kit_solic_vt", idBtn: "#btn_ver_kit_solic_vt" },
        { idCampo: "id_pdf_kit_ir", idBtn: "#btn_ver_kit_ir" },
        { idCampo: "id_pdf_kit_sal_familia", idBtn: "#btn_ver_kit_sal_familia" },
        { idCampo: "id_pdf_kit_termo_resp", idBtn: "#btn_ver_kit_termo_resp" },
        { idCampo: "id_pdf_kit_ficha_reg", idBtn: "#btn_ver_kit_ficha_reg" },
        { idCampo: "id_pdf_kit_sigilo", idBtn: "#btn_ver_kit_sigilo" }
    ];

    for (var j = 0; j < botoesVerKit.length; j++) {
        if (form.getValue(botoesVerKit[j].idCampo) != "") {
            customHTML.append("  $('" + botoesVerKit[j].idBtn + "').show(); ");
        }
    }

    // Regras de Jornada com timeout seguro
    customHTML.append("  setTimeout(function() { ");
    customHTML.append("    try { if(typeof controlaRegrasJornada === 'function') { controlaRegrasJornada(); } } ");
    customHTML.append("    catch(e) { console.log('Erro ao aplicar regras de jornada: ', e); } ");
    customHTML.append("  }, 1000); ");

    customHTML.append("});");
    customHTML.append("</script>");
}