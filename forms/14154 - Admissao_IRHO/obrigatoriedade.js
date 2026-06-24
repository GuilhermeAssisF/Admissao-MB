// =========================================================================
// MOTOR DE OBRIGATORIEDADE (FRONT-END)
// Centraliza quais campos recebem o asterisco (*) em cada atividade
// =========================================================================

var REGRAS_OBRIGATORIEDADE = {
    // Atividades 0, 1 e 41 (Abertura e Correção)
    "0,1,41": [
        "cpfcnpj", "txtNomeColaborador", "dtDataNascColaborador",
        "txtTELEFONE", "txtCELULAR", "txtEmail", "txtNomeSocial",
        "IDDESC_EMPRESAFILIAL", "descricaoJornada", "FUN_ADMISSAO", "cpJornadaAdmissao",
        "FUN_TPADMISSAO_IDDESC_AD", "FUN_SECAO_IDDESC_AD", "FUN_IDDESCFUN", "selectTemRemuneracao",
        "FUN_VLRSALARIO", "FUN_IDDESCTURN", "zoomTipoFuncionario", "FUN_SEQTURN_IDDESC_AD", "FUN_TPJORNADA",
        "cpDataHoraExame", "cpEnderecoClinica", "cpNomeClinica", "cpEmailCandidatoInicio", "cpEmailCandidato",
        "cpContratoPrazo"
    ],

    // Atividade 74 (Aprovação RH)
    "74": ["cpAprovacaoRH"],

    // Atividade 97 (Admissão RH / Preenchimento eSocial)
    "97": [
        "cpAprovacaoAdmissao",
        "zoom_banco",
        "zoom_agencia",
        "FUN_PADT",
        "FUN_TIPOPGTO_IDDESC_AD",
        "zoom_categoriaEsocial",
        "cpRegimeTrabalhista",
        "zoom_sindicato",
        "FUN_INSS",
        "FUN_IRRF",
        "zoom_ocorrencia_sefip",
        "zoom_categoria_sefip",
        "zoom_situacao_rais",
        "zoom_vinculo_rais",
        //"cpIndiceInicioHorario",
        "FUN_CONTRATOPARCIAL",
        "FUN_TPJORNADA",
        "zoom_centroCusto",
        "FUN_NATATIV",           // Natureza da Atividade
        "FUN_INDADMISSAO",       // Indicativo Admissão
        "FUN_SEQTURN_IDDESC_AD", // Sequencia Turno
        "cpQtdHorasMes",         // Jornada Mensal
        "cpRegimePrevidenciario" // Tipo Regime Previdenciario
    ],

    // Atividade 128 (Validação do Kit)
    "128": ["cpAprovacaoKit"],

    // Atividade 135 (Upload do ASO)
    "135": ["btn_upload_aso"]
};

function aplicarObrigatoriedadeFrontEnd(atividadeAtual) {
    // 1. Limpa resquícios de tela
    $("[obrigatorio='true']").removeAttr("obrigatorio");
    $(".CampoObrigatorio").remove();

    // --- NOVA REGRA: CAPTURA A JORNADA E MAPEIA CAMPOS CLT ---
    var jornada = $("#cpJornadaAdmissao").val();
    var camposExclusivosCLT = [
        "zoom_sindicato", "zoom_sindicato_filiacao",
        "FUN_INSS", "FUN_IRRF", "FUN_ALTFGTS", "cpDataUltimoSaldoFGTS",
        "zoom_ocorrencia_sefip", "zoom_categoria_sefip", "zoom_situacao_rais", "zoom_vinculo_rais"
    ];

    // 2. Varre a matriz de regras
    $.each(REGRAS_OBRIGATORIEDADE, function (atividades, campos) {
        var listaAtividades = atividades.split(",");

        // Verifica se a regra se aplica à atividade atual
        if (listaAtividades.indexOf(atividadeAtual.toString()) > -1) {
            $.each(campos, function (i, idCampo) {
                
                // --- NOVA REGRA: SE FOR ESTÁGIO E O CAMPO FOR DE CLT, IGNORA E PULA! ---
                if ((jornada === "Estagio" || jornada === "Estágio") && camposExclusivosCLT.indexOf(idCampo) > -1) {
                    return true; // Funciona como um 'continue', pulando este campo específico
                }

                var $campo = $("#" + idCampo);
                if ($campo.length > 0) {
                    $campo.attr("obrigatorio", "true");
                }
            });
        }
    });

    // 3. Chama o desenhista de asteriscos do seu compartilhados.js
    if (typeof Compartilhados !== "undefined" && typeof Compartilhados.camposObrigatorio === "function") {
        Compartilhados.camposObrigatorio();
    }
}