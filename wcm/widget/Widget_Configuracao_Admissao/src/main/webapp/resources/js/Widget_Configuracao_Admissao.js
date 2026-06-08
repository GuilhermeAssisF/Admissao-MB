var Widget_Configuracao_Admissao = SuperWidget.extend({
    instanceId: null,
    documentId: null, // Mantém backup em memória caso o HTML com hidden cacheie
    itensEmMemoria: {},
    ID_PASTA_FORMULARIO: 17765,
    SENHA_MESTRE: 'MB_Admin@2026', // Defina a senha desejada aqui

    init: function () {
        this.carregarDados();
        this.configurarEventosSenha();
    },

    bindings: {
        local: {
            'save-config': ['click_salvarConfiguracoes'],
            'new-config': ['click_abrirNovoFormulario'],
            'back-dashboard': ['click_voltarPainel']
        }
    },

    configurarEventosSenha: function () {
        var that = this;
        // Habilita o botão de editar apenas quando houver algo digitado na senha
        $("#pwd_acesso_" + this.instanceId).on('keyup', function () {
            var val = $(this).val();
            if (val && val.length > 0) {
                $("#btn_editar_config_" + that.instanceId).prop('disabled', false);
            } else {
                $("#btn_editar_config_" + that.instanceId).prop('disabled', true);
            }
        });

        // Força o bind direto com jQuery para evitar problemas do lifecycle do SuperWidget em botões disabled
        $("#btn_editar_config_" + this.instanceId).off('click').on('click', function (e) {
            e.preventDefault();
            that.verificarSenhaE_Editar();
        });
    },

    /**
     * Fluxo de Listagem e Cache em Memória
     * Busca os dados no Dataset e armazena no objeto this.itensEmMemoria
     */
    carregarDados: function () {
        var that = this;

        // Reset UI de Dashboard
        $("#status_icon_" + that.instanceId).html('<i class="flaticon flaticon-system-clock"></i>').css("color", "#ccc");
        $("#status_text_" + that.instanceId).text("Carregando dados...");
        $("#status_subtext_" + that.instanceId).text("Verificando se já existe uma configuração ativa neste servidor.");
        $("#btn_criar_config_" + that.instanceId).hide();
        $("#area_autenticacao_" + that.instanceId).hide();

        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: "Form_Configuracoes_Admissao",
                constraints: [{
                    "_field": "metadata#active",
                    "_initialValue": "true",
                    "_finalValue": "true",
                    "_type": 1, // MUST
                    "_likeSearch": false
                }]
            }),
            success: function (res) {
                that.itensEmMemoria = {};
                var valores = res.content ? res.content.values : [];
                var qtdValidos = 0;

                if (valores && valores.length > 0) {
                    for (var i = 0; i < valores.length; i++) {
                        var item = valores[i];

                        if (item["metadata#active"] === false || item["metadata#active"] === "false") {
                            continue; // Pula registros inativos
                        }

                        var docId = item.documentid || item["metadata#id"];
                        if (!docId) continue;

                        that.itensEmMemoria[docId] = item;
                        qtdValidos++;
                    }
                }

                if (qtdValidos > 0) {
                    // JÁ EXISTE CONFIGURAÇÃO
                    $("#status_icon_" + that.instanceId).html('<i class="flaticon flaticon-check-circle-on"></i>').css("color", "#4caf50");
                    $("#status_text_" + that.instanceId).text("Configurações Encontradas");
                    $("#status_subtext_" + that.instanceId).text("1 registro ativo de configuração geral foi localizado.");

                    $("#area_autenticacao_" + that.instanceId).fadeIn();
                } else {
                    // NÃO EXISTE CONFIGURAÇÃO
                    $("#status_icon_" + that.instanceId).html('<i class="flaticon flaticon-warning-circle"></i>').css("color", "#ff9800");
                    $("#status_text_" + that.instanceId).text("Nenhuma Configuração Encontrada");
                    $("#status_subtext_" + that.instanceId).text("Você precisa criar o perfil de configuração interna.");

                    // Limpa id para garantir INSERT 
                    that.documentId = null;
                    if ($("#config_doc_id_" + that.instanceId).length > 0) {
                        $("#config_doc_id_" + that.instanceId).val('');
                    }

                    $("#btn_criar_config_" + that.instanceId).fadeIn();
                }
            },
            error: function (err) {
                console.error("Erro ao consultar dataset: ", err);
                $("#status_icon_" + that.instanceId).html('<i class="flaticon flaticon-close-circle"></i>').css("color", "#f44336");
                $("#status_text_" + that.instanceId).text("Erro de Conexão");
                $("#status_subtext_" + that.instanceId).text("Falha ao comunicar com os Datasets internos do Fluig.");
            }
        });
    },

    // --- NAVEGAÇÃO E AUTENTICAÇÃO ---

    abrirNovoFormulario: function () {
        // Zera os campos pro caso de ter sujeira
        $("#Widget_Configuracao_Admissao_" + this.instanceId + " input.form-control").val('');

        $("#view_dashboard_" + this.instanceId).hide();
        $("#view_formulario_" + this.instanceId).fadeIn();
    },

    voltarPainel: function () {
        $("#view_formulario_" + this.instanceId).hide();
        $("#view_dashboard_" + this.instanceId).fadeIn();
        // Limpa a senha por segurança
        $("#pwd_acesso_" + this.instanceId).val('');
        $("#btn_editar_config_" + this.instanceId).prop('disabled', true);
    },

    verificarSenhaE_Editar: function () {
        var that = this;
        var senhaDigitada = $("#pwd_acesso_" + this.instanceId).val();

        if (senhaDigitada !== this.SENHA_MESTRE) {
            FLUIGC.toast({ title: 'Acesso Negado', message: 'Senha incorreta.', type: 'danger' });
            return;
        }

        // Senha correta: pega a primeira config em memoria e preenche a tela
        var ids = Object.keys(that.itensEmMemoria);
        if (ids.length > 0) {
            that.preencherFormulario(ids[0]);

            $("#view_dashboard_" + this.instanceId).hide();
            $("#view_formulario_" + this.instanceId).fadeIn();
        } else {
            FLUIGC.toast({ title: 'Erro', message: 'Nenhuma configuração em memória para editar.', type: 'warning' });
        }
    },

    /**
     * Fluxo de Edição 
     */
    preencherFormulario: function (docId) {
        var that = this;
        var configDaMemoria = this.itensEmMemoria[docId];

        if (configDaMemoria) {
            // Guarda o ID no campo oculto e também em memória local
            that.documentId = docId;
            if ($("#config_doc_id_" + that.instanceId).length > 0) {
                $("#config_doc_id_" + that.instanceId).val(docId);
            }

            var camposForm = [
                "FLUIG_SOAP_USER", "FLUIG_SOAP_PASS",
                "RM_USER", "RM_PASS", "RM_ENDPOINT_WS",
                "FLUIG_OAUTH_CONSUMER_KEY", "FLUIG_OAUTH_CONSUMER_SECRET",
                "FLUIG_OAUTH_TOKEN", "FLUIG_OAUTH_TOKEN_SECRET",
                "URL_PAGINA_CANDIDATO", "URL_PAGINA_CORRECAO", "URL_PAGINA_ASSINATURA"
            ];

            // Itera e preenche a tela
            camposForm.forEach(function (campo) {
                if (configDaMemoria[campo]) {
                    $("#" + campo + "_" + that.instanceId).val(configDaMemoria[campo]);
                }
            });
        }
    },

    /**
     * Fluxo de Gravação (Estratégia Delete + Create)
     */
    salvarConfiguracoes: function () {
        var that = this;

        // Lê o campo oculto de ID (ou do backup em memória)
        var hiddenVal = $("#config_doc_id_" + that.instanceId).val();
        var idDocumento = hiddenVal ? hiddenVal : that.documentId;

        var camposForm = [
            "FLUIG_SOAP_USER", "FLUIG_SOAP_PASS",
            "RM_USER", "RM_PASS", "RM_ENDPOINT_WS",
            "FLUIG_OAUTH_CONSUMER_KEY", "FLUIG_OAUTH_CONSUMER_SECRET",
            "FLUIG_OAUTH_TOKEN", "FLUIG_OAUTH_TOKEN_SECRET",
            "URL_PAGINA_CANDIDATO", "URL_PAGINA_CORRECAO", "URL_PAGINA_ASSINATURA"
        ];

        var formData = [];
        camposForm.forEach(function (campo) {
            formData.push({
                "name": campo,
                "value": String($("#" + campo + "_" + that.instanceId).val() || '')
            });
        });

        // Estrutura Obrigatória do Fluig para as APIs /cards
        var pacoteJSON = {
            "documentDescription": "ConfigAdmissao_Registro_" + new Date().getTime(),
            "version": 1000,
            "parentDocumentId": this.ID_PASTA_FORMULARIO,
            "inheritSecurity": true,
            "formData": formData
        };

        var loading = FLUIGC.loading(window);
        loading.show();

        if (idDocumento) {
            $.ajax({
                url: '/api/public/2.0/documents/deleteDocument/' + idDocumento,
                type: 'POST',
                success: function () {
                    that.gravarNovaConfiguracao(pacoteJSON, loading);
                },
                error: function (err) {
                    console.warn("Aviso ao tentar excluir o card antigo.", err);
                    that.gravarNovaConfiguracao(pacoteJSON, loading);
                }
            });
        } else {
            that.gravarNovaConfiguracao(pacoteJSON, loading);
        }
    },

    /**
     * Função Auxiliar para criar o Card físico após limpeza
     */
    gravarNovaConfiguracao: function (pacoteJSON, loading) {
        var that = this;
        $.ajax({
            url: '/api/public/2.0/cards/create',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(pacoteJSON),
            success: function (res) {
                loading.hide();
                FLUIGC.toast({ title: 'Sucesso', message: 'Dados salvos corretamente!', type: 'success' });

                // Limpa variáveis e cache
                that.documentId = null;
                $("#config_doc_id_" + that.instanceId).val('');

                // Volta para o dashboard e recarrega os status
                that.voltarPainel();
                setTimeout(function () {
                    that.carregarDados();
                }, 1000);
            },
            error: function (err) {
                loading.hide();
                console.error("Erro na API Cards Fluig:", err);
                FLUIGC.toast({ title: 'Erro Upsert', message: 'Houve falha na gravação.', type: 'danger' });
            }
        });
    }
});
