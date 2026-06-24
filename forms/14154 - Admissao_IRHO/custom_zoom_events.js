/* custom_zoom_events.js - Versão Blindada V4 (Com Variáveis Dinâmicas) */

console.log(">>> Carregando scripts customizados de Zoom (Modo Seguro V4)...");

var beforeZoomItemSelected = window.setSelectedZoomItem;
var beforeZoomItemRemoved = window.removedZoomItem;

// 1. FUNÇÃO SALVA-VIDAS: Habilita/Desabilita zooms usando a API do Fluig (Sem quebrar o Select2)
function changeZoomState(zoomId, disabledState) {
    if (window[zoomId] !== undefined) {
        try { window[zoomId].disable(disabledState); } catch (e) { }
    } else {
        setTimeout(function () {
            if (window[zoomId] !== undefined) {
                try { window[zoomId].disable(disabledState); } catch (e) { }
            }
        }, 500);
    }
}

function montarTextoCodigoDescricaoZoom(selectedItem, campoCodigo, campoDescricao) {
    var codigo = $.trim(String(selectedItem && selectedItem[campoCodigo] ? selectedItem[campoCodigo] : ""));
    var descricao = $.trim(String(selectedItem && selectedItem[campoDescricao] ? selectedItem[campoDescricao] : ""));

    if (!codigo && !descricao) {
        return "";
    }

    if (!codigo) {
        return descricao;
    }

    if (!descricao) {
        return codigo;
    }

    // Evita duplicar quando o dataset já retorna "001 - Descrição"
    if (descricao === codigo || descricao.indexOf(codigo + " - ") === 0 || descricao.indexOf(codigo + " — ") === 0) {
        return descricao;
    }

    return codigo + " - " + descricao;
}

function atualizarTextoVisualZoomSelecionado(campoId, textoVisual) {
    if (!campoId || !textoVisual) {
        return;
    }

    setTimeout(function () {
        try {
            var $select2 = $("#s2id_" + campoId);

            if ($select2.length) {
                var $chosen = $select2.find(".select2-chosen").first();

                if (!$chosen.length) {
                    $chosen = $select2.find(".select2-choice span").first();
                }

                if ($chosen.length) {
                    $chosen.text(textoVisual);
                }
            }
        } catch (e) {
            console.warn("[Zoom] Não foi possível atualizar o texto visual do zoom:", campoId, e);
        }
    }, 100);
}

// =========================================================================
// GATILHO: SELECIONOU UM ITEM
// =========================================================================
window.setSelectedZoomItem = function (selectedItem) {
    if (typeof beforeZoomItemSelected === "function") {
        try { beforeZoomItemSelected(selectedItem); } catch (e) { }
    }

    try {
        var inputId = selectedItem ? selectedItem.inputId : null;
        if (!inputId) return;

        // 1. CASCATA GERAL DA EMPRESA / FILIAL E PREENCHIMENTO DOS DADOS OCULTOS
        if (inputId == "IDDESC_EMPRESAFILIAL") {
            setTimeout(function () {
                var empresa = selectedItem.ID_EMPRESA || selectedItem.CODCOLIGADA || $("#FUN_EMPRESA").val();
                var filial = selectedItem.ID_FILIAL || selectedItem.CODFILIAL || $("#FUN_FILIAL").val();

                if (!$("#FUN_EMPRESA").val() && empresa) $("#FUN_EMPRESA").val(empresa);
                if (!$("#FUN_FILIAL").val() && filial) $("#FUN_FILIAL").val(filial);

                // === INJETANDO OS DADOS OCULTOS AO VIVO ===
                $("#FUN_NOMECOMERCIAL_FILIAL").val(selectedItem["NOMECOMERCIAL_FILIAL"] || selectedItem["NOMECOMERCIAL"]);
                $("#FUN_CNPJ_FILIAL").val(selectedItem["CNPJ_FILIAL"] || selectedItem["CNPJ"]);
                $("#FUN_LOGRADOURO_FILIAL").val(selectedItem["LOGRADOURO_FILIAL"] || selectedItem["LOGRADOURO"]);
                $("#FUN_NUMERO_FILIAL").val(selectedItem["NUMERO_FILIAL"] || selectedItem["NUMERO"]);
                $("#FUN_COMPLEMENTO_FILIAL").val(selectedItem["COMPLEMENTO_FILIAL"] || selectedItem["COMPLEMENTO"]);
                $("#FUN_BAIRRO_FILIAL").val(selectedItem["BAIRRO_FILIAL"] || selectedItem["BAIRRO"]);
                $("#FUN_CIDADE_FILIAL").val(selectedItem["CIDADE_FILIAL"] || selectedItem["CIDADE"]);
                $("#FUN_ESTADO_FILIAL").val(selectedItem["ESTADO_FILIAL"] || selectedItem["ESTADO"]);
                $("#FUN_CEP_FILIAL").val(selectedItem["CEP_FILIAL"] || selectedItem["CEP"]);

                // ====================================================================
                // EXECUTA A NOSSA PARAMETRIZAÇÃO PRIMEIRO (Antes que o Fluig crashe)
                // ====================================================================
                if (empresa && filial) {
                    try {
                        if (typeof aplicarParametrosPorFilial === "function") {
                            aplicarParametrosPorFilial(empresa, filial);
                        }
                    } catch (e) {
                        console.error(">>> [Admissão] Erro ao aplicar parâmetros da filial:", e);
                    }
                }

                // ====================================================================
                // BLINDAGEM DOS FILTROS NATIVOS (TRY / CATCH EM TODOS)
                // ====================================================================
                if (typeof reloadZoomFilial === "function") {
                    try { reloadZoomFilial(empresa, filial); } catch (e) { }
                }

                if (typeof popularJornadasAdmissaoPorColigada === "function") {
                    popularJornadasAdmissaoPorColigada(empresa || $("#FUN_EMPRESA").val());
                }

                if (typeof aplicarBloqueioDadosContratacaoPorJornada === "function") {
                    aplicarBloqueioDadosContratacaoPorJornada();
                }

                if (empresa && typeof reloadZoomFilterValues === "function") {
                    try { reloadZoomFilterValues("zoom_sindicato", "ID_EMPRESA," + empresa); } catch (e) { }
                    try { reloadZoomFilterValues("FUN_SECAO_IDDESC_AD", "CODCOLIGADA," + empresa); } catch (e) { }

                    try { window["zoom_quiosque"].clear(); } catch (e) { }
                    try { reloadZoomFilterValues("zoom_quiosque", "CODCOLIGADA," + empresa); } catch (e) { }

                    try { window["zoom_centroCusto"].clear(); } catch (e) { }
                    try { reloadZoomFilterValues("zoom_centroCusto", "CODCOLIGADA," + empresa); } catch (e) { }
                }

                try {
                    if (typeof limparCampoAplicadoPorJornada === "function") {
                        limparCampoAplicadoPorJornada("FUN_IDDESCTURN");
                    } else if (window["FUN_IDDESCTURN"] !== undefined) {
                        window["FUN_IDDESCTURN"].clear();
                    }
                } catch (e) { }

            }, 300);
        }

        // 2. FUNÇÃO E TURNO
        if (inputId == "FUN_IDDESCFUN") {
            $("#FUN_CBO2002").val(selectedItem.CBO2002);
            $("#FUN_CARGO").val(selectedItem.CARGO);
            $("#FUN_FUNCAO").val(selectedItem.CODIGO);
            $("#FUN_DESCFUN").val(selectedItem.NOME);

            setTimeout(function () {
                var empresa = $("#FUN_EMPRESA").val() || $("#txtCodcoligada").val();
                var codFuncao = selectedItem.CODIGO || $("#FUN_FUNCAO").val();
                if (empresa && codFuncao && typeof reloadZoomFilterValues === "function") {
                    reloadZoomFilterValues("FUN_NIVELFUNCAO", "ID_EMPRESA," + empresa + ",FUNCAO," + codFuncao);
                }
            }, 300);
        }

        if (inputId == "FUN_IDDESCTURN") {
            setTimeout(function () {
                var codHorario = selectedItem.CODIGO || selectedItem.CODHORARIO || selectedItem[0];

                // Grava o código oculto
                if (codHorario) {
                    var codLimpo = String(codHorario).split(" - ")[0].trim();
                    $("#FUN_CODTURN").val(codLimpo);
                }

                // Limpa a sequência antiga que estava preenchida
                if (typeof limparCampoAplicadoPorJornada === "function") {
                    limparCampoAplicadoPorJornada("FUN_SEQTURN_IDDESC_AD");
                } else if (window["FUN_SEQTURN_IDDESC_AD"] && typeof window["FUN_SEQTURN_IDDESC_AD"].clear === "function") {
                    window["FUN_SEQTURN_IDDESC_AD"].clear();
                } else {
                    $("#FUN_SEQTURN_IDDESC_AD").val(null).trigger("change");
                }

                // Chama o Motor Central para montar o filtro e liberar
                if (typeof window.liberarSequenciaTurno === "function") {
                    window.liberarSequenciaTurno();
                }
            }, 300);
        }

        if (inputId == "descricaoJornada") {
            var codigoJornada = selectedItem.CODIGO || selectedItem.CODJORNADA || selectedItem.CODHORARIO || selectedItem.codigo;
            if (codigoJornada) $("#codJornada").val(codigoJornada);
        }

        // 3. DADOS BANCÁRIOS E DEMAIS ZOOMS SIMPLES
        if (inputId == "zoom_banco") {
            setTimeout(function () {
                var codBanco = selectedItem.CODIGO || selectedItem.NUMBANCO;
                if (codBanco) {
                    $("#num_banco").val(codBanco);
                    changeZoomState("zoom_agencia", false);
                    if (window['zoom_agencia'] !== undefined) window['zoom_agencia'].clear();
                    if (typeof reloadZoomFilterValues === "function") reloadZoomFilterValues("zoom_agencia", "NUMBANCO," + codBanco);
                }
            }, 300);
        }

        if (inputId == "zoom_agencia") $("#num_agencia").val(selectedItem.NUMAGENCIA);

        if (inputId == "zoom_sindicato") {
            var textoSindicato = montarTextoCodigoDescricaoZoom(selectedItem, "CODIGO", "IDDESC_SINDICATO");

            $("#cod_sindicato").val(selectedItem.CODIGO);
            atualizarTextoVisualZoomSelecionado("zoom_sindicato", textoSindicato);
        }

        if (inputId == "zoom_categoriaEsocial") $("#FUN_CATESOCIAL").val(selectedItem.CODCLIENTE);
        if (inputId == "zoomTipoFuncionario") $("#codTipoFuncionario").val(selectedItem.CODIGO);
        if (inputId == "zoom_banco_fgts") {
            $("#FUN_BANCOFGTS").val(selectedItem.CODIGO);
            if (window["zoom_agencia_fgts"] != undefined) {
                window["zoom_agencia_fgts"].clear();
                reloadZoomFilterValues("zoom_agencia_fgts", "COD_BANCO," + selectedItem.CODIGO);
            }
        }
        if (inputId == "zoom_banco_pis") $("#FUN_CODBANCOPIS").val(selectedItem.CODIGO);
        if (inputId == "zoom_agencia_fgts") $("#cpAgenciaFGTS").val(selectedItem.NUMAGENCIA);

        if (inputId == "zoom_sindicato_filiacao") {
            var textoSindicatoFiliacao = montarTextoCodigoDescricaoZoom(selectedItem, "CODIGO", "IDDESC_SINDICATO");

            $("#FUN_CODDESCSINDICATOFILIACAO").val(selectedItem.CODIGO);
            atualizarTextoVisualZoomSelecionado("zoom_sindicato_filiacao", textoSindicatoFiliacao);
        }

        if (inputId == "FUN_TIPOPGTO_IDDESC_AD") {
            $("#FUN_TIPOPGTO").val(selectedItem.CODCLIENTE || selectedItem.CODIGO || "");
            $("#FUN_TIPOPGTO_DESC_AD").val(selectedItem.DESCRICAO || selectedItem.IDDESC_TIPORECEBIMENTO || selectedItem.CODCLIENTE || selectedItem.CODIGO || "");
        }
        if (inputId == "FUN_SEQTURN_IDDESC_AD") {
            var seqTurno = selectedItem.INDINICIOHOR || selectedItem.CODIGO || "";
            $("#FUN_SEQTURN").val(seqTurno);
            $("#FUN_SEQTURN_DESC_AD").val(seqTurno);
        }
        if (inputId == "zoom_equipe") $("#cpCodigoEquipe").val(selectedItem.CODIGO);
        if (inputId == "zoom_quiosque") $("#FUN_CODQUIOSQUE_IDDESC").val(selectedItem.CODGRUPO);
        if (inputId == "zoom_centroCusto") $("#FUN_CC").val(selectedItem.CODIGO);
        if (inputId == "zoom_vinculo_rais") {
            $("#FUN_VINCEMPREG").val(selectedItem.CODCLIENTE);
            $("#FUN_VINCEMPREG_IDDESC_AD").val(selectedItem.IDDESC_VINCULO);
        }
        if (inputId == "zoom_categoria_sefip") $("#FUN_CATSEFIP_IDDESC").val(selectedItem.IDDESC_CATSEFIP);
        if (inputId == "zoom_ocorrencia_sefip") $("#FUN_CODOCORRENCIA_IDDESC").val(selectedItem.IDDESC_OCORRENCIA);
        if (inputId == "zoom_situacao_rais") $("#cpSituacaoRais").val(selectedItem.COD_SITUACAO);

        // 4. MUNICÍPIO E ESTADOS
        if (inputId == "zoom_municipio") {
            $("#txtCODMUNICIPIO").val(selectedItem.CODMUNICIPIO);
            $("#txtNOMEMUNICIPIO").val(selectedItem.NOMEMUNICIPIO);
        }
        if (inputId == "zoom_estado") {
            $("#txtCODETD").val(selectedItem.CODETD);
            $("#txtNOMECODETD").val(selectedItem.NOME);
            $("#txtEstado").val(selectedItem.CODETD);
            if (window["zoom_municipio"] != undefined) {
                window["zoom_municipio"].clear();
                reloadZoomFilterValues("zoom_municipio", "CODETDMUNICIPIO," + selectedItem.CODETD);
            }
        }
        if (inputId == "zoom_estado_natal") {
            $("#ESTADONatalCod").val(selectedItem.CODETD);
            $("#ESTADO").val(selectedItem.NOME);
        }

        if (inputId == "cpEmailCandidatoInicio") {
            $("#hidden_mail_assunto").val(selectedItem["mail_assunto"]);
            $("#hidden_mail_corpo").val(selectedItem["mail_corpo"]);
        }

        // NOVO ESTÚDIO DE DOCUMENTOS
        if (inputId && inputId.indexOf("zoom_kit_") === 0) {
            var docPrefix = inputId.replace("zoom_", "");
            $("#file_" + docPrefix).prop("disabled", true).css("pointer-events", "none");
            var docName = selectedItem.nome_contrato;
            var idDocumento = selectedItem.documentid;
            var loading = FLUIGC.loading(window);
            loading.show();

            var c1 = DatasetFactory.createConstraint("documentid", idDocumento, idDocumento, ConstraintType.MUST);
            DatasetFactory.getDataset("ds_form_config_contratos", null, [c1], null, {
                success: function (dataset) {
                    if (dataset.values && dataset.values.length > 0) {
                        var contratoBase = dataset.values[0].texto_html_contrato;
                        if (!contratoBase) {
                            FLUIGC.toast({ title: 'Atenção:', message: 'Modelo vazio.', type: 'warning' });
                        } else {
                            gerarPDFDocumentoDinamico(contratoBase, docPrefix, docName);
                        }
                    }
                    loading.hide();
                },
                error: function (error) { loading.hide(); }
            });
        }

        if (inputId.indexOf("txtParentescoDepen___") > -1) {
            setTimeout(function () { if (typeof sincronizarFiliacao === "function") sincronizarFiliacao(); }, 200);
        }

        if (inputId == "FUN_SECAO_IDDESC_AD") {
            setTimeout(function () {
                if (typeof exibeDocumentosPorJornadaKit === "function") exibeDocumentosPorJornadaKit();
            }, 300);
        }

    } catch (error) {
        console.error(">>> [ZOOM EVENT] Erro tratado na SELEÇÃO do item: ", error);
    }
}


// =========================================================================
// GATILHO: REMOVEU UM ITEM
// =========================================================================
window.removedZoomItem = function (removedItem) {
    if (typeof beforeZoomItemRemoved === "function") {
        try { beforeZoomItemRemoved(removedItem); } catch (e) { }
    }

    try {
        var inputId = removedItem ? removedItem.inputId : null;
        if (!inputId) return;
        var aplicandoJornadaAgora = (typeof window.aplicandoParametrosJornada === "boolean" && window.aplicandoParametrosJornada);

        if (inputId == "IDDESC_EMPRESAFILIAL") {
            // === LIMPA TODOS OS CAMPOS OCULTOS SE O RH APAGAR A FILIAL ===
            $("#FUN_EMPRESA, #FUN_FILIAL").val("");
            $("#FUN_NOMECOMERCIAL_FILIAL, #FUN_CNPJ_FILIAL, #FUN_LOGRADOURO_FILIAL, #FUN_NUMERO_FILIAL, #FUN_COMPLEMENTO_FILIAL, #FUN_BAIRRO_FILIAL, #FUN_CIDADE_FILIAL, #FUN_ESTADO_FILIAL, #FUN_CEP_FILIAL").val("");

            if (typeof limparCamposJornadaAnterior === "function") {
                limparCamposJornadaAnterior();
            }

            if (window["FUN_IDDESCTURN"] !== undefined) window["FUN_IDDESCTURN"].clear();
            if (window["zoom_quiosque"] != undefined) window["zoom_quiosque"].clear();
            if (window["zoom_centroCusto"] != undefined) window["zoom_centroCusto"].clear();
            if (typeof reloadZoomFilterValues === "function") reloadZoomFilterValues("FUN_IDDESCTURN", "");

            $("#FUN_PADT").val(""); // Limpa o Adiantamento
            $("#num_banco").val(""); // Limpa o código do banco oculto

            if (window["zoom_banco"] !== undefined) {
                window["zoom_banco"].clear(); // Limpa o visual do banco
            }

            // Como removemos o banco da filial, precisamos resetar a Agência também
            $("#num_agencia").val("");
            $("#cpJornadaAdmissao").val("").removeAttr("data-jornada-pendente");
            if (typeof popularJornadasAdmissaoPorColigada === "function") {
                popularJornadasAdmissaoPorColigada("");
            }
            if (typeof aplicarBloqueioDadosContratacaoPorJornada === "function") {
                aplicarBloqueioDadosContratacaoPorJornada();
            }
            if (window['zoom_agencia'] !== undefined) {
                window['zoom_agencia'].clear();
            }
            changeZoomState("zoom_agencia", true); // Bloqueia a agência novamente
        }

        if (inputId == "FUN_IDDESCTURN") {
            $("#FUN_CODTURN").val("");
            if (aplicandoJornadaAgora) {
                if (typeof limparCampoAplicadoPorJornada === "function") {
                    limparCampoAplicadoPorJornada("FUN_SEQTURN_IDDESC_AD");
                }
                return;
            }
            // Chama o Motor Central que já vai cuidar de bloquear a Sequência automaticamente
            if (typeof window.liberarSequenciaTurno === "function") {
                window.liberarSequenciaTurno();
            }
            if (typeof limparCampoAplicadoPorJornada === "function") {
                limparCampoAplicadoPorJornada("FUN_SEQTURN_IDDESC_AD");
            }
        }

        if (inputId == "zoom_banco") {
            $("#num_banco, #num_agencia").val("");
            if (window['zoom_agencia'] !== undefined) window['zoom_agencia'].clear();
            changeZoomState("zoom_agencia", true);
        }

        if (inputId == "zoom_banco_fgts") {
            $("#FUN_BANCOFGTS").val("");
            if (window["zoom_agencia_fgts"] != undefined) window["zoom_agencia_fgts"].clear();
        }

        if (inputId == "zoom_estado") {
            $("#txtCODETD, #txtNOMECODETD, #txtEstado").val("");
            if (window["zoom_municipio"] != undefined) window["zoom_municipio"].clear();
        }

        // LIMPEZA DOS CAMPOS OCULTOS
        if (inputId == "zoom_agencia") $("#num_agencia").val("");
        if (inputId == "zoom_sindicato") $("#cod_sindicato").val("");
        if (inputId == "zoom_categoriaEsocial") $("#FUN_CATESOCIAL").val("");
        if (inputId == "zoomTipoFuncionario") $("#codTipoFuncionario").val("");
        if (inputId == "zoom_banco_pis") $("#FUN_CODBANCOPIS").val("");
        if (inputId == "zoom_agencia_fgts") $("#cpAgenciaFGTS").val("");
        if (inputId == "zoom_sindicato_filiacao") $("#FUN_CODDESCSINDICATOFILIACAO").val("");
        if (inputId == "FUN_TIPOPGTO_IDDESC_AD") $("#FUN_TIPOPGTO, #FUN_TIPOPGTO_DESC_AD").val("");
        if (inputId == "FUN_SEQTURN_IDDESC_AD") $("#FUN_SEQTURN, #FUN_SEQTURN_DESC_AD").val("");
        if (inputId == "zoom_municipio") $("#txtCODMUNICIPIO, #txtNOMEMUNICIPIO").val("");
        if (inputId == "zoom_estado_natal") $("#ESTADONatalCod, #ESTADO").val("");
        if (inputId == "zoom_equipe") $("#cpCodigoEquipe").val("");
        if (inputId == "zoom_quiosque") $("#FUN_CODQUIOSQUE_IDDESC").val("");
        if (inputId == "zoom_centroCusto") $("#FUN_CC").val("");
        if (inputId == "zoom_vinculo_rais") $("#FUN_VINCEMPREG, #FUN_VINCEMPREG_IDDESC_AD").val("");
        if (inputId == "zoom_categoria_sefip") $("#FUN_CATSEFIP_IDDESC").val("");
        if (inputId == "zoom_ocorrencia_sefip") $("#FUN_CODOCORRENCIA_IDDESC").val("");
        if (inputId == "zoom_situacao_rais") $("#cpSituacaoRais").val("");

        if (inputId == "cpEmailCandidatoInicio") $("#hidden_mail_assunto, #hidden_mail_corpo").val("");

        if (inputId && inputId.indexOf("zoom_kit_") === 0) {
            var docPrefix = inputId.replace("zoom_", "");
            $("#file_" + docPrefix).prop("disabled", false).val("");
            if ($("#id_pdf_" + docPrefix).val() !== "") {
                if (typeof deletarDocumentoGED === "function") deletarDocumentoGED(docPrefix);
            }
        }

        if (inputId.indexOf("txtParentescoDepen___") > -1) {
            if (typeof sincronizarFiliacao === "function") sincronizarFiliacao();
        }

        if (inputId == "FUN_SECAO_IDDESC_AD") {
            setTimeout(function () {
                if (typeof exibeDocumentosPorJornadaKit === "function") exibeDocumentosPorJornadaKit();
            }, 300);
        }

    } catch (error) {
        console.error(">>> [ZOOM EVENT] Erro tratado na REMOÇÃO do item: ", error);
    }
}

// =========================================================================
// GATILHOS INICIAIS (Form Load / Mudança de Atividade)
// =========================================================================
$(document).ready(function () {
    setTimeout(function () {
        var bancoAtual = $("#num_banco").val();
        if (!bancoAtual || bancoAtual === "") {
            changeZoomState("zoom_agencia", true);
        } else {
            if (typeof reloadZoomFilterValues === "function") reloadZoomFilterValues("zoom_agencia", "NUMBANCO," + bancoAtual);
        }

        var empresaSalva = $("#FUN_EMPRESA").val() || $("#txtCodcoligada").val();
        if (empresaSalva) {
            if (typeof reloadZoomFilterValues === "function") {
                reloadZoomFilterValues("zoom_quiosque", "CODCOLIGADA," + empresaSalva);
                reloadZoomFilterValues("zoom_centroCusto", "CODCOLIGADA," + empresaSalva);
                reloadZoomFilterValues("zoom_sindicato", "ID_EMPRESA," + empresaSalva);
                reloadZoomFilterValues("FUN_SECAO_IDDESC_AD", "CODCOLIGADA," + empresaSalva);

                var turnoSalvo = $("#FUN_CODTURN").val() || $("#FUN_IDDESCTURN").val();
                if (Array.isArray(turnoSalvo)) turnoSalvo = turnoSalvo[0];
                if (typeof turnoSalvo === "string" && turnoSalvo.indexOf("-") > -1) {
                    turnoSalvo = turnoSalvo.split("-")[0].trim();
                }

                if (turnoSalvo && turnoSalvo !== "") {
                    try {
                        // Envia o comando, o Escudo Global recém atualizado vai cuidar se o campo não existir
                        reloadZoomFilterValues("FUN_SEQTURN_IDDESC_AD", "ID_EMPRESA," + empresaSalva + ",CODHORARIO," + turnoSalvo);
                    } catch (err) {
                        console.warn(">>> Erro ignorado ao pré-filtrar Sequência na carga da tela.");
                    }
                }

                var tentativas = 0;
                var intervalDesbloqueio = setInterval(function () {
                    tentativas++;
                    if (typeof campoFoiAplicadoPorJornada !== "function" || !campoFoiAplicadoPorJornada("FUN_SEQTURN_IDDESC_AD")) {
                        changeZoomState("FUN_SEQTURN_IDDESC_AD", false);
                        if ($("#FUN_SEQTURN_IDDESC_AD").hasClass("select2-offscreen")) {
                            $("#FUN_SEQTURN_IDDESC_AD").select2("enable", true);
                        }
                        $("#FUN_SEQTURN_IDDESC_AD").prop("disabled", false).removeAttr("disabled");
                    }

                    if (tentativas >= 10) clearInterval(intervalDesbloqueio);
                }, 500);
            }
        }
    }, 800);
});

function aplicarParametrosPorFilial(codEmpresa, codFilial) {
    console.log(">>> [Admissão] Iniciando aplicarParametrosPorFilial - Empresa:", codEmpresa, "Filial:", codFilial);

    if (!codEmpresa || !codFilial) {
        console.error(">>> [Admissão] Empresa ou Filial indefinidas no momento do click. Abortando.");
        return;
    }

    var c1 = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);

    // 1. Busca Assíncrona do Documento Mestre
    DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, [c1], null, {
        success: function (dsConfig) {
            console.log(">>> [Admissão] Retorno do Dataset de Configuração Mestre:", dsConfig);

            if (dsConfig && dsConfig.values && dsConfig.values.length > 0) {
                // Previne erro entre documentid (novo) e metadata#id (legado)
                var docId = dsConfig.values[0]["documentid"] || dsConfig.values[0]["metadata#id"];
                console.log(">>> [Admissão] ID do Documento Mestre de Configuração:", docId);

                // 2. Busca Assíncrona dos Filhos (Tabela Pai x Filho) usando documentid
                var cDoc = DatasetFactory.createConstraint("tablename", "tbParametrosFilial", "tbParametrosFilial", ConstraintType.MUST);
                var cId = DatasetFactory.createConstraint("documentid", docId, docId, ConstraintType.MUST);

                DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, [cDoc, cId], null, {
                    success: function (dsParametros) {
                        console.log(">>> [Admissão] Retorno da Tabela de Parâmetros (Linhas Filhas):", dsParametros);

                        if (dsParametros && dsParametros.values) {
                            var regraEncontrada = false;

                            for (var i = 0; i < dsParametros.values.length; i++) {
                                var paramEmp = dsParametros.values[i]["PARAM_COD_EMPRESA"];
                                var paramFil = dsParametros.values[i]["PARAM_COD_FILIAL"];

                                console.log(">>> [Admissão] Lendo regra gravada -> Emp: " + paramEmp + " | Fil: " + paramFil);

                                // Proteção com parseInt para evitar que "01" seja diferente de "1"
                                if (parseInt(paramEmp, 10) === parseInt(codEmpresa, 10) && parseInt(paramFil, 10) === parseInt(codFilial, 10)) {
                                    regraEncontrada = true;
                                    console.log(">>> [Admissão] MATCH! Regra encontrada para esta filial.");

                                    var bancoDefault = dsParametros.values[i]["PARAM_BANCO"];
                                    var agenciaDefault = dsParametros.values[i]["PARAM_AGENCIA"];
                                    var padtDefault = dsParametros.values[i]["PARAM_PADT"];

                                    // Atenção ao id do campo do Arredondamento salvo pela sua Widget
                                    var arredondamentoDefault = dsParametros.values[i]["PARAM_ARREDONDAMENTO"];

                                    // --- Aplica Adiantamento ---
                                    if (padtDefault) {
                                        $("#FUN_PADT").val(padtDefault);
                                        console.log(">>> [Admissão] Adiantamento (PADT) aplicado:", padtDefault);
                                    }

                                    // --- Aplica Arredondamento ---
                                    if (arredondamentoDefault) {
                                        $("#cpArredondamento").val(arredondamentoDefault);
                                        console.log(">>> [Admissão] Arredondamento aplicado:", arredondamentoDefault);
                                    }

                                    // --- Aplica Banco e Agência (Delegado para função auxiliar) ---
                                    if (bancoDefault) {
                                        aplicarBancoEAgenciaAsync(bancoDefault, agenciaDefault);
                                    } else {
                                        FLUIGC.toast({ title: 'Regra Aplicada', message: 'Parâmetros automáticos preenchidos (sem banco).', type: 'info' });
                                    }

                                    break; // Sai do loop após achar a filial correta
                                }
                            }

                            if (!regraEncontrada) {
                                console.warn(">>> [Admissão] A filial selecionada (" + codEmpresa + "-" + codFilial + ") não possui parâmetros cadastrados na Widget.");
                            }
                        }
                    },
                    error: function (err) {
                        console.error(">>> [Admissão] Erro ao buscar os Parâmetros da Filial:", err);
                    }
                });

            } else {
                console.warn(">>> [Admissão] Nenhuma configuração ativa encontrada. Salve algo na Widget primeiro.");
            }
        },
        error: function (err) {
            console.error(">>> [Admissão] Erro grave de comunicação com o Dataset Form_Configuracoes_Admissao:", err);
        }
    });
}

// Função auxiliar assíncrona para resolver as descrições de Banco e Agência
function aplicarBancoEAgenciaAsync(bancoDefault, agenciaDefault) {
    console.log(">>> [Admissão] Iniciando busca da descrição do Banco:", bancoDefault);

    var cBanco = DatasetFactory.createConstraint("CODIGO", bancoDefault, bancoDefault, ConstraintType.MUST);
    DatasetFactory.getDataset("ds_irho_banco", null, [cBanco], null, {
        success: function (dsBanco) {
            var idDescBanco = bancoDefault;
            if (dsBanco && dsBanco.values && dsBanco.values.length > 0) {
                idDescBanco = dsBanco.values[0]["IDDESC_BANCO"];
            }

            $("#num_banco").val(bancoDefault);
            if (window["zoom_banco"] !== undefined) {
                $("#zoom_banco").empty().append(new Option(idDescBanco, idDescBanco, true, true)).trigger("change");
                try { window["zoom_banco"].setValue(idDescBanco); } catch (e) { }
            }

            // Destrava zoom de agência
            changeZoomState("zoom_agencia", false);
            if (window['zoom_agencia'] !== undefined) window['zoom_agencia'].clear();

            if (agenciaDefault && agenciaDefault !== "") {
                console.log(">>> [Admissão] Iniciando busca da descrição da Agência:", agenciaDefault);

                var cBancoAg = DatasetFactory.createConstraint("NUMBANCO", bancoDefault, bancoDefault, ConstraintType.MUST);
                var cAgencia = DatasetFactory.createConstraint("NUMAGENCIA", agenciaDefault, agenciaDefault, ConstraintType.MUST);

                DatasetFactory.getDataset("ds_irho_agenciasBanco", null, [cBancoAg, cAgencia], null, {
                    success: function (dsAgencia) {
                        var idDescAgencia = agenciaDefault;
                        if (dsAgencia && dsAgencia.values && dsAgencia.values.length > 0) {
                            idDescAgencia = dsAgencia.values[0]["IDDESC_AGENCIA"];
                        }

                        $("#num_agencia").val(agenciaDefault);
                        if (window["zoom_agencia"] !== undefined) {
                            $("#zoom_agencia").empty().append(new Option(idDescAgencia, idDescAgencia, true, true)).trigger("change");
                            try { window["zoom_agencia"].setValue(idDescAgencia); } catch (e) { }
                        }

                        if (typeof reloadZoomFilterValues === "function") {
                            reloadZoomFilterValues("zoom_agencia", "NUMBANCO," + bancoDefault);
                        }

                        FLUIGC.toast({ title: 'Regras Aplicadas', message: 'Arredondamento, Banco e Agência preenchidos.', type: 'info' });
                    },
                    error: function (err) { console.error(">>> Erro ao buscar agência:", err); }
                });
            } else {
                if (typeof reloadZoomFilterValues === "function") {
                    reloadZoomFilterValues("zoom_agencia", "NUMBANCO," + bancoDefault);
                }
                FLUIGC.toast({ title: 'Regras Aplicadas', message: 'Arredondamento e Banco preenchidos.', type: 'info' });
            }
        },
        error: function (err) { console.error(">>> Erro ao buscar banco:", err); }
    });
}

// =========================================================================
// GERADOR DE PDF 1: CONTRATO (ATUALIZADO COM MOTOR DINÂMICO)
// =========================================================================
function gerarPDFContrato(htmlTemplate) {
    // Pega o nome apenas para nomear o arquivo final
    var txtNomeColaborador = $("#txtNomeColaborador").val() || "Colaborador";

    // 1. Motor Dinâmico de Variáveis
    var htmlFinal = htmlTemplate;
    var tags = htmlFinal.match(/\{[a-zA-Z0-9_]+\}/g);

    if (tags) {
        // Remove duplicatas para otimizar a performance
        tags = tags.filter(function (item, pos) { return tags.indexOf(item) == pos; });

        tags.forEach(function (tag) {
            var idCampo = tag.replace(/[{}]/g, ''); // Extrai apenas o ID (ex: txtNomeColaborador)
            var valor = "";
            var $campo = $("#" + idCampo);

            if ($campo.length > 0) {
                // Tenta pegar o texto visível se for um campo Select
                if ($campo.is("select")) {
                    valor = $campo.find("option:selected").text();
                    if (!valor || valor.indexOf("Selecione") > -1) valor = $campo.val();
                } else {
                    valor = $campo.val();
                }
                // Fluig retorna array em campos Zoom, pegamos a primeira posição
                if (Array.isArray(valor)) valor = valor[0];
            }

            // Tratamento específico do seu formulário para o CPF
            if (idCampo === "cpfcnpj" && (!valor || valor === "")) {
                valor = $("#cpfcnpjValue").val() || "";
            }

            if (!valor) valor = ""; // Previne null ou undefined

            // Substitui todas as ocorrências da tag no contrato pelo valor do formulário
            var regexReplace = new RegExp(tag.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g');
            htmlFinal = htmlFinal.replace(regexReplace, valor);
        });
    }

    // 2. Limpeza do HTML (Mantido do seu código original)
    var htmlParaPDF = '<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; text-align: justify;">' + htmlFinal + '</div>';

    var htmlTratado = htmlParaPDF
        .replace(/<colgroup[\s\S]*?<\/colgroup>/gi, '')
        .replace(/<(img|br|hr|input)([^>]*?)(?:\/?)>/gi, '<$1$2 />')
        .replace(/&nbsp;/gi, '&#160;')
        .replace(/&ndash;/gi, '&#8211;')
        .replace(/&mdash;/gi, '&#8212;')
        .replace(/&ldquo;/gi, '"')
        .replace(/&rdquo;/gi, '"');

    var fileName = 'Contrato_' + txtNomeColaborador.replace(/\s+/g, '_') + '.pdf';

    FLUIGC.toast({ title: 'Aguarde:', message: 'A gerar e guardar o contrato no Servidor...', type: 'info' });

    var c1 = DatasetFactory.createConstraint("HTML_CONTENT", htmlTratado, htmlTratado, ConstraintType.MUST);

    DatasetFactory.getDataset("ds_irho_gerar_pdf_admissao", null, [c1], null, {
        success: function (ds) {
            if (ds && ds.values && ds.values.length > 0 && ds.values[0].STATUS == "SUCCESS") {
                var pdfBase64 = ds.values[0].BASE64;
                salvarPdfNoFluig(pdfBase64, fileName);
            } else {
                console.error(">>> [DEBUG PDF] Erro no Dataset: ", ds.values[0] ? ds.values[0].ERRO : "Erro desconhecido");
                FLUIGC.toast({ title: 'Erro de Formatação:', message: 'Falha na renderização. Verifique se o modelo HTML possui as etiquetas bem fechadas.', type: 'danger' });
            }
        },
        error: function (err) {
            console.error(">>> [DEBUG PDF] Erro de Comunicação: ", err);
            FLUIGC.toast({ title: 'Erro:', message: 'Falha ao comunicar com o servidor Fluig.', type: 'danger' });
        }
    });
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

function salvarPdfNoFluig(base64Data, fileName) {
    var pastaCandidato = $("#cpIdPastaGedCandidato").val();
    var idPastaDestino = (pastaCandidato && pastaCandidato !== "") ? parseInt(pastaCandidato) : 3479;

    var blob = b64toBlob(base64Data, 'application/pdf');
    var formData = new FormData();
    formData.append('file', blob, fileName);

    $.ajax({
        url: '/ecm/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            publicarDocumentoGED(fileName, idPastaDestino);
        },
        error: function (err) {
            FLUIGC.toast({ title: 'Erro: ', message: 'Falha ao enviar o ficheiro temporário.', type: 'danger' });
        }
    });
}

function publicarDocumentoGED(fileName, idPastaDestino) {
    var jsonDocumento = {
        "description": fileName,
        "parentId": idPastaDestino,
        "attachments": [{ "fileName": fileName, "principal": true }]
    };

    $.ajax({
        url: '/api/public/ecm/document/createDocument',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(jsonDocumento),
        success: function (response) {
            var idDocumentoGerado = response.content.id;
            $("#id_pdf_contrato").val(idDocumentoGerado);
            $("#div_ver_contrato").show();
            FLUIGC.toast({ title: 'Sucesso: ', message: 'Contrato salvo no GED com sucesso!', type: 'success' });
        },
        error: function (err) {
            FLUIGC.toast({ title: 'Erro: ', message: 'Falha ao publicar o contrato no GED.', type: 'danger' });
        }
    });
}

function visualizarContratoGerado() {
    var docId = $("#id_pdf_contrato").val();
    if (docId) window.open('/portal/p/1/ecmnavigation?app_ecm_navigation_doc=' + docId, '_blank');
}

// =========================================================================
// GERADOR DE PDF 2: DINÂMICO (ATUALIZADO COM MOTOR DINÂMICO)
// =========================================================================
function gerarPDFDocumentoDinamico(htmlTemplate, docPrefix, docName) {
    var txtNomeColaborador = $("#txtNomeColaborador").val() || "Colaborador";

    // 1. Motor Dinâmico de Variáveis
    var htmlFinal = htmlTemplate;
    var tags = htmlFinal.match(/\{[a-zA-Z0-9_]+\}/g);

    if (tags) {
        tags = tags.filter(function (item, pos) { return tags.indexOf(item) == pos; });

        tags.forEach(function (tag) {
            var idCampo = tag.replace(/[{}]/g, '');
            var valor = "";
            var $campo = $("#" + idCampo);

            if ($campo.length > 0) {
                if ($campo.is("select")) {
                    valor = $campo.find("option:selected").text();
                    if (!valor || valor.indexOf("Selecione") > -1) valor = $campo.val();
                } else {
                    valor = $campo.val();
                }
                if (Array.isArray(valor)) valor = valor[0];
            }

            if (idCampo === "cpfcnpj" && (!valor || valor === "")) {
                valor = $("#cpfcnpjValue").val() || "";
            }

            if (!valor) valor = "";

            var regexReplace = new RegExp(tag.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g');
            htmlFinal = htmlFinal.replace(regexReplace, valor);
        });
    }

    // 2. Monta o HTML limpo (Mantido do seu código original)
    var htmlParaPDF = '<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; text-align: justify;">' + htmlFinal + '</div>';

    var htmlTratado = htmlParaPDF
        .replace(/<colgroup[\s\S]*?<\/colgroup>/gi, '')
        .replace(/<(img|br|hr|input)([^>]*?)(?:\/?)>/gi, '<$1$2 />')
        .replace(/&nbsp;/gi, '&#160;')
        .replace(/&ndash;/gi, '&#8211;')
        .replace(/&mdash;/gi, '&#8212;')
        .replace(/&ldquo;/gi, '"')
        .replace(/&rdquo;/gi, '"');

    var nomeBasePdf = docName.trim() + " - " + txtNomeColaborador.trim();
    nomeBasePdf = nomeBasePdf.replace(/[\\/:*?"<>|]/g, "");

    var pastaCandidato = $("#cpIdPastaDocsGerados").val();
    var idPastaDestino = (pastaCandidato && pastaCandidato !== "") ? parseInt(pastaCandidato) : 3479;

    FLUIGC.toast({ title: 'Aguarde:', message: 'A gerar ' + docName + ' via Servidor...', type: 'info' });

    obterNomeArquivoUnico(nomeBasePdf, idPastaDestino, function (nomeFinalUnico) {

        var c1 = DatasetFactory.createConstraint("HTML_CONTENT", htmlTratado, htmlTratado, ConstraintType.MUST);

        DatasetFactory.getDataset("ds_irho_gerar_pdf_admissao", null, [c1], null, {
            success: function (ds) {
                if (ds && ds.values && ds.values.length > 0 && ds.values[0].STATUS == "SUCCESS") {
                    var pdfBase64 = ds.values[0].BASE64;
                    salvarPdfNoFluigDin(pdfBase64, nomeFinalUnico, docPrefix, idPastaDestino, docName);
                } else {
                    console.error(">>> [DEBUG PDF DINAMICO] Erro no Dataset: ", ds.values[0] ? ds.values[0].ERRO : "Erro desconhecido");
                    FLUIGC.toast({ title: 'Erro:', message: 'Falha na renderização do Java. Verifique a formatação do modelo.', type: 'danger' });
                }
            },
            error: function (err) {
                console.error(">>> [DEBUG PDF DINAMICO] Erro de Comunicação: ", err);
                FLUIGC.toast({ title: 'Erro:', message: 'Falha ao comunicar com o servidor Fluig.', type: 'danger' });
            }
        });
    });
}

function publicarDocumentoGEDDin(fileName, idPastaDestino, docPrefix, docNameFriendly) {
    var jsonDocumento = {
        "description": fileName,
        "parentId": idPastaDestino,
        "attachments": [{ "fileName": fileName, "principal": true }]
    };

    $.ajax({
        url: '/api/public/ecm/document/createDocument',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(jsonDocumento),
        success: function (response) {
            var idDocumentoGerado = response.content.id;
            $("#id_pdf_" + docPrefix).val(idDocumentoGerado).attr("data-origin", "SYS");
            var nomeParaCofre = docNameFriendly || fileName;

            if (typeof window.salvarIdNoCofreJson === "function") {
                window.salvarIdNoCofreJson(docPrefix, idDocumentoGerado, "SYS", nomeParaCofre);
            }

            if (typeof window.aplicarTravasDocumentosKit === "function") window.aplicarTravasDocumentosKit();

            $("#btn_ver_" + docPrefix).show();
            if ($("#btn_excluir_" + docPrefix).length > 0) $("#btn_excluir_" + docPrefix).show();

            if (typeof changeZoomState === "function" && window["zoom_" + docPrefix]) {
                changeZoomState("zoom_" + docPrefix, true);
            }

            FLUIGC.toast({ title: 'Sucesso: ', message: fileName + ' gerado no GED!', type: 'success' });
        },
        error: function (err) {
            $("#status_chk_" + docPrefix).text("Erro ao Salvar").css("color", "#ef4444");
            $("#chk_" + docPrefix).prop("disabled", false).prop("checked", false);
            FLUIGC.toast({ title: 'Erro: ', message: 'Falha ao publicar no GED.', type: 'danger' });
        }
    });
}

function salvarPdfNoFluigDin(base64Data, fileName, docPrefix, idPastaDestino, docNameFriendly) {
    var blob = b64toBlob(base64Data, 'application/pdf');
    var formData = new FormData();
    formData.append('file', blob, fileName);

    $.ajax({
        url: '/ecm/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            publicarDocumentoGEDDin(fileName, idPastaDestino, docPrefix, docNameFriendly);
        },
        error: function (err) {
            FLUIGC.toast({ title: 'Erro: ', message: 'Falha ao enviar o ficheiro temporário.', type: 'danger' });
        }
    });
}

function obterNomeArquivoUnico(nomeBase, idPasta, callback) {
    if (!idPasta || idPasta === "") {
        callback(nomeBase + ".pdf");
        return;
    }

    $.ajax({
        url: "/api/public/ecm/document/listDocument/" + idPasta + "?limit=1000",
        type: "GET",
        success: function (res) {
            var items = res.content || [];
            var nomesExistentes = [];

            for (var i = 0; i < items.length; i++) {
                nomesExistentes.push(items[i].description.toLowerCase());
            }

            var nomeFinal = nomeBase + ".pdf";
            var contador = 2;

            while (nomesExistentes.indexOf(nomeFinal.toLowerCase()) !== -1) {
                nomeFinal = nomeBase + " (" + contador + ").pdf";
                contador++;
            }

            callback(nomeFinal);
        },
        error: function (err) {
            callback(nomeBase + ".pdf");
        }
    });
}
