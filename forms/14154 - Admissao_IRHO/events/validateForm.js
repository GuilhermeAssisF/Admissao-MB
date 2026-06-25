function validateForm(form) {
    // --- BYPASS DE INTEGRAÇÃO ---

    // Se quem está movendo é o usuário da Widget, IGNORA validações e permite avançar.
    // var usuarioLogado = getValue("WKUser");
    // if (usuarioLogado == "admin") { // Use o login exato do seu usuário integrador
    //     return; 
    // }



    // Só valida se o utilizador estiver a tentar avançar a tarefa
    if (acaoUsuario != "true") {
        return;
    }

    // Se quem está movendo é o usuário da Widget, IGNORA validações e permite avançar.
    // Isso evita erro 500 pois os campos estarão vazios nesse momento.
    var usuarioLogado = getValue("WKUser");
    if (usuarioLogado == "widgetpublicadeadmissao") { // Use o login exato do seu usuário integrador
        return;
    }


    var atividade = parseInt(getValue("WKNumState"));
    var acaoUsuario = getValue("WKCompletTask");
    var msg = "";

    // --- FUNÇÃO AUXILIAR DE SEGURANÇA ---
    // Garante que retorna String vazia se o campo for nulo, evitando erro 500
    function getSafeValue(campo) {
        var val = form.getValue(campo);
        if (val == null) return "";
        return new java.lang.String(val).trim();
    }

    function normalizarJornada(valor) {
        return String(valor || "")
            .replace(/^\s+|\s+$/g, "")
            .toLowerCase()
            .replace(/[áàâãä]/g, "a")
            .replace(/[éèêë]/g, "e")
            .replace(/[íìîï]/g, "i")
            .replace(/[óòôõö]/g, "o")
            .replace(/[úùûü]/g, "u")
            .replace(/ç/g, "c");
    }

    var jornadaNormalizada = normalizarJornada(
        getSafeValue("cpJornadaAdmissao") +
        " " +
        getSafeValue("cpJornadaAdmissaoDescricao")
    );

    var jornadaEhCLT =
        jornadaNormalizada.indexOf("clt") >= 0;

    var jornadaEhAssociado =
        jornadaNormalizada.indexOf("associado") >= 0;

    // Bypass para a atividade 97 (Admissão RH) - Caso a opção 4 esteja neste painel
    if (atividade == 97 && getSafeValue("cpAprovacaoAdmissao") == "4") {
        return;
    }

    // =========================================================================
    // MATRIZ DE OBRIGATORIEDADE (BACK-END)
    // =========================================================================
    var REGRAS_BACKEND = {
        // Atividades 0, 1, 41 (Início/Correção)
        "0,1,41": [
            { id: "cpfcnpj", nome: "CPF/CNPJ" },
            { id: "txtNomeColaborador", nome: "Nome Completo" },
            { id: "dtDataNascColaborador", nome: "Data de Nascimento" },
            { id: "txtNomeSocial", nome: "Nome Social" },
            { id: "txtEmail", nome: "E-mail" },
            { id: "txtCELULAR", nome: "Celular 1" },
            { id: "txtTELEFONE", nome: "Telefone 2" },
            { id: "IDDESC_EMPRESAFILIAL", nome: "Empresa - Filial" },
            { id: "FUN_SECAO_IDDESC_AD", nome: "Seção" },
            { id: "cpJornadaAdmissao", nome: "Jornada de Admissão" },
            { id: "cpTipoContrato", nome: "Tipo de Contrato" },
            { id: "cpEmailCandidato", nome: "E-mail Candidato" },
            { id: "FUN_ADMISSAO", nome: "Data de Admissão" },
            { id: "zoomTipoFuncionario", nome: "Tipo Funcionário" },
            { id: "FUN_IDDESCFUN", nome: "Função" },
            { id: "selectTemRemuneracao", nome: "Remuneração" },
            { id: "FUN_VLRSALARIO", nome: "Salário" },
            { id: "cpContratoPrazo", nome: "Contrato com Prazo" },

            { id: "cpDataHoraExame", nome: "Data e Hora do Exame" },
            { id: "cpEnderecoClinica", nome: "Endereço da Clínica" },
            { id: "cpNomeClinica", nome: "Nome da Clínica" },
            { id: "cpEmailCandidatoInicio", nome: "E-mail para Envio do Exame" }

        ],

        "97": [
            { id: "cpAprovacaoAdmissao", nome: "Decisão Admissão RH" },
            { id: "zoom_banco", nome: "Banco" },
            { id: "zoom_agencia", nome: "Agência" },
            { id: "FUN_PADT", nome: "Percentual de Adiantamento" },
            { id: "FUN_TIPOPGTO_IDDESC_AD", nome: "Tipo de Recebimento/Pagamento" },
            { id: "zoom_categoriaEsocial", nome: "Categoria eSocial" },
            { id: "cpRegimeTrabalhista", nome: "Tipo de Regime Trabalhista" },
            { id: "zoom_sindicato", nome: "Sindicato" },
            { id: "FUN_INSS", nome: "INSS" },
            { id: "FUN_IRRF", nome: "IRRF" },
            { id: "zoom_ocorrencia_sefip", nome: "Cód. Ocorrência SEFIP" },
            { id: "zoom_categoria_sefip", nome: "Cód. Categoria SEFIP" },
            { id: "zoom_situacao_rais", nome: "Situação Empreg. (RAIS)" },
            { id: "zoom_vinculo_rais", nome: "Vínculo Empreg. (RAIS)" },
            //{ id: "cpIndiceInicioHorario", nome: "Índice Início Horário" },
            { id: "FUN_TPJORNADA", nome: "Tipo de Jornada" },
            { id: "zoom_centroCusto", nome: "Centro de Custo" },
            { id: "FUN_NATATIV", nome: "Natureza da Atividade" },
            { id: "FUN_INDADMISSAO", nome: "Indicativo Admissão" },
            { id: "FUN_SEQTURN_IDDESC_AD", nome: "Sequência do Turno" },
            { id: "cpQtdHorasMes", nome: "Jornada Mensal (Horas)" },
            { id: "cpRegimePrevidenciario", nome: "Tipo Regime Previdenciário" }
        ],

        "128": [
            { id: "cpAprovacaoKit", nome: "Aprovação do Kit Admissão" }
        ]
    };

    // =========================================================================
    // 1. VARREDURA AUTOMÁTICA DE CAMPOS VAZIOS
    // =========================================================================
    var chaves = Object.keys(REGRAS_BACKEND);
    var jornadaAdmissao = jornadaNormalizada;

    for (var i = 0; i < chaves.length; i++) {
        var listaAtividades = chaves[i].split(",");

        if (listaAtividades.indexOf(atividade.toString()) > -1) {
            var camposExigidos = REGRAS_BACKEND[chaves[i]];

            for (var c = 0; c < camposExigidos.length; c++) {
                var campoID = camposExigidos[c].id;

                // --- INÍCIO DA NOVA REGRA: BYPASS PARA ESTÁGIO ---
                var camposExclusivosCLT = [
                    "zoom_sindicato", "zoom_sindicato_filiacao",
                    "FUN_INSS", "FUN_IRRF", "FUN_ALTFGTS", "cpDataUltimoSaldoFGTS",
                    "zoom_ocorrencia_sefip", "zoom_categoria_sefip", "zoom_situacao_rais", "zoom_vinculo_rais"
                ];

                // Se NÃO for CLT e o campo estiver na lista acima, pula a validação
                if (
                    !jornadaEhCLT &&
                    camposExclusivosCLT.indexOf(campoID) > -1
                ) {
                    continue;
                }
                // --- FIM DA NOVA REGRA ---

                var valor = getSafeValue(campoID);
                if (valor == "" || valor == "0") {
                    msg += "O campo <b>" + camposExigidos[c].nome + "</b> é obrigatório.<br/>";
                }
            }
        }
    }

    // =========================================================================
    // 2. VALIDAÇÕES CONDICIONAIS E DE INTEGRIDADE (Do seu código original)
    // =========================================================================

    // Validação de Segurança de CPF (Atividades iniciais)
    var etapasIniciais = [0, 1, 41];
    if (etapasIniciais.indexOf(atividade) > -1) {
        if (getSafeValue("txtFuncAtivo") == "FUNC_ATIVO") {
            msg += "<b>Bloqueio:</b> Existem funcionários ativos utilizando o CPF informado.<br/>";
        }
    }

    // =========================================================================
    // VALIDAÇÃO DINÂMICA: ADMISSÃO RH (97)
    // =========================================================================
    if (atividade == 97) {
        var decisaoRH = getSafeValue("cpAprovacaoAdmissao");

        if (decisaoRH == "3" || decisaoRH == "Corrigir") {
            if (getSafeValue("cpParecerAprovaAdmissao") == "") {
                msg += "O campo <b>Parecer</b> é obrigatório quando a decisão for 'Solicitar Correção'.<br/>";
            }
        }

        var upFrontSelecionado =
            getSafeValue("cpUpFront");

        var hiringBonusSelecionado =
            getSafeValue("cpHiringBonus");

        var permiteUpFront =
            jornadaEhAssociado;

        var permiteHiringBonus =
            !permiteUpFront &&
            jornadaEhCLT;

        if (
            upFrontSelecionado == "sim" &&
            hiringBonusSelecionado == "sim"
        ) {
            msg += "Os campos <b>UP Front</b> e <b>Hiring Bonus</b> não podem ser habilitados simultaneamente.<br/>";
        } else {
            if (upFrontSelecionado == "sim") {
                if (!permiteUpFront) {
                    msg += "O campo <b>UP Front</b> só pode ser informado quando a Jornada de Admissão for Associado.<br/>";
                } else {
                    if (getSafeValue("cpUpFrontValor") == "") {
                        msg += "O campo <b>Valor do UP Front</b> é obrigatório quando UP Front for Sim.<br/>";
                    }

                    if (getSafeValue("cpUpFrontDataInicio") == "") {
                        msg += "O campo <b>Data Início do UP Front</b> é obrigatório quando UP Front for Sim.<br/>";
                    }

                    if (getSafeValue("cpUpFrontObservacao") == "") {
                        msg += "O campo <b>Observação do UP Front</b> é obrigatório quando UP Front for Sim.<br/>";
                    }
                }
            }

            if (hiringBonusSelecionado == "sim") {
                if (!permiteHiringBonus) {
                    msg += "O campo <b>Hiring Bonus</b> só pode ser informado quando a Jornada de Admissão contiver CLT.<br/>";
                } else {
                    if (getSafeValue("cpHiringBonusValor") == "") {
                        msg += "O campo <b>Valor do Hiring Bonus</b> é obrigatório quando Hiring Bonus for Sim.<br/>";
                    }

                    if (getSafeValue("cpHiringBonusDataInicio") == "") {
                        msg += "O campo <b>Data Início do Hiring Bonus</b> é obrigatório quando Hiring Bonus for Sim.<br/>";
                    }

                    if (getSafeValue("cpHiringBonusObservacao") == "") {
                        msg += "O campo <b>Observação do Hiring Bonus</b> é obrigatório quando Hiring Bonus for Sim.<br/>";
                    }
                }
            }
        }

        if (getSafeValue("cpTipoPLR") != "") {
            if (getSafeValue("cpValorPLR") == "") {
                msg += "O campo <b>Valor PLR</b> é obrigatório quando Tipo PLR estiver preenchido.<br/>";
            }

            if (getSafeValue("cpDataPLR") == "") {
                msg += "O campo <b>Data PLR</b> é obrigatório quando Tipo PLR estiver preenchido.<br/>";
            }
        }
    }

    // =========================================================================
    // VALIDAÇÃO DINÂMICA: VALIDAR KIT (128)
    // =========================================================================
    if (atividade == 128) {
        var decisaoKit = getSafeValue("cpAprovacaoKit");

        // Se a opção for '3' (Solicitar Correção)
        if (decisaoKit == "3") {
            // Usa o ID exato do seu HTML: cpParecerValidaKit
            if (getSafeValue("cpParecerValidaKit") == "") {
                msg += "O campo <b>Parecer</b> é obrigatório quando o Kit Admissional precisa de correção.<br/>";
            }
        }
    }

    // =========================================================================
    // VALIDAÇÃO DINÂMICA: CONTRATO DE TRABALHO
    // =========================================================================
    var etapasIniciais = [0, 1, 41];
    if (etapasIniciais.indexOf(atividade) > -1) {
        var tipoContrato = getSafeValue("cpContratoPrazo");

        if (tipoContrato == "determinado") {
            if (getSafeValue("cpTerminoContrato") == "") {
                msg += "O campo <b>Término de Contrato</b> é obrigatório para prazo Determinado.<br/>";
            }

            // Só exige a Cláusula Assecuratória se a jornada for CLT
            if (
                jornadaEhCLT &&
                getSafeValue("cpClausulaAssecuratoria") == ""
            ) {
                msg += "O campo <b>Cláusula Assecuratória</b> é obrigatório.<br/>";
            }
        }
        else if (tipoContrato == "experiencia") {
            if (getSafeValue("cpDiasVencPrimeiraExp") == "") msg += "O campo <b>Dias Venc. 1ª Experiência</b> é obrigatório.<br/>";
            if (getSafeValue("cpVencPrimeiraExp") == "") msg += "O campo <b>Vencimento da 1ª Experiência</b> é obrigatório.<br/>";
            if (getSafeValue("cpDiasVencSegundaExp") == "") msg += "O campo <b>Dias Venc. 2ª Experiência</b> é obrigatório.<br/>";
            if (getSafeValue("cpVencSegundaExp") == "") msg += "O campo <b>Vencimento da 2ª Experiência</b> é obrigatório.<br/>";
        }
    }

    // =========================================================================
    // DISPARO DE EXCEÇÃO (Impede o envio se houver erro)
    // =========================================================================
    if (msg != "") {
        throw "<br/><br/><b>Atenção! Verifique os seguintes erros antes de avançar:</b><br/><br/>" + msg;
    }

    // BLINDAGEM: Verifica se o campo existe antes de tentar fazer split
    var cptbDadosRCM = getSafeValue("cptbDadosRCM");
    var dadosRCm = (cptbDadosRCM.indexOf(",") > -1) ? cptbDadosRCM.split(",") : [];

    // BLINDAGEM DE DATAS
    var data1 = getSafeValue("cpDataAbertura");
    var data2 = getSafeValue("dtDataNascColaborador");

    // Só entra no IF se as datas existirem e tiverem barras (evita crash)
    if (data1 != "" && data2 != "" && data1.indexOf("/") > -1 && data2.indexOf("/") > -1) {
        try {
            var nova1 = data1.split("/");
            var Nova1 = nova1[1] + "/" + nova1[0] + "/" + nova1[2];

            var nova2 = data2.split("/");
            var Nova2 = nova2[1] + "/" + nova2[0] + "/" + nova2[2];

            var d1 = new Date(Nova1);
            var d2 = new Date(Nova2);
            var DAY = 1000 * 60 * 60 * 24 * 365;
            var days_passed = Math.round((d1.getTime() - d2.getTime()) / DAY);
            var dias = days_passed + 1;
        } catch (e) {
            log.warn("[validateForm] Erro ao calcular datas: " + e);
        }
    }

    // --- VALIDAÇÕES DO CANDIDATO (Apenas se não for validação de RH/Gestor) ---
    // Atividade 122 é "Aguardando Candidato" (conforme seu log anterior).
    // Adicionei validação segura usando getSafeValue.
    if ((atividade == 1 || atividade == 0 || atividade == 41 || atividade == 122) && acaoUsuario == "true") {

        // DADOS DO COLABORADOR
        if (getSafeValue("cpfcnpj") == "") msg += "CPF não informado.<br>";
        if (getSafeValue("txtNomeColaborador") == "") msg += "Nome não informado.<br>";

        // Validação de Segurança para CPF (Só se o campo txtFuncAtivo estiver preenchido)
        if (getSafeValue("txtFuncAtivo") == "FUNC_ATIVO") {
            msg += "Existem funcionários ativos utilizando o CPF informado.<br>";
        }
    }

    // GESTOR
    if (atividade == 7 && acaoUsuario == "true") {
        if (getSafeValue("cpAprovacaoGestor") == "0") msg += "Aprovação pendente.<br>";
        if (getSafeValue("cpAprovacaoGestor") == "2" && getSafeValue("cpParecerAprovGestor") == "")
            msg += "Parecer de Reprovação obrigatório.<br>";
    }

    // DIRETOR
    if (atividade == 8 && acaoUsuario == "true") {
        if (getSafeValue("cpAprovacaoDiretor") == "0") msg += "Aprovação pendente.<br>";
        if (getSafeValue("cpAprovacaoDiretor") == "2" && getSafeValue("cpParecerAprovaDiretor") == "")
            msg += "Parecer de Reprovação obrigatório.<br>";
    }

    // REABERTURA
    if (atividade == 41 && acaoUsuario == "true") {
        if (getSafeValue("cpReaberturaChamado") == "") msg += "Ação de reabertura pendente.<br>";
    }

    // RH
    if (atividade == 74 && acaoUsuario == "true") {
        if (getSafeValue("cpAprovacaoRH") == "0") msg += "Aprovação pendente.<br>";
        if (getSafeValue("cpAprovacaoRH") == "2" && getSafeValue("cpParecerAprovaRH") == "")
            msg += "Parecer de Reprovação obrigatório.<br>";
        if (getSafeValue("txtChapaJaExiste") == "2") msg += "Chapa já existe na base.<br>";
    }

    // ADMISSÃO RH (Atividade 97)
    if (atividade == 97 && acaoUsuario == "true") {
        var decisao = getSafeValue("cpAprovacaoAdmissao");

        if (decisao == "" || decisao == "0") {
            msg += "Aprovação pendente na etapa de Admissão RH.<br>";
        }

        // Agora exigimos o parecer APENAS se for Correção (3)
        if (decisao == "3" && getSafeValue("cpParecerAprovaAdmissao") == "") {
            msg += "É obrigatório informar o motivo no campo Parecer para solicitar correção.<br>";
        }
    }

    // VALIDAR KIT (Atividade 128)
    if (atividade == 128 && acaoUsuario == "true") {
        var decisaoKit = getSafeValue("cpAprovacaoKit");

        if (decisaoKit == "" || decisaoKit == "0") {
            msg += "Aprovação pendente na etapa de Validação do Kit Admissão.<br>";
        }

        // Exige parecer se a escolha for "Solicitar Correção"
        if (decisaoKit == "3" && getSafeValue("cpParecerValidaKit") == "") {
            msg += "É obrigatório informar o motivo no campo Parecer para solicitar correção.<br>";
        }
    }

    if (msg != "") {
        throw "<br> ERRO DE VALIDAÇÃO: <br>" + msg;
    }
}