window.jornadasAdmissaoConfig = window.jornadasAdmissaoConfig || [];
window.camposJornadaAdmissaoConfig = window.camposJornadaAdmissaoConfig || [];
window.parametrosJornadaCarregados = window.parametrosJornadaCarregados || false;
window.parametrosJornadaCarregando = window.parametrosJornadaCarregando || false;
window.callbacksParametrosJornada = window.callbacksParametrosJornada || [];
window.aplicandoParametrosJornada = window.aplicandoParametrosJornada || false;
window.camposJornadaAplicados = window.camposJornadaAplicados || {};
window.timerRecalculoExperienciaJornada = window.timerRecalculoExperienciaJornada || null;
window.DEBUG_PARAM_JORNADA = window.DEBUG_PARAM_JORNADA !== undefined ? window.DEBUG_PARAM_JORNADA : true;

function logJornadaGrupo(titulo, dados) {
  if (!window.DEBUG_PARAM_JORNADA) {
    return;
  }

  if (console.groupCollapsed) {
    console.groupCollapsed("[Jornada][DEBUG] " + titulo);
    if (dados !== undefined) {
      console.log(dados);
    }
    console.groupEnd();
  } else {
    console.log("[Jornada][DEBUG] " + titulo, dados);
  }
}

function logJornadaTabela(titulo, linhas) {
  if (!window.DEBUG_PARAM_JORNADA) {
    return;
  }

  if (console.table && linhas && linhas.length) {
    console.log("[Jornada][DEBUG] " + titulo);
    console.table(linhas);
  } else {
    console.log("[Jornada][DEBUG] " + titulo, linhas || []);
  }
}

function normalizarValorComparacao(valor) {
  var texto = valor == null ? "" : String(valor);
  texto = $.trim(texto);

  if (!texto) {
    return "";
  }

  try {
    texto = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } catch (e) { }

  return texto.toLowerCase();
}

function obterValorCampoAtual(campoId) {
  var $campo = $("#" + campoId);

  if (!$campo.length) {
    return "";
  }

  try {
    if ($campo.is("select")) {
      var textoSelecionado = $.trim($campo.find("option:selected").text() || "");
      var valorSelecionado = $.trim($campo.val() || "");

      if (textoSelecionado && textoSelecionado !== valorSelecionado) {
        return textoSelecionado + " (" + valorSelecionado + ")";
      }

      return valorSelecionado || textoSelecionado;
    }

    return $.trim($campo.val() || "");
  } catch (e) {
    return "";
  }
}

function agendarRecalculoExperienciaPorJornada(origem) {
  if (window.timerRecalculoExperienciaJornada) {
    clearTimeout(window.timerRecalculoExperienciaJornada);
  }

  window.timerRecalculoExperienciaJornada = setTimeout(function () {
    console.log("[Jornada][Experiencia] Recalculando vencimentos apos jornada:", {
      origem: origem,
      cpContratoPrazo: $("#cpContratoPrazo").val(),
      cpDataPrevisaoAdmissao: $("#cpDataPrevisaoAdmissao").val(),
      FUN_ADMISSAO: $("#FUN_ADMISSAO").val(),
      cpDiasVencPrimeiraExp: $("#cpDiasVencPrimeiraExp").val(),
      cpDiasVencSegundaExp: $("#cpDiasVencSegundaExp").val()
    });

    if (typeof gerenciarPainelContrato === "function") {
      gerenciarPainelContrato(false);
    }

    if (typeof calcularVencimentosExperiencia === "function") {
      calcularVencimentosExperiencia();
    }

    if (typeof exibeDocumentosPorJornadaKit === "function") {
      exibeDocumentosPorJornadaKit();
    }

    console.log("[Jornada][Experiencia] Resultado do recalculo:", {
      cpVencPrimeiraExp: $("#cpVencPrimeiraExp").val(),
      cpVencSegundaExp: $("#cpVencSegundaExp").val()
    });
  }, 250);
}

window.safeReloadZoomFilterValues = window.safeReloadZoomFilterValues || function (campoId, filtro) {
  try {
    var $campo = $("#" + campoId);

    if (!$campo.length) {
      console.warn("[Zoom] Ignorado filtro. Campo nao existe:", campoId, filtro);
      return false;
    }

    if ($campo.is(":hidden") && !$campo.next(".select2-container").length) {
      console.warn("[Zoom] Ignorado filtro. Campo oculto/inativo:", campoId, filtro);
      return false;
    }

    if (typeof reloadZoomFilterValues !== "function") {
      console.warn("[Zoom] reloadZoomFilterValues indisponivel:", campoId, filtro);
      return false;
    }

    reloadZoomFilterValues(campoId, filtro);
    return true;
  } catch (e) {
    console.warn("[Zoom] Erro ignorado ao filtrar zoom:", {
      campoId: campoId,
      filtro: filtro,
      erro: e
    });
    return false;
  }
};
$(document).ready(function () {

  // ====================================================================
  // MOTOR CENTRAL DA SEQUÊNCIA DO TURNO (FONTE DA VERDADE)
  // ====================================================================
  window.jornadasAdmissaoConfig = window.jornadasAdmissaoConfig || [];
  window.camposJornadaAdmissaoConfig = window.camposJornadaAdmissaoConfig || [];
  window.parametrosJornadaCarregados = window.parametrosJornadaCarregados || false;
  window.parametrosJornadaCarregando = window.parametrosJornadaCarregando || false;
  window.callbacksParametrosJornada = window.callbacksParametrosJornada || [];
  window.aplicandoParametrosJornada = window.aplicandoParametrosJornada || false;
  window.camposJornadaAplicados = window.camposJornadaAplicados || {};
  window.DEBUG_PARAM_JORNADA = true;

  function logJornadaGrupo(titulo, dados) {
    if (!window.DEBUG_PARAM_JORNADA) {
      return;
    }

    if (console.groupCollapsed) {
      console.groupCollapsed("[Jornada][DEBUG] " + titulo);
      if (dados !== undefined) {
        console.log(dados);
      }
      console.groupEnd();
    } else {
      console.log("[Jornada][DEBUG] " + titulo, dados);
    }
  }

  function logJornadaTabela(titulo, linhas) {
    if (!window.DEBUG_PARAM_JORNADA) {
      return;
    }

    if (console.table && linhas && linhas.length) {
      console.log("[Jornada][DEBUG] " + titulo);
      console.table(linhas);
    } else {
      console.log("[Jornada][DEBUG] " + titulo, linhas || []);
    }
  }

  function normalizarValorComparacao(valor) {
    var texto = valor == null ? "" : String(valor);
    texto = $.trim(texto);

    if (!texto) {
      return "";
    }

    try {
      texto = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    } catch (e) { }

    return texto.toLowerCase();
  }

  function obterValorCampoAtual(campoId) {
    var $campo = $("#" + campoId);

    if (!$campo.length) {
      return "";
    }

    try {
      if ($campo.is("select")) {
        var textoSelecionado = $.trim($campo.find("option:selected").text() || "");
        var valorSelecionado = $.trim($campo.val() || "");

        if (textoSelecionado && textoSelecionado !== valorSelecionado) {
          return textoSelecionado + " (" + valorSelecionado + ")";
        }

        return valorSelecionado || textoSelecionado;
      }

      return $.trim($campo.val() || "");
    } catch (e) {
      return "";
    }
  }

  window.liberarSequenciaTurno = function () {
    var empresa = $("#FUN_EMPRESA").val() || $("#txtCodcoligada").val();
    var turno = $("#FUN_CODTURN").val() || $("#FUN_IDDESCTURN").val();

    // Limpa a string do turno caso venha como "0001 - Descrição"
    if (Array.isArray(turno)) turno = turno[0];
    if (typeof turno === "string" && turno.indexOf("-") > -1) {
      turno = turno.split("-")[0].trim();
    }

    var campoSeq = "FUN_SEQTURN_IDDESC_AD";

    if (empresa && empresa !== "" && turno && turno !== "") {
      // 1. DESBLOQUEIA O CAMPO VISUAL E NO HTML
      try { if (window[campoSeq]) window[campoSeq].disable(false); } catch (e) { }
      $("#" + campoSeq).prop('disabled', false).removeAttr('disabled');

      // 2. APLICA O FILTRO CORRETO
      setTimeout(function () {
        try {
          if (window.safeReloadZoomFilterValues) {
            window.safeReloadZoomFilterValues(campoSeq, "ID_EMPRESA," + empresa + ",CODHORARIO," + turno);
          }
        } catch (e) {
          console.warn("Aviso ao filtrar Sequência:", e);
        }
      }, 300);
    } else {
      // BLOQUEIA E LIMPA SE O TURNO FOR REMOVIDO OU ESTIVER VAZIO
      try { if (window[campoSeq]) window[campoSeq].disable(true); } catch (e) { }
      $("#" + campoSeq).prop('disabled', true).attr('disabled', 'disabled');
      if (window[campoSeq] && typeof window[campoSeq].clear === "function") {
        window[campoSeq].clear();
      }
    }
  };

  // Verifica se não há empresa selecionada
  if ($("#FUN_EMPRESA").val() == "" || $("#FUN_EMPRESA").val() == null) {

    var camposParaBloquear = [
      'FUN_IDDESCFUN',
      'FUN_IDDESCTURN',
      'FUN_SEQTURN_IDDESC_AD',
      'FUN_CCIDDESC',
      'FUN_SECAO_IDDESC_AD',
      'FUN_IDDESCSIND',
      'FUN_CODDESCSINDICATOFILIACAO',
      'FUN_NIVELFUNCAO',
      'FUN_FAIXASALARIAL',
      'FUN_INTEGRCONTABIL_IDDESC',
      'FUN_INTEGRGERENCIAL_IDDESC'
    ];

    // Função que força o bloqueio
    function forcarBloqueio() {
      $.each(camposParaBloquear, function (index, idCampo) {
        // 1. Bloqueio via API do Fluig (para o componente visual cinza)
        try {
          if (window[idCampo] && window[idCampo].disable) {
            window[idCampo].disable(true);
          }
        } catch (e) { }

        // 2. Bloqueio via HTML (para o input em si)
        $("#" + idCampo).attr('disabled', 'disabled');
        $("#" + idCampo).prop('disabled', true);
      });
    }

    // Executa imediatamente
    forcarBloqueio();

    // Executa novamente a cada 500ms durante 3 segundos para garantir
    // que pegue o componente Zoom assim que ele terminar de carregar
    var tentativas = 0;
    var intervaloBloqueio = setInterval(function () {
      // SÓ BLOQUEIA se a empresa continuar vazia
      if ($("#FUN_EMPRESA").val() == "" || $("#FUN_EMPRESA").val() == null) {
        forcarBloqueio();
      } else {
        // Se a integração do ATS já preencheu a empresa, MATAMOS o cronómetro
        // para ele não voltar a trancar a Secção e o Turno!
        clearInterval(intervaloBloqueio);
      }

      tentativas++;
      if (tentativas >= 6) clearInterval(intervaloBloqueio); // Para após 3s
    }, 500);

  }

  // Ativa campos disabled para serem salvos pelo Fluig ---
  // Campos "disabled" no HTML não são enviados no form submit do Fluig.
  // Transformamos em "readonly" para que o RM consiga popular e o Fluig salve no dataset.
  var camposParaHabilitar = [
    "ESTADONatalCod", "ESTADO", "txtNaturalidadeCod", "txtNaturalidade",
    "txtEstCivilCod", "txtEstadoCivil", "GRAUINSTRUCAOCod", "txtEscolaridade",
    "NACIONALIDADECod", "NACIONALIDADE", "txtCODTIPORUA", "txtNOMETIPORUA",
    "txtCODMUNICIPIO", "txtNOMEMUNICIPIO", "txtCODETD", "txtNOMECODETD",
    "CODUFCARTIDENTIDADE", "UFCARTIDENTIDADE", "CODUFTITULO", "UFTITULO",
    "CODUFCTPS", "UFCARTTRAB", "CodUFCNH", "UFCNH", "txtCODPAIS", "txtPAIS",
    "CORRACA"
  ];
  $.each(camposParaHabilitar, function (i, id) {
    var $el = $("#" + id);
    if ($el.length) {
      $el.prop("disabled", false).prop("readonly", true);
    }
  });


  var atividade = getWKNumState();

  // --- LÓGICA DO BOTÃO DE ANEXO ---
  $("#btnIrParaAnexos").on("click", function (e) {
    e.preventDefault(); // Previne qualquer comportamento padrão do botão

    try {
      // Seletor mais robusto que busca diretamente pelo link da aba de anexos
      var $anexosTab = window.parent.$('a[href="#attachments"]');

      if ($anexosTab.length > 0) {
        // Encontrou pelo href, clica nele
        $anexosTab.click();
      } else {
        // Se falhar, tenta o método antigo por posição (fallback)
        window.parent.$("#workflowView-tab").find("li").eq(1).find("a").click();
      }
    } catch (err) {
      console.error("Erro ao tentar mudar para a aba Anexos:", err);
      alert("Não foi possível navegar para a aba 'Anexos'. Por favor, clique manualmente.");
    }
  });

  // Função para UP Front
  function toggleUpFrontTipo() {
    var isSim = $("#cpUpFront").val() == "sim";
    var $radiosTipo = $("input[name='cpUpFrontTipo']");
    var $campoInfo = $("#cpUpFrontInfoEventos");

    // O tipo agora fica sempre visível
    $("#divUpFrontTipo").show();

    if (isSim) {
      $radiosTipo
        .prop("disabled", false)
        .css("cursor", "pointer");

      $("#divUpFrontInfoEventos").show();

      $campoInfo
        .prop("readonly", false)
        .prop("disabled", false)
        .css({
          "pointer-events": "auto",
          "background-color": "#fff",
          "cursor": "auto"
        });
    } else {
      if (atividade == 0 || atividade == 1 || atividade == 41) {
        $radiosTipo.prop("checked", false);
        $campoInfo.val("");
      }

      $radiosTipo
        .prop("disabled", true)
        .css("cursor", "not-allowed");

      $("#divUpFrontInfoEventos").hide();

      $campoInfo
        .prop("readonly", true)
        .prop("disabled", false)
        .css({
          "pointer-events": "none",
          "background-color": "#f3f4f6",
          "cursor": "not-allowed"
        });
    }
  }

  // Função para Hiring Bonus
  function toggleHiringBonusTipo() {
    var isSim = $("#cpHiringBonus").val() == "sim";
    var $radiosTipo = $("input[name='cpHiringBonusTipo']");
    var $campoInfo = $("#cpHiringBonusInfoEventos");

    // O tipo agora fica sempre visível
    $("#divHiringBonusTipo").show();

    if (isSim) {
      $radiosTipo
        .prop("disabled", false)
        .css("cursor", "pointer");

      $("#divHiringBonusInfoEventos").show();

      $campoInfo
        .prop("readonly", false)
        .prop("disabled", false)
        .css({
          "pointer-events": "auto",
          "background-color": "#fff",
          "cursor": "auto"
        });
    } else {
      if (atividade == 0 || atividade == 1 || atividade == 41) {
        $radiosTipo.prop("checked", false);
        $campoInfo.val("");
      }

      $radiosTipo
        .prop("disabled", true)
        .css("cursor", "not-allowed");

      $("#divHiringBonusInfoEventos").hide();

      $campoInfo
        .prop("readonly", true)
        .prop("disabled", false)
        .css({
          "pointer-events": "none",
          "background-color": "#f3f4f6",
          "cursor": "not-allowed"
        });
    }
  }

  // Função para Bonus
  function toggleBonusTipo() {
    var valor = $("#cpBonusValor").val();
    // Verifica se o valor não é vazio, 0,00 ou 0.00
    if (valor != "" && valor != "0,00" && valor != "0.00" && valor != null) {
      $("#divBonusTipo").show();
    } else {
      $("#divBonusTipo").hide();
      // Limpa seleção apenas em modo de edição
      if (atividade == 0 || atividade == 1 || atividade == 41) {
        $("input[name='cpBonusTipo']").prop("checked", false);
      }
    }
  }

  // Dispara as funções no carregamento da página (para modo de visão e edição)
  toggleUpFrontTipo();
  toggleHiringBonusTipo();
  toggleBonusTipo();

  $("#cpUpFront").off("change.valoresAssociados").on("change.valoresAssociados", toggleUpFrontTipo);
  $("#cpHiringBonus").off("change.valoresAssociados").on("change.valoresAssociados", toggleHiringBonusTipo);
  $("#cpBonusValor").off("blur.valoresAssociados change.valoresAssociados").on("blur.valoresAssociados change.valoresAssociados", toggleBonusTipo);

  // 1. Cria uma regra onde o primeiro dígito da hora é opcional (permitindo HH:MM ou HHH:MM)
  var maskBehavior = function (val) {
    return val.replace(/\D/g, '').length === 5 ? '000:00' : '00:009';
  },
    options = {
      onKeyPress: function (val, e, field, options) {
        field.mask(maskBehavior.apply({}, arguments), options);

        // 2. Validação extra: Impede que o usuário digite mais de 59 nos minutos
        var partes = val.split(':');
        if (partes.length === 2 && partes[1].length === 2) {
          var minutos = parseInt(partes[1], 10);
          if (minutos > 59) {
            // Se digitar 220:99, corrige automaticamente para 220:59
            field.val(partes[0] + ':59');
          }
        }
      }
    };

  // 3. Aplica a máscara em todos os campos que tenham a classe 'mask-horario'
  $('.mask-horario').mask(maskBehavior, options);

  // ====================================================================
  // RECEÇÃO DE DADOS DO PAINEL ATS (Com De-Para de Zoom e Desbloqueio)
  // ====================================================================
  function sincronizarDadosATS() {
    var dadosATS = localStorage.getItem("FLUIG_ATS_DATA");
    if (!dadosATS) return;

    try {
      var c = JSON.parse(dadosATS);

      // 1. Extrai o envelope original para o Balão e apaga-o para não dar erro no Fluig
      var dadosOriginais = c["_dadosOriginais"] || c;
      delete c["_dadosOriginais"];

      // 2. Chama a criação do balão com os dados brutos do ATS
      if (typeof criarBalaoResumoATS === "function") {
        criarBalaoResumoATS(dadosOriginais);
      }

      // 3. Separa o CNPJ para tratamento especial
      var cnpjFilial = c["CNPJ_FILIAL_ATS"];
      delete c["CNPJ_FILIAL_ATS"];

      // 1. Cola os dados normais
      $.each(c, function (campoId, valor) {
        if ($("#" + campoId).length > 0) {
          $("#" + campoId).val(valor).trigger("change");
          if (campoId === "cpJornadaAdmissao") {
            $("#cpJornadaAdmissao").attr("data-jornada-pendente", valor || "");
          }
        }
      });

      // 2. Limpa a memória
      localStorage.removeItem("FLUIG_ATS_DATA");

      setTimeout(function () {
        FLUIGC.toast({
          title: 'Integração ATS: ',
          message: 'Dados do candidato pré-preenchidos com sucesso!',
          type: 'success'
        });
      }, 500);

      // =========================================================
      // 3. TRATAMENTO DO ZOOM DA EMPRESA/FILIAL (COM DEBUG)
      // =========================================================
      if (cnpjFilial && cnpjFilial !== "") {
        console.log(">>> [ATS Sync] 1. Iniciando busca de Filial pelo CNPJ: " + cnpjFilial);

        // ATENÇÃO: Confirme o nome do dataset e da coluna do CNPJ
        var nomeDatasetFilial = "ds_irho_empresaFilial"; // Ex: 'ds_filiais_rm'
        var colunaCnpjDataset = "CNPJ_FILIAL";

        var cnpjLimpo = cnpjFilial.replace(/\D/g, '');
        var c1 = DatasetFactory.createConstraint(colunaCnpjDataset, cnpjLimpo, cnpjLimpo, ConstraintType.MUST);

        DatasetFactory.getDataset(nomeDatasetFilial, null, [c1], null, {
          success: function (dataset) {
            console.log(">>> [ATS Sync] 2. Retorno do Dataset de Filial:", dataset);

            var filialSelecionada = null;

            // Variável com o CNPJ do ATS (certifique-se de que atsData.cnpjFilial ou a variável que você usa aqui seja a correta)
            // Limpamos pontos e traços para garantir a comparação
            var cnpjBuscadoLimpo = String(atsData.cnpjFilial || atsData.CNPJ_FILIAL_ATS || "").replace(/\D/g, '');

            if (dataset && dataset.values && dataset.values.length > 0) {
              var filiaisRetornadas = dataset.values;

              // O SEGREDO: Varrer as 8 filiais que voltaram e achar a certa
              for (var i = 0; i < filiaisRetornadas.length; i++) {
                var linha = filiaisRetornadas[i];
                var cnpjRM = String(linha["CNPJ_FILIAL"] || linha["CNPJ"] || "").replace(/\D/g, '');

                if (cnpjRM !== "" && cnpjRM === cnpjBuscadoLimpo) {
                  filialSelecionada = linha;
                  break; // Achou a filial certa (ex: Index 7), para de procurar!
                }
              }
            }

            console.log(">>> [ATS Sync] 3. Objeto da Filial encontrada:", filialSelecionada);

            if (filialSelecionada) {
              console.log(">>> [ATS Sync] 4. Setando valor no componente Zoom visual...");

              var descFilial = filialSelecionada["IDDESC_EMPFILIALCOM"] || filialSelecionada["iddesc_empfilialcom"];

              // Removemos o 'setValue' nativo do Fluig e preenchemos via jQuery
              var $zoomFilial = $("#IDDESC_EMPRESAFILIAL");
              $zoomFilial.empty().append(new Option(descFilial, descFilial, true, true)).trigger("change");

              // Injetamos os dados ocultos corretos
              $("#FUN_EMPRESA").val(filialSelecionada["ID_EMPRESA"]);
              $("#FUN_FILIAL").val(filialSelecionada["ID_FILIAL"]);
              $("#FUN_NOMECOMERCIAL_FILIAL").val(filialSelecionada["NOMECOMERCIAL_FILIAL"]);
              $("#FUN_CNPJ_FILIAL").val(filialSelecionada["CNPJ_FILIAL"]);
              $("#FUN_LOGRADOURO_FILIAL").val(filialSelecionada["LOGRADOURO_FILIAL"]);
              $("#FUN_BAIRRO_FILIAL").val(filialSelecionada["BAIRRO_FILIAL"]);
              $("#FUN_CIDADE_FILIAL").val(filialSelecionada["CIDADE_FILIAL"]);
              $("#FUN_ESTADO_FILIAL").val(filialSelecionada["ESTADO_FILIAL"]);

              // Montamos o objeto Fake para o seu script de Zoom ler
              var zoomItemFake = {
                inputId: "IDDESC_EMPRESAFILIAL",
                ID_EMPRESA: filialSelecionada["ID_EMPRESA"],
                ID_FILIAL: filialSelecionada["ID_FILIAL"],
                NOMECOMERCIAL_FILIAL: filialSelecionada["NOMECOMERCIAL_FILIAL"],
                CNPJ_FILIAL: filialSelecionada["CNPJ_FILIAL"],
                LOGRADOURO_FILIAL: filialSelecionada["LOGRADOURO_FILIAL"],
                BAIRRO_FILIAL: filialSelecionada["BAIRRO_FILIAL"],
                CIDADE_FILIAL: filialSelecionada["CIDADE_FILIAL"],
                ESTADO_FILIAL: filialSelecionada["ESTADO_FILIAL"],
                IDDESC_EMPFILIALCOM: descFilial
              };

              setTimeout(function () {
                console.log(">>> [ATS Sync] 5. Disparando setSelectedZoomItem manualmente com a Coligada CORRETA:", filialSelecionada["ID_EMPRESA"]);
                if (typeof window.setSelectedZoomItem === "function") {
                  window.setSelectedZoomItem(zoomItemFake);
                }
              }, 500);
            } else {
              console.log(">>> [ATS Sync] ERRO: Nenhuma filial deu match com o CNPJ", cnpjBuscadoLimpo);
            }
          },
          error: function (error) {
            console.error(">>> [ATS Sync] Erro grave ao buscar a filial pelo CNPJ do ATS:", error);
          }
        });
      }

      // 4. "Acorda" os painéis e integrações (SERPRO / RM Labore)
      setTimeout(function () {
        if (typeof gerenciarPainelContrato === "function") {
          gerenciarPainelContrato(false)
        }

        // Dispara o SERPRO para validar o Nome usando o CPF
        var cpf = $("#cpfcnpj").val();
        if (cpf && cpf !== "") {
          $("#cpfcnpj").trigger("blur").trigger("change");
        }
      }, 600);

    } catch (e) {
      console.error("Erro ao sincronizar dados do ATS: ", e);
    }
  }

  // Executa a função
  sincronizarDadosATS();

  // Lógica de visualização de campos por Etapa
  if (atividade == 0 || atividade == 1 || atividade == 41) {

    // Oculta "Está Recebendo Seguro Desemprego?"
    $("#TxtSegDesemprego").closest(".col-md-6").hide();

    // Oculta "Cor/Raça"
    $("#CORRACA").closest(".col-md-6").hide();

    // Oculta "Nacionalidade"
    $("#NACIONALIDADE").closest(".col-md-6").hide();

    // Oculta "Estado Natal"
    $("#ESTADO").closest(".col-md-6").hide();

    // Oculta "Naturalidade"
    $("#txtNaturalidade").closest(".col-md-6").hide();

    // Oculta "Sexo"
    $("#txtSexo").closest(".col-md-6").hide();

    // Oculta "Estado Civil"
    $("#txtEstadoCivil").closest(".col-md-6").hide();

    // Oculta "Escolaridade"
    $("#txtEscolaridade").closest(".col-md-6").hide();

    // Oculta "Tipo Sanguíneo"
    $("#TipoSanguineo").closest("div[class*='col-']").hide();

    // Oculta o painel inteiro de "Dependentes" e "Filiação"
    $('a[href="#dados_pessoais"]').closest('.panel.panel-default').hide();


    // Oculta o painel "Deficiências"
    $('h3.panel-title:contains("Deficiências")').closest('.panel.panel-default').hide();

    // Oculta APENAS o painel de Documentos Pessoais do Candidato
    $('#painelDocumentos').hide();

    // Oculta o painel "Dados Bancários"
    $('h3.panel-title:contains("Dados Bancários")').closest('.panel.panel-default').hide();

    // Oculta o painel "Endereço"
    $('.fluigicon-home').closest('.panel.panel-default').hide();

    // 1. Oculta a linha de "Complementos e Emergência"
    // Busca pelo título H4 específico e esconde a linha inteira que o contém
    $("h4:contains('Complementos e Emergência')").closest(".row").hide();

    // 2. Oculta o Painel inteiro de "Benefícios"
    $('h3.panel-title:contains("Benefícios")').closest('.panel.panel-default').hide();

    // 3. Oculta "Marca Ponto" e "Conta Salário" (que estão na aba Informações Gerais)
    $("#MarcaPonto").closest(".row").hide();
    $("#ContSalBrad").closest(".row").hide();

    // --- Oculta campos da seção "Dados da Lotação" ---

    // Oculta "Fechamento da Vaga"
    $("#txtAdmissao").closest(".col-md-2").hide();

    // Oculta "Início das Atividades"
    $("#txtInicioAdmissao").closest(".col-md-2").hide();

    // Oculta "Fim Período de Experiência"
    $("#txtInicioExperiencia").closest(".col-md-2").hide();

    // Oculta "Sindicato"
    $("#Sind").closest(".col-md-6").hide();

    // Oculta "Índice do Horário de Trabalho"
    $("#TxtIndi").closest(".col-md-6").hide();

    // Oculta "Motivo de Admissão"
    $("#TxtMotADM").closest(".col-md-6").hide();

    // Oculta "Situação do FGTS"
    $("#TxtSitFGTS").closest(".col-md-6").hide();

    // Oculta "Banco de Pagamento FGTS"
    $("#BANCFGTS").closest(".col-md-6").hide();

    // Oculta "Vínculo da RAIS"
    $("#TxtVINCRais").closest(".col-md-6").hide();

    // Oculta "Situação da RAIS"
    $("#TxtSITRais").closest(".col-md-6").hide();

    // Oculta "Contribuição Sindical"
    $("#TxtContSind").closest(".col-md-6").hide();

    // Oculta o painel "Informe a chapa do Colaborador"
    $("#TxtChapa").closest('.panel.panel-default').hide();

    // --- OCULTA ABA VALE TRANSPORTE NESSAS ETAPAS ---
    $('a[href="#dados_VT"]').parent('li').hide();

    // Oculta campos antigos de "Informações Gerais" 
    $("#cpTpRecrutamento").closest(".row").hide(); // Oculta Tipo de Recrutamento e Contratação
    $("#ValeAlim").closest(".row").hide(); // Oculta Vale Alimentação, Cesta, VT (select) e Marca Ponto
    $("#CatPonto").closest(".row").hide(); // Oculta Categoria Ponto e Substituição
    $("#AddInsul").closest(".row").hide(); // Oculta Insalubridade, Periculosidade e Gratificação
    $("#AuxMoradia").closest(".row").hide(); // Oculta Aux Moradia e Crédito Combustível

    // --- Lógica para deixar visível APENAS os campos solicitados na seção 'Dados da Contratação' ---

    // Lista de IDs dos campos que devem ser OCULTADOS
    var camposParaOcultar = [
      "FUN_CHAPA",
      "FUN_MATRICULAESOCIAL",
      "FUN_EMAIL_CORPORATIVO",
      "FUN_DATABASE",
      "FUN_CCIDDESC",             // Centro de Custo (Ver nota de validação abaixo)
      "FUN_NATATIV",
      "FUN_INDADMISSAO",
      "FUN_TPREGIMEPREV",
      "FUN_HRMENSAIS",
      "FUN_HRSEMANAIS",
      "FUN_HRDIAS",
      "FUN_CATEGORIA_IDDESC_AD",  // Categoria (Ver nota de validação abaixo)
      "FUN_TIPOPGTO_IDDESC_AD",   // Tipo de Pagamento (Ver nota de validação abaixo)
      "FUN_SALARIOBASE",
      "FUN_PADT",
      "FUN_CATESOCIAL_IDDESC_AD", // Categoria eSocial (Ver nota de validação abaixo)
      "FUN_PGCTSIN_IDDESC_AD",
      "FUN_IDDESCSIND",           // Sindicato (Ver nota de validação abaixo)
      "FUN_CODDESCSINDICATOFILIACAO",
      "FUN_APOSENTADO",
      "FUN_PROCMENOR",
      "FUN_INSS",
      "FUN_IRRF",
      "FUN_ALTFGTS",
      "FUN_CATSEFIP_IDDESC",
      "FUN_CODOCORRENCIA_IDDESC",
      "FUN_VINCEMPREG_IDDESC_AD",
      "FUN_CODQUIOSQUE_IDDESC",
      "FUN_AJUDACUSTO",
      "FUN_DIASUTEISMES",
      "FUN_DIASUTPROXMES",
      "FUN_INTEGRCONTABIL_IDDESC",
      "FUN_INTEGRGERENCIAL_IDDESC",
      "FUN_TURNO_JORNADA",
      "FUN_VALORHORA"
    ];

    // Loop para ocultar os containers (divs) desses campos
    for (var i = 0; i < camposParaOcultar.length; i++) {
      $("#" + camposParaOcultar[i]).closest("div[class*='col-']").hide();
    }

  }
  // --- FIM: Lógica de visualização de campos por Etapa ---

  Compartilhados.expandePainel(atividade);
  Compartilhados.destacaAprovacoes();
  Compartilhados.destacaParecer();
  Compartilhados.camposObrigatorio(); // <-- Garante que a marcação ocorra

  if (atividade !== 41 && $("#cpReaberturaChamado").val() == "") {
    $("#divReabertura").hide();
  }

  letras();
  Numeros();

  // 1. Lista de todos os IDs dos campos que devem ser calendários
  var camposData = [
    '#dtDataNascColaborador', '#txtInicioExperiencia', '#txtDataRH',
    '#txtInicioAdmissao', '#dtDataEmissaoCartTrab', '#DTVENCHABILIT',
    '#DTEMISSAOCNH', '#DTTITELEITOR', '#DTEmPrimCNH', '#DtCERTIFRESERV',
    '#DtEmRIC', '#DtChegBras', '#DTRNE', '#DTEMISSAOIDENT',
    '#txtAdmissao', '#FUN_ADMISSAO', '#FUN_DATABASE', '#cpTerminoContrato',
    '#cpVencPrimeiraExp', '#cpVencSegundaExp', '#cpDataHoraExame', '#cpDataUltimoSaldoFGTS',
    '#cpDataOpcaoFGTS', '#cpDataInclusaoAM', '#cpDataInclusaoAO',
    '#cpEstagioDataInicio', '#cpEstagioDataFim',
    '#Reg_Prof_Emissao', '#Passaporte_Emissao', '#Passaporte_Validade', '#cpDataExameAdmissional'
  ];

  // 2. Inicialização padronizada usando a API do Fluig
  $.each(camposData, function (i, id) {
    if ($(id).length > 0) {
      FLUIGC.calendar(id, {
        pickDate: true,
        pickTime: (id === '#cpDataHoraExame'), // Ativa hora apenas se for este campo
        language: 'pt-br',
        showToday: true,
        highlightToday: true,
        autoclose: true
      });
    }
  });

  if (atividade == "1" || atividade == "0" || atividade == "41") {

    // Gatilho que dispara a dupla validação do CPF (Serpro + RM)
    $("#cpfcnpj").change(function () {
      CarregaCPF();
    });

    //data de nascimento dependente
    $(document).on("click", ".openPicker", function () {
      $(this).closest(".input-group").find("input").datepicker("show");
    });

    //add processos de pagamento
    $("#btnAddItem").click(function () {
      var index = wdkAddChild("tbItens");
      $("#cpQtdLinhas").val(index);
      //aviso das regras de RG
      FLUIGC.popover(".bs-docs-popover-hover", {
        trigger: "hover",
        placement: "auto",
      });

    });

    $("#btnAddVT").click(function () {
      var indexRCM = wdkAddChild("tbVT");
      $("#cpQtdLinhasVt").val(indexRCM);
      //aviso das regras de RG
      FLUIGC.popover(".bs-docs-popover-hover", {
        trigger: "hover",
        placement: "auto",
      });

      $(".Numeros").keypress(function () {
        tecla = event.keyCode;
        if (tecla >= 48 && tecla <= 57) {
          return true;
        } else {
          return false;
        }
      });
      // Aplica a máscara APENAS nos campos da nova linha que foi adicionada
      // Usamos jQuery para segurança e a vírgula para manter consistência
      jQuery("#txtTarifa___" + indexRCM).maskMoney({ decimal: ",", thousands: "", precision: 2 });
      jQuery("#txtValorTotal___" + indexRCM).maskMoney({ decimal: ",", thousands: "", precision: 2 });

      $("#txtNumViagensVt___" + indexRCM).attr("readonly", true);
    });

    jQuery("input.telefone")
      .mask("(99) 9999-9999?9")
      .focusout(function (event) {
        var target, phone, element;
        target = event.currentTarget ? event.currentTarget : event.srcElement;
        phone = target.value.replace(/\D/g, "");
        element = $(target);
        element.unmask();
        if (phone.length > 10) {
          element.mask("(99) 99999-999?9");
        } else {
          element.mask("(99) 9999-9999?9");
        }
      });

    //add Dependente
    $(document).on("click", ".buscaDependente", function (ev) {
      var $row = $(ev.target).closest("tr"),
        campos = $row.find("input"),
        codParentesco = campos.get(2).id,
        txtParentescoDepen = campos.get(3).id;
      ZoomParentesco(codParentesco, txtParentescoDepen, $row);
    });

    $(document).on("click", ".buscaLinhaTarifa", function (ev) {
      var $row = $(ev.target).closest("tr"),
        campos = $row.find("input"),
        txtLinhaVt = campos.get(0).id,
        txtCodVt = campos.get(1).id,
        txtTarifa = campos.get(2).id,
        txtNumViagensVt = campos.get(3).id,
        txtValorTotal = campos.get(4).id;
      ZoomLinhaTarifa(
        txtLinhaVt,
        txtCodVt,
        txtTarifa,
        txtNumViagensVt,
        txtValorTotal,
        $row
      );
    });

    // 3. Regra especial para Data de Nascimento (bloquear datas futuras)
    if ($('#dtDataNascColaborador').length > 0) {
      var calNasc = FLUIGC.calendar('#dtDataNascColaborador');
      calNasc.setMaxDate(new Date());
    }

    $("#cpJornadaAdmissao")
      .off("change.contratoJornada")
      .on("change.contratoJornada", function () {
        if (typeof aplicarBloqueioDadosContratacaoPorJornada === "function") {
          aplicarBloqueioDadosContratacaoPorJornada();
        }

        if ($("#FUN_EMPRESA").val()) {
          if (typeof reloadZoomFilial === "function") {
            reloadZoomFilial($("#FUN_EMPRESA").val(), $("#FUN_FILIAL").val());
          }

          if (typeof window.liberarSequenciaTurno === "function") {
            window.liberarSequenciaTurno();
          }
        }

        if (window.aplicandoParametrosJornada) {
          console.log("[Jornada][Contrato] Change ignorado durante aplicacao automatica:", {
            campo: this.id,
            valor: $(this).val()
          });

          agendarRecalculoExperienciaPorJornada("change ignorado durante aplicacao automatica - " + this.id);
        } else if (typeof gerenciarPainelContrato === "function") {
          gerenciarPainelContrato(true);
        }

        if (!window.aplicandoParametrosJornada && typeof exibeDocumentosPorJornadaKit === "function") {
          exibeDocumentosPorJornadaKit();
        }

        var jornada = $("#cpJornadaAdmissao").val();
        if (jornada) {
          aplicarParametrosJornadaAdmissao(jornada);
        }

        if (typeof aplicarObrigatoriedadeFrontEnd === "function") {
          aplicarObrigatoriedadeFrontEnd(getWKNumState());
        }

        if (typeof validarLiberacaoGED === "function") {
          validarLiberacaoGED();
        }
      });

    $("#cpContratoPrazo")
      .off("change.contratoJornada")
      .on("change.contratoJornada", function () {
        if (window.aplicandoParametrosJornada) {
          console.log("[Jornada][Contrato] Change ignorado durante aplicacao automatica:", {
            campo: this.id,
            valor: $(this).val()
          });

          agendarRecalculoExperienciaPorJornada("change ignorado durante aplicacao automatica - " + this.id);
          return;
        }

        gerenciarPainelContrato(true);
        exibeDocumentosPorJornadaKit();

        if (typeof aplicarObrigatoriedadeFrontEnd === "function") {
          aplicarObrigatoriedadeFrontEnd(getWKNumState());
        }

        if (typeof validarLiberacaoGED === "function") {
          validarLiberacaoGED();
        }
      });

    // Roda a função assim que a tela abre SEM limpar dados
    setTimeout(function () {
      gerenciarPainelContrato(false);
      aplicarBloqueioDadosContratacaoPorJornada();
    }, 500);

    carregarParametrosJornadaAdmissao(function () {
      popularJornadasAdmissaoPorColigada($("#FUN_EMPRESA").val());

      var jornadaAtual = $("#cpJornadaAdmissao").val();
      if (jornadaAtual) {
        aplicarParametrosJornadaAdmissao(jornadaAtual);
      }
    });


  }

  if (atividade == "1" || atividade == "0" || atividade == "41") {
    //money
    jQuery(".money").maskMoney({ decimal: ",", thousands: "", precision: 2 });

    $(".Jornada").mask("999:99");

    if (!$("#TxtSitFGTS").val()) {
      $("#TxtSitFGTS").val("1");
    }

    ContrSindical();

    // (Inclui os dois possíveis campos de admissão para garantir o funcionamento)
    $('#cpDataPrevisaoAdmissao, #FUN_ADMISSAO, #cpDiasVencPrimeiraExp, #cpDiasVencSegundaExp')
      .off('change.experiencia blur.experiencia keyup.experiencia')
      .on('change.experiencia blur.experiencia keyup.experiencia', function () {
        if (window.aplicandoParametrosJornada) {
          agendarRecalculoExperienciaPorJornada("evento de experiencia durante aplicacao - " + this.id);
          return;
        }

        calcularVencimentosExperiencia();
      });
  }

  // Ativa o calendário com hora
  FLUIGC.calendar('#cpDataHoraExame', {
    pickDate: true,
    pickTime: true,
    sideBySide: true
  });

  // TRAVA DE SEGURANÇA INICIAL
  // Se não houver empresa selecionada, desabilita os campos dependentes imediatamente
  if ($("#FUN_EMPRESA").val() == "" || $("#FUN_EMPRESA").val() == null) {
    var camposDependentes = [
      '#FUN_IDDESCFUN', '#FUN_IDDESCTURN', '#FUN_SEQTURN_IDDESC_AD',
      '#FUN_CCIDDESC', '#FUN_SECAO_IDDESC_AD', '#FUN_IDDESCSIND',
      '#FUN_CODDESCSINDICATOFILIACAO', '#FUN_NIVELFUNCAO', '#FUN_FAIXASALARIAL'
    ];
    $(camposDependentes.join(",")).attr('disabled', true);
  }

  // =========================================================================
  // GERADOR AUTOMÁTICO DE MENU LATERAL CARD (CABEÇALHO, LISTA E RODAPÉ)
  // =========================================================================

  var $formContainer = $("form").parent();
  // Proteção para não duplicar o wrapper
  if ($("#layout_wrapper").length === 0) {
    $formContainer.wrapInner('<div id="layout_wrapper"><div id="form_main_container"></div></div>');
  }

  // Header, Content e Footer (Minimalista com FontAwesome)
  var sidebarHTML = `
        <div id="sidebar_etapas_card">
            <div class="sidebar-header">
                <div class="sidebar-logo-wrapper">
                    <img src="img/logo-mb.png" class="sidebar-logo" alt="Monte Bravo">
                    <h3 class="sidebar-title">ADMISSÃO DIGITAL</h3>
                </div>
            </div>
            <div class="sidebar-content">
                <ul class="sidebar-menu"></ul>
            </div>
            <div class="sidebar-footer">
                <div class="footer-text-left">
                    <span class="footer-version">Desenvolvido por</span>
                    <img src="img/logo-interhativa.svg" class="sidebar-footer-logo" alt="Interhativa" style="max-width: 200px; margin-bottom: 5px;">
                </div>
                
                <div class="footer-socials-right">
                    <a href="#" target="_blank" title="Instagram">
                        <i class="fa-brands fa-instagram" style="color: rgb(255, 255, 255);"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/interhativa/posts/?feedView=all" target="_blank" title="LinkedIn">
                        <i class="fa-brands fa-linkedin" style="color: rgb(255, 255, 255);"></i>
                    </a>
                </div>
            </div>
        </div>
    `;

  if ($("#sidebar_etapas_card").length === 0) {
    $("#layout_wrapper").prepend(sidebarHTML);
  }

  var secoes = []; // Array global para o Scroll funcionar

  // 1. CRIAMOS UMA FUNÇÃO PARA RENDERIZAR OS ITENS (COM ATRASO)
  function renderizarItensSidebar() {
    var $sidebarUl = $("#sidebar_etapas_card .sidebar-menu");
    $sidebarUl.empty(); // Limpa antes de recriar
    secoes = []; // Reseta o array global de seções

    $(".panel").each(function (index) {
      var $painel = $(this);

      // Ignora painéis sistêmicos de dados ocultos
      if ($painel.attr("id") === "divDadosOcultos") return true;

      // O painel precisa estar VISÍVEL na tela atual
      if ($painel.is(":visible")) {
        var painelId = $painel.attr("id");
        if (!painelId) {
          painelId = "painel_secao_" + index;
          $painel.attr("id", painelId);
        }

        // Pega o título e limpa possíveis quebras de linha sujas do HTML
        var titulo = $painel.find(".panel-heading").text().trim();
        titulo = titulo.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ");

        if (titulo) {
          secoes.push(painelId);
          $sidebarUl.append('<li data-target="' + painelId + '">' + titulo + '</li>');
        }
      }
    });

    // 2. Re-vincula o evento de clique após criar os itens
    $("#sidebar_etapas_card li").off("click").on("click", function () {
      var target = $(this).attr("data-target");
      $('html, body').animate({ scrollTop: $("#" + target).offset().top - 40 }, 500);
    });

    // 3. Força o scroll check uma vez para marcar o item atual de verde
    $(window).trigger("scroll");
  }

  // 4. MÁGICA: Chama a função com 600ms de atraso!
  // Isso dá tempo de sobra para o `displayFields.js` mostrar o painel do ASO e do Kit
  setTimeout(renderizarItensSidebar, 600);

  // =========================================================================
  // SCROLL SPY (Mantido igual, fica monitorando a rolagem do usuário)
  // =========================================================================
  $(window).on("scroll", function () {
    var scrollPos = $(document).scrollTop() + 150;

    for (var i = 0; i < secoes.length; i++) {
      var $painel = $("#" + secoes[i]);
      if ($painel.length && $painel.is(":visible")) {
        var topPos = $painel.offset().top;
        var bottomPos = topPos + $painel.outerHeight();

        if (scrollPos >= topPos && scrollPos <= bottomPos) {
          var $liAtual = $("#sidebar_etapas_card li[data-target='" + secoes[i] + "']");

          if (!$liAtual.hasClass("ativa")) {
            $("#sidebar_etapas_card li").removeClass("ativa");
            $liAtual.addClass("ativa");

            var sidebarContent = $("#sidebar_etapas_card .sidebar-content");
            if ($liAtual.length) {
              var liOffset = $liAtual[0].offsetTop;
              sidebarContent.stop().animate({
                scrollTop: liOffset - 60
              }, 250);
            }
          }
        }
      }
    }
  });

  // Descobre a atividade atual no Front-end
  var atividadeAtual = (typeof getWKNumState !== 'undefined') ? getWKNumState() : 0;

  // ====================================================================
  // MONITORAMENTO DA PÁGINA DO CANDIDATO - ATIVIDADE 122
  // ====================================================================

  function safeParseJsonCampo(idCampo, valorPadrao) {
    var valor = $("#" + idCampo).val();

    if (!valor || $.trim(valor) === "") {
      return valorPadrao;
    }

    try {
      return JSON.parse(valor);
    } catch (e) {
      console.warn("[Monitor Candidato] JSON inválido no campo " + idCampo + ":", e);
      return valorPadrao;
    }
  }

  function escaparHtmlMonitor(valor) {
    if (valor === null || valor === undefined) return "";

    return String(valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizarTextoMonitor(valor) {
    if (valor === null || valor === undefined || valor === "") return "-";
    return escaparHtmlMonitor(valor);
  }

  function obterNomePassoCandidato(passo) {
    var mapaPassos = {
      "1": "Passo 1 - Dados iniciais",
      "2": "Passo 2 - Dados pessoais",
      "3": "Passo 3 - Dados complementares",
      "4": "Passo 4 - Documentos",
      "5": "Passo 5 - Assinaturas",
      "6": "Passo 6 - Revisão e envio"
    };

    return mapaPassos[String(passo)] || ("Passo " + normalizarTextoMonitor(passo));
  }

  function obterClasseStatusMonitor(status) {
    var s = String(status || "").toLowerCase();

    if (
      s.indexOf("conclu") > -1 ||
      s.indexOf("enviado") > -1 ||
      s.indexOf("assinado") > -1 ||
      s.indexOf("salvo") > -1 ||
      s.indexOf("anexado") > -1
    ) {
      return "success";
    }

    if (
      s.indexOf("andamento") > -1 ||
      s.indexOf("preench") > -1 ||
      s.indexOf("parcial") > -1
    ) {
      return "info";
    }

    if (
      s.indexOf("pendente") > -1 ||
      s.indexOf("aguard") > -1 ||
      s.indexOf("não") > -1 ||
      s.indexOf("nao") > -1
    ) {
      return "warning";
    }

    if (
      s.indexOf("erro") > -1 ||
      s.indexOf("falha") > -1 ||
      s.indexOf("rejeitado") > -1
    ) {
      return "danger";
    }

    return "default";
  }

  function montarBadgeStatusMonitor(status) {
    var texto = status || "Pendente";
    var classe = obterClasseStatusMonitor(texto);

    return '<span class="label label-' + classe + '">' + normalizarTextoMonitor(texto) + '</span>';
  }

  function normalizarItensStatusMonitor(objetoStatus) {
    var lista = [];

    if (!objetoStatus) {
      return lista;
    }

    if ($.isArray(objetoStatus)) {
      $.each(objetoStatus, function (_, item) {
        if (!item) return true;

        lista.push({
          nome: item.nome || item.label || item.titulo || item.documento || item.assinatura || "Item",
          status: item.status || item.situacao || item.estado || "Pendente",
          detalhe: item.detalhe || item.nomeArquivo || item.arquivo || item.data || item.dataHora || ""
        });
      });

      return lista;
    }

    if (typeof objetoStatus === "object") {
      $.each(objetoStatus, function (chave, valor) {
        if (valor && typeof valor === "object") {
          lista.push({
            nome: valor.nome || valor.label || valor.titulo || valor.documento || valor.assinatura || chave,
            status: valor.status || valor.situacao || valor.estado || (valor.enviado ? "Enviado" : "Pendente"),
            detalhe: valor.detalhe || valor.nomeArquivo || valor.arquivo || valor.data || valor.dataHora || ""
          });
        } else {
          lista.push({
            nome: chave,
            status: valor || "Pendente",
            detalhe: ""
          });
        }
      });
    }

    return lista;
  }

  function renderizarListaStatusMonitor(idContainer, objetoStatus, mensagemVazia) {
    var lista = normalizarItensStatusMonitor(objetoStatus);
    var $container = $("#" + idContainer);

    if (!$container.length) return;

    if (!lista.length) {
      $container.html('<p class="text-muted">' + mensagemVazia + '</p>');
      return;
    }

    var html = '<div class="table-responsive">';
    html += '<table class="table table-condensed table-striped" style="margin-bottom: 0;">';
    html += '<thead>';
    html += '<tr>';
    html += '<th>Item</th>';
    html += '<th style="width: 140px;">Status</th>';
    html += '<th>Detalhe</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    $.each(lista, function (_, item) {
      html += '<tr>';
      html += '<td>' + normalizarTextoMonitor(item.nome) + '</td>';
      html += '<td>' + montarBadgeStatusMonitor(item.status) + '</td>';
      html += '<td>' + normalizarTextoMonitor(item.detalhe) + '</td>';
      html += '</tr>';
    });

    html += '</tbody>';
    html += '</table>';
    html += '</div>';

    $container.html(html);
  }

  function normalizarPlanoBeneficio(valor) {
    return String(valor || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function preencherSelectPorValorOuTexto($campo, valor) {
    var valorPlano = String(valor || "").trim();

    if (!valorPlano || !$campo.length) {
      return;
    }

    $campo.val(valorPlano);

    if ($campo.val()) {
      return;
    }

    var valorNormalizado = normalizarPlanoBeneficio(valorPlano);

    $campo.find("option").each(function () {
      var $option = $(this);
      var textoNormalizado = normalizarPlanoBeneficio($option.text());
      var valueNormalizado = normalizarPlanoBeneficio($option.val());

      if (textoNormalizado === valorNormalizado || valueNormalizado === valorNormalizado) {
        $campo.val($option.val());
        return false;
      }
    });
  }

  function bloquearCampoPlanoCandidato($campo) {
    if (!$campo.length) {
      return;
    }

    $campo
      .attr("readonly", "readonly")
      .css({
        "background-color": "#F0F2F2",
        "pointer-events": "none"
      });

    $campo.closest(".form-group").find(".help-block.plano-candidato-lock").remove();
    $campo.closest(".form-group").append(
      '<span class="help-block plano-candidato-lock">Preenchido automaticamente pela escolha do candidato.</span>'
    );
  }

  function aplicarPlanosCandidatoNoPainelBeneficios() {
    var opcaoSaude = ($("#TxtIncPlanoSaudeOpcao").val() || "").trim();
    var planoSaude = ($("#TxtIncPlanoSaudeTipoCod").val() || $("#TxtIncPlanoSaudeTipo").val() || "").trim();

    var opcaoOdonto = ($("#TxtIncPlanoOdontoOpcao").val() || "").trim();
    var planoOdonto = ($("#TxtIncPlanoOdontoTipoCod").val() || $("#TxtIncPlanoOdontoTipo").val() || "").trim();

    var candidatoOptouSaude = opcaoSaude.indexOf("Opto") !== -1;
    var candidatoOptouOdonto = opcaoOdonto.toLowerCase() === "sim";

    if (candidatoOptouSaude && planoSaude) {
      var $campoPlanoSaudeRH = $("#cpPlanoAM");

      if ($campoPlanoSaudeRH.is("select")) {
        preencherSelectPorValorOuTexto($campoPlanoSaudeRH, planoSaude);
      } else {
        $campoPlanoSaudeRH.val($("#TxtIncPlanoSaudeTipo").val());
      }

      bloquearCampoPlanoCandidato($campoPlanoSaudeRH);
    }

    if (candidatoOptouOdonto && planoOdonto) {
      var $campoPlanoOdontoRH = $("#cpPlanoAO");

      if ($campoPlanoOdontoRH.is("select")) {
        preencherSelectPorValorOuTexto($campoPlanoOdontoRH, planoOdonto);
      } else {
        $campoPlanoOdontoRH.val($("#TxtIncPlanoOdontoTipo").val());
      }

      bloquearCampoPlanoCandidato($campoPlanoOdontoRH);
    }
  }

  function normalizarJornadaContratoEstagio(valor) {
    return String(valor || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function jornadaPermiteContratoEstagioAprendiz() {
    var jornada = normalizarJornadaContratoEstagio($("#cpJornadaAdmissao").val());

    return (
      jornada === "estagio" ||
      jornada === "estagiario" ||
      jornada === "jovem aprendiz"
    );
  }

  function aplicarBloqueioContratoEstagioAprendizRH() {
    var permiteEditar = jornadaPermiteContratoEstagioAprendiz();

    var $blocos = $(".bloco-estagio-aprendiz-rh");
    var $campos = $blocos.find("input, select, textarea, button");

    if (!$blocos.length) {
      return;
    }

    $("#tituloContratoEstagioAprendizRH")
      .find(".help-block.bloqueio-estagio-aprendiz")
      .remove();

    if (permiteEditar) {
      $campos.each(function () {
        var $campo = $(this);

        if ($campo.is("[type='hidden']")) {
          return true;
        }

        $campo
          .removeAttr("readonly")
          .prop("disabled", false)
          .css({
            "pointer-events": "auto",
            "background-color": "#ffffff",
            "cursor": "auto"
          });

        $campo.closest(".input-group").find(".input-group-addon").css({
          "pointer-events": "auto",
          "background-color": "",
          "cursor": "auto"
        });
      });

      return;
    }

    $campos.each(function () {
      var $campo = $(this);

      if ($campo.is("[type='hidden']")) {
        return true;
      }

      if ($campo.is("select, button")) {
        $campo.prop("disabled", true).attr("disabled", "disabled");
      } else {
        $campo.prop("readonly", true).attr("readonly", "readonly");
      }

      $campo.css({
        "pointer-events": "none",
        "background-color": "#f3f4f6",
        "cursor": "not-allowed"
      });

      $campo.closest(".input-group").find(".input-group-addon").css({
        "pointer-events": "none",
        "background-color": "#f3f4f6",
        "cursor": "not-allowed"
      });
    });

    $("#tituloContratoEstagioAprendizRH .col-md-12").append(
      '<span class="help-block bloqueio-estagio-aprendiz" style="margin-top: 4px; color: #777;">' +
      'Campos bloqueados. Liberado apenas para jornada Estagiário ou Jovem Aprendiz.' +
      '</span>'
    );
  }

  function renderizarResumoDadosMonitor(resumo, persistencia) {
    var $container = $("#monCandResumoDados");

    if (!$container.length) return;

    var dados = resumo && typeof resumo === "object" ? resumo : {};
    var dadosPersistidos = persistencia && typeof persistencia === "object" ? persistencia : {};

    var html = "";

    if (dados.nome || dados.cpf || dados.email || dados.telefone || dados.celular) {
      html += '<ul class="list-unstyled" style="margin-bottom: 0;">';

      if (dados.nome) {
        html += '<li><strong>Nome:</strong> ' + normalizarTextoMonitor(dados.nome) + '</li>';
      }

      if (dados.cpf) {
        html += '<li><strong>CPF:</strong> ' + normalizarTextoMonitor(dados.cpf) + '</li>';
      }

      if (dados.email) {
        html += '<li><strong>E-mail:</strong> ' + normalizarTextoMonitor(dados.email) + '</li>';
      }

      if (dados.telefone || dados.celular) {
        html += '<li><strong>Telefone:</strong> ' + normalizarTextoMonitor(dados.telefone || dados.celular) + '</li>';
      }

      html += '</ul>';

      $container.html(html);
      return;
    }

    var secoes = [];

    $.each(dadosPersistidos, function (chave, valor) {
      if (valor && typeof valor === "object") {
        var totalCampos = 0;
        var preenchidos = 0;

        $.each(valor, function (_, v) {
          totalCampos++;

          if (v !== null && v !== undefined && String(v).trim() !== "") {
            preenchidos++;
          }
        });

        secoes.push({
          nome: chave,
          preenchidos: preenchidos,
          total: totalCampos
        });
      }
    });

    if (!secoes.length) {
      $container.html('<p class="text-muted">Nenhuma informação registrada ainda.</p>');
      return;
    }

    html += '<div class="table-responsive">';
    html += '<table class="table table-condensed table-striped" style="margin-bottom: 0;">';
    html += '<thead>';
    html += '<tr>';
    html += '<th>Seção</th>';
    html += '<th style="width: 160px;">Campos preenchidos</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    $.each(secoes, function (_, secao) {
      html += '<tr>';
      html += '<td>' + normalizarTextoMonitor(secao.nome) + '</td>';
      html += '<td>' + secao.preenchidos + ' de ' + secao.total + '</td>';
      html += '</tr>';
    });

    html += '</tbody>';
    html += '</table>';
    html += '</div>';

    $container.html(html);
  }

  function renderizarMonitoramentoCandidato() {
    if ($("#painelMonitoramentoCandidato").length === 0) {
      return;
    }

    var status = $("#cpStatusCand").val() || "Não iniciado";
    var percentual = parseInt($("#cpPctCand").val(), 10);
    var ultimaAtualizacao = $("#cpUltAtualCand").val() || "-";
    var origem = $("#cpOrigemAtualCand").val();
    var dispositivo = $("#cpDispCand").val();

    if (isNaN(percentual)) percentual = 0;
    if (percentual < 0) percentual = 0;
    if (percentual > 100) percentual = 100;

    var persistencia = safeParseJsonCampo("jsonPersistCand", {});
    var statusDocumentos = safeParseJsonCampo("jsonDocsCand", {});
    var statusAssinaturas = safeParseJsonCampo("jsonAssCand", {});
    var resumo = safeParseJsonCampo("jsonResumoCand", {});

    $("#monCandStatus").html(montarBadgeStatusMonitor(status));
    $("#monCandPasso").html(normalizarTextoMonitor(obterNomePassoCandidato(passoAtual)));

    $("#monCandBarraProgresso")
      .css("width", percentual + "%")
      .attr("aria-valuenow", percentual)
      .text(percentual + "%");

    var textoUltimaAtualizacao = normalizarTextoMonitor(ultimaAtualizacao);

    if (origem || dispositivo) {
      textoUltimaAtualizacao += '<br><small class="text-muted">';

      if (origem) {
        textoUltimaAtualizacao += 'Origem: ' + normalizarTextoMonitor(origem);
      }

      if (origem && dispositivo) {
        textoUltimaAtualizacao += ' | ';
      }

      if (dispositivo) {
        textoUltimaAtualizacao += 'Dispositivo: ' + normalizarTextoMonitor(dispositivo);
      }

      textoUltimaAtualizacao += '</small>';
    }

    $("#monCandUltimaAtualizacao").html(textoUltimaAtualizacao);

    renderizarResumoDadosMonitor(resumo, persistencia);

    renderizarListaStatusMonitor(
      "monCandAssinaturas",
      statusAssinaturas,
      "Nenhuma assinatura registrada ainda."
    );

    renderizarListaStatusMonitor(
      "monCandDocumentos",
      statusDocumentos,
      "Nenhum documento enviado ainda."
    );
  }

  if (atividadeAtual == 122) {
    $("#divReenviarEmailCandidato").show();
    $("#painelMonitoramentoCandidato").show();

    renderizarMonitoramentoCandidato();

    // Recalcula a sidebar depois que o painel fica visível,
    // para ele aparecer também no menu lateral.
    setTimeout(function () {
      if (typeof renderizarItensSidebar === "function") {
        renderizarItensSidebar();
      }
    }, 900);
  } else {
    $("#painelMonitoramentoCandidato").hide();
  }

  aplicarObrigatoriedadeFrontEnd(atividadeAtual);

  if (atividadeAtual == 97) {

    // 1. Mapeia dinamicamente os painéis que devem ser totalmente liberados (visual e interação)
    var paineisLiberados = [
      $('#cpfcnpj').closest('.panel'),              // Dados do Colaborador
      $('#dados_pessoais'),                         // Aba Dependentes
      $('#dados_Filiacao'),                         // Aba Filiação
      $('#txtPossuiDeficiencia').closest('.panel'), // Painel Deficiências
      $('#painelDocumentos'),                       // Painel Documentos
      $('#txtCEP').closest('.panel'),               // Painel Endereço
      $('#txtNomeSocial').closest('.panel'),        // Painel Contato
      $('#painelBeneficios')                        // Painel Benefícios
    ];

    // 2. Varre cada painel selecionado arrancando as travas visuais antigas
    $.each(paineisLiberados, function (index, painel) {
      // Libera inputs de texto comuns, textareas e botões
      $(painel).find('input[type="text"]:not([type="zoom"]), textarea, button').removeAttr('readonly').prop('disabled', false);

      // Libera os Selects comuns
      $(painel).find('select')
        .removeAttr('readonly')
        .prop('disabled', false)
        .css('pointer-events', 'auto')
        .css('background-color', '#fff');
    });

    // 3. Protege campos calculados para não serem sobrescritos manualmente
    $('#Idade, #txtValorTotal, #cpQtdHorasSemana, #cpQtdHorasDia').prop('readonly', true);

    // ====================================================================
    // 4. TRAVA DE SEGURANÇA (MANTÉM BLOQUEADO)
    // ====================================================================

    // Bloqueia Banco e Agência e Dados da Chapa
    $('#BancoPAgto, #AgPagto, #txtCodBanPgto, #CodAgPagto, #TxtChapa, #FUN_CODPESSOA').prop('readonly', true).css('pointer-events', 'none');

    // Bloqueia Dados do Solicitante
    $('#cpNumeroSolicitacao, #cpDataAbertura, #cpNomeSolicitante, #cpFuncaoSolicitante, #cpEmpresaSolicitante, #cpDepartamentoObraSolicitante, #cpEmailSolicitante, #cpEstadoSolicitante').prop('readonly', true).css('pointer-events', 'none');
  }

  // Reaplica cedo a jornada salva para evitar que os zooms fiquem visíveis apenas com o código
  // após avançar atividade e recarregar o formulário.
  if (typeof agendarReaplicacaoJornadaSalvaAoCarregar === "function") {
    agendarReaplicacaoJornadaSalvaAoCarregar();
  }

  // Disparos atrasados para garantir que a tela carregou
  setTimeout(() => {
    if (typeof reloadZoomFilial === "function") {
      reloadZoomFilial($("#FUN_EMPRESA").val(), $("#FUN_FILIAL").val());
    }

    if (typeof getRestPublic === "function") {
      getRestPublic();
    }

    // Chama o motor central para garantir que a Sequência carregue corretamente
    if (typeof window.liberarSequenciaTurno === "function") {
      window.liberarSequenciaTurno();
    }

    aplicarBloqueioDadosContratacaoPorJornada();

    // Reaplica a parametrização visual da jornada quando a atividade é recarregada.
    // Isso corrige os zooms que o Fluig reidrata apenas com o código, ex.: U, 0002, 1001.
    if (typeof reaplicarJornadaSalvaAoCarregar === "function") {
      reaplicarJornadaSalvaAoCarregar();
    }
  }, 2500);

  // Quando a filial é alterada, revalida os documentos do Kit
  $("#FUN_NOMECOMERCIAL_FILIAL").on("change", function () {
    exibeDocumentosPorJornadaKit();
  });

  // Gatilho: Quando o número da CNH muda, revalida o Kit
  $("#CARTMOTORISTA").on("change blur keyup", function () {
    exibeDocumentosPorJornadaKit();
  });

  $(document).on("blur change", "input[id^='txtNomDepen___']", function () {
    exibeDocumentosPorJornadaKit();
  });

  // 1. Pesca os dados do painel no navegador
  var atsDataString = localStorage.getItem("FLUIG_ATS_DATA");

  if (atsDataString) {
    try {
      var atsData = JSON.parse(atsDataString);

      // 2. Preenche os dados básicos do candidato
      $("#txtOrigemAdmissao").val(atsData.txtOrigemAdmissao);
      $("#txtIdCandidatoATS").val(atsData.txtIdCandidatoATS);
      $("#cpNumRequisicaoERP").val(atsData.cpNumRequisicaoERP);
      $("#cpNumRequisicaoATS").val(atsData.cpNumRequisicaoATS);

      $("#cpfcnpj").val(atsData.cpfcnpj).trigger('blur'); // blur dispara a sua máscara/validação
      $("#txtNomeColaborador").val(atsData.txtNomeSocial);
      $("#txtEmail").val(atsData.txtEmail);
      $("#cpEmailCandidato").val(atsData.cpEmailCandidato);
      $("#txtCELULAR").val(atsData.txtCELULAR).trigger('blur');
      $("#FUN_ADMISSAO").val(atsData.FUN_ADMISSAO);
      $("#cpJornadaAdmissao").val(atsData.cpJornadaAdmissao);
      $("#cpJornadaAdmissao").attr("data-jornada-pendente", atsData.cpJornadaAdmissao || "");
      aplicarBloqueioDadosContratacaoPorJornada();
      gerenciarPainelContrato(false);
      exibeDocumentosPorJornadaKit();

      // Deficiências
      $("#txtPossuiDeficiencia").val(atsData.cand_possui_deficiencia);
      $("#DEFICIENTEFISICO").val(atsData.cpDeficienciaFisica === "Sim" ? "1" : "0");
      $("#DEFICIENTEAUDITIVO").val(atsData.cpDeficienciaAuditiva === "Sim" ? "1" : "0");
      $("#DEFICIENTEVISUAL").val(atsData.cpDeficienciaVisual === "Sim" ? "1" : "0");
      $("#DEFICIENTEINTELECTUAL").val(atsData.cpDeficienciaIntelectual === "Sim" ? "1" : "0");

      // 3. A MÁGICA LÓGICA E VISUAL BLINDADA
      if (atsData.IDDESC_EMPRESAFILIAL && atsData.IDDESC_EMPRESAFILIAL !== "") {
        var descFilial = atsData.IDDESC_EMPRESAFILIAL;

        // Removemos o 'setValue' nativo do Fluig! É ele que estava trazendo a Empresa 1.
        // Preenchemos o componente visual na "força bruta" via jQuery/Select2
        var $zoomFilial = $("#IDDESC_EMPRESAFILIAL");
        $zoomFilial.empty().append(new Option(descFilial, descFilial, true, true)).trigger("change");

        // Injetamos os dados ocultos no formulário instantaneamente
        $("#FUN_EMPRESA").val(atsData.FUN_EMPRESA);
        $("#FUN_FILIAL").val(atsData.FUN_FILIAL);
        $("#FUN_NOMECOMERCIAL_FILIAL").val(atsData.FUN_NOMECOMERCIAL_FILIAL);
        $("#FUN_CNPJ_FILIAL").val(atsData.FUN_CNPJ_FILIAL);
        $("#FUN_LOGRADOURO_FILIAL").val(atsData.FUN_LOGRADOURO_FILIAL);
        $("#FUN_BAIRRO_FILIAL").val(atsData.FUN_BAIRRO_FILIAL);
        $("#FUN_CIDADE_FILIAL").val(atsData.FUN_CIDADE_FILIAL);
        $("#FUN_ESTADO_FILIAL").val(atsData.FUN_ESTADO_FILIAL);

        // Criamos o objeto "fake" idêntico ao que o Fluig geraria, mas com os dados CORRETOS do ATS
        var zoomItemFake = {
          inputId: "IDDESC_EMPRESAFILIAL",
          ID_EMPRESA: atsData.FUN_EMPRESA,
          ID_FILIAL: atsData.FUN_FILIAL,
          NOMECOMERCIAL_FILIAL: atsData.FUN_NOMECOMERCIAL_FILIAL,
          CNPJ_FILIAL: atsData.FUN_CNPJ_FILIAL,
          LOGRADOURO_FILIAL: atsData.FUN_LOGRADOURO_FILIAL,
          BAIRRO_FILIAL: atsData.FUN_BAIRRO_FILIAL,
          CIDADE_FILIAL: atsData.FUN_CIDADE_FILIAL,
          ESTADO_FILIAL: atsData.FUN_ESTADO_FILIAL,
          IDDESC_EMPFILIALCOM: descFilial
        };

        // Damos um pequeno delay para garantir que o DOM renderizou
        setTimeout(function () {
          console.log("[ATS Sync] Disparando setSelectedZoomItem com a Empresa:", atsData.FUN_EMPRESA);

          // Disparamos o gatilho do seu custom_zoom_events.js passando a Coligada certa!
          if (typeof window.setSelectedZoomItem === "function") {
            window.setSelectedZoomItem(zoomItemFake);
          }

          aplicarBloqueioDadosContratacaoPorJornada();
        }, 500);
      }

      // Limpa o localStorage
      localStorage.removeItem("FLUIG_ATS_DATA");

      FLUIGC.toast({ title: 'Integração ATS:', message: 'Dados do candidato importados com sucesso!', type: 'success' });

    } catch (e) {
      console.error("Erro ao processar os dados do ATS:", e);
    }
  }

  aplicarPlanosCandidatoNoPainelBeneficios();
  aplicarBloqueioContratoEstagioAprendizRH();

  $("#cpJornadaAdmissao")
    .off("change.bloqueioEstagioAprendiz")
    .on("change.bloqueioEstagioAprendiz", function () {
      aplicarBloqueioContratoEstagioAprendizRH();
    });
});

function obterValoresDatasetParamJornada(dataset) {
  if (dataset && dataset.values) {
    return dataset.values;
  }

  if (dataset && dataset.content && dataset.content.values) {
    return dataset.content.values;
  }

  return [];
}

function finalizarCarregamentoParametrosJornada() {
  parametrosJornadaCarregados = true;
  parametrosJornadaCarregando = false;
  logJornadaGrupo("Carregamento de parametros concluido", {
    jornadas: (jornadasAdmissaoConfig || []).length,
    campos: (camposJornadaAdmissaoConfig || []).length
  });

  var callbacks = callbacksParametrosJornada.slice(0);
  callbacksParametrosJornada = [];

  for (var i = 0; i < callbacks.length; i++) {
    try {
      callbacks[i]();
    } catch (e) {
      console.warn("[Param Jornada] Erro ao executar callback.", e);
    }
  }
}

function buscarTabelaFilhaParamJornada(docId, tablename, callback) {
  function consultar(campoDocumento, permiteFallback) {
    try {
      var constraints = [
        DatasetFactory.createConstraint("tablename", tablename, tablename, ConstraintType.MUST),
        DatasetFactory.createConstraint(campoDocumento, docId, docId, ConstraintType.MUST)
      ];

      logJornadaGrupo("Buscando tabela filha da configuracao", {
        tablename: tablename,
        campoDocumento: campoDocumento,
        docId: docId,
        permiteFallback: permiteFallback,
        constraints: [
          { field: "tablename", value: tablename },
          { field: campoDocumento, value: docId }
        ]
      });

      DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, constraints, null, {
        success: function (dataset) {
          var valores = obterValoresDatasetParamJornada(dataset);
          var tabelaDebug = [];

          for (var i = 0; i < valores.length; i++) {
            tabelaDebug.push({
              indice: i + 1,
              campos: Object.keys(valores[i] || {}).slice(0, 8).join(", ")
            });
          }

          logJornadaTabela("Tabela filha retornada - " + tablename, tabelaDebug);

          if ((!valores || !valores.length) && permiteFallback) {
            consultar("documentid", false);
            return;
          }

          callback(valores || []);
        },
        error: function (erro) {
          if (permiteFallback) {
            consultar("documentid", false);
            return;
          }

          console.warn("[Param Jornada] Erro ao buscar tabela filha " + tablename + ".", erro);
          callback([]);
        }
      });
    } catch (e) {
      console.warn("[Param Jornada] Erro ao consultar tabela filha " + tablename + ".", e);
      callback([]);
    }
  }

  consultar("metadata#id", true);
}

function carregarParametrosJornadaAdmissao(callback) {
  if (typeof jornadasAdmissaoConfig === "undefined") {
    window.jornadasAdmissaoConfig = [];
  }
  if (typeof camposJornadaAdmissaoConfig === "undefined") {
    window.camposJornadaAdmissaoConfig = [];
  }
  if (typeof parametrosJornadaCarregados === "undefined") {
    window.parametrosJornadaCarregados = false;
  }
  if (typeof parametrosJornadaCarregando === "undefined") {
    window.parametrosJornadaCarregando = false;
  }
  if (typeof callbacksParametrosJornada === "undefined") {
    window.callbacksParametrosJornada = [];
  }
  if (typeof aplicandoParametrosJornada === "undefined") {
    window.aplicandoParametrosJornada = false;
  }

  if (typeof callback === "function") {
    callbacksParametrosJornada.push(callback);
  }

  if (parametrosJornadaCarregados) {
    finalizarCarregamentoParametrosJornada();
    return;
  }

  if (parametrosJornadaCarregando) {
    return;
  }

  parametrosJornadaCarregando = true;
  jornadasAdmissaoConfig = [];
  camposJornadaAdmissaoConfig = [];

  try {
    var constraints = [
      DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST)
    ];

    logJornadaGrupo("Iniciando carregamento da configuracao de jornada", {
      dataset: "Form_Configuracoes_Admissao",
      constraints: [
        { field: "metadata#active", value: "true" }
      ]
    });

    DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, constraints, null, {
      success: function (datasetConfig) {
        try {
          var valoresConfig = obterValoresDatasetParamJornada(datasetConfig);
          logJornadaTabela("Registro(s) ativos de configuracao encontrados", valoresConfig.map(function (item, idx) {
            return {
              indice: idx + 1,
              documentid: item.documentid || item["metadata#id"] || "",
              titulo: item["documentDescription"] || item["descricao"] || ""
            };
          }));

          if (!valoresConfig.length) {
            console.warn("[Param Jornada] Nenhuma configuracao ativa encontrada.");
            finalizarCarregamentoParametrosJornada();
            return;
          }

          var docId = valoresConfig[0]["documentid"] || valoresConfig[0]["metadata#id"];

          if (!docId) {
            console.warn("[Param Jornada] Configuracao ativa sem documentid.");
            finalizarCarregamentoParametrosJornada();
            return;
          }

          logJornadaGrupo("Configuracao ativa selecionada", {
            documentId: docId,
            totalRegistros: valoresConfig.length
          });

          buscarTabelaFilhaParamJornada(docId, "tbJornadasAdmissao", function (jornadas) {
            jornadasAdmissaoConfig = [];

            for (var i = 0; i < jornadas.length; i++) {
              var jornada = jornadas[i] || {};

              jornadasAdmissaoConfig.push({
                codigo: jornada.JORNADA_CODIGO || "",
                descricao: jornada.JORNADA_DESCRICAO || "",
                coligadas: jornada.JORNADA_COLIGADAS || "*",
                ativo: jornada.JORNADA_ATIVO || "S",
                ordem: jornada.JORNADA_ORDEM || ""
              });
            }

            logJornadaTabela("tbJornadasAdmissao carregada", jornadasAdmissaoConfig.map(function (item, idx) {
              return {
                indice: idx + 1,
                codigo: item.codigo || "",
                descricao: item.descricao || "",
                coligadas: item.coligadas || "",
                ativo: item.ativo || "",
                ordem: item.ordem || ""
              };
            }));

            buscarTabelaFilhaParamJornada(docId, "tbCamposJornadaAdmissao", function (campos) {
              camposJornadaAdmissaoConfig = [];

              for (var c = 0; c < campos.length; c++) {
                var campo = campos[c] || {};

                camposJornadaAdmissaoConfig.push({
                  jornadaCodigo: campo.CJ_JORNADA_CODIGO || "",
                  campoId: campo.CJ_CAMPO_ID || "",
                  campoLabel: campo.CJ_CAMPO_LABEL || "",
                  campoTipo: campo.CJ_CAMPO_TIPO || "",
                  valor: campo.CJ_VALOR || "",
                  jsonExtra: campo.CJ_JSON_EXTRA || "",
                  descricao: campo.CJ_DESCRICAO || "",
                  ativo: campo.CJ_ATIVO || "S",
                  ordem: campo.CJ_ORDEM || ""
                });
              }

              logJornadaTabela("tbCamposJornadaAdmissao carregada", camposJornadaAdmissaoConfig.map(function (item, idx) {
                return {
                  indice: idx + 1,
                  jornadaCodigo: item.jornadaCodigo || "",
                  campoId: item.campoId || "",
                  campoTipo: item.campoTipo || "",
                  valor: item.valor || "",
                  descricao: item.descricao || "",
                  ativo: item.ativo || "",
                  ordem: item.ordem || ""
                };
              }));

              finalizarCarregamentoParametrosJornada();
            });
          });
        } catch (e) {
          console.warn("[Param Jornada] Erro ao processar configuracao.", e);
          finalizarCarregamentoParametrosJornada();
        }
      },
      error: function (erro) {
        console.warn("[Param Jornada] Erro ao buscar configuracao ativa.", erro);
        finalizarCarregamentoParametrosJornada();
      }
    });
  } catch (e) {
    console.warn("[Param Jornada] Erro ao iniciar carregamento.", e);
    finalizarCarregamentoParametrosJornada();
  }
}

function normalizarColigadasParam(valor) {
  if (!valor) {
    return ["*"];
  }

  if (valor === "*") {
    return ["*"];
  }

  var partes = String(valor).split(",");
  var lista = [];

  for (var i = 0; i < partes.length; i++) {
    var item = $.trim(partes[i] || "");

    if (!item) {
      continue;
    }

    if (item === "*") {
      return ["*"];
    }

    if (lista.indexOf(item) === -1) {
      lista.push(item);
    }
  }

  return lista.length ? lista : ["*"];
}

function jornadaDisponivelParaColigada(jornada, codColigada) {
  if (!jornada) {
    return false;
  }

  var ativo = jornada.ativo || "S";
  var ativoNormalizado = String(ativo).toLowerCase();

  if (ativoNormalizado !== "s" && ativoNormalizado !== "sim" && ativoNormalizado !== "true" && ativoNormalizado !== "1") {
    return false;
  }

  var coligadas = normalizarColigadasParam(jornada.coligadas);

  if (coligadas.indexOf("*") !== -1) {
    return true;
  }

  if (!codColigada) {
    return false;
  }

  return coligadas.indexOf(String(codColigada)) !== -1;
}

function obterLabelJornada(jornada) {
  if (!jornada) {
    return "";
  }

  if (jornada.descricao && $.trim(jornada.descricao) !== "") {
    return jornada.descricao;
  }

  return jornada.codigo || "";
}

function obterCamposDaJornada(codigoJornada) {
  var lista = [];
  var codigoNorm = String(codigoJornada || "").toLowerCase();

  for (var i = 0; i < camposJornadaAdmissaoConfig.length; i++) {
    var item = camposJornadaAdmissaoConfig[i];

    if (String(item.jornadaCodigo || "").toLowerCase() === codigoNorm) {
      lista.push(item);
    }
  }

  return lista;
}

function parseJsonSeguroParamJornada(valor) {
  if (!valor) {
    return {};
  }

  try {
    return JSON.parse(valor);
  } catch (e) {
    console.warn("[Param Jornada] JSON extra invalido:", valor, e);
    return {};
  }
}

function obterValorItemParamJornada(item, campo) {
  if (!item || !campo) {
    return "";
  }

  var chaves = [
    campo,
    String(campo).toUpperCase(),
    String(campo).toLowerCase()
  ];

  for (var i = 0; i < chaves.length; i++) {
    var chave = chaves[i];

    if (chave && item[chave] !== undefined && item[chave] !== null && item[chave] !== "") {
      return item[chave];
    }
  }

  return "";
}

function formatarTextoCodigoDescricaoJornada(codigo, descricao) {
  var cod = $.trim(String(codigo || ""));
  var desc = $.trim(String(descricao || ""));

  if (!cod && !desc) {
    return "";
  }

  if (!cod) {
    return desc;
  }

  if (!desc) {
    return cod;
  }

  // Evita duplicar quando o dataset já retorna "0105 - Descrição"
  if (desc === cod || desc.indexOf(cod + " - ") === 0 || desc.indexOf(cod + " — ") === 0) {
    return desc;
  }

  return cod + " - " + desc;
}

function obterDescricaoItemDatasetParamJornada(itemDataset, extra, valorTecnico) {
  if (!itemDataset) {
    return "";
  }

  var camposPossiveis = [];
  var textField = extra && extra.textField ? extra.textField : "";

  if (textField) {
    camposPossiveis.push(textField);
  }

  camposPossiveis = camposPossiveis.concat([
    "IDDESC_SINDICATO",
    "IDDESC_FUNCAO",
    "IDDESC_HORARIO",
    "IDDESC_TIPORECEBIMENTO",
    "IDDESC_OCORRENCIA",
    "IDDESC_CATSEFIP",
    "IDDESC_SITUACAO",
    "IDDESC_VINCULO",
    "IDDESC_CATEGORIAESOCIAL",
    "TIPO_FUNCIONARIO",
    "DESCRICAO",
    "DESCRIÇÃO",
    "NOME",
    "NOME_FUNCIONARIO",
    "FUNCAO",
    "HORARIO"
  ]);

  var usados = {};
  var valorNorm = normalizarValorComparacao(valorTecnico);

  for (var i = 0; i < camposPossiveis.length; i++) {
    var campo = camposPossiveis[i];

    if (!campo || usados[campo]) {
      continue;
    }

    usados[campo] = true;

    var texto = obterValorItemParamJornada(itemDataset, campo);
    var textoNorm = normalizarValorComparacao(texto);

    if (texto && textoNorm && textoNorm !== valorNorm) {
      return String(texto);
    }

    // Se o próprio campo já vier como "0105 - Descrição", aceita.
    if (texto && valorTecnico && String(texto).indexOf(String(valorTecnico) + " - ") === 0) {
      return String(texto);
    }
  }

  return "";
}

function obterCampoColigadaPadraoDatasetJornada(datasetId, campoId) {
  var ds = String(datasetId || "").toLowerCase();

  if (
    ds.indexOf("secao") >= 0 ||
    ds.indexOf("centrocusto") >= 0 ||
    ds.indexOf("quiosque") >= 0
  ) {
    return "CODCOLIGADA";
  }

  return "ID_EMPRESA";
}

function montarConstraintsBuscaDatasetParamJornada(extra, valorTecnico, campoId) {
  var constraints = [];

  if (!extra || !extra.valueField || !valorTecnico || typeof DatasetFactory === "undefined") {
    return constraints;
  }

  constraints.push(
    DatasetFactory.createConstraint(extra.valueField, valorTecnico, valorTecnico, ConstraintType.MUST)
  );

  var datasetId = extra.datasetId || "";
  var camposComColigada = {
    FUN_IDDESCFUN: true,
    FUN_IDDESCTURN: true,
    FUN_SEQTURN_IDDESC_AD: true,
    zoom_sindicato: true,
    zoom_sindicato_filiacao: true
  };

  var deveFiltrarColigada = !!extra.usaColigadaJornada || !!camposComColigada[campoId];
  var empresa = $("#FUN_EMPRESA").val() || $("#txtCodcoligada").val();

  if (deveFiltrarColigada && empresa) {
    var campoColigada = extra.coligadaConstraintField || obterCampoColigadaPadraoDatasetJornada(datasetId, campoId);

    constraints.push(
      DatasetFactory.createConstraint(campoColigada, empresa, empresa, ConstraintType.MUST)
    );
  }

  return constraints;
}

function escolherItemDatasetPorValor(ds, extra, valorTecnico, campoId) {
  var valores = obterValoresDatasetParamJornada(ds);
  var campoBusca = $.trim(String(extra && extra.valueField ? extra.valueField : ""));
  var valorComparacao = normalizarValorComparacao(valorTecnico);
  var linhasDebug = [];

  for (var i = 0; i < valores.length; i++) {
    var item = valores[i] || {};
    linhasDebug.push({
      indice: i + 1,
      valor: campoBusca ? obterValorItemParamJornada(item, campoBusca) : "",
      descricao: extra && extra.textField ? obterValorItemParamJornada(item, extra.textField) : "",
      campos: Object.keys(item).slice(0, 8).join(", ")
    });
  }

  logJornadaGrupo("Consulta de dataset para campo parametrizado", {
    campoId: campoId || "",
    datasetId: extra && extra.datasetId ? extra.datasetId : "",
    valueField: campoBusca,
    textField: extra && extra.textField ? extra.textField : "",
    valorTecnico: valorTecnico || "",
    valorNormalizado: valorComparacao,
    totalLinhas: valores.length
  });
  logJornadaTabela("Linhas retornadas pelo dataset para " + (campoId || "campo"), linhasDebug);

  if (!valores.length || !campoBusca || !valorComparacao) {
    return null;
  }

  for (var j = 0; j < valores.length; j++) {
    var itemAtual = valores[j] || {};
    var valorItem = normalizarValorComparacao(obterValorItemParamJornada(itemAtual, campoBusca));

    if (valorItem && valorItem === valorComparacao) {
      logJornadaGrupo("Item exato do dataset selecionado", {
        campoId: campoId || "",
        valorTecnico: valorTecnico || "",
        valorEncontrado: obterValorItemParamJornada(itemAtual, campoBusca),
        descricaoEncontrada: extra && extra.textField ? obterValorItemParamJornada(itemAtual, extra.textField) : ""
      });
      return itemAtual;
    }
  }

  console.warn("[Jornada] Nenhum item exato encontrado no dataset para", campoId, valorTecnico, campoBusca);
  return null;
}

function formatarTextoCodigoDescricaoJornada(codigo, descricao) {
  var cod = $.trim(String(codigo || ""));
  var desc = $.trim(String(descricao || ""));

  if (!cod && !desc) {
    return "";
  }

  if (!cod) {
    return desc;
  }

  if (!desc) {
    return cod;
  }

  // Evita duplicar quando o dataset já retorna "001 - Descrição"
  if (desc === cod || desc.indexOf(cod + " - ") === 0 || desc.indexOf(cod + " — ") === 0) {
    return desc;
  }

  return cod + " - " + desc;
}

function obterTextoVisualJornada(itemCampo, itemDataset, extra) {
  var codigo = "";
  var descricao = "";

  if (itemCampo && itemCampo.valor !== undefined && itemCampo.valor !== null) {
    codigo = String(itemCampo.valor);
  }

  if (itemDataset && extra) {
    if (extra.valueField) {
      var valorDataset = obterValorItemParamJornada(itemDataset, extra.valueField);

      if (valorDataset !== undefined && valorDataset !== null && $.trim(String(valorDataset)) !== "") {
        codigo = String(valorDataset);
      }
    }

    descricao = obterDescricaoItemDatasetParamJornada(itemDataset, extra, codigo);
  }

  if (
    !descricao &&
    itemCampo &&
    itemCampo.descricao !== undefined &&
    itemCampo.descricao !== null &&
    $.trim(String(itemCampo.descricao)) !== "" &&
    normalizarValorComparacao(itemCampo.descricao) !== normalizarValorComparacao(codigo)
  ) {
    descricao = String(itemCampo.descricao);
  }

  return formatarTextoCodigoDescricaoJornada(codigo, descricao);
}

function obterTextoCampoParamJornada(campo) {
  return obterTextoVisualJornada(campo, null, {});
}

function injetarEstiloCamposParametrizadosJornada() {
  if ($("#style-campos-parametrizados-jornada").length) {
    return;
  }

  $("head").append(
    '<style id="style-campos-parametrizados-jornada">' +
    '.campo-parametrizado-jornada{' +
    'background-color:#f3f4f6!important;' +
    'cursor:not-allowed!important;' +
    'color:#374151!important;' +
    'border:1px solid #d1d5db!important;' +
    '}' +
    '</style>'
  );
}

function campoFoiAplicadoPorJornada(campoId) {
  return !!(window.camposJornadaAplicados && window.camposJornadaAplicados[campoId]);
}

function obterCampoDomParamJornada(campoId) {
  if (!campoId) {
    return $();
  }

  return $(document.getElementById(campoId));
}

function criarOuAtualizarCampoTextoParametrizado(campoId, texto) {
  var $campoOriginal = $("#" + campoId);

  if (!$campoOriginal.length) {
    console.warn("[Jornada] Campo original não encontrado para mirror:", campoId);
    return;
  }

  var valor = $.trim(String(texto == null ? "" : texto));

  // Se não existe texto visual, não cria campo cinza vazio.
  // Isso evita o caso da Função aparecer com uma caixa vazia abaixo.
  if (!valor) {
    removerCampoTextoParametrizado(campoId);
    return;
  }

  injetarEstiloCamposParametrizadosJornada();

  var mirrorId = campoId + "_PARAM_JORNADA_TEXT";
  var $mirror = $("#" + mirrorId);
  var $containersSelect2 = $();

  // Select2 antigo do Fluig.
  var $select2Antigo = $("#s2id_" + campoId);
  if ($select2Antigo.length) {
    $containersSelect2 = $containersSelect2.add($select2Antigo);
  }

  // Select2 novo, normalmente renderizado logo após o select original.
  var $select2Novo = $campoOriginal.nextAll(".select2-container").first();
  if ($select2Novo.length) {
    $containersSelect2 = $containersSelect2.add($select2Novo);
  }

  if (!$mirror.length) {
    $mirror = $("<input>", {
      type: "text",
      id: mirrorId,
      class: "form-control campo-parametrizado-jornada",
      readonly: true
    });

    $mirror.attr("data-campo-original", campoId);

    if ($containersSelect2.length) {
      $mirror.insertAfter($containersSelect2.last());
    } else {
      $mirror.insertAfter($campoOriginal);
    }
  }

  $campoOriginal.attr("data-param-jornada-oculto", "S");
  $mirror.val(valor).prop("readonly", true).show();

  function ocultarCampoOriginalEZoom() {
    var $containersAtualizados = $();

    var $select2AntigoAtual = $("#s2id_" + campoId);
    if ($select2AntigoAtual.length) {
      $containersAtualizados = $containersAtualizados.add($select2AntigoAtual);
    }

    var $select2NovoAtual = $campoOriginal.nextAll(".select2-container").first();
    if ($select2NovoAtual.length) {
      $containersAtualizados = $containersAtualizados.add($select2NovoAtual);
    }

    $campoOriginal.hide();

    if ($containersAtualizados.length) {
      $containersAtualizados
        .attr("data-param-jornada-container-oculto", "S")
        .hide();
    }
  }

  // Executa agora e depois novamente, porque o Fluig/Select2 pode redesenhar o componente após o change.
  ocultarCampoOriginalEZoom();

  setTimeout(ocultarCampoOriginalEZoom, 50);
  setTimeout(ocultarCampoOriginalEZoom, 200);
  setTimeout(ocultarCampoOriginalEZoom, 600);
}

function removerCampoTextoParametrizado(campoId) {
  var $campoOriginal = $("#" + campoId);
  var mirrorId = campoId + "_PARAM_JORNADA_TEXT";

  $("#" + mirrorId).remove();

  if (!$campoOriginal.length) {
    return;
  }

  var $containersSelect2 = $();

  var $select2Antigo = $("#s2id_" + campoId);
  if ($select2Antigo.length) {
    $containersSelect2 = $containersSelect2.add($select2Antigo);
  }

  var $select2Novo = $campoOriginal.nextAll(".select2-container").first();
  if ($select2Novo.length) {
    $containersSelect2 = $containersSelect2.add($select2Novo);
  }

  $campoOriginal.removeAttr("data-param-jornada-oculto");

  if ($containersSelect2.length) {
    $containersSelect2
      .removeAttr("data-param-jornada-container-oculto")
      .show();
  } else {
    $campoOriginal.show();
  }
}

function preencherCampoRealJornada(campoId, valor, options) {
  options = options || {};
  var $campo = $("#" + campoId);

  if (!$campo.length) {
    console.warn("[Jornada] Campo real nao encontrado:", campoId, valor);
    return false;
  }

  var valorFinal = valor == null ? "" : String(valor);

  try {
    if ($campo.is("select")) {
      var encontrou = false;
      var textoOpcao = $.trim(String(options.textoOpcao || ""));

      $campo.find("option").each(function () {
        if (String($(this).val()) === valorFinal || String($(this).text()) === valorFinal) {
          if (textoOpcao) {
            $(this).text(textoOpcao);
          }

          $campo.val($(this).val());
          encontrou = true;
          return false;
        }
      });

      if (!encontrou && valorFinal !== "") {
        $campo.append(new Option(textoOpcao || valorFinal, valorFinal, true, true));
        $campo.val(valorFinal);
      }
    } else {
      $campo.val(valorFinal);
    }

    $campo.attr("data-preenchido-jornada", "S");
    $campo.attr("data-jornada-valor", valorFinal);
    if (!options.silencioso) {
      $campo.trigger("change").trigger("blur");
    }

    console.log("[Jornada] Campo preenchido:", {
      campoId: campoId,
      valor: valorFinal,
      silencioso: !!options.silencioso,
      valorDepois: $campo.val()
    });

    return true;
  } catch (e) {
    console.error("[Jornada] Erro preenchendo campo real:", campoId, valorFinal, e);
    return false;
  }
}

function limparCampoRealJornada(campoId, options) {
  options = options || {};
  var $campo = $("#" + campoId);

  if (!$campo.length) {
    return;
  }

  try {
    if ($campo.is('[type="zoom"]') && window[campoId] && typeof window[campoId].clear === "function") {
      window[campoId].clear();
    } else if ($campo.is("select")) {
      $campo.val("");
    } else {
      $campo.val("");
    }

    $campo.removeAttr("data-preenchido-jornada");
    $campo.removeAttr("data-jornada-valor");
    if (!options.silencioso) {
      $campo.trigger("change").trigger("blur");
    }

    console.log("[Jornada][Limpeza] Campo limpo:", {
      campoId: campoId,
      silencioso: !!options.silencioso,
      valorDepois: $campo.val()
    });
  } catch (e) {
    console.warn("[Jornada] Erro limpando campo:", campoId, e);
  }
}

function limparCamposJornadaAnterior() {
  var aplicados = window.camposJornadaAplicados || {};
  var campos = Object.keys(aplicados);

  if (!campos.length) {
    return;
  }

  logJornadaGrupo("Limpando campos da jornada anterior", aplicados);

  for (var i = 0; i < campos.length; i++) {
    var campoId = campos[i];
    var meta = aplicados[campoId] || {};
    var hiddenFields = meta.hiddenFields || [];

    logJornadaGrupo("Limpando campo parametrizado", {
      campoId: campoId,
      tipo: meta.tipo || "",
      valorAtual: obterValorCampoAtual(campoId),
      hiddenFields: hiddenFields
    });

    removerCampoTextoParametrizado(campoId);
    limparCampoRealJornada(campoId, { silencioso: true });

    for (var h = 0; h < hiddenFields.length; h++) {
      var hiddenField = hiddenFields[h] || {};
      if (hiddenField.id) {
        limparCampoRealJornada(hiddenField.id, { silencioso: true });
      }
    }
  }

  window.camposJornadaAplicados = {};
}

function limparCampoAplicadoPorJornada(campoId) {
  if (!campoFoiAplicadoPorJornada(campoId)) {
    return;
  }

  var meta = window.camposJornadaAplicados[campoId] || {};
  var hiddenFields = meta.hiddenFields || [];

  removerCampoTextoParametrizado(campoId);
  limparCampoRealJornada(campoId, { silencioso: !!window.aplicandoParametrosJornada });

  for (var i = 0; i < hiddenFields.length; i++) {
    var hiddenField = hiddenFields[i] || {};
    if (hiddenField.id) {
      limparCampoRealJornada(hiddenField.id, { silencioso: !!window.aplicandoParametrosJornada });
    }
  }

  delete window.camposJornadaAplicados[campoId];
}

function aplicarValorVisualParamJornada($campoDom, valorTexto, valorTecnico) {
  if (!$campoDom || !$campoDom.length) {
    return;
  }

  var texto = $.trim(String(valorTexto || ""));
  var codigo = $.trim(String(valorTecnico || ""));

  if ($campoDom.is("select")) {
    var $opcao = $();

    if (texto) {
      $opcao = $campoDom.find("option").filter(function () {
        return $.trim($(this).text() || "") === texto;
      }).first();
    }

    if (!$opcao.length && codigo) {
      $opcao = $campoDom.find("option").filter(function () {
        return $.trim(String($(this).val() || "")) === codigo;
      }).first();
    }

    if ($opcao.length) {
      $campoDom.val($opcao.val()).trigger("change").trigger("blur");
      return;
    }

    if (texto) {
      $campoDom.append($("<option>", {
        value: texto,
        text: texto,
        selected: true
      }));
      $campoDom.val(texto).trigger("change").trigger("blur");
      return;
    }

    $campoDom.val(codigo).trigger("change").trigger("blur");
    return;
  }

  $campoDom.val(texto || codigo || "").trigger("change").trigger("blur");
}

function obterLabelJornadaAplicada(campo) {
  return $.trim(String(campo && campo.descricao ? campo.descricao : campo && campo.valor ? campo.valor : ""));
}

function obterValorAplicacaoCampoSimplesJornada(itemCampo) {
  var campoId = itemCampo.campoId;
  var valorTecnico = $.trim(String(itemCampo.valor || ""));
  var descricao = $.trim(String(itemCampo.descricao || ""));
  var camposQueDevemUsarValorTecnico = {
    cpContratoPrazo: true,
    cpTipoContrato: true,
    FUN_TPJORNADA: true,
    ContSalBrad: true,
    MarcaPonto: true
  };

  if (camposQueDevemUsarValorTecnico[campoId]) {
    return valorTecnico || descricao;
  }

  var $campo = $("#" + campoId);

  if ($campo.length && $campo.is("select")) {
    return valorTecnico || descricao;
  }

  return descricao || valorTecnico;
}

function ordenarCamposJornadaParaAplicacao(campos) {
  var prioridade = {
    "FUN_IDDESCTURN": 10,
    "FUN_SEQTURN_IDDESC_AD": 20
  };

  return (campos || []).slice(0).sort(function (a, b) {
    var pa = prioridade[a.campoId] || 100;
    var pb = prioridade[b.campoId] || 100;

    if (pa === pb) {
      return String(a.campoId || "").localeCompare(String(b.campoId || ""));
    }

    return pa - pb;
  });
}

function aplicarCampoSimplesJornada(itemCampo) {
  var campoId = itemCampo.campoId;

  if (!campoId) {
    return;
  }

  var valor = obterValorAplicacaoCampoSimplesJornada(itemCampo);

  window.camposJornadaAplicados[campoId] = {
    tipo: itemCampo.campoTipo || "simples",
    hiddenFields: []
  };

  logJornadaGrupo("Aplicando campo simples da jornada", {
    campoId: campoId,
    valorConfigurado: valor,
    valorAntes: obterValorCampoAtual(campoId)
  });

  removerCampoTextoParametrizado(campoId);
  preencherCampoRealJornada(campoId, valor, {
    silencioso: !!window.aplicandoParametrosJornada
  });

  console.log("[Jornada][Campo simples aplicado]", {
    campoId: campoId,
    valorAplicado: valor,
    valorTecnico: itemCampo.valor,
    descricao: itemCampo.descricao,
    valorDepois: obterValorCampoAtual(campoId)
  });

  if (
    campoId === "cpContratoPrazo" ||
    campoId === "cpDiasVencPrimeiraExp" ||
    campoId === "cpDiasVencSegundaExp" ||
    campoId === "cpDataPrevisaoAdmissao" ||
    campoId === "FUN_ADMISSAO"
  ) {
    agendarRecalculoExperienciaPorJornada("campo simples aplicado - " + campoId);
  }
}

function aplicarCampoZoomJornada(itemCampo) {
  var campoId = itemCampo.campoId;
  var extra = parseJsonSeguroParamJornada(itemCampo.jsonExtra);
  var valorTecnico = $.trim(String(itemCampo.valor || ""));
  var textoFallback = $.trim(String(itemCampo.descricao || itemCampo.valor || ""));
  var itemDataset = null;
  var textoVisual = textoFallback;
  var valorOriginal = valorTecnico || textoFallback;

  if (!campoId) {
    return;
  }

  logJornadaGrupo("Aplicando campo zoom da jornada", {
    campoId: campoId,
    datasetId: extra.datasetId || "",
    valueField: extra.valueField || "",
    textField: extra.textField || "",
    valorConfiguradoTecnico: valorTecnico,
    textoConfigurado: textoFallback,
    valorAntes: obterValorCampoAtual(campoId)
  });

  window.camposJornadaAplicados[campoId] = {
    tipo: "zoom",
    hiddenFields: extra.hiddenFields || []
  };

  try {
    if (extra.datasetId && extra.valueField && valorTecnico && typeof DatasetFactory !== "undefined") {
      var constraintsBusca = montarConstraintsBuscaDatasetParamJornada(extra, valorTecnico, campoId);
      var dataset = DatasetFactory.getDataset(extra.datasetId, null, constraintsBusca, null);

      itemDataset = escolherItemDatasetPorValor(dataset, extra, valorTecnico, campoId);

      // Fallback: se não encontrou com coligada/dependências, tenta só pelo código.
      if (!itemDataset) {
        var constraintSimples = DatasetFactory.createConstraint(extra.valueField, valorTecnico, valorTecnico, ConstraintType.MUST);
        var datasetSimples = DatasetFactory.getDataset(extra.datasetId, null, [constraintSimples], null);

        itemDataset = escolherItemDatasetPorValor(datasetSimples, extra, valorTecnico, campoId);
      }
    }
  } catch (e) {
    console.warn("[Jornada] Erro opcional ao consultar dataset para", campoId, e);
  }

  textoVisual = obterTextoVisualJornada(itemCampo, itemDataset, extra) || textoFallback || valorTecnico;

  // Mantém o valor técnico no campo real e o texto no mirror para evitar quebra de lógica do formulário.
  preencherCampoRealJornada(campoId, valorOriginal || textoVisual, {
    silencioso: !!window.aplicandoParametrosJornada,
    textoOpcao: textoVisual
  });

  criarOuAtualizarCampoTextoParametrizado(campoId, textoVisual);

  var hiddenFields = extra.hiddenFields || [];
  for (var i = 0; i < hiddenFields.length; i++) {
    var hf = hiddenFields[i] || {};
    if (!hf.id) {
      continue;
    }

    var valorHidden = "";
    var campoHidden = $.trim(String(hf.field || "")).toUpperCase();
    var campoValor = $.trim(String(extra.valueField || "")).toUpperCase();
    var campoTexto = $.trim(String(extra.textField || "")).toUpperCase();

    if (itemDataset && hf.field && itemDataset[hf.field] != null && $.trim(String(itemDataset[hf.field])) !== "") {
      valorHidden = itemDataset[hf.field];
    } else if (campoHidden && campoHidden === campoValor) {
      valorHidden = valorTecnico || textoVisual;
    } else if (campoHidden && campoHidden === campoTexto) {
      valorHidden = textoVisual || valorTecnico;
    } else {
      var nomeCampoHidden = String(hf.id + " " + (hf.field || "")).toLowerCase();
      var usaTexto = nomeCampoHidden.indexOf("descricao") !== -1 || nomeCampoHidden.indexOf("label") !== -1 || nomeCampoHidden.indexOf("nome") !== -1 || nomeCampoHidden.indexOf("text") !== -1;
      valorHidden = usaTexto ? (textoVisual || valorTecnico) : (valorTecnico || textoVisual);
    }

    preencherCampoRealJornada(hf.id, valorHidden || "", {
      silencioso: !!window.aplicandoParametrosJornada
    });
  }

  if (campoId === "zoomTipoFuncionario") {
    logJornadaGrupo("Debug Tipo Funcionario", {
      campoId: campoId,
      valorTecnico: valorTecnico,
      textoVisual: textoVisual,
      valorFinalNoCampo: obterValorCampoAtual(campoId)
    });
  }

  logJornadaGrupo("Campo zoom aplicado", {
    campoId: campoId,
    valorDepois: obterValorCampoAtual(campoId),
    textoVisual: textoVisual,
    itemDatasetSelecionado: itemDataset ? itemDataset[extra.valueField || ""] || "" : ""
  });
}

function aplicarCamposJornadaEmSerie(campos, indice) {
  var lista = campos || [];
  var posicao = indice || 0;

  if (posicao >= lista.length) {
    console.log("[Jornada] Aplicacao da jornada finalizada. Rodando pos-processamento.");

    window.aplicandoParametrosJornada = false;
    aplicandoParametrosJornada = false;

    if (typeof gerenciarPainelContrato === "function") {
      gerenciarPainelContrato(false);
    }

    agendarRecalculoExperienciaPorJornada("fim da aplicacao da jornada");

    if (typeof exibeDocumentosPorJornadaKit === "function") {
      exibeDocumentosPorJornadaKit();
    }

    if (typeof aplicarBloqueioDadosContratacaoPorJornada === "function") {
      aplicarBloqueioDadosContratacaoPorJornada();
    }

    if (typeof validarLiberacaoGED === "function") {
      validarLiberacaoGED();
    }

    console.log("[Jornada][Experiencia][Estado final]", {
      cpContratoPrazo: $("#cpContratoPrazo").val(),
      cpDataPrevisaoAdmissao: $("#cpDataPrevisaoAdmissao").val(),
      FUN_ADMISSAO: $("#FUN_ADMISSAO").val(),
      cpDiasVencPrimeiraExp: $("#cpDiasVencPrimeiraExp").val(),
      cpVencPrimeiraExp: $("#cpVencPrimeiraExp").val(),
      cpDiasVencSegundaExp: $("#cpDiasVencSegundaExp").val(),
      cpVencSegundaExp: $("#cpVencSegundaExp").val()
    });

    return;
  }

  var itemCampo = lista[posicao] || {};
  logJornadaGrupo("Aplicando campo em serie", {
    indice: posicao + 1,
    total: lista.length,
    campoId: itemCampo.campoId,
    tipo: itemCampo.campoTipo,
    valor: itemCampo.valor,
    descricao: itemCampo.descricao,
    valorAntes: obterValorCampoAtual(itemCampo.campoId)
  });

  if (String(itemCampo.campoTipo || "").toLowerCase() === "zoom" || $("#" + itemCampo.campoId).is('[type="zoom"]')) {
    aplicarCampoZoomJornada(itemCampo);
  } else {
    aplicarCampoSimplesJornada(itemCampo);
  }

  aplicarCamposJornadaEmSerie(lista, posicao + 1);
}

function popularJornadasAdmissaoPorColigada(codColigada) {
  if (typeof parametrosJornadaCarregados === "undefined") {
    window.parametrosJornadaCarregados = false;
  }

  if (!parametrosJornadaCarregados) {
    carregarParametrosJornadaAdmissao(function () {
      popularJornadasAdmissaoPorColigada(codColigada);
    });
    return;
  }

  var $select = $("#cpJornadaAdmissao");

  if (!$select.length) {
    return;
  }

  var valorPendente = $select.attr("data-jornada-pendente") || "";
  var valorAtual = $select.val() || valorPendente || "";
  var manteveValorAtual = false;

  $select.empty();

  if (!codColigada) {
    $select.append($("<option>", {
      value: "",
      text: "Selecione Empresa/Filial primeiro"
    }));
    $select.val("").prop("disabled", true);
    aplicarBloqueioDadosContratacaoPorJornada();
    return;
  }

  $select.prop("disabled", false);
  $select.append($("<option>", { value: "", text: "" }));

  var jornadasOrdenadas = jornadasAdmissaoConfig.slice(0);
  jornadasOrdenadas.sort(function (a, b) {
    var ordemA = parseInt(a.ordem, 10);
    var ordemB = parseInt(b.ordem, 10);

    if (isNaN(ordemA) && isNaN(ordemB)) {
      return String(obterLabelJornada(a)).localeCompare(String(obterLabelJornada(b)));
    }

    if (isNaN(ordemA)) {
      return 1;
    }

    if (isNaN(ordemB)) {
      return -1;
    }

    return ordemA - ordemB;
  });

  for (var i = 0; i < jornadasOrdenadas.length; i++) {
    var jornada = jornadasOrdenadas[i];

    if (!jornadaDisponivelParaColigada(jornada, codColigada)) {
      continue;
    }

    $select.append($("<option>", {
      value: jornada.codigo,
      text: obterLabelJornada(jornada)
    }));

    if (String(jornada.codigo) === String(valorAtual)) {
      manteveValorAtual = true;
    }
  }

  if (valorAtual && manteveValorAtual) {
    $select.val(valorAtual);
    $select.removeAttr("data-jornada-pendente");

    if (typeof aplicarParametrosJornadaAdmissao === "function") {
      aplicarBloqueioDadosContratacaoPorJornada();

      setTimeout(function () {
        aplicarParametrosJornadaAdmissao(valorAtual);
      }, 200);
    }

    return;
  }

  var limpouJornada = !!valorAtual;
  $select.val("");
  $select.removeAttr("data-jornada-pendente");

  if (limpouJornada) {
    aplicarBloqueioDadosContratacaoPorJornada();

    if (typeof gerenciarPainelContrato === "function") {
      gerenciarPainelContrato(false);
    }

    if (typeof exibeDocumentosPorJornadaKit === "function") {
      exibeDocumentosPorJornadaKit();
    }
  }
}

function aplicarParametrosJornadaAdmissao(codigoJornada) {
  if (typeof aplicandoParametrosJornada === "undefined") {
    window.aplicandoParametrosJornada = false;
  }
  if (typeof parametrosJornadaCarregados === "undefined") {
    window.parametrosJornadaCarregados = false;
  }

  if (!codigoJornada || aplicandoParametrosJornada) {
    return;
  }

  if (!parametrosJornadaCarregados) {
    carregarParametrosJornadaAdmissao(function () {
      aplicarParametrosJornadaAdmissao(codigoJornada);
    });
    return;
  }

  aplicandoParametrosJornada = true;

  try {
    var jornadaSelecionada = null;
    for (var i = 0; i < jornadasAdmissaoConfig.length; i++) {
      if (normalizarValorComparacao(jornadasAdmissaoConfig[i].codigo) === normalizarValorComparacao(codigoJornada)) {
        jornadaSelecionada = jornadasAdmissaoConfig[i];
        break;
      }
    }

    logJornadaGrupo("Jornada selecionada para aplicacao", {
      codigoSelecionado: codigoJornada,
      jornadaConfigurada: jornadaSelecionada || {},
      totalJornadasConfiguradas: (jornadasAdmissaoConfig || []).length
    });

    limparCamposJornadaAnterior();

    var campos = obterCamposDaJornada(codigoJornada);
    campos = ordenarCamposJornadaParaAplicacao(campos);
    logJornadaTabela("De/para de campos encontrados para a jornada", campos.map(function (item, idx) {
      return {
        indice: idx + 1,
        campoId: item.campoId || "",
        campoTipo: item.campoTipo || "",
        valorConfigurado: item.valor || "",
        descricaoConfigurada: item.descricao || ""
      };
    }));

    aplicarCamposJornadaEmSerie(campos, 0);
  } catch (e) {
    console.warn("[Param Jornada] Erro ao aplicar parametros.", e);
  } finally {
    if (aplicandoParametrosJornada) {
      aplicandoParametrosJornada = false;
      window.aplicandoParametrosJornada = false;

      if (typeof gerenciarPainelContrato === "function") {
        gerenciarPainelContrato(false);
      }

      agendarRecalculoExperienciaPorJornada("finally da aplicacao da jornada");

      if (typeof exibeDocumentosPorJornadaKit === "function") {
        exibeDocumentosPorJornadaKit();
      }

      if (typeof validarLiberacaoGED === "function") {
        validarLiberacaoGED();
      }
    }
  }
}

function aplicarParametrosDaJornadaSelecionada() {
  var jornada = $("#cpJornadaAdmissao").val();

  logJornadaGrupo("Selecao de jornada no formulario", {
    valorSelecionado: jornada || "",
    valorAtualCampo: obterValorCampoAtual("cpJornadaAdmissao")
  });

  if (!jornada) {
    limparCamposJornadaAnterior();

    if (typeof aplicarBloqueioDadosContratacaoPorJornada === "function") {
      aplicarBloqueioDadosContratacaoPorJornada();
    }

    return;
  }

  aplicarParametrosJornadaAdmissao(jornada);
}

function reaplicarJornadaSalvaAoCarregar() {
  var jornadaAtual = $.trim(String($("#cpJornadaAdmissao").val() || ""));
  var empresaAtual = $.trim(String($("#FUN_EMPRESA").val() || $("#txtCodcoligada").val() || ""));

  if (!jornadaAtual || !empresaAtual) {
    return;
  }

  if (window.reaplicandoJornadaSalvaAoCarregar || window.jornadaSalvaReaplicadaAoCarregar) {
    return;
  }

  window.reaplicandoJornadaSalvaAoCarregar = true;

  console.log("[Jornada][Reload] Reaplicando jornada salva ao carregar a atividade:", {
    jornada: jornadaAtual,
    empresa: empresaAtual
  });

  carregarParametrosJornadaAdmissao(function () {
    try {
      var $selectJornada = $("#cpJornadaAdmissao");

      if ($selectJornada.length) {
        var existeOpcao = false;

        $selectJornada.find("option").each(function () {
          if (String($(this).val()) === String(jornadaAtual)) {
            existeOpcao = true;
            return false;
          }
        });

        if (!existeOpcao) {
          $selectJornada.append($("<option>", {
            value: jornadaAtual,
            text: jornadaAtual
          }));
        }

        $selectJornada.val(jornadaAtual);
      }

      // Aplica diretamente a jornada salva, sem esperar o fluxo de popular o select.
      // Isso reduz o tempo em que os zooms aparecem apenas com o código após avançar atividade.
      aplicarParametrosJornadaAdmissao(jornadaAtual);

      window.jornadaSalvaReaplicadaAoCarregar = true;
      window.reaplicandoJornadaSalvaAoCarregar = false;
    } catch (e) {
      window.reaplicandoJornadaSalvaAoCarregar = false;
      console.warn("[Jornada][Reload] Erro ao reaplicar jornada salva.", e);
    }
  });
}

function agendarReaplicacaoJornadaSalvaAoCarregar() {
  var tempos = [150, 700, 1500];

  for (var i = 0; i < tempos.length; i++) {
    (function (tempo) {
      setTimeout(function () {
        if (window.jornadaSalvaReaplicadaAoCarregar) {
          return;
        }

        if (typeof reaplicarJornadaSalvaAoCarregar === "function") {
          reaplicarJornadaSalvaAoCarregar();
        }
      }, tempo);
    })(tempos[i]);
  }
}

window.aplicarParametrosDaJornadaSelecionada = aplicarParametrosDaJornadaSelecionada;
window.limparCamposJornadaAnterior = limparCamposJornadaAnterior;
window.limparCampoAplicadoPorJornada = limparCampoAplicadoPorJornada;
window.reaplicarJornadaSalvaAoCarregar = reaplicarJornadaSalvaAoCarregar;
window.agendarReaplicacaoJornadaSalvaAoCarregar = agendarReaplicacaoJornadaSalvaAoCarregar;

var Conta = function (indice) {
  var a = indice.name;
  a = a.replace("txtNumViagensVt___", "").replace("txtTarifa___", "");
  var v = "#" + "txtTarifa___" + a;
  var valor = $(v).val();
  var vi = "#" + "txtNumViagensVt___" + a;
  var viagens = $(vi).val();

  $("#txtValorTotal___" + a).val(calcula(valor, viagens));
};
var calcula = function (valor, viagens) {
  if (valor == "") valor = 0;
  if (viagens == "") viagens = 0;
  var resulta = valor * viagens;
  return resulta;
};

//somente letras
function letras() {
  $(".nome").keypress(function () {
    tecla = event.keyCode;
    if (tecla >= 48 && tecla <= 57) {
      return false;
    } else {
      return true;
    }
  });
}

//somente Numeros
function Numeros() {
  $(".Numeros").keypress(function () {
    tecla = event.keyCode;
    if (tecla >= 48 && tecla <= 57) {
      return true;
    } else {
      return false;
    }
  });
}

//VALIDACAO DE CPF
function validar(obj) {
  // recebe um objeto
  var s = obj.value.replace(/\D/g, "");
  var tam = s.length;

  // se for CPF
  if (tam < 12) {
    if (!validaCPF(s) && $("#cpfcnpj").val().trim() != "") {
      alert("'" + s + "' N\u00e3o \u00e9 um CPF v\u00e1lido!");
      $("#cpfcnpj").val("");
      obj.select(); // se quiser selecionar o campo em quest?o
      return false;
    }
  }

  // DEFININDO AS REGRAS DE VALIDACAO DO CPF
  function validaCPF(s) {
    if (
      s == "11111111111" ||
      s == "22222222222" ||
      s == "33333333333" ||
      s == "44444444444" ||
      s == "55555555555" ||
      s == "66666666666" ||
      s == "77777777777" ||
      s == "88888888888" ||
      s == "99999999999" ||
      s == "00000000000"
    ) {
      return false;
    }
    var c = s.substr(0, 9);
    var dv = s.substr(9, 2);
    var d1 = 0;
    for (var i = 0; i < 9; i++) {
      d1 += c.charAt(i) * (10 - i);
    }
    if (d1 == 0) return false;
    d1 = 11 - (d1 % 11);
    if (d1 > 9) d1 = 0;
    if (dv.charAt(0) != d1) {
      return false;
    }
    d1 *= 2;
    for (var i = 0; i < 9; i++) {
      d1 += c.charAt(i) * (11 - i);
    }
    d1 = 11 - (d1 % 11);
    if (d1 > 9) d1 = 0;
    if (dv.charAt(1) != d1) {
      return false;
    }
    return true;
  }
}

function PegaValorData() {
  var DtNasc = $("#dtDataNascColaborador").val();
  $("#dtDataNascColaboradorValue").val(DtNasc);
}

var formatarData = function (data) {
  if (data == "" || data == null) {
    return "";
  }
  if (data.indexOf("T") > -1) {
    data = data.substr(0, data.indexOf("T"));
  }
  var arrData = data.split("-");
  // Verifica se a data já não está no formato correto (evita erro de split)
  if (arrData.length === 1 && data.indexOf("/") > -1) {
    return data;
  }
  return arrData[2] + "/" + arrData[1] + "/" + arrData[0];
};

/**
 * Função Auxiliar para desbloquear campos de endereço após a consulta
 */
function desbloquearCamposEndereco() {
  // Adapte para os campos de endereço do seu formulário 14154
  $("#txtRUA").prop("readonly", false);
  $("#txtBAIRRO").prop("readonly", false);
  $("#txtNUMERO").prop("readonly", false);
  $("#txtCOMPLEMENTO").prop("readonly", false);
}

/**
 * Função "Coordenadora": Busca os dados completos na folha de pagamento
 */
var consultaFuncionario = function (cpf) {
  var myLoading = FLUIGC.loading(window, {
    textMessage: 'Aguarde, procurando informações'
  });
  myLoading.show();

  setTimeout(function () {
    // Adaptado para usar a coligada do seu formulário 14154
    var empresa = $("#cpSolicitanteColigada").val(); //
    var filial = ""; // Deixe em branco ou remova a constraint c2 se não for usar

    // D. Cria as "constraints" (filtros) para o dataset principal
    var c1 = DatasetFactory.createConstraint("id_empresa", empresa, empresa, ConstraintType.MUST);
    // var c2 = DatasetFactory.createConstraint("id_filial", filial, filial, ConstraintType.MUST); // Remova se a filial não for necessária
    var c3 = DatasetFactory.createConstraint("cpf", cpf, cpf, ConstraintType.MUST);
    var c4 = DatasetFactory.createConstraint("matricula", "todasEmpresasFiliais", "todasEmpresasFiliais", ConstraintType.MUST);

    // Ajuste a lista de constraints (removi c2, adicione se precisar)
    var constraints = [c1, c3, c4];

    var dsConsultaFuncionario = DatasetFactory.getDataset("ds_irho_consultaFuncionario", null, constraints, null);

    // --- INÍCIO DA LÓGICA CORRIGIDA ---
    if (dsConsultaFuncionario != null && dsConsultaFuncionario.values && dsConsultaFuncionario.values.length > 0) {
      var error = dsConsultaFuncionario.values[0].ERROR;

      if (error != null && error != "") {
        if (error == "CPF não encontrado na base") {
          console.log("RM: CPF não encontrado na folha. Somente os dados básicos (Serpro) serão preenchidos.");
        } else {
          FLUIGC.toast({ title: 'Erro RM: ', message: error, type: 'warning' });
        }
      } else {
        FLUIGC.toast({ title: 'Sucesso: ', message: 'Dados complementares encontrados no RM atualizados', type: 'info' });
        preencherInfoFuncionario(dsConsultaFuncionario.values[0]);
      }
    } else {
      console.log("RM: Nenhum dado retornado da folha. Somente os dados básicos (Serpro) serão preenchidos.");
    }
    // --- FIM DA LÓGICA CORRIGIDA ---

    myLoading.hide();
  }, 300);
};

/**
 * Função "Trabalhadora": Preenche os campos no formulário 14154
 * Esta é a versão ATUALIZADA E CORRIGIDA com o mapeamento "DE-PARA" completo.
 */
var preencherInfoFuncionario = function (info) {

  desbloquearCamposEndereco();

  // --- Início do Mapeamento (DE-PARA) ---
  // Sintaxe: $("#ID_DO_SEU_FORMULÁRIO_NOVO").val( info['NOME_DA_COLUNA_DO_DATASET_ORIGINAL'] );

  // Dados Pessoais
  // $("#txtNomeColaborador").val(info['FUN_NOME']); // Mantém os dados importados da API Serpro
  // $("#dtDataNascColaborador").val(formatarData(info['FUN_NASCIMENTO'])); // Mantém os dados importados da API Serpro
  $("#CORRACA").val(info['FUN_RACACOR']);
  $("#NACIONALIDADECod").val(info['FUN_NACIONALIDADE']);
  $("#NACIONALIDADE").val(info['FUN_NACIONALIDADE_DESC_AD']); // Campo Descrição
  $("#ESTADONatalCod").val(info['FUN_UFNASCIMENTO']); // No form 1007 é FUN_NATURALIDADE
  $("#ESTADO").val(info['FUN_NATURALIDADE_DESC_AD']); // Campo Descrição
  $("#txtNaturalidadeCod").val(info['FUN_CODMUNASC']);
  $("#txtNaturalidade").val(info['FUN_CODMUNASC_DESC_AD']); // Campo Descrição
  $("#txtSexo").val(info['FUN_SEXO']);
  $("#txtEstCivilCod").val(info['FUN_ESTADOCIV']);
  $("#txtEstadoCivil").val(info['FUN_ESTADOCIV_DESC_AD']); // Campo Descrição
  $("#GRAUINSTRUCAOCod").val(info['FUN_CODGINRAI']);
  $("#txtEscolaridade").val(info['FUN_CODGINRAI_DESC_AD']); // Campo Descrição
  $("#TipoSanguineo").val(info['FUN_TIPOSANG']);

  // Deficiências
  $("#DEFICIENTEFISICO").val(info['FUN_DEFICIENTEFISICO']);
  $("#DEFICIENTEAUDITIVO").val(info['FUN_DEFICIENTEAUDITIVO']);
  $("#DEFICIENTEFALA").val(info['FUN_DEFICIENTEFALA']);
  $("#DEFICIENTEVISUAL").val(info['FUN_DEFICIENTEVISUAL']);
  $("#DEFICIENTEMENTAL").val(info['FUN_DEFICIENTEMENTAL']);
  $("#DEFICIENTEINTELECTUAL").val(info['FUN_DEFICIENTEINTELECTUAL']);

  // Documentos
  $("#TxtRg").val(info['FUN_RG']);
  $("#CODUFCARTIDENTIDADE").val(info['FUN_RGUF']); // Setando o CÓDIGO
  $("#UFCARTIDENTIDADE").val(info['FUN_RGUF']); // Setando a DESCRIÇÃO (que no 1007 é o mesmo valor)
  $("#ORGAOCARTIDENTIDADE").val(info['FUN_RGORG']);
  $("#DTEMISSAOIDENT").val(formatarData(info['FUN_DTRG']));
  $("#TITULOELEITOR").val(info['FUN_TITULOELEITOR']);
  $("#ZONATITELEITOR").val(info['FUN_TITULOELEITOR_ZONA']);
  $("#DTTITELEITOR").val(formatarData(info['FUN_DTTITELEITOR']));
  $("#SECAOTITELEITOR").val(info['FUN_TITULOELEITOR_SECAO']);
  $("#CODUFTITULO").val(info['FUN_ESTELEIT']);
  $("#UFTITULO").val(info['FUN_ESTELEIT']); // Assumindo que o código é a própria UF
  $("#txtCartTrab").val(info['FUN_CARTEIRAPROF']);
  $("#txtSerieCart").val(info['FUN_SERCART']);
  $("#dtDataEmissaoCartTrab").val(formatarData(info['FUN_DTCARTTRAB']));
  $("#CODUFCTPS").val(info['FUN_UFCP']);
  $("#UFCARTTRAB").val(info['FUN_UFCP']); // Assumindo que o código é a própria UF
  $("#CARTMOTORISTA").val(info['FUN_HABILIT']);
  $("#TIPOCARTHABILIT").val(info['FUN_CNHCAT']);
  $("#DTVENCHABILIT").val(formatarData(info['FUN_DTCNHVALID']));
  $("#ORGEMISSORCNH").val(info['FUN_CNHORG']);
  $("#DTEmPrimCNH").val(formatarData(info['FUN_DATAPRIMEIRACNH']));
  $("#CodUFCNH").val(info['FUN_UFCNH']);
  $("#UFCNH").val(info['FUN_UFCNH']); // Assumindo que o código é a própria UF
  $("#PIS").val(info['FUN_PIS']);
  $("#CERTIFRESERV").val(info['FUN_NR_CART_RESERVISTA']);
  $("#DtCERTIFRESERV").val(formatarData(info['DtCERTIFRESERV'])); // Coluna não mapeada, verifique o nome no dataset

  // Endereço
  $("#txtCEP").val(info['FUN_CEP']);
  $("#txtCODTIPORUA").val(info['FUN_TPLOGRADOURO']);
  $("#txtNOMETIPORUA").val(info['FUN_TPLOGRADOURO_DESC_AD']); // Campo Descrição
  $("#txtRUA").val(info['FUN_LOGRADOURODESC']);
  $("#txtNUMERO").val(info['FUN_NUMLOGRADOURO']);
  $("#txtCOMPLEMENTO").val(info['FUN_ENDERECOM']);
  $("#txtBAIRRO").val(info['FUN_BAIRRO']);
  $("#txtCODETD").val(info['FUN_UF']);
  $("#txtNOMECODETD").val(info['FUN_UF']); // Assumindo que o código é a própria UF
  $("#txtCODMUNICIPIO").val(info['FUN_CODIBGE']);
  $("#txtNOMEMUNICIPIO").val(info['FUN_CODIBGE_DESC_AD']); // Campo Descrição
  $("#txtCODPAIS").val(info['FUN_PAIS_ENDERECO']);
  $("#txtPAIS").val(info['FUN_PAIS_ENDERECO_DESC']); // Campo Descrição

  // Contato
  $("#txtTELEFONE").val(info['FUN_TELEFONE']);
  $("#txtCELULAR").val(info['FUN_CELULAR']);
  $("#txtEmail").val(info['FUN_EMAIL']);

  var codPessoa = info["FUN_CODPESSOA"];

  if (codPessoa && codPessoa.trim() !== "") {
    // A PESSOA EXISTE! Salva nos campos ocultos de backup E no novo campo visível
    $("#FUN_CODPESSOA").val(codPessoa);
    $("#txtCodigoPeExist").val(codPessoa);
    $("#txtCodigoPessoaAdm").val(codPessoa);

    FLUIGC.toast({
      title: 'Aviso: ',
      message: 'O CPF informado já possui cadastro no RM (Cód. Pessoa: ' + codPessoa + '). Os dados pessoais serão atualizados.',
      type: 'warning'
    });
  } else {
    // A PESSOA NÃO EXISTE
    $("#FUN_CODPESSOA").val("");
    $("#txtCodigoPeExist").val("");
    $("#txtCodigoPessoaAdm").val("");
  }

  // ** Lógica que faltava do 14154 **
  // Esta função é do seu view.js original, vamos chamá-la.
  VerificaFuncAtivo();
};

/**
 * CONSULTA DIRETA NO SERPRO (NOVO DATASET ds_irho_cpf_serpro)
 */
function PessoaJaExiste(cpf) {

  // Limpa os campos antes de tentar preencher
  $("#txtNomeColaborador").val("");
  $("#dtDataNascColaborador").val("");

  // Cria a constraint apenas com o CPF (único dado que o novo dataset precisa)
  var c1 = DatasetFactory.createConstraint('cpf', cpf, cpf, ConstraintType.MUST);
  var constraints = [c1];

  try {
    // CHAMA O NOVO DATASET
    var dsFUN_CPF = DatasetFactory.getDataset("ds_irho_cpf_serpro", null, constraints, null);

    if (dsFUN_CPF == null || !dsFUN_CPF.values || dsFUN_CPF.values.length == 0) {
      FLUIGC.toast({ title: 'Atenção:', message: 'Não houve retorno do Serpro.', type: 'warning' });
      jQuery("#txtNomeColaborador").prop("readonly", false);
      jQuery("#dtDataNascColaborador").prop("readonly", false);
      jQuery("#txtNomeColaborador").focus();
      return;
    }

    // Processa o retorno do nosso novo dataset
    var retorno = dsFUN_CPF.values[0];

    if (retorno.response_code == "200") {
      if (retorno.nome_completo != "") {
        var nome = retorno.nome_completo;
        var dataNascimento = retorno.dt_nascimento;

        // Preenche os campos
        jQuery("#txtNomeColaborador").val(nome);
        jQuery("#dtDataNascColaborador").val(dataNascimento);

        // Bloqueia os campos para o RH não alterar o dado oficial
        jQuery("#txtNomeColaborador").prop("readonly", true);
        jQuery("#dtDataNascColaborador").prop("readonly", true);

        FLUIGC.toast({ title: 'Sucesso:', message: 'Dados validados na Receita Federal.', type: 'success' });
      }
    } else {
      // Se caiu aqui, é porque deu erro 404 (Não achou), 422 (Menor de idade) ou 500
      jQuery("#txtNomeColaborador").val("");
      jQuery("#dtDataNascColaborador").val("");
      jQuery("#txtNomeColaborador").prop("readonly", false); // Libera para digitação
      jQuery("#dtDataNascColaborador").prop("readonly", false); // Libera para digitação
      jQuery("#txtNomeColaborador").focus();

      // Exibe a mensagem de erro exata que configuramos no dataset
      FLUIGC.toast({ title: 'Atenção:', message: retorno.response_message, type: 'warning' });
    }

  } catch (erro) {
    window.alert("Erro ao consultar o dataset ds_irho_cpf_serpro: " + erro.message);
    jQuery("#txtNomeColaborador").prop("readonly", false);
    jQuery("#dtDataNascColaborador").prop("readonly", false);
  }
}

function CarregaCPF() {
  var CPF = jQuery("#cpfcnpj").val(); // <-- Mudança aqui

  CPF = CPF.replace(/\./g, "").replace(/\-/g, "").trim();

  jQuery("#cpfcnpjValue").val(CPF); // <-- Mudança aqui

  // Nova chamada para a busca completa
  if (CPF.length === 11) {
    PessoaJaExiste(CPF); // API Serpro primeiro (Nome e Nascimento oficial)
    consultaFuncionario(CPF); // RM Labore depois (Campos complementares)
  }
}

//verifica se o funcionário já está ativo na base pelo CPF
var formateData = function (Data) {
  Data = Data.value.split("/");

  Valor = Data[1] + "/" + Data[0] + "/" + Data[2];
  $("#" + "" + Data.name + "").val(Valor);
};
function VerificaFuncAtivo() {
  var verifica = $("#txtFuncAtivo").val();
  var CodigoPessoaAdm = $("#txtCodigoPessoaAdm").val();

  if (verifica == "FUNC_ATIVO" && CodigoPessoaAdm != "") {
    alert(
      "Existem funcionários ativos utilizando o CPF informado, gentileza verificar."
    );

    $("#cpfcnpj").val("");
  }
}

//VERIFICA CHAPA JA EXISTENTE
function VerificaChapa() {
  var CHAPA = document.getElementById("TxtChapa").value;

  var fields = new Array(CHAPA);

  var CODIGO = 0;

  try {
    var tabela = DatasetFactory.getDataset(
      "ds_verificaChapa",
      fields,
      null,
      null
    );

    if (tabela == null) {
      //throw "N&atilde;o Foram encontrados registros!";
    } else if (tabela.values.length == "0") {
      //throw "N&atilde;o Foram encontrados registros.";
    }

    for (var i = 0; i < tabela.values.length; i++) {
      CODIGO = tabela.values[i].CODIGO.toString();

      document.getElementById("txtChapaJaExiste").value = CODIGO;
      //1 NAO EXISTE 2 EXISTE
    }
  } catch (erro) {
    window.alert(erro);
  }

  //return DIAS;
  return 0;
}

function ContrSindical() {
  var cont = $("#TxtContSind").val();
  if (cont == "J") {
    $(".contrsind").show();
  } else {
    $(".contrsind").hide();
  }
}

//mask celular
function MascaraCelular() {
  var Cel = $("#txtCELULAR").val();
  var qtd = Cel.length;
  $("#txtCELULAR").mask("(99) 99999-9999");
}
//mask tel
function MascaraTelefone() {
  var Cel = $("#txtTELEFONE").val();
  var qtd = Cel.length;
  $("#txtTELEFONE").mask("(99) 99999-9999");
}
//mask contato
function MascaraContato() {
  var Cel = $("#txtTElCont").val();
  var qtd = Cel.length;
  $("#txtTElCont").mask("(99) 99999-9999");
}
//limpacel
function LimpaCel() {
  $("#txtCELULAR").val("");
  $("#txtCELULAR").unmask();
}
//limpatel
function LimpaTel() {
  $("#txtTELEFONE").val("");
  $("#txtTELEFONE").unmask();
}
//limpacont
function LimpaCont() {
  $("#txtTElCont").val("");
  $("#txtTElCont").unmask();
}

///valida pis

var ftap = "3298765432";
var total = 0;
var i;
var resto = 0;
var numPIS = 0;
var strResto = "";

function ChecaPIS() {
  total = 0;
  resto = 0;
  numPIS = 0;
  strResto = "";

  numPIS = pis = $("#PIS").val();

  if (numPIS == "" || numPIS == null) {
    return false;
  }

  for (i = 0; i <= 9; i++) {
    resultado = numPIS.slice(i, i + 1) * ftap.slice(i, i + 1);
    total = total + resultado;
  }

  resto = total % 11;

  if (resto != 0) {
    resto = 11 - resto;
  }

  if (resto == 10 || resto == 11) {
    strResto = resto + "";
    resto = strResto.slice(1, 2);
  }

  if (resto != numPIS.slice(10, 11)) {
    return false;
  }

  return true;
}

function ValidaPis() {
  var pis = $("#PIS").val();

  if (!ChecaPIS(pis)) {
    $("#PIS").val("");
  } else {
  }
}

function fnCustomDelete(oElement) {
  fnWdkRemoveChild(oElement);

  var tableBody = document.getElementById("tbItens");
  var trashButtons = tableBody.getElementsByTagName("tr");
}

function fnCustomDeleteVT(oElement) {
  fnWdkRemoveChild(oElement);

  var tableBody = document.getElementById("tbVT");
  var trashButtons = tableBody.getElementsByTagName("tr");
}

function limpa_formulário_cep() {
  // Limpa valores do formulário de cep.
  $("#txtRUA").val("");
  $("#txtBAIRRO").val("");
  /* $("#cidade").val("");
    $("#uf").val("");
    $("#ibge").val("");*/
}

$(document).ready(function () {
  //Quando o campo cep perde o foco.
  $("#txtCEP").blur(function () {
    //Nova variável "cep" somente com dígitos.
    var cep = $(this).val().replace(/\D/g, "");

    //Verifica se campo cep possui valor informado.
    if (cep != "") {
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if (validacep.test(cep)) {
        //Preenche os campos com "..." enquanto consulta webservice.
        $("#txtRUA").val("...");
        $("#txtBAIRRO").val("...");
        /*   $("#cidade").val("...");
            $("#uf").val("...");
            $("#ibge").val("...");*/

        //Consulta o webservice viacep.com.br/
        $.getJSON(
          "https://viacep.com.br/ws/" + cep + "/json/?callback=?",
          function (dados) {
            if (!("erro" in dados)) {
              //Atualiza os campos com os valores da consulta.
              $("#txtRUA").val(dados.logradouro);
              $("#txtBAIRRO").val(dados.bairro);
              /*  $("#cidade").val(dados.localidade);
                    $("#uf").val(dados.uf);
                    $("#ibge").val(dados.ibge);*/
            } //end if.
            else {
              //CEP pesquisado não foi encontrado.
              limpa_formulário_cep();
              alert("CEP não encontrado.");
            }
          }
        );
      } //end if.
      else {
        //cep é inválido.
        limpa_formulário_cep();
        alert("Formato de CEP inválido.");
      }
    } //end if.
    else {
      //cep sem valor, limpa formulário.
      limpa_formulário_cep();
    }
  });


});

/*********************************************************************************
 * INÍCIO - CÓDIGO MIGRADOS DO FORMULÁRIO 1007 (ADMISSÃO DIGITAL - RM)
 *********************************************************************************/

/**
 * removedZoomItem é chamada quando um item de um campo Zoom é removido.
 */
function removedZoomItem(removedItem) {

  if (removedItem.inputId == "IDDESC_EMPRESAFILIAL") {
    $('#FUN_EMPRESA').val("");
    $('#FUN_EMPRESA_DESC_AD').val("");
    $('#FUN_FILIAL').val("");
    $('#FUN_FILIAL_DESC_AD').val("");
    $('#FUN_CNPJ').val("");
    $('#FUN_NOMECOMERCIAL').val("");
    $('#FUN_NOMECOMERCIAL_FILIAL').val("");
    // Limpa outros campos dependentes
    try { window['FUN_IDDESCFUN'].clear(); } catch (ex) { };
    try { window['FUN_CCIDDESC'].clear(); } catch (ex) { };
    try { window['FUN_SECAO_IDDESC_AD'].clear(); } catch (ex) { };
    try { window['FUN_IDDESCTURN'].clear(); } catch (ex) { };
    try { window['FUN_SEQTURN_IDDESC_AD'].clear(); } catch (ex) { };
    try { window['FUN_IDDESCSIND'].clear(); } catch (ex) { };
    try { window['FUN_CODDESCSINDICATOFILIACAO'].clear(); } catch (ex) { };
    try { window['FUN_NIVELFUNCAO'].clear(); } catch (ex) { };
    try { window['FUN_FAIXASALARIAL'].clear(); } catch (ex) { };

    // Desabilita campos
    $('#FUN_IDDESCFUN').attr('disabled', true);
    $('#FUN_CCIDDESC').attr('disabled', true);
    $('#FUN_SECAO_IDDESC_AD').attr('disabled', true);
    $('#FUN_IDDESCTURN').attr('disabled', true);
    $('#FUN_SEQTURN_IDDESC_AD').attr('disabled', true);
    $('#FUN_IDDESCSIND').attr('disabled', true);
    $('#FUN_CODDESCSINDICATOFILIACAO').attr('disabled', true);
    $('#FUN_NIVELFUNCAO').attr('disabled', true);
    $('#FUN_FAIXASALARIAL').attr('disabled', true);

  } else if (removedItem.inputId == "descricaoJornada") {
    $('#codJornada').val("");

  } else if (removedItem.inputId == "desc_kitAssinatura") {
    $('#id_kitAssinatura').val("");
    // buscarBeneficios(); // Descomente se for usar a lógica de benefícios

  } else if (removedItem.inputId == "FUN_CCIDDESC") {
    $('#FUN_CC').val("");
    $('#FUN_CCDESC').val("");

  } else if (removedItem.inputId == "FUN_IDDESCFUN") {
    $('#FUN_FUNCAO').val("");
    $('#FUN_DESCFUN').val("");
    $('#FUN_CBO').val("");
    $('#FUN_CBO2002').val("");
    $('#FUN_CARGO_DESC_AD').val("");
    $('#FUN_CARGO').val("");
    try { window['FUN_NIVELFUNCAO'].clear(); } catch (e) { }
    $('#FUN_NIVELFUNCAO').attr('disabled', true);

  } else if (removedItem.inputId == "FUN_IDDESCTURN") {
    $('#FUN_CODTURN').val("");
    $('#FUN_DESCTURN').val("");
    try {
      window['FUN_SEQTURN_IDDESC_AD'].clear();
      window['FUN_SEQTURN_IDDESC_AD'].disable(true); // Bloqueia a sequência novamente
    } catch (e) { }
    $('#FUN_SEQTURN_IDDESC_AD').attr('disabled', 'disabled');
    $('#FUN_CODTURN').val("");
    $('#FUN_DESCTURN').val("");
    try { window['FUN_SEQTURN_IDDESC_AD'].clear(); } catch (e) { }

  } else if (removedItem.inputId == "FUN_TPADMISSAO_IDDESC_AD") {
    $('#FUN_TPADMISSAO').val("");
    $('#FUN_TPADMISSAO_DESC_AD').val("");

  } else if (removedItem.inputId == "FUN_TIPOPGTO_IDDESC_AD") {
    $('#FUN_TIPOPGTO').val("");
    $('#FUN_TIPOPGTO_DESC_AD').val("");

  } else if (removedItem.inputId == "FUN_CATEGORIA_IDDESC_AD") {
    $('#FUN_CATEGORIA').val("");
    $('#FUN_CATEGORIA_DESC_AD').val("");

  } else if (removedItem.inputId == "FUN_VINCEMPREG_IDDESC_AD") {
    $('#FUN_VINCEMPREG').val("");
    $('#FUN_VINCEMPREG_DESC_AD').val("");

  } else if (removedItem.inputId == "FUN_PGCTSIN_IDDESC_AD") {
    $('#FUN_PGCTSIN').val("");
    $('#FUN_PGCTSIN_DESC_AD').val("");

  } else if (removedItem.inputId == "FUN_IDDESCSIND") {
    $('#FUN_CODSIND').val("");
    $('#FUN_DESCSIND').val("");

  } else if (removedItem.inputId == "FUN_CODDESCSINDICATOFILIACAO") {
    $('#FUN_CODSINDICATOFILIACAO').val("");
    $('#FUN_DESCSINDICATOFILIACAO').val("");

  } else if (removedItem.inputId == "FUN_CATESOCIAL_IDDESC_AD") {
    $('#FUN_CATESOCIAL').val("");
    $('#FUN_CATESOCIAL_DESC_AD').val("");

  } else if (removedItem.inputId == "FUN_BANCOFGTS_IDDESC_AD") {
    $('#FUN_BANCOFGTS').val("");
    $('#FUN_BANCOFGTS_DESC_AD').val("");

  } else if (removedItem.inputId == "FUN_SEQTURN_IDDESC_AD") {
    $('#FUN_SEQTURN').val("");
    $('#FUN_SEQTURN_DESC_AD').val("");

  } else if (removedItem.inputId == "FUN_SECAO_IDDESC_AD") {
    $('#FUN_SECAO').val("");
    $('#FUN_SECAO_DESC_AD').val("");

  } else if (removedItem.inputId == "FUN_FAIXASALARIAL") {
    $('#FUN_VLRSALARIO').val('');
    $('#FUN_VLRSALARIO').prop('readonly', false);
    $('#txtSalario').val(''); // Limpa o campo do form antigo também
    $('#txtSalario').prop('readonly', false);

  } else if (removedItem.inputId == "FUN_CATSEFIP_IDDESC") {
    $('#FUN_CATSEFIP').val('');
    $('#FUN_CATSEFIP_DESC').val('');

  } else if (removedItem.inputId == "FUN_CODOCORRENCIA_IDDESC") {
    $('#FUN_CODOCORRENCIA').val('');
    $('#FUN_CODOCORRENCIA_DESC').val('');

  } else if (removedItem.inputId == "FUN_CODQUIOSQUE_IDDESC") {
    $('#FUN_CODQUIOSQUE').val('');
    $('#FUN_CODQUIOSQUE_DESC').val('');

  } else if (removedItem.inputId == "FUN_INTEGRCONTABIL_IDDESC") {
    $('#FUN_INTEGRCONTABIL').val('');
    $('#FUN_INTEGRCONTABIL_DESC').val('');

  } else if (removedItem.inputId == "FUN_INTEGRGERENCIAL_IDDESC") {
    $('#FUN_INTEGRGERENCIAL').val('');
    $('#FUN_INTEGRGERENCIAL_DESC').val('');
  }
}

/**
 * Funções Auxiliares de Zoom (copiadas do 1007)
 */
function reloadZoomFilial(ID_EMPRESA, ID_FILIAL) {
  // 1. Verifica se deve bloquear (se não tem empresa)
  var desabilitaCamposEmpresa = (ID_EMPRESA == "" || ID_EMPRESA == null || ID_EMPRESA == undefined);

  // Lista dos IDs dos campos (sem o #) para acessar o objeto Zoom
  var listaCamposZoom = [
    'FUN_IDDESCFUN',
    'FUN_IDDESCTURN',
    'FUN_SEQTURN_IDDESC_AD',
    'FUN_CCIDDESC',
    'FUN_SECAO_IDDESC_AD',
    'FUN_IDDESCSIND',
    'FUN_CODDESCSINDICATOFILIACAO',
    'FUN_NIVELFUNCAO',
    'FUN_FAIXASALARIAL',
    'FUN_INTEGRCONTABIL_IDDESC',
    'FUN_INTEGRGERENCIAL_IDDESC'
  ];

  // 2. Aplica o bloqueio/desbloqueio CORRETO no componente Visual e no HTML
  $.each(listaCamposZoom, function (index, idCampo) {
    try {
      // AÇÃO NO COMPONENTE FLUIG (AQUI ESTÁ A CORREÇÃO)
      // Se tiver empresa (desabilitaCamposEmpresa = false), ele executa disable(false), habilitando o campo.
      if (window[idCampo] && window[idCampo].disable) {
        window[idCampo].disable(desabilitaCamposEmpresa);
      }
    } catch (e) {
      console.log("Erro ao manipular estado do Zoom: " + idCampo);
    }

    // AÇÃO NO HTML (Fallback)
    if (desabilitaCamposEmpresa) {
      $("#" + idCampo).attr('disabled', 'disabled');
    } else {
      $("#" + idCampo).removeAttr('disabled');
    }
  });

  // GARANTIA: A Sequência do Turno NÃO pode ser liberada só porque escolheu a Empresa. Ela depende do Turno!
  if (!desabilitaCamposEmpresa) {
    try { window['FUN_SEQTURN_IDDESC_AD'].disable(true); } catch (e) { }
    $("#FUN_SEQTURN_IDDESC_AD").attr('disabled', 'disabled');
  }

  // 3. Se não tiver empresa, limpa os campos e encerra a execução
  if (desabilitaCamposEmpresa) {
    try { window['FUN_IDDESCFUN'].clear(); } catch (ex) { };
    try { window['FUN_IDDESCTURN'].clear(); } catch (ex) { };
    try { window['FUN_SEQTURN_IDDESC_AD'].clear(); } catch (ex) { };
    return;
  }

  // 4. Prepara as strings de filtro

  // Filtro A: Apenas Empresa (Para campos globais como Função)
  var filtroApenasEmpresa = "ID_EMPRESA," + ID_EMPRESA;

  // Filtro B: Empresa + Filial (Para campos específicos como Seção/Turno)
  var filtroEmpresaFilial = filtroApenasEmpresa;
  var temFilial = (ID_FILIAL && ID_FILIAL.trim() !== "" && ID_FILIAL !== "null" && ID_FILIAL !== "undefined");

  if (temFilial) {
    filtroEmpresaFilial += ",ID_FILIAL," + ID_FILIAL;
  }

  // --- RECARGAS DOS ZOOMS ---

  // FUNÇÃO: Usa apenas filtro de Empresa
  try {
    reloadZoomFilterValuesDelay("FUN_IDDESCFUN", filtroApenasEmpresa);
  } catch (e) { }

  // TURNO: Alterado para usar apenas filtro de Empresa (para trazer dados)
  try {
    // Verifica se a função clear() existe antes de chamar, evitando o "is not a function"
    if (window['FUN_SEQTURN_IDDESC_AD'] && typeof window['FUN_SEQTURN_IDDESC_AD'].clear === "function") {
      window['FUN_SEQTURN_IDDESC_AD'].clear();
    }
    reloadZoomFilterValuesDelay("FUN_IDDESCTURN", filtroApenasEmpresa);
  } catch (e) {
    console.warn("Erro ao tentar limpar/filtrar o Turno: ", e);
  }

  // SEÇÃO: Usa filtro completo
  try {
    reloadZoomFilterValuesDelay("FUN_SECAO_IDDESC_AD", filtroEmpresaFilial);
  } catch (e) { }

  // SINDICATOS
  try {
    reloadZoomFilterValuesDelay("FUN_IDDESCSIND", filtroEmpresaFilial);
    reloadZoomFilterValuesDelay("FUN_CODDESCSINDICATOFILIACAO", filtroEmpresaFilial);
  } catch (e) { }

  // CENTRO DE CUSTO
  try {
    reloadZoomFilterValuesDelay("FUN_CCIDDESC", filtroEmpresaFilial);
  } catch (e) { }

  // GRUPO QUIOSQUE
  try {
    reloadZoomFilterValuesDelay("FUN_CODQUIOSQUE_IDDESC", filtroEmpresaFilial);
  } catch (e) { }

  // CONTÁBIL / GERENCIAL
  try {
    reloadZoomFilterValuesDelay("FUN_INTEGRCONTABIL_IDDESC", filtroEmpresaFilial);
    reloadZoomFilterValuesDelay("FUN_INTEGRGERENCIAL_IDDESC", filtroEmpresaFilial);
  } catch (e) { }

  // RECARGA TOMADORES (Pai x Filho)
  var camposTomador = $('[name*="FUN_TOMADOR_NOME___"]');
  $(camposTomador).each(function () {
    var name = $(this).attr('name');
    try {
      reloadZoomFilterValuesDelay(name, filtroApenasEmpresa);
    }
    catch (ex) { };
  });

  // Outros Zooms independentes da estrutura
  try { reloadZoomFilterValuesDelay("FUN_AGENCIAFGTS_IDDESC_AD", "BANCO," + $('#FUN_BANCOFGTS').val()); } catch (ex) { };
  try { reloadZoomFilterValuesDelay("FUN_AGENCIA_IDDESC_AD", "BANCO," + $('#FUN_BANCO').val()); } catch (ex) { };
  try { reloadZoomFilterValuesDelay("FUN_AGENCIA_IDDESC_AD2", "BANCO," + $('#FUN_BANCO2').val()); } catch (ex) { };

  // RECARGA NÍVEL/FAIXA (se já houver função selecionada)
  try {
    if ($('#FUN_FUNCAO').val() != "" && $('#FUN_FUNCAO').val() != null) {
      reloadZoomFilterValuesDelay("FUN_NIVELFUNCAO", filtroApenasEmpresa + ",FUNCAO," + $('#FUN_FUNCAO').val());
    }
  } catch (e) { }

  try {
    if ($('#FUN_IDNIVELFUNCAO').val() != "" && $('#FUN_IDNIVELFUNCAO').val() != null) {
      reloadZoomFilterValuesDelay("FUN_FAIXASALARIAL", filtroApenasEmpresa + ",NIVEL," + $('#FUN_IDNIVELFUNCAO').val());
    }
  } catch (e) { }
}

function reloadZoomFilterValuesDelay(field, filter) {
  window.setTimeout(function () {
    try {
      // Verifica se o objeto do Fluig realmente existe antes de aplicar o filtro
      if (window[field] !== undefined) {
        reloadZoomFilterValues(field, filter);
      }
    } catch (e) {
      console.warn("Aviso [Zoom]: Ignorado filtro no campo '" + field + "'. O campo pode estar oculto ou inativo.");
    }
  }, 500);
}

function validarFilial(dataset) {
  // Esta função depende de Datasets que podem não estar disponíveis publicamente.
  // É mais seguro assumir que o filtro é necessário.
  return "true"; // Força a validação
}
function validarEmpresa(dataset) {
  // Mesma lógica da validarFilial
  return "true"; // Força a validação
}

// Funções de conversão (necessárias para o 'setSelectedZoomItem')
function numeroPorExtenso(valor) {
  var c = valor;
  var ex = [
    ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"],
    ["dez", "vinte", "trinta", "quarenta", "cinqüenta", "sessenta", "setenta", "oitenta", "noventa"],
    ["cem", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"],
    ["mil", "milhão", "bilhão", "trilhão", "quadrilhão", "quintilhão", "sextilhão", "setilhão", "octilhão", "nonilhão", "decilhão", "undecilhão", "dodecilhão", "tredecilhão", "quatrodecilhão", "quindecilhão", "sedecilhão", "septendecilhão", "octencilhão", "nonencilhão"]
  ];
  var a, n, v, i, n = c.replace(c ? /[^,\d]/g : /\D/g, "").split(","), e = " e ", $ = "real", d = "centavo", sl;
  for (var f = n.length - 1, l, j = -1, r = [], s = [], t = ""; ++j <= f; s = []) {
    j && (n[j] = (("." + n[j]) * 1).toFixed(2).slice(2));
    if (!(a = (v = n[j]).slice((l = v.length) % 3).match(/\d{3}/g), v = l % 3 ? [v.slice(0, l % 3)] : [], v = a ? v.concat(a) : v).length) continue;
    for (a = -1, l = v.length; ++a < l; t = "") {
      if (!(i = v[a] * 1)) continue;
      i % 100 < 20 && (t += ex[0][i % 100]) ||
        i % 100 + 1 && (t += ex[1][(i % 100 / 10 >> 0) - 1] + (i % 10 ? e + ex[0][i % 10] : ""));
      s.push((i < 100 ? t : !(i % 100) ? ex[2][i == 100 ? 0 : i / 100 >> 0] : (ex[2][i / 100 >> 0] + e + t)) +
        ((t = l - a - 2) > -1 ? " " + (i > 1 && t > 0 ? ex[3][t].replace("ão", "ões") : ex[3][t]) : ""));
    }
    a = ((sl = s.length) > 1 ? (a = s.pop(), s.join(" ") + e + a) : s.join("") || ((!j && (n[j + 1] * 1 > 0) || r.length) ? "" : ex[0][0]));
    a && r.push(a + (c ? (" " + (v.join("") * 1 > 1 ? j ? d + "s" : (/0{6,}$/.test(n[0]) ? "de " : "") + $.replace("l", "is") : j ? d : $)) : ""));
  }
  return r.join(e);
};

function dataAdmissaoPorExtenso(valor) {
  if (valor != "" && valor != null) {
    const ano = valor.split("/")[2];
    const mes = valor.split("/")[1];
    const dia = valor.split("/")[0];
    var time = new Date(ano + "-" + mes + "-" + dia + "T00:00:00");
    var outraData = new Date(time);
    var day = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][outraData.getDay()];
    var date = outraData.getDate();
    var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][outraData.getMonth()];
    var year = outraData.getFullYear();
    return (date + " de " + month + " de " + year);
  }
  else
    return "";
};

// Esta função é do 1007 e pode ser necessária.
function setValueFromPublicForm(field) {
  // Em ambiente não-widget (como o seu 14154), apenas retorna o valor do campo.
  return $('#' + field).val();
};

// Adiciona os gatilhos (event handlers) para os novos campos
$(document).ready(function () {
  // Adiciona lógica de data para os novos campos
  // (O seu 'criaDatepickers' já cobre isso, mas precisamos adicionar os novos botões)
  $("button[data-date-picker-id]").on("click", function () {
    var inputId = $(this).data("date-picker-id");
    $("#" + inputId).datepicker("show");
  });

  // Gatilhos de lógica de negócio
  $("#FUN_TPCONTR").on("change", function (event) {
    const tipoContrato = event.target.value;
    // Simplificado: no seu form 14154, parece que você só quer mostrar/ocultar
    // o campo 'txtInicioExperiencia' (Fim Período de Experiência)
    if (tipoContrato == "3") { // 3 = Experiência
      $("#txtInicioExperiencia").closest(".col-md-2").show();
    } else {
      $("#txtInicioExperiencia").closest(".col-md-2").hide();
      $("#txtInicioExperiencia").val("");
    }
    // A lógica de datas (VENCEXP1, VENCEXP2) do 1007 foi omitida por ser muito complexa
    // e depender de outros campos que não migramos.
  });

  $("#FUN_ADMISSAO").on("change", function (event) {
    let dataAdmissao = event.target.value;
    $("#FUN_DATABASE").val(dataAdmissao);
    $("#FUN_ADMISSAO_EXTENSO_AD").val(dataAdmissaoPorExtenso(dataAdmissao));
    if (dataAdmissao) {
      if (!$("#cpDataOpcaoFGTS").val()) {
        $("#cpDataOpcaoFGTS").val(dataAdmissao);
      }

      if (!$("#cpDataUltimoSaldoFGTS").val()) {
        $("#cpDataUltimoSaldoFGTS").val(dataAdmissao);
      }
    }

    if (!$("#cpValorSaldoFGTS").val()) {
      $("#cpValorSaldoFGTS").val("0,00");
    }

    if (!$("#cpSaldoFGTSFinsRescisorios").val()) {
      $("#cpSaldoFGTSFinsRescisorios").val("0,00");
    }
  });

  function somenteNumerosComplementar(valor) {
    return String(valor || "").replace(/\D/g, "");
  }

  function preencherCodigoUsuarioPortalPonto() {
    var cpf = somenteNumerosComplementar($("#cpfcnpj").val());

    if (cpf && !$("#cpCodigoUsuarioPortalPonto").val()) {
      $("#cpCodigoUsuarioPortalPonto").val(cpf);
    }
  }

  function preencherNomeUsuarioPortalPonto() {
    var nomeAtual = $.trim(String($("#cpNomeUsuarioPortalPonto").val() || ""));

    if (nomeAtual) {
      return;
    }

    var nome = $.trim(String($("#txtNomeColaborador").val() || $("#txtNomeSocial").val() || ""));

    if (nome) {
      $("#cpNomeUsuarioPortalPonto").val(nome);
    }
  }

  $("#cpfcnpj").on("change blur", function () {
    preencherCodigoUsuarioPortalPonto();
  });

  $("#txtNomeColaborador, #txtNomeSocial").on("change blur", function () {
    preencherNomeUsuarioPortalPonto();
  });

  preencherCodigoUsuarioPortalPonto();
  preencherNomeUsuarioPortalPonto();

  if (!$("#cpValorSaldoFGTS").val()) {
    $("#cpValorSaldoFGTS").val("0,00");
  }

  if (!$("#cpSaldoFGTSFinsRescisorios").val()) {
    $("#cpSaldoFGTSFinsRescisorios").val("0,00");
  }

  $('#FUN_HRMENSAIS').on('blur', function () {
    var horasMes = Number($(this).val());
    var horasSemana = horasMes / 5;
    var horasDia = horasMes / 30;
    $('#FUN_HRSEMANAIS').val(horasSemana.toFixed(2));
    $('#FUN_HRDIAS').val(horasDia.toFixed(4));
  });

  // Esta lógica já existe no seu view.js, mas os campos ocultos são necessários.
  $("#FUN_NOME").on('change', (event) => {
    let nome = event.target.value;
    let cpf = $("#cpfcnpj").val(); // Pega o CPF do seu campo existente
    $("#FUN_CPFNOME").val(cpf + " - " + nome);
    $("#FUN_CPFNOMECC").val(cpf + " - " + nome + " - " + $('#FUN_CC').val() + " - " + $('#FUN_CCDESC').val());
  });

  $("#FUN_NASCIMENTO").on('change', (event) => {
    // Esta lógica é do 1007, mas seu campo de data de nascimento é 'dtDataNascColaborador'
    // Vamos adaptar para usar o seu campo
  });

  // Adaptação da lógica acima para o seu campo:
  $("#dtDataNascColaborador").on('change', (event) => {
    let dataNascimento = event.target.value;
    // Preenche o campo oculto 'FUN_IDADE_AD' (se existir)
    try {
      const ano = dataNascimento.split("/")[2];
      const mes = dataNascimento.split("/")[1];
      const dia = dataNascimento.split("/")[0];
      let idade = getAge(ano, mes, dia); // getAge não foi copiada, vamos adicionar
      $("#FUN_IDADE_AD").val(idade);
    } catch (e) { }
  });

  // Adiciona a função getAge que faltou
  const getAge = (ano, mes, dia) => {
    let d = new Date();
    let ano_atual = d.getFullYear();
    let mes_atual = d.getMonth() + 1;
    let dia_atual = d.getDate();
    let quantos_anos = ano_atual - ano;
    if ((mes_atual < mes) || (mes_atual == mes && dia_atual < dia)) quantos_anos--;
    return quantos_anos < 0 ? 0 : quantos_anos;
  };

  // 1. Função que aplica a regra de visibilidade
  function aplicarRegraParecer() {
    var valor = $("#cpAprovacaoAdmissao").val();

    // Regra: Só mostra o parecer se for "3" (Solicitar Correção).
    // Se for "1" (Aprovar), vazio "" (Selecione) ou qualquer outra coisa, oculta.
    if (valor == "3" || valor == "Corrigir") {
      $("#div_parecer_rh").show();
    } else {
      $("#div_parecer_rh").hide();
    }
  }

  // 2. Monitora mudança no select de Aprovação
  $("#cpAprovacaoAdmissao").on("change", function () {
    aplicarRegraParecer();
  });

  // 3. Executa a regra ao carregar a página (para garantir estado inicial correto)
  if ($("#cpAprovacaoAdmissao").length > 0) {
    aplicarRegraParecer();
  }

  // Recupera a atividade atual via objeto da API do Fluig no Front-end
  var atividadeAtual = window.parent.ECM.workflowView ? window.parent.ECM.workflowView.sequence : 0;

});

//   var pastaRaizId = 3479; // ID da pasta raiz onde as pastas dos candidatos devem ser criadas

//   // Recuperamos os campos mapeados no seu formulário
//   var nomeCandidato = $("#txtNomeColaborador").val();
//   var cpfCandidato = $("#cpfcnpjValue").val();

//   // Concatena para formar o nome da pasta (Ex: "João da Silva - 12345678900")
//   var nomePastaDestino = nomeCandidato + " - " + cpfCandidato;

//   var folderExiste = false;
//   var folderDestinoId = $("#cpIdPastaGedCandidato").val(); // Tenta ler se já criámos antes

//   // 1. Se não tiver ID no campo, pesquisa na API se a pasta já existe
//   if (!folderDestinoId || folderDestinoId == "") {
//       $.ajax({
//         method: "GET",
//         url: "/api/public/ecm/document/listDocument/" + pastaRaizId + "?limit=9999",
//         contentType: "application/json",
//         async: false,
//         success: function (result) {
//           var content = result.content;
//           for (var i = 0; i < content.length; i++) {
//             if (content[i].description == nomePastaDestino) {
//               folderExiste = true;
//               folderDestinoId = content[i].id;
//               break;
//             }
//           }
//         },
//         error: function (x, e) {
//           console.error("Erro ao verificar pasta no GED: ", x);
//         }
//       });

//       // 2. Se a pasta não existir no GED, consome a API de criação
//       if (!folderExiste) {
//         var dados = {
//           "description": nomePastaDestino,
//           "parentId": pastaRaizId,
//         };

//         $.ajax({
//           method: 'POST',
//           url: '/api/public/ecm/document/createFolder/',
//           contentType: 'application/json;charset=utf-8',
//           dataType: 'json',
//           async: false,
//           data: JSON.stringify(dados),
//           success: function (data) {
//             folderDestinoId = data.content.id;
//           },
//           error: function (x, e, s) {
//             console.error("Erro ao criar a pasta no GED: ", x);
//           }
//         });
//       }

//       // 3. Salva o ID da pasta pai no formulário
//       $("#cpIdPastaGedCandidato").val(folderDestinoId);
//   }

//   // =========================================================================
//   // 4. CRIAÇÃO DAS SUBPASTAS DENTRO DA PASTA DO CANDIDATO
//   // =========================================================================
//   if (folderDestinoId && folderDestinoId != "") {
//       criarSubpastaSeNaoExistir("1. Documentos do Candidato", "cpIdPastaDocsCandidato", folderDestinoId);
//       criarSubpastaSeNaoExistir("2. Documentos Gerados (Kit)", "cpIdPastaDocsGerados", folderDestinoId);
//       criarSubpastaSeNaoExistir("3. Documentos Assinados", "cpIdPastaDocsAssinados", folderDestinoId);
//   }
// }

// // Função auxiliar para criar subpastas garantindo que não cria duplicados
// function criarSubpastaSeNaoExistir(nomeSubpasta, idCampoHidden, idPastaPai) {
//     // Se o campo oculto já tem um ID, é porque a pasta já foi criada nesta solicitação
//     if ($("#" + idCampoHidden).val() != "") {
//         return; 
//     }

//     var dadosSub = {
//         "description": nomeSubpasta,
//         "parentId": parseInt(idPastaPai),
//     };

//     $.ajax({
//         method: 'POST',
//         url: '/api/public/ecm/document/createFolder/',
//         contentType: 'application/json;charset=utf-8',
//         dataType: 'json',
//         async: false,
//         data: JSON.stringify(dadosSub),
//         success: function (data) {
//             // Guarda o ID da nova subpasta no formulário
//             $("#" + idCampoHidden).val(data.content.id);
//             console.log(">>> Subpasta '" + nomeSubpasta + "' criada com ID: " + data.content.id);
//         },
//         error: function (x, e, s) {
//             console.error("Erro ao criar a subpasta '" + nomeSubpasta + "': ", x);
//         }
//     });
// }

// Gatilho que escuta quando o usuário digita/sai do campo de CPF, Nome ou Data na aba de Dependentes

$(document).ready(function () {

  // 2. Dispara o cálculo automaticamente assim que a data mudar ou sair do campo
  $('#dtDataNascColaborador').on('change blur', function () {
    // Se ainda for usar a função legada "PegaValorData", chamamos ela aqui para evitar erros
    if (typeof PegaValorData === "function") {
      PegaValorData();
    }

    calcularIdade();
  });

});

// Função aprimorada para o cálculo
function calcularIdade() {
  var dataNascStr = $("#dtDataNascColaborador").val();

  // Só calcula se tiver digitado a data completa (ex: 01/01/1990 tem 10 caracteres)
  if (dataNascStr && dataNascStr.length === 10) {
    var partes = dataNascStr.split("/");
    var dia = parseInt(partes[0], 10);
    var mes = parseInt(partes[1], 10) - 1; // Mês no JS começa em zero
    var ano = parseInt(partes[2], 10);

    var dataNasc = new Date(ano, mes, dia);
    var hoje = new Date();

    var idade = hoje.getFullYear() - dataNasc.getFullYear();
    var diferencaMes = hoje.getMonth() - dataNasc.getMonth();

    // Subtrai 1 da idade se o mês atual for menor que o mês do aniversário,
    // ou se for o mês do aniversário mas o dia ainda não chegou.
    if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }

    $("#Idade").val(idade);
  } else {
    $("#Idade").val(""); // Deixa vazio se a data estiver apagada ou incompleta
  }
}

// Função para replicar o Nome Completo para o Nome Social
function replicarNomeSocial() {
  var nomeCompleto = $("#txtNomeColaborador").val();
  var nomeSocial = $("#txtNomeSocial").val();

  // Só replica se o Nome Social ainda estiver em branco. 
  // Assim, se o usuário alterar o Nome Social depois, nós não sobrescrevemos a alteração dele.
  if (nomeCompleto && nomeSocial === "") {
    $("#txtNomeSocial").val(nomeCompleto);
  }
}

function aplicarBloqueioDadosContratacaoPorJornada() {
  var atvAtual = typeof getWKNumState !== "undefined" ? getWKNumState() : 0;
  var etapaEditavel = atvAtual == 0 || atvAtual == 1 || atvAtual == 41;
  var jornada = $.trim($("#cpJornadaAdmissao").val() || "");
  var $container = $("#containerDadosContratacaoDependentes");
  var idsLiberadosSemJornada = {
    cpJornadaAdmissao: true,
    IDDESC_EMPRESAFILIAL: true,
    FUN_EMPRESA: true,
    FUN_FILIAL: true,
    FUN_NOMECOMERCIAL_FILIAL: true,
    FUN_CNPJ_FILIAL: true,
    FUN_LOGRADOURO_FILIAL: true,
    FUN_NUMERO_FILIAL: true,
    FUN_COMPLEMENTO_FILIAL: true,
    FUN_BAIRRO_FILIAL: true,
    FUN_CIDADE_FILIAL: true,
    FUN_ESTADO_FILIAL: true,
    FUN_CEP_FILIAL: true
  };

  if (!etapaEditavel || !$container.length) {
    return;
  }

  var $campos = $container.find("input, select, textarea, button").filter(function () {
    var $campo = $(this);

    if ($campo.is('[type="hidden"]')) {
      return false;
    }

    if (idsLiberadosSemJornada[$campo.attr("id")]) {
      return false;
    }

    if ($campo.closest(".hide").length > 0) {
      return false;
    }

    return true;
  });

  function salvarAtributoOriginal($alvo, nomeAtributo, valor) {
    if ($alvo.attr(nomeAtributo) === undefined) {
      $alvo.attr(nomeAtributo, valor);
    }
  }

  function aplicarVisualZoom($campo, bloqueado) {
    var campoId = $campo.attr("id");
    if (!campoId) {
      return;
    }

    var $select2 = $("#s2id_" + campoId);
    if (!$select2.length) {
      return;
    }

    var $choice = $select2.find(".select2-choice");
    salvarAtributoOriginal($select2, "data-jornada-original-style", $select2.attr("style") || "");
    salvarAtributoOriginal($choice, "data-jornada-original-style", $choice.attr("style") || "");

    if (bloqueado) {
      $select2.addClass("select2-container-disabled");
      $choice.css({ "background-color": "#f3f4f6", "cursor": "not-allowed", "pointer-events": "none" });
      return;
    }

    var select2Style = $select2.attr("data-jornada-original-style");
    var choiceStyle = $choice.attr("data-jornada-original-style");
    if (select2Style === "") {
      $select2.removeAttr("style");
    } else if (select2Style !== undefined) {
      $select2.attr("style", select2Style);
    }

    if (choiceStyle === "") {
      $choice.removeAttr("style");
    } else if (choiceStyle !== undefined) {
      $choice.attr("style", choiceStyle);
    }

    if ($campo.prop("disabled")) {
      $select2.addClass("select2-container-disabled");
    } else {
      $select2.removeClass("select2-container-disabled");
    }

    $select2.removeAttr("data-jornada-original-style");
    $choice.removeAttr("data-jornada-original-style");
  }

  function aplicarVisualCampo($campo, bloqueado) {
    salvarAtributoOriginal($campo, "data-jornada-original-style", $campo.attr("style") || "");

    var $addon = $campo.closest(".input-group").find(".input-group-addon");
    if ($addon.length) {
      salvarAtributoOriginal($addon, "data-jornada-original-style", $addon.attr("style") || "");
    }

    if (bloqueado) {
      $campo.css({ "pointer-events": "none", "background-color": "#f3f4f6", "cursor": "not-allowed" });
      if ($addon.length) {
        $addon.css({ "pointer-events": "none", "background-color": "#f3f4f6", "cursor": "not-allowed" });
      }
      return;
    }

    var estiloOriginal = $campo.attr("data-jornada-original-style");
    if (estiloOriginal === "") {
      $campo.removeAttr("style");
    } else if (estiloOriginal !== undefined) {
      $campo.attr("style", estiloOriginal);
    }

    if ($addon.length) {
      var estiloAddon = $addon.attr("data-jornada-original-style");
      if (estiloAddon === "") {
        $addon.removeAttr("style");
      } else if (estiloAddon !== undefined) {
        $addon.attr("style", estiloAddon);
      }
      $addon.removeAttr("data-jornada-original-style");
    }

    $campo.removeAttr("data-jornada-original-style");
  }

  function bloquearCampo($campo) {
    var jaBloqueadoPelaJornada = $campo.attr("data-bloqueio-jornada") === "true";

    if (!jaBloqueadoPelaJornada) {
      salvarAtributoOriginal($campo, "data-jornada-original-disabled", $campo.prop("disabled") ? "true" : "false");
      salvarAtributoOriginal($campo, "data-jornada-original-readonly", $campo.prop("readonly") ? "true" : "false");
      $campo.attr("data-bloqueio-jornada", "true");
    }

    var campoId = $campo.attr("id");
    var isZoom = $campo.is('[type="zoom"]');
    var usaDisabled = isZoom || $campo.is("select, button");

    if (usaDisabled) {
      $campo.prop("disabled", true).attr("disabled", "disabled");
    } else {
      $campo.prop("readonly", true).attr("readonly", "readonly");
    }

    if (isZoom && campoId && typeof changeZoomState === "function") {
      changeZoomState(campoId, true);
      aplicarVisualZoom($campo, true);
    }

    aplicarVisualCampo($campo, true);
  }

  function liberarCampo($campo) {
    if ($campo.attr("data-bloqueio-jornada") !== "true") {
      return;
    }

    var originalDisabled = $campo.attr("data-jornada-original-disabled") === "true";
    var originalReadonly = $campo.attr("data-jornada-original-readonly") === "true";
    var campoId = $campo.attr("id");
    var isZoom = $campo.is('[type="zoom"]');

    if (isZoom && campoId && typeof changeZoomState === "function") {
      changeZoomState(campoId, originalDisabled);
    }

    $campo.prop("disabled", originalDisabled);
    if (originalDisabled) {
      $campo.attr("disabled", "disabled");
    } else {
      $campo.removeAttr("disabled");
    }

    $campo.prop("readonly", originalReadonly);
    if (originalReadonly) {
      $campo.attr("readonly", "readonly");
    } else {
      $campo.removeAttr("readonly");
    }

    aplicarVisualCampo($campo, false);
    if (isZoom) {
      aplicarVisualZoom($campo, false);
    }

    $campo.removeAttr("data-bloqueio-jornada");
    $campo.removeAttr("data-jornada-original-disabled");
    $campo.removeAttr("data-jornada-original-readonly");
  }

  function liberarEmpresaFilialSemJornada() {
    var $empresaFilial = $("#IDDESC_EMPRESAFILIAL");

    $empresaFilial.prop("disabled", false).removeAttr("disabled");

    if (typeof changeZoomState === "function") {
      changeZoomState("IDDESC_EMPRESAFILIAL", false);
    }

    aplicarVisualZoom($empresaFilial, false);
    aplicarVisualCampo($empresaFilial, false);
  }

  if (jornada === "") {
    $campos.each(function () {
      bloquearCampo($(this));
    });
    liberarEmpresaFilialSemJornada();
    return;
  }

  liberarEmpresaFilialSemJornada();

  $campos.filter('[data-bloqueio-jornada="true"]').each(function () {
    liberarCampo($(this));
  });
}

// =========================================================================
// MOTOR UNIFICADO DO PAINEL DE CONTRATO DE TRABALHO
// =========================================================================
function gerenciarPainelContrato(alteracaoManualUser) {
  var jornada = $("#cpJornadaAdmissao").val();
  var prazo = $("#cpContratoPrazo").val();

  // 1. Verifica se a tela está editável (atividades 0, 1, 41)
  var atvAtual = (typeof getWKNumState !== 'undefined') ? getWKNumState() : 0;
  var isEditavel = (atvAtual == 0 || atvAtual == 1 || atvAtual == 41);

  // 2. DEFINIR VALORES FORÇADOS
  if (jornada === "Estagio" || jornada === "Estágio") {
    $("#cpTipoContrato").val("TCE");
    if (isEditavel) $("#cpContratoPrazo").val("determinado");
    prazo = "determinado";
  } else if (jornada === "CLT") {
    $("#cpTipoContrato").val("Individual");
  }

  // 3. LIMPEZA INTELIGENTE
  if (alteracaoManualUser === true && isEditavel) {
    if (prazo !== "determinado") {
      $("#cpTerminoContrato, #cpClausulaAssecuratoria").val("");
    }
    if (prazo !== "experiencia") {
      $("#cpDiasVencPrimeiraExp, #cpVencPrimeiraExp, #cpDiasVencSegundaExp, #cpVencSegundaExp").val("");
    }
    if (jornada !== "CLT") {
      $("#cpClausulaAssecuratoria, #cpComplementoContrato").val("");
    }
  }

  // 4. VISIBILIDADE 
  var $containerTermino = $("#cpTerminoContrato").closest("div[class*='col-']");
  var $containerClausula = $("#cpClausulaAssecuratoria").closest("div[class*='col-']");
  var $containerExp = $("#cpDiasVencPrimeiraExp").closest(".row");
  var $containerComplemento = $("#cpComplementoContrato").closest(".row");

  $containerTermino.hide(); $containerClausula.hide(); $containerExp.hide(); $containerComplemento.hide();

  if (prazo === "determinado") {
    $containerTermino.show();
    if (jornada === "CLT") $containerClausula.show();
    $containerComplemento.show();
  } else if (prazo === "experiencia") {
    $containerExp.show(); $containerComplemento.show();
  } else if (prazo === "indeterminado") {
    $containerComplemento.show();
  }

  // 5. TRAVAS DE EDIÇÃO FRONT-END
  if (isEditavel) {
    // A) Libera campos de digitação
    $("#cpTerminoContrato, #cpClausulaAssecuratoria, #cpDiasVencPrimeiraExp, #cpDiasVencSegundaExp, #cpComplementoContrato")
      .removeAttr("readonly").prop("disabled", false).css({ "pointer-events": "auto", "background-color": "#ffffff" });

    // B) Bloqueia datas de experiência para o cálculo rodar automático
    $("#cpVencPrimeiraExp, #cpVencSegundaExp").attr("readonly", true).prop("disabled", false).css({ "pointer-events": "none", "background-color": "#eeeeee" });
    $("#cpVencPrimeiraExp, #cpVencSegundaExp").closest(".input-group").find(".input-group-addon").css("pointer-events", "none");

    // C) Trava do tipo de Contrato
    if (jornada === "Estagio" || jornada === "Estágio") {
      $("#cpContratoPrazo").attr("readonly", true).css("pointer-events", "none");
    } else {
      $("#cpContratoPrazo").removeAttr("readonly").css("pointer-events", "auto");
    }
  } else {
    // Blinda painel inteiro em visualização
    $("#cpContratoPrazo, #cpTerminoContrato, #cpClausulaAssecuratoria, #cpDiasVencPrimeiraExp, #cpVencPrimeiraExp, #cpDiasVencSegundaExp, #cpVencSegundaExp, #cpComplementoContrato")
      .attr("readonly", true).css({ "pointer-events": "none", "background-color": "#f9f9f9" });
  }
}

// Função para mostrar/esconder documentos na Atividade e gerir o bloqueio inicial dos ficheiros
function exibeDocumentosPorJornadaKit() {
  var jornada = $("#cpJornadaAdmissao").val();
  var filial = $("#FUN_NOMECOMERCIAL_FILIAL").val();
  var numCnh = $("#CARTMOTORISTA").val() || "";
  var temDependente = $("input[id^='txtNomDepen___']").length > 0;

  // Puxa o nome da seção (Busca no campo oculto de descrição ou no próprio Zoom)
  var secao = String($("#FUN_SECAO_DESC_AD").val() || $("#FUN_SECAO_IDDESC_AD").val() || "").toUpperCase();

  // A) Documentos que aparecem para AMBOS (CLT e Estágio)
  // NDA foi removido daqui para ser validado como condicional
  var docsAmbos = [
    "#container_termo_sigilo"
  ];

  // B) Documentos padrão CLT
  var docsCLT = [
    "#container_contrato",
    "#container_compensacao_horas",
    "#container_prorrogacao_horas",
    "#container_renuncia_vt",
    "#container_solicitacao_vt",
    "#container_ficha_registro"
  ];

  // C) Documentos exclusivos ESTÁGIO
  var docsEstagio = [
    "#container_tce"
  ];

  // D) Documentos Condicionais (Agrupados para o hide global)
  var docsCondicionais = [
    "#container_ponto_excecao",
    "#container_termo_veiculo",
    "#container_encargos_ir",
    "#container_salario_familia",
    "#container_termo_responsabilidade",
    "#container_termo_nda" // <-- NDA adicionado aos condicionais
  ];

  // 1. Esconde ABSOLUTAMENTE TUDO antes de validar
  $(docsAmbos.join(", ") + ", " + docsCLT.join(", ") + ", " + docsEstagio.join(", ") + ", " + docsCondicionais.join(", ")).hide();

  // LÓGICA DO NDA: Verifica se a seção exige confidencialidade
  var exigeNDA = secao.indexOf("TIME FINANCEIRO") > -1 ||
    secao.indexOf("TIME DE SUPRIMENTOS") > -1 ||
    secao.indexOf("TIME RH") > -1;

  // 2. Valida a exibição por Jornada
  if (jornada === "CLT") {
    $(docsAmbos.join(", ")).show();
    $(docsCLT.join(", ")).show();

    // REGRA 1: Ponto por Exceção
    // TODO: Definir regras de filial Monte Bravo após reunião
    // Por enquanto, a regra de exibição do Ponto por Exceção está desabilitada
    // $("#container_ponto_excecao").show();

    // REGRA 2: Termo de Veículo
    if (numCnh.trim() !== "") {
      $("#container_termo_veiculo").show();
    }

    // REGRA 3: Dependentes
    if (temDependente) {
      $("#container_encargos_ir").show();
      $("#container_salario_familia").show();
      $("#container_termo_responsabilidade").show();
    }

    // REGRA 4: NDA (Para CLT)
    if (exigeNDA) {
      $("#container_termo_nda").show();
    }

  } else if (jornada === "Estágio" || jornada === "Estagio") {
    $(docsAmbos.join(", ")).show();
    $(docsEstagio.join(", ")).show();

    // REGRA 4: NDA (Para Estágio também!)
    if (exigeNDA) {
      $("#container_termo_nda").show();
    }
  }

  // ====================================================================
  // 3. MANTÉM O LOOP DE TRAVAS DE SEGURANÇA ORIGINAL
  // ====================================================================
  var atividadeAtual = (typeof getWKNumState !== 'undefined') ? getWKNumState() : 0;
  var podeEditar = (atividadeAtual == 0 || atividadeAtual == 4 || atividadeAtual == 41 || atividadeAtual == 135);

  $("input[id^='id_pdf_kit_']").each(function () {
    var idAttr = $(this).attr("id");
    if (idAttr.indexOf("kit_dyn_") > -1) return;
    var idPdf = $(this).val();
    var prefix = idAttr.replace("id_pdf_", "");

    if (idPdf && idPdf !== "") {
      $("#btn_ver_" + prefix).show();
      if (podeEditar) $("#btn_excluir_" + prefix).show(); else $("#btn_excluir_" + prefix).hide();
      $("#file_" + prefix).prop("disabled", true).css("pointer-events", "none");
      if (typeof changeZoomState === "function") changeZoomState("zoom_" + prefix, true);
    } else {
      $("#btn_ver_" + prefix).hide();
      $("#btn_excluir_" + prefix).hide();
      if (podeEditar) $("#file_" + prefix).prop("disabled", false).css("pointer-events", "auto");
    }
  });
}

// ==========================================================
// CÁLCULOS AUTOMÁTICOS DE RH (VALOR HORA, SEMANA E DIA)
// ==========================================================
$(document).ready(function () {
  function calcularCamposRH() {
    var salarioStr = $("#FUN_VLRSALARIO").val() || "0";
    var horasMesStr = $("#cpQtdHorasMes").val() || "0";

    // Limpa os pontos e converte vírgula para ponto
    var salarioNum = parseFloat(salarioStr.replace(/\./g, "").replace(",", ".")) || 0;
    var horasMesNum = parseFloat(horasMesStr.replace(",", ".")) || 0;

    if (horasMesNum > 0) {
      // 1. CÁLCULO DO VALOR HORA
      if (salarioNum > 0) {
        var valorHora = salarioNum / horasMesNum;
        var valorHoraFormatado = valorHora.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        $("#FUN_VALORHORA").val(valorHoraFormatado);
      } else {
        $("#FUN_VALORHORA").val("");
      }

      // 2. CÁLCULO DE HORAS SEMANAIS E DIÁRIAS
      // Base de mercado: 220h Mês = 44h Semana = 8h Dia
      var horasSemana = horasMesNum / 5;          // Ex: 220 / 5 = 44
      var horasDia = horasMesNum / 27.5;          // Ex: 220 / 27.5 = 8

      // Formata os números (remove dízimas infinitas caso existam)
      var strSemana = Number.isInteger(horasSemana) ? horasSemana : horasSemana.toFixed(2);
      var strDia = Number.isInteger(horasDia) ? horasDia : horasDia.toFixed(2);

      // Troca o ponto por vírgula para manter o padrão Brasileiro e envia para a tela
      $("#cpQtdHorasSemana").val(strSemana.toString().replace(".", ","));
      $("#cpQtdHorasDia").val(strDia.toString().replace(".", ","));
    } else {
      // Limpa os campos se as Horas do Mês forem zeradas ou apagadas
      $("#FUN_VALORHORA").val("");
      $("#cpQtdHorasSemana").val("");
      $("#cpQtdHorasDia").val("");
    }
  }

  // Dispara os cálculos sempre que o usuário digitar/alterar o Salário ou as Horas do Mês
  $(document).on("change blur", "#FUN_VLRSALARIO, #cpQtdHorasMes", function () {
    calcularCamposRH();
  });
});


$(document).ready(function () {
  setTimeout(function () {
    // Agora a função de Jornada roda em TODAS as etapas (inclusive a 97 do RH)
    // E roda com 800ms de atraso para não ser "atropelada" pelo desbloqueio automático da tela
    gerenciarPainelContrato(false)
    exibeDocumentosPorJornadaKit();
    aplicarBloqueioDadosContratacaoPorJornada();
  }, 800);
});

// =========================================================================
// MOTOR DE CRIAÇÃO DE PASTAS NO GED (FRONT-END)
// =========================================================================
$(document).ready(function () {
  var atividadeAtual = window.parent.ECM.workflowView ? window.parent.ECM.workflowView.sequence : 0;

  // Dispara na atividade do Kit (135) E nas atividades iniciais (0, 4, 41)
  if (atividadeAtual == 0 || atividadeAtual == 4 || atividadeAtual == 41 || atividadeAtual == 135) {

    // Tenta criar logo que a tela abre (útil se estiver a reabrir a ficha)
    setTimeout(gerenciarPastaCandidato, 2000);

    // Se estiver na etapa inicial, cria/atualiza as pastas assim que o RH preencher o CPF
    $("#cpfcnpj").on("blur change", function () {
      setTimeout(gerenciarPastaCandidato, 1000);
    });
  }
});

function calcularVencimentosExperiencia() {
  var dataAdmissaoStr = $("#cpDataPrevisaoAdmissao").val() || $("#FUN_ADMISSAO").val();
  console.log("[Experiencia] calcularVencimentosExperiencia chamado:", {
    dataAdmissao: dataAdmissaoStr,
    dias1: $("#cpDiasVencPrimeiraExp").val(),
    dias2: $("#cpDiasVencSegundaExp").val(),
    cpContratoPrazo: $("#cpContratoPrazo").val()
  });

  if (!dataAdmissaoStr || dataAdmissaoStr.indexOf("_") > -1 || dataAdmissaoStr.length !== 10) {
    $("#cpVencPrimeiraExp, #cpVencSegundaExp").val("").trigger("change");
    console.log("[Experiencia] Resultado:", {
      cpVencPrimeiraExp: $("#cpVencPrimeiraExp").val(),
      cpVencSegundaExp: $("#cpVencSegundaExp").val()
    });
    return;
  }

  var partes = dataAdmissaoStr.split('/');
  var dataBase = new Date(partes[2], partes[1] - 1, partes[0]);
  var dias1 = parseInt($("#cpDiasVencPrimeiraExp").val()) || 0;

  if (dias1 > 0) {
    var dataVenc1 = new Date(dataBase.getTime());
    dataVenc1.setDate(dataVenc1.getDate() + (dias1 - 1));
    $("#cpVencPrimeiraExp").val(formatarDataParaBR(dataVenc1)).trigger("change");

    var dias2 = parseInt($("#cpDiasVencSegundaExp").val()) || 0;
    if (dias2 > 0) {
      var dataVenc2 = new Date(dataBase.getTime());
      dataVenc2.setDate(dataVenc2.getDate() + (dias1 + dias2 - 1));
      $("#cpVencSegundaExp").val(formatarDataParaBR(dataVenc2)).trigger("change");
    } else {
      $("#cpVencSegundaExp").val("").trigger("change");
    }
  } else {
    $("#cpVencPrimeiraExp").val("").trigger("change");
    $("#cpVencSegundaExp").val("").trigger("change");
  }

  console.log("[Experiencia] Resultado:", {
    cpVencPrimeiraExp: $("#cpVencPrimeiraExp").val(),
    cpVencSegundaExp: $("#cpVencSegundaExp").val()
  });
}

// Função auxiliar para formatar a data calculada de volta para DD/MM/YYYY
function formatarDataParaBR(data) {
  var dia = data.getDate().toString();
  var mes = (data.getMonth() + 1).toString(); // Meses começam em 0 no JS
  var ano = data.getFullYear();

  // Adiciona o zero à esquerda se for menor que 10
  if (dia.length === 1) dia = '0' + dia;
  if (mes.length === 1) mes = '0' + mes;

  return dia + '/' + mes + '/' + ano;
}

// ====================================================================
// WIDGET FLUTUANTE: "COLA" DOS DADOS DO ATS
// ====================================================================
function criarBalaoResumoATS(dados) {
  if ($("#balaoATS").length > 0) return;

  // Dicionário para deixar os nomes técnicos bonitos para o RH ler
  var dicionarioATS = {
    "nomeCandidato": "Nome",
    "cpf": "CPF",
    "email": "E-mail",
    "telefone": "Telefone",
    "cargoAprovado": "Cargo",
    "departamento": "Departamento",
    "jornada": "Jornada",
    "cnpjFilial": "CNPJ",
    "dataNascimento": "Nascimento",
    "dataContratacao": "Prev. Admissão",
    "statusATS": "Status ATS",
    "codRequisicaoATS": "ID Req. ATS",
    "codRequisicaoERP": "ID Req. ERP",
    "deficienciaFisica": "Def. Física",
    "deficienciaVisual": "Def. Visual",
    "deficienciaAuditiva": "Def. Auditiva",
    "deficienciaIntelectual": "Def. Intelectual"
  };

  var html = `
    <div id="balaoATS" style="position: fixed; bottom: 14px; right: 120px; width: 320px; background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; box-shadow: 0 -5px 25px rgba(0,0,0,0.15); z-index: 100000; font-family: 'Inter', sans-serif; overflow: hidden;">
        
        <div onclick="$('#conteudoBalaoATS').slideToggle(200);" style="background: linear-gradient(135deg, #198754 0%, #146c43 100%); color: #fff; padding: 0 16px; height: 31.6px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s;" title="Clique para abrir/fechar a cola">
            <span style="display: flex; align-items: center; gap: 8px;">
                <i class="fluigicon fluigicon-user-config icon-sm"></i> Dados do ATS
            </span>
            <div><i class="fluigicon fluigicon-chevron-up icon-sm"></i></div>
        </div>

        <div id="conteudoBalaoATS" style="display: none; padding: 10px; max-height: 400px; overflow-y: auto; font-size: 11px; background: #FAFAFA;">
            <table style="width: 100%; border-collapse: collapse;">
                <tbody>`;

  $.each(dados, function (key, value) {
    // Só exibe se a chave existir no nosso dicionário (ignora IDs de sistema soltos)
    var label = dicionarioATS[key];

    if (label && value !== "" && value !== null) {
      var valorExibicao = value;

      // Tratamento 1: Transforma 0 e 1 das deficiências em Sim/Não
      if (key.indexOf("deficiencia") > -1) {
        if (valorExibicao === "0") valorExibicao = "Não";
        if (valorExibicao === "1") valorExibicao = "Sim";
      }

      // Tratamento 2: Formata as datas (de YYYY-MM-DD para DD/MM/YYYY)
      if (typeof valorExibicao === "string" && valorExibicao.match(/^\d{4}-\d{2}-\d{2}$/)) {
        var p = valorExibicao.split('-');
        valorExibicao = p[2] + '/' + p[1] + '/' + p[0];
      }

      html += `
                <tr style="border-bottom: 1px solid #E5E7EB;">
                    <td style="padding: 6px 4px; font-weight: 600; color: #6B7280; width: 40%; word-break: keep-all;">${label}</td>
                    <td style="padding: 6px 4px; color: #111827; word-break: break-word;">${valorExibicao}</td>
                </tr>`;
    }
  });

  html += `
                </tbody>
            </table>
        </div>
    </div>`;

  $('body').append(html);
}
// ========================================================================
// EVENTO NATIVO FLUIG: Dispara imediatamente antes de salvar ou avançar
// ========================================================================
var beforeSendValidate = function (numState, nextState) {
  // Libera TODOS os campos bloqueados 1 milissegundo antes de enviar para o Fluig salvar tudo
  $("select, input, textarea").prop("disabled", false).prop("readonly", false);
  return true;
}

// Coloque esta chamada dentro do seu $(document).ready para bloquear logo que a tela abrir
$(document).ready(function () {
  setTimeout(function () {
    validarLiberacaoGED();
  }, 1000); // Aguarda 1s para garantir que os Zooms do Fluig carregaram antes de desabilitá-los

  // Adiciona gatilhos para revalidar sempre que o usuário digitar ou alterar um campo
  $("input, select").on("change blur", function () {
    validarLiberacaoGED();
  });
});

// Função auxiliar que imita o comportamento nativo de bloqueio do seu view.js
function estadoZoomAssinatura(idCampo, bloquear) {
  // 1. Bloqueio via API do Fluig (para o componente visual Select2)
  try {
    if (window[idCampo] && window[idCampo].disable) {
      window[idCampo].disable(bloquear);
    }
  } catch (e) { }

  // 2. Bloqueio via HTML e CSS (Garante o fundo cinza idêntico ao FUN_SECAO_IDDESC_AD)
  if (bloquear) {
    $("#" + idCampo).attr('disabled', 'disabled');
    $("#" + idCampo).prop('disabled', true);

    // Força o CSS visual imediatamente caso a API do Fluig atrase
    if ($("#s2id_" + idCampo).length > 0) {
      $("#s2id_" + idCampo).addClass("select2-container-disabled");
      $("#s2id_" + idCampo + " .select2-choice").css({ "background-color": "#eee", "cursor": "not-allowed" });
    }
  } else {
    $("#" + idCampo).removeAttr('disabled');
    $("#" + idCampo).prop('disabled', false);

    // Restaura o visual de liberação
    if ($("#s2id_" + idCampo).length > 0) {
      $("#s2id_" + idCampo).removeClass("select2-container-disabled");
      $("#s2id_" + idCampo + " .select2-choice").css({ "background-color": "#fff", "cursor": "pointer" });
    }
  }
}

// Lógica Principal de Liberação (Atualizada para Flags Dinâmicas)
function validarLiberacaoGED() {
  var nome = $("#txtNomeColaborador").val();
  var cpf = $("#cpfcnpj").val() || $("#cpfcnpjValue").val();
  var pastaCriada = $("#cpIdPastaGedCandidato").val() !== "";

  // 1. REGRA DO BOTÃO DA PASTA
  if (pastaCriada) {
    transformarBotaoGedAberto($("#cpIdPastaGedCandidato").val());
  } else if (nome && String(nome).trim() !== "" && cpf && String(cpf).trim() !== "") {
    $("#btnGedCandidato").prop("disabled", false);
  } else {
    $("#btnGedCandidato").prop("disabled", true);
  }

  // 2. REGRA DE DESBLOQUEIO DAS FLAGS E UPLOADS
  var camposObrigatorios = [
    "txtNomeColaborador", "cpfcnpj",
    "txtEmail", "txtCELULAR",
    "FUN_EMPRESA", "cpJornadaAdmissao",
    "FUN_IDDESCFUN", "FUN_VLRSALARIO", "cpTipoContrato"
  ];

  var tudoPreenchido = true;
  for (var i = 0; i < camposObrigatorios.length; i++) {
    var valor = $("#" + camposObrigatorios[i]).val();
    if (!valor || String(valor).trim() === "") {
      tudoPreenchido = false;
      break;
    }
  }

  // Se tudo estiver preenchido e a pasta existir, liberta o Kit Dinâmico
  if (tudoPreenchido && pastaCriada) {
    // CHAMA O NOVO MOTOR DE TRAVAS DAS FLAGS
    if (typeof aplicarTravasDocumentosKit === "function") {
      aplicarTravasDocumentosKit();
    }
    $("#aviso_bloqueio_ged").hide();
  } else {
    // Caso contrário, garante que tudo continua bloqueado
    if (typeof aplicarTravasDocumentosKit === "function") {
      aplicarTravasDocumentosKit();
    }

    $("#aviso_bloqueio_ged").show();
    if (!pastaCriada && tudoPreenchido) {
      $("#aviso_bloqueio_ged").html('<span class="fluigicon fluigicon-warning-sign icon-sm"></span> <strong>Ação Necessária:</strong> Clique no botão para criar a pasta do candidato e liberar os modelos de documento.');
    } else {
      $("#aviso_bloqueio_ged").html('<span class="fluigicon fluigicon-warning-sign icon-sm"></span> <strong>Ação Necessária:</strong> Preencha todos os campos obrigatórios e crie a pasta para liberar a geração de documentos.');
    }
  }
}

function gerenciarPastaCandidato() {
  // 1. Busca o ID da pasta raiz nas configurações globais
  var pastaRaiz = 3479; // Valor padrão de fallback
  var dsConfig = DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, [
    DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST)
  ], null);

  if (dsConfig && dsConfig.values && dsConfig.values.length > 0) {
    pastaRaiz = parseInt(dsConfig.values[0].ID_PASTA_RAIZ_CANDIDATOS || "3479");
  }

  var nomeCand = $("#txtNomeColaborador").val();
  var cpfCand = $("#cpfcnpj").val() || $("#cpfcnpjValue").val();

  var cpfLimpo = String(cpfCand).replace(/\D/g, '');
  var nomePastaDestino = nomeCand.trim() + " - " + cpfLimpo;

  // Feedback visual
  $("#btnGedCandidato").prop("disabled", true).html('<i class="flaticon flaticon-refresh icon-spin"></i> Processando...');

  // 1. Consulta o Dataset "document" para ver se a pasta já existe
  var c1 = DatasetFactory.createConstraint("parentDocumentId", pastaRaiz, pastaRaiz, ConstraintType.MUST);
  var c2 = DatasetFactory.createConstraint("documentDescription", nomePastaDestino, nomePastaDestino, ConstraintType.MUST);
  var c3 = DatasetFactory.createConstraint("deleted", "false", "false", ConstraintType.MUST);

  DatasetFactory.getDataset("document", null, [c1, c2, c3], null, {
    success: function (ds) {
      if (ds && ds.values && ds.values.length > 0) {
        // A PASTA JÁ EXISTE NO GED!
        var idPastaExistente = ds.values[0]["documentPK.documentId"];
        $("#cpIdPastaGedCandidato").val(idPastaExistente);

        // Mapeia as subpastas dela (para não recriá-las)
        mapearSubpastasExistentes(idPastaExistente);
      } else {
        // A PASTA NÃO EXISTE! Vamos criar a estrutura completa
        criarEstruturaGedFrontEnd(pastaRaiz, nomePastaDestino);
      }
    },
    error: function (err) {
      FLUIGC.toast({ title: 'Erro:', message: 'Falha ao consultar GED.', type: 'danger' });
      // Aqui garantimos que o nome volte correto se der erro
      $("#btnGedCandidato").prop("disabled", false).html('<i class="flaticon flaticon-folder-create icon-sm"></i> Criar/Vincular Pasta do Candidato');
    }
  });
}

function criarEstruturaGedFrontEnd(idRaiz, nomePasta) {
  // Cria Pasta Principal
  $.ajax({
    url: '/api/public/ecm/document/createFolder',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ "description": nomePasta, "parentId": idRaiz }),
    success: function (dataRoot) {
      var idPrincipal = dataRoot.content.id;
      $("#cpIdPastaGedCandidato").val(idPrincipal);

      // Cria as 3 subpastas simultaneamente via Promise.all (rápido e seguro)
      Promise.all([
        criarSubpastaAjax("1. Documentos do Candidato", idPrincipal),
        criarSubpastaAjax("2. Documentos Gerados", idPrincipal),
        criarSubpastaAjax("3. Documentos Assinados", idPrincipal)
      ]).then(function (resultados) {
        $("#cpIdPastaDocsCandidato").val(resultados[0]);
        $("#cpIdPastaDocsGerados").val(resultados[1]);
        $("#cpIdPastaDocsAssinados").val(resultados[2]);

        FLUIGC.toast({ title: 'Sucesso:', message: 'Pasta criada e vinculada!', type: 'success' });
        transformarBotaoGedAberto(idPrincipal);

        validarLiberacaoGED();
      });
    }
  });
}

function criarSubpastaAjax(nome, pai) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: '/api/public/ecm/document/createFolder',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ "description": nome, "parentId": pai }),
      success: function (res) { resolve(res.content.id); },
      error: function (err) { reject(err); }
    });
  });
}

function mapearSubpastasExistentes(idPrincipal) {
  // Busca os IDs das subpastas para o formulário
  $.ajax({
    url: "/api/public/ecm/document/listDocument/" + idPrincipal + "?limit=100",
    type: "GET",
    success: function (res) {
      var items = res.content;
      for (var i = 0; i < items.length; i++) {
        var nome = items[i].description;
        if (nome.indexOf("1. Documentos") > -1) $("#cpIdPastaDocsCandidato").val(items[i].id);
        if (nome.indexOf("2. Documentos Gerados") > -1) $("#cpIdPastaDocsGerados").val(items[i].id);
        if (nome.indexOf("3. Documentos Assinados") > -1) $("#cpIdPastaDocsAssinados").val(items[i].id);
      }
      FLUIGC.toast({ title: 'Sucesso:', message: 'Pasta do candidato localizada e vinculada!', type: 'success' });
      transformarBotaoGedAberto(idPrincipal);

      validarLiberacaoGED();
    }
  });
}

function transformarBotaoGedAberto(idPasta) {
  // Obtém o código da empresa/tenant atual dinamicamente
  var tenant = (typeof WCMAPI !== 'undefined') ? WCMAPI.tenantCode : "1";
  var urlGed = "/portal/p/" + tenant + "/ecmnavigation?app_ecm_navigation_doc=" + idPasta;

  // Atualiza o botão do painel inicial (Documentos Assinatura)
  $("#btnGedCandidato")
    .removeClass("btn-success btn-primary btn-ged-action")
    .addClass("btn-aberto")
    .prop("disabled", false)
    .html('<i class="flaticon flaticon-folder-open icon-sm"></i> Abrir Pasta no GED')
    .attr("onclick", "window.open('" + urlGed + "', '_blank')");

  // Atualiza o botão do painel de Gerar Kit para garantir o link direto
  if ($("#btnAbrirPastaGerarKit").length > 0) {
    $("#btnAbrirPastaGerarKit")
      .attr("onclick", "window.open('" + urlGed + "', '_blank')");
  }
}

// Função chamada pelo botão "Abrir Pasta do Candidato" no painel de Gerar Kit
function visualizarPastaGed() {
  var idPasta = $("#cpIdPastaGedCandidato").val();
  var tenant = (typeof WCMAPI !== 'undefined') ? WCMAPI.tenantCode : "1";

  if (idPasta && idPasta !== "") {
    window.open("/portal/p/" + tenant + "/ecmnavigation?app_ecm_navigation_doc=" + idPasta, '_blank');
  } else {
    FLUIGC.toast({
      title: 'Aviso:',
      message: 'A pasta do candidato ainda não foi criada ou vinculada.',
      type: 'warning'
    });
  }
}

// =========================================================================
// NOVO MOTOR DINÂMICO DE DOCUMENTOS EM LOTE (CHECKLIST)
// =========================================================================

var TAG_GRUPO_ASSINATURA = "Primeiro Link";

$(document).ready(function () {
  setTimeout(renderizarDocumentosAssinaturaFixos, 1000);
  setTimeout(window.renderizarListaSegundoLink, 1200);
});

// Função orquestradora: Chama a renderização para cada grupo fixo
function renderizarDocumentosAssinaturaFixos() {
  renderizarGrupoAssinaturaFixo("LGPD", "#container_lgpd .render-area");
  renderizarGrupoAssinaturaFixo("Carta Proposta", "#container_carta_proposta .render-area");
}

// O Motor de Renderização Fixo (Sincronizado com a Widget do Candidato)
function renderizarGrupoAssinaturaFixo(grupo, selector) {
  var container = $(selector);
  var constraints = [DatasetFactory.createConstraint("grupo_contrato", grupo, grupo, ConstraintType.MUST)];

  // CONTROLE DE PERMISSÃO (Primeiro Link) - Adicione/Remova as etapas permitidas aqui
  var atividadeAtual = (typeof getWKNumState !== 'undefined') ? getWKNumState() : 0;
  var podeEditarAssinaturas = (atividadeAtual == 0 || atividadeAtual == 1 || atividadeAtual == 4 || atividadeAtual == 41);

  var memoriaJson = $("#json_ids_primeiro_link").val() || "{}";
  var objIdsSalvos = {};
  try { objIdsSalvos = JSON.parse(memoriaJson); } catch (e) { }

  DatasetFactory.getDataset("ds_lista_contratos_rh", null, constraints, null, {
    success: function (dataset) {
      container.empty();
      if (!dataset || !dataset.values || dataset.values.length === 0) {
        container.html('<div class="alert alert-warning" style="margin:0; padding:10px; font-size:13px;"><i class="flaticon flaticon-warning icon-sm"></i> Aviso: Nenhum modelo de <strong>' + grupo + '</strong> foi localizado no Estúdio.</div>');
        return;
      }

      dataset.values.forEach(function (doc) {
        var docId = doc.documentid;
        var docNome = doc.nome_contrato;
        var corpoHtml = doc.texto_html_contrato;

        var prefix = "";
        if (grupo === "LGPD") {
          prefix = "kit_lgpd_admissao";
        } else if (grupo === "Carta Proposta") {
          prefix = "kit_proposta_admissao";
        } else {
          prefix = "kit_dyn_" + docId;
        }

        var savedData = objIdsSalvos[prefix];
        var idSalvo = ""; var origin = "SYS";
        if (typeof savedData === "object" && savedData !== null) {
          idSalvo = savedData.id; origin = savedData.origin;
        } else if (savedData) {
          idSalvo = savedData; origin = "SYS";
        }

        var htmlRow = `
            <div class="row row-kit-dinamico" id="row_${prefix}" style="margin-bottom: 0;">
                <div class="col-md-5">
                    <label class="modern-chip-checkbox" id="lbl_chk_${prefix}">
                        <input type="checkbox" id="chk_${prefix}" class="chk-doc-kit" 
                               onclick="toggleFlagDocumento('${prefix}', this)" data-docid="${docId}">
                        <div class="chip-content">
                            <i class="chip-icon"></i>
                            <div style="display: flex; flex-direction: column;">
                                <strong id="nome_modelo_${prefix}" style="font-size: 13px;">${docNome}</strong>
                                <small id="status_chk_${prefix}" style="font-size: 10px; color: #64748b;">Gerar Automático</small>
                            </div>
                        </div>
                    </label>
                </div>
                <div class="col-md-4">
                    <div class="modern-file-upload" id="box_file_${prefix}">
                        <input type="file" id="file_${prefix}" accept=".pdf" onchange="handleFileInputChange('${prefix}')">
                        <div class="upload-content">
                            <i class="flaticon flaticon-file-pdf icon-md" style="color: #ef4444;"></i>
                            <div style="display: flex; flex-direction: column; overflow: hidden; width: 100%;">
                                <span class="upload-text" id="text_file_${prefix}" style="font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Upload Manual</span>
                                <small style="font-size: 10px; color: #94a3b8;" id="sub_text_file_${prefix}">Arraste ou clique</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 text-right" style="display: flex; justify-content: flex-end; gap: 6px;">
                    <input type="hidden" name="id_pdf_${prefix}" id="id_pdf_${prefix}" value="${idSalvo}" data-origin="${origin}">
                    
                    <button type="button" class="btn btn-info btn-ged-action" id="btn_ver_${prefix}" style="display:none;" 
                            onclick="visualizarDocDinamicoKit('id_pdf_${prefix}')">
                        <i class="flaticon flaticon-eye-open icon-sm"></i> Ver
                    </button>
                    
                    ${podeEditarAssinaturas ? `
                    <button type="button" class="btn btn-danger btn-ged-action" id="btn_excluir_${prefix}" style="display:none;" 
                            onclick="excluirDocumentoDinamicoKit('${prefix}')">
                        <i class="flaticon flaticon-trash icon-sm"></i>
                    </button>` : ''}
                </div>
            </div>`;

        container.append(htmlRow);
        $("#chk_" + prefix).data("template", corpoHtml);
      });

      // Só exibe o botão de Gerar Lote se tiver permissão
      if (podeEditarAssinaturas) {
        $("#container_btn_assinatura").fadeIn();
      } else {
        $("#container_btn_assinatura").hide();
      }

      aplicarTravasDocumentosKit();
    }
  });
}

window.toggleFlagDocumento = function (prefix, el) {
  if ($(el).is(":checked")) {
    $("#file_" + prefix).prop("disabled", true).val("");
    $("#box_file_" + prefix).addClass("disabled-upload");
  } else {
    $("#file_" + prefix).prop("disabled", false);
    $("#box_file_" + prefix).removeClass("disabled-upload");
  }
};

window.handleFileInputChange = function (prefix) {
  var fileInput = document.getElementById("file_" + prefix);
  if (fileInput.files && fileInput.files.length > 0) {
    $("#text_file_" + prefix).text(fileInput.files[0].name).css("color", "#2563eb");
    $("#sub_text_file_" + prefix).text("Pronto para enviar");
    $("#chk_" + prefix).prop("disabled", true).prop("checked", false);
    $("#lbl_chk_" + prefix).css("pointer-events", "none");
  } else {
    $("#text_file_" + prefix).text("Upload Manual").css("color", "");
    $("#sub_text_file_" + prefix).text("Arraste ou clique");
    $("#chk_" + prefix).prop("disabled", false);
    $("#lbl_chk_" + prefix).css("pointer-events", "auto");
  }
};

window.aplicarTravasDocumentosKit = function () {
  var pastaCriada = $("#cpIdPastaGedCandidato").val() !== "";

  // Resgata as permissões por atividade
  var atividadeAtual = (typeof getWKNumState !== 'undefined') ? getWKNumState() : 0;
  var podeEditarAssinaturas = (atividadeAtual == 0 || atividadeAtual == 1 || atividadeAtual == 4 || atividadeAtual == 41);
  var podeEditarGerarKit = (atividadeAtual == 135);

  // Oculta/Bloqueia botões de Selecionar Todos se não for a etapa certa
  if (podeEditarAssinaturas) { $("#btn_selecionar_todos_kit").prop("disabled", !pastaCriada).show(); }
  else { $("#btn_selecionar_todos_kit").hide(); }

  if (podeEditarGerarKit) { $("#btn_selecionar_todos_segundo").prop("disabled", !pastaCriada).show(); }
  else { $("#btn_selecionar_todos_segundo").hide(); }

  $(".chk-doc-kit").each(function () {
    var prefix = $(this).attr("id").replace("chk_", "");
    var idSalvo = $("#id_pdf_" + prefix).val();
    var origin = $("#id_pdf_" + prefix).attr("data-origin") || "SYS";
    var chk = $("#chk_" + prefix);
    var file = $("#file_" + prefix);
    var lblChk = $("#lbl_chk_" + prefix);
    var boxFile = $("#box_file_" + prefix);

    var isSegundoLink = prefix.indexOf("seg_dyn_") > -1;
    var permissaoAcesso = isSegundoLink ? podeEditarGerarKit : podeEditarAssinaturas;

    if (idSalvo && idSalvo !== "") {
      // DOCUMENTO SALVO NO GED
      if (origin === "MAN") {
        chk.prop("disabled", true).prop("checked", false);
        lblChk.removeClass("success-chip").css("pointer-events", "none");
        $("#status_chk_" + prefix).text("Upload Finalizado").css("color", "#94a3b8");

        file.prop("disabled", true);
        boxFile.addClass("disabled-upload");
        $("#text_file_" + prefix).text("Salvo no GED").css("color", "#10b981");
        $("#sub_text_file_" + prefix).text("Operação Concluída");
      } else {
        chk.prop("disabled", true).prop("checked", true);
        lblChk.addClass("success-chip").css("pointer-events", "none");
        $("#status_chk_" + prefix).text("Gerado com Sucesso!").css("color", "#10b981");

        file.prop("disabled", true);
        boxFile.addClass("disabled-upload");
        $("#text_file_" + prefix).text("Gerado Automático").css("color", "#10b981");
        $("#sub_text_file_" + prefix).text("Sistema Fluig");
      }

      $("#btn_ver_" + prefix).show();
      // O botão de excluir só aparece se a etapa for permitida
      if (permissaoAcesso) { $("#btn_excluir_" + prefix).show(); } else { $("#btn_excluir_" + prefix).hide(); }

    } else {
      // AINDA NÃO SALVO
      var isChecked = chk.is(":checked");
      var hasFile = file[0].files && file[0].files.length > 0;

      if (!permissaoAcesso) {
        // BLOQUEIO TOTAL POR ATIVIDADE INCORRETA
        chk.prop("disabled", true); lblChk.css("pointer-events", "none").removeClass("success-chip");
        file.prop("disabled", true); boxFile.addClass("disabled-upload").css("opacity", "0.6");
        $("#status_chk_" + prefix).text("Aguardando Etapa...").css("color", "#94a3b8");
      } else if (!pastaCriada) {
        chk.prop("disabled", true); lblChk.css("pointer-events", "none").removeClass("success-chip");
        file.prop("disabled", true); boxFile.addClass("disabled-upload");
      } else {
        if (isChecked) {
          chk.prop("disabled", false); lblChk.css("pointer-events", "auto").removeClass("success-chip");
          file.prop("disabled", true); boxFile.addClass("disabled-upload");
        } else if (hasFile) {
          chk.prop("disabled", true).prop("checked", false); lblChk.css("pointer-events", "none").removeClass("success-chip");
          file.prop("disabled", false); boxFile.removeClass("disabled-upload");
        } else {
          chk.prop("disabled", false).prop("checked", false); lblChk.css("pointer-events", "auto").removeClass("success-chip");
          $("#status_chk_" + prefix).text("Gerar Automático").css("color", "#64748b");
          file.prop("disabled", false); boxFile.removeClass("disabled-upload");
          $("#text_file_" + prefix).text("Upload Manual").css("color", "");
          $("#sub_text_file_" + prefix).text("Arraste ou clique");
        }
      }
      $("#btn_ver_" + prefix).hide();
      $("#btn_excluir_" + prefix).hide();
    }
  });
};

window.selecionarTodosKit = function () {
  $(".chk-doc-kit").each(function () {
    var prefix = $(this).attr("id").replace("chk_", "");
    if (!$(this).prop("disabled") && !$(this).is(":checked") && $("#id_pdf_" + prefix).val() === "") {
      $(this).prop("checked", true);
      toggleFlagDocumento(prefix, this);
    }
  });
};

window.processarDocumentosEmLote = function () {
  var pastaDestino = $("#cpIdPastaDocsGerados").val() || $("#cpIdPastaGedCandidato").val();
  if (!pastaDestino || pastaDestino === "") {
    FLUIGC.toast({ title: 'Atenção:', message: 'Crie/Vincule a pasta do candidato primeiro.', type: 'warning' });
    return;
  }

  var totalDisparos = 0;

  $(".row-kit-dinamico").each(function () {
    var prefix = $(this).attr("id").replace("row_", "");
    var idSalvo = $("#id_pdf_" + prefix).val();

    if (!idSalvo || idSalvo === "") {
      var chk = $("#chk_" + prefix);
      var fileInput = document.getElementById("file_" + prefix);
      var docNome = $("#nome_modelo_" + prefix).text();

      if (chk.is(":checked")) {
        $("#status_chk_" + prefix).text("Processando PDF...").css("color", "#eab308");
        var template = chk.data("template");
        if (typeof gerarPDFDocumentoDinamico === "function") {
          gerarPDFDocumentoDinamico(template, prefix, docNome);
          totalDisparos++;
        }
      } else if (fileInput.files && fileInput.files.length > 0) {
        enviarUploadManualDinamico(prefix, docNome);
        totalDisparos++;
      }
    }
  });

  if (totalDisparos > 0) {
    FLUIGC.toast({ title: 'Processando...', message: totalDisparos + ' documento(s) sendo enviado(s).', type: 'info' });
  } else {
    FLUIGC.toast({ title: 'Aviso:', message: 'Todos os documentos selecionados já foram gerados, ou não há seleções.', type: 'warning' });
  }
};

// =========================================================
// FUNÇÕES DE COMUNICAÇÃO DE SUCESSO E MEMÓRIA
// =========================================================

// Salva a Origem no Cofre ("SYS" ou "MAN") com Auto-Cura (Self-Healing)
window.salvarIdNoCofreJson = function (prefix, idDoc, origin, docNome) {
  var nomeDoCampoCofre = prefix.indexOf("seg_dyn_") > -1 ? "json_ids_segundo_link" : "json_ids_primeiro_link";

  if ($("#" + nomeDoCampoCofre).length === 0) {
    $("form").append('<input type="hidden" name="' + nomeDoCampoCofre + '" id="' + nomeDoCampoCofre + '">');
  }

  var jsonStr = $("#" + nomeDoCampoCofre).val() || "{}";
  var obj = {};
  try { obj = JSON.parse(jsonStr); } catch (e) { }

  if (idDoc) {
    obj[prefix] = { id: idDoc, origin: origin, name: docNome || "Documento" };
  } else {
    delete obj[prefix];
  }

  var novaStringJson = JSON.stringify(obj);
  $("#" + nomeDoCampoCofre).val(novaStringJson);
  console.log("💾 COFRE ATUALIZADO [" + nomeDoCampoCofre + "]:", novaStringJson);
};

// Visualiza Exclusivamente do Dinâmico
window.visualizarDocDinamicoKit = function (hiddenId) {
  var docId = $("#" + hiddenId).val();
  if (docId) window.open('/portal/p/1/ecmnavigation?app_ecm_navigation_doc=' + docId, '_blank');
};

// Processo Físico de Upload do Dinâmico
window.enviarUploadManualDinamico = function (docPrefix, docName) {
  var fileInput = document.getElementById("file_" + docPrefix);
  var file = fileInput.files[0];
  var idPastaDestino = $("#cpIdPastaDocsGerados").val() || $("#cpIdPastaGedCandidato").val();
  var formData = new FormData(); formData.append('file', file);

  $.ajax({
    url: '/ecm/upload', type: 'POST', data: formData, processData: false, contentType: false,
    success: function (data) {
      var nomeColaborador = $("#txtNomeColaborador").val() || "Candidato";
      var nomeBasePdf = docName.trim() + " - " + nomeColaborador.trim();
      nomeBasePdf = nomeBasePdf.replace(/[\\/:*?"<>|]/g, "");

      if (typeof obterNomeArquivoUnico === "function") {
        obterNomeArquivoUnico(nomeBasePdf, idPastaDestino, function (nomeFinalUnico) {
          publicarUploadManualDinamicoGED(nomeFinalUnico, idPastaDestino, file.name, docPrefix);
        });
      } else {
        publicarUploadManualDinamicoGED(nomeBasePdf + ".pdf", idPastaDestino, file.name, docPrefix);
      }
    }
  });
};

// =========================================================================
// RENDERIZAÇÃO DO SEGUNDO LINK (KIT DE ADMISSÃO) - 14 FIXOS
// =========================================================================
window.renderizarListaSegundoLink = function () {
  // 1. O NOME DO GRUPO NO FLUIG | 2. O SELETOR DO HTML | 3. O ID INTERNO PARA O JSON
  renderizarGrupoKitFixo("CONTRATO DE TRABALHO", "#container_contrato .render-area", "seg_dyn_contrato");
  renderizarGrupoKitFixo("ACORDO INDIVIDUAL - PONTO POR EXCEÇÃO", "#container_ponto_excecao .render-area", "seg_dyn_ponto_excecao");
  renderizarGrupoKitFixo("TERMO DE RESPONSABILIDADE DE USO VEÍCULO", "#container_termo_veiculo .render-area", "seg_dyn_termo_veiculo");
  renderizarGrupoKitFixo("TERMO DE CONFIDENCIALIDADE - NDA", "#container_termo_nda .render-area", "seg_dyn_termo_nda");
  renderizarGrupoKitFixo("TCE - TERMO DE COMPROMISSO DE ESTÁGIO", "#container_tce .render-area", "seg_dyn_tce");
  renderizarGrupoKitFixo("ACORDO DE COMPENSAÇÃO DE HORAS TRABALHADAS", "#container_compensacao_horas .render-area", "seg_dyn_compensacao_horas");
  renderizarGrupoKitFixo("ACORDO DE PRORROGAÇÃO DE HORAS TRABALHADAS", "#container_prorrogacao_horas .render-area", "seg_dyn_prorrogacao_horas");
  renderizarGrupoKitFixo("DECLARAÇÃO DE RENÚNCIA DE VALE TRANSPORTE", "#container_renuncia_vt .render-area", "seg_dyn_renuncia_vt");
  renderizarGrupoKitFixo("SOLICITAÇÃO DE VALE TRANSPORTE", "#container_solicitacao_vt .render-area", "seg_dyn_solicitacao_vt");
  renderizarGrupoKitFixo("DECLARAÇÃO DE ENCARGOS DE FAMÍLIA - IMPOSTO DE RENDA", "#container_encargos_ir .render-area", "seg_dyn_encargos_ir");
  renderizarGrupoKitFixo("FICHA DE SALÁRIO FAMÍLIA", "#container_salario_familia .render-area", "seg_dyn_salario_familia");
  renderizarGrupoKitFixo("TERMO DE RESPONSABILIDADE", "#container_termo_responsabilidade .render-area", "seg_dyn_termo_responsabilidade");
  renderizarGrupoKitFixo("FICHA REGISTRO DE EMPREGADO", "#container_ficha_registro .render-area", "seg_dyn_ficha_registro");
  renderizarGrupoKitFixo("TERMO DE PROIBIÇÃO DE CAPTURA E REPRODUÇÃO DE INFORMAÇÕES SIGILOSAS", "#container_termo_sigilo .render-area", "seg_dyn_termo_sigilo");
};

// Motor de Renderização Fixo para o Segundo Link
function renderizarGrupoKitFixo(grupo, selector, prefixoFixo) {
  var container = $(selector);
  var constraints = [DatasetFactory.createConstraint("grupo_contrato", grupo, grupo, ConstraintType.MUST)];

  var atividadeAtual = (typeof getWKNumState !== 'undefined') ? getWKNumState() : 0;
  var podeEditarGerarKit = (atividadeAtual == 135);

  var memoriaJson = $("#json_ids_segundo_link").val() || "{}";
  var objIdsSalvos = {};
  try { objIdsSalvos = JSON.parse(memoriaJson); } catch (e) { }

  DatasetFactory.getDataset("ds_lista_contratos_rh", null, constraints, null, {
    success: function (dataset) {
      container.empty();
      if (!dataset || !dataset.values || dataset.values.length === 0) {
        // Alerta caso falte o modelo no Estúdio
        container.html('<div class="alert alert-warning" style="margin:0; padding:10px; font-size:12px;"><i class="flaticon flaticon-warning icon-sm"></i> Aviso: Modelo não localizado. Verifique se o Grupo <strong>"' + grupo + '"</strong> existe.</div>');
        return;
      }

      var doc = dataset.values[0]; // Pega o modelo retornado
      var docId = doc.documentid;
      var docNome = doc.nome_contrato;
      var corpoHtml = doc.texto_html_contrato;

      var prefix = prefixoFixo; // Aplica a chave fixa

      var savedData = objIdsSalvos[prefix];
      var idSalvo = ""; var origin = "SYS";
      if (typeof savedData === "object" && savedData !== null) {
        idSalvo = savedData.id; origin = savedData.origin;
      } else if (savedData) {
        idSalvo = savedData; origin = "SYS";
      }

      var htmlRow = `
                <div class="row row-kit-dinamico" id="row_${prefix}" style="margin-bottom: 0;">
                    <div class="col-md-5">
                        <label class="modern-chip-checkbox" id="lbl_chk_${prefix}">
                            <input type="checkbox" id="chk_${prefix}" class="chk-doc-kit" 
                                   onclick="toggleFlagDocumento('${prefix}', this)" data-docid="${docId}">
                            <div class="chip-content">
                                <i class="chip-icon"></i>
                                <div style="display: flex; flex-direction: column;">
                                    <strong id="nome_modelo_${prefix}" style="font-size: 13px;">${docNome}</strong>
                                    <small id="status_chk_${prefix}" style="font-size: 10px; color: #64748b;">Gerar Automático</small>
                                </div>
                            </div>
                        </label>
                    </div>
                    <div class="col-md-4">
                        <div class="modern-file-upload" id="box_file_${prefix}">
                            <input type="file" id="file_${prefix}" accept=".pdf" onchange="handleFileInputChange('${prefix}')">
                            <div class="upload-content">
                                <i class="flaticon flaticon-file-pdf icon-md" style="color: #ef4444;"></i>
                                <div style="display: flex; flex-direction: column; overflow: hidden; width: 100%;">
                                    <span class="upload-text" id="text_file_${prefix}" style="font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Upload Manual</span>
                                    <small style="font-size: 10px; color: #94a3b8;" id="sub_text_file_${prefix}">Arraste ou clique</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 text-right" style="display: flex; justify-content: flex-end; gap: 6px;">
                        <input type="hidden" name="id_pdf_${prefix}" id="id_pdf_${prefix}" value="${idSalvo}" data-origin="${origin}">
                        
                        <button type="button" class="btn btn-info btn-ged-action" id="btn_ver_${prefix}" style="display:none;" 
                                onclick="visualizarDocDinamicoKit('id_pdf_${prefix}')">
                            <i class="flaticon flaticon-eye-open icon-sm"></i> Ver
                        </button>

                        ${podeEditarGerarKit ? `
                        <button type="button" class="btn btn-danger btn-ged-action" id="btn_excluir_${prefix}" style="display:none;" 
                                onclick="excluirDocumentoDinamicoKit('${prefix}')">
                            <i class="flaticon flaticon-trash icon-sm"></i>
                        </button>` : ''}
                    </div>
                </div>`;

      container.append(htmlRow);
      $("#chk_" + prefix).data("template", corpoHtml);

      if (podeEditarGerarKit) {
        $("#row_btn_lote_segundo").show();
      }

      aplicarTravasDocumentosKit();
    }
  });
}

// =========================================================================
// FUNÇÕES DE AÇÃO DO SEGUNDO LINK (FILTRANDO COM :VISIBLE)
// =========================================================================

window.selecionarTodosSegundoLink = function () {
  // Ignora caixas escondidas (ex: se o candidato não for estagiário e o TCE estiver oculto)
  $(".row-kit-dinamico[id^='row_seg_dyn_']:visible .chk-doc-kit").each(function () {
    var prefix = $(this).attr("id").replace("chk_", "");
    if (!$(this).prop("disabled") && !$(this).is(":checked") && $("#id_pdf_" + prefix).val() === "") {
      $(this).prop("checked", true);
      toggleFlagDocumento(prefix, this);
    }
  });
};

// =========================================================================
// PROCESSAR O LOTE APENAS DO SEGUNDO LINK
// =========================================================================
window.processarSegundoLinkEmLote = function () {
  var pastaDestino = $("#cpIdPastaDocsGerados").val() || $("#cpIdPastaGedCandidato").val();
  if (!pastaDestino || pastaDestino === "") {
    FLUIGC.toast({ title: 'Atenção:', message: 'Crie/Vincule a pasta do candidato primeiro.', type: 'warning' });
    return;
  }

  var totalDisparos = 0;

  // Envia apenas o que está visível
  $(".row-kit-dinamico[id^='row_seg_dyn_']:visible").each(function () {
    var prefix = $(this).attr("id").replace("row_", "");
    var idSalvo = $("#id_pdf_" + prefix).val();

    if (!idSalvo || idSalvo === "") {
      var chk = $("#chk_" + prefix);
      var fileInput = document.getElementById("file_" + prefix);
      var docNome = $("#nome_modelo_" + prefix).text();

      if (chk.is(":checked")) {
        $("#status_chk_" + prefix).text("Processando PDF...").css("color", "#eab308");
        var template = chk.data("template");
        if (typeof gerarPDFDocumentoDinamico === "function") {
          gerarPDFDocumentoDinamico(template, prefix, docNome);
          totalDisparos++;
        }
      } else if (fileInput && fileInput.files && fileInput.files.length > 0) {
        enviarUploadManualDinamico(prefix, docNome);
        totalDisparos++;
      }
    }
  });

  if (totalDisparos > 0) {
    FLUIGC.toast({ title: 'Processando...', message: totalDisparos + ' documento(s) do Segundo Link sendo enviado(s).', type: 'info' });
  } else {
    FLUIGC.toast({ title: 'Aviso:', message: 'Todos os documentos selecionados já foram gerados, ou não há seleções.', type: 'warning' });
  }
};

// Upload Manual Finalizado (Avisa que foi MAN)
window.publicarUploadManualDinamicoGED = function (nomeFinalGED, idPasta, nomeArquivoOriginal, docPrefix) {
  var jsonDocumento = { "description": nomeFinalGED, "parentId": idPasta, "attachments": [{ "fileName": nomeArquivoOriginal, "principal": true }] };
  $.ajax({
    url: '/api/public/ecm/document/createDocument', type: 'POST', contentType: 'application/json', data: JSON.stringify(jsonDocumento),
    success: function (response) {
      var idGerado = response.content.id;
      $("#id_pdf_" + docPrefix).val(idGerado).attr("data-origin", "MAN");

      salvarIdNoCofreJson(docPrefix, idGerado, "MAN", nomeFinalGED);

      aplicarTravasDocumentosKit();
      FLUIGC.toast({ title: 'Sucesso: ', message: nomeFinalGED + ' anexado!', type: 'success' });
    }
  });
};

// Botão de Excluir do Dinâmico
window.excluirDocumentoDinamicoKit = function (docPrefix) {
  FLUIGC.message.confirm({
    message: 'Deseja excluir este documento da pasta do candidato?', title: 'Confirmação', labelYes: 'Sim, excluir', labelNo: 'Cancelar'
  }, function (result) {
    if (result) deletarDocumentoDinamicoGED(docPrefix);
  });
};

// Lixeira Exclusiva do Dinâmico (Reseta tudo perfeitamente)
window.deletarDocumentoDinamicoGED = function (docPrefix) {
  var idDoc = $("#id_pdf_" + docPrefix).val();
  if (idDoc && idDoc !== "") {
    $.ajax({ url: '/api/public/ecm/document/remove', type: 'POST', contentType: 'application/json', data: JSON.stringify({ "id": idDoc }) });
  }

  // Limpa a memória
  $("#id_pdf_" + docPrefix).val("").attr("data-origin", "");
  salvarIdNoCofreJson(docPrefix, null, null);

  // Força o reset visual antes do recálculo da tela
  $("#chk_" + docPrefix).prop("checked", false);
  $("#status_chk_" + docPrefix).text("Gerar Automático").css("color", "#64748b");
  $("#file_" + docPrefix).val("");

  aplicarTravasDocumentosKit();

  FLUIGC.toast({ title: 'Lixeira:', message: 'Documento excluído com sucesso.', type: 'success' });
};

// Função para exibir/ocultar o parecer na validação do kit
function controlaParecerKit() {
  var decisao = $("#cpAprovacaoKit").val();

  // O valor "3" corresponde a "Solicitar Correção"
  if (decisao == "3") {
    $("#linhaParecerValidaKit").show(); // Mostra a linha
  } else {
    $("#linhaParecerValidaKit").hide(); // Esconde a linha
    $("#cpParecerValidaKit").val(""); // Limpa o texto caso o RH mude de ideia e coloque "Aprovado"
  }
}

// Garante que a regra seja verificada assim que a tela for carregada
$(document).ready(function () {
  controlaParecerKit();
});

// Função para dar feedback visual quando o usuário escolhe o arquivo
window.handleAsoFileInputChange = function () {
  var fileInput = document.getElementById("btn_upload_aso");
  if (fileInput.files && fileInput.files.length > 0) {
    $("#text_file_aso").text(fileInput.files[0].name).css("color", "#2563eb");
    $("#sub_text_file_aso").text("Pronto para enviar");
  } else {
    $("#text_file_aso").text("Upload Manual").css("color", "");
    $("#sub_text_file_aso").text("Arraste ou clique para anexar");
  }
};

// Função de upload para o GED
function uploadASOCandidato() {
  var docPrefix = "aso";
  var fileInput = document.getElementById('btn_upload_aso');
  var file = fileInput.files[0];
  var idPastaDestino = $("#cpIdPastaDocsCandidato").val() || $("#cpIdPastaGedCandidato").val();

  if (!file) {
    FLUIGC.toast({ title: 'Atenção:', message: 'Selecione o arquivo do ASO antes de enviar.', type: 'warning' });
    return;
  }

  if (!idPastaDestino) {
    FLUIGC.toast({ title: 'Erro:', message: 'Pasta do candidato não localizada.', type: 'danger' });
    return;
  }

  var loading = FLUIGC.loading(window);
  loading.show();

  var formData = new FormData();
  formData.append('file', file);

  // Passo 1: Upload para a área temporária do servidor
  $.ajax({
    url: '/ecm/upload',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      var nomeColaborador = $("#txtNomeColaborador").val() || "Candidato";
      var nomeBasePdf = "ASO - " + nomeColaborador.trim();
      nomeBasePdf = nomeBasePdf.replace(/[\\/:*?"<>|]/g, "");

      if (typeof obterNomeArquivoUnico === "function") {
        obterNomeArquivoUnico(nomeBasePdf, idPastaDestino, function (nomeFinalUnico) {
          publicarASOGED(nomeFinalUnico, idPastaDestino, file.name, docPrefix, loading);
        });
      } else {
        publicarASOGED(nomeBasePdf + ".pdf", idPastaDestino, file.name, docPrefix, loading);
      }
    },
    error: function () {
      loading.hide();
      FLUIGC.toast({ title: 'Erro:', message: 'Falha no envio temporário do arquivo.', type: 'danger' });
    }
  });
}

function publicarASOGED(nomeFinalGED, idPasta, nomeArquivoOriginal, docPrefix, loading) {
  var jsonDocumento = {
    "description": nomeFinalGED,
    "parentId": idPasta,
    "attachments": [{ "fileName": nomeArquivoOriginal, "principal": true }]
  };

  // Passo 3: Criação definitiva do documento no GED
  $.ajax({
    url: '/api/public/ecm/document/createDocument',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(jsonDocumento),
    success: function (response) {
      var idGerado = response.content.id;

      $("#id_pdf_aso").val(idGerado).attr("data-origin", "MAN");

      if (typeof salvarIdNoCofreJson === 'function') {
        salvarIdNoCofreJson(docPrefix, idGerado, "MAN", nomeFinalGED);
      }

      loading.hide();
      FLUIGC.toast({ title: 'Sucesso: ', message: 'ASO anexado com sucesso no GED!', type: 'success' });

      // Feedback visual de bloqueio igual aos do Kit
      $("#btn_upload_aso").prop("disabled", true);
      $("#box_file_aso").addClass("disabled-upload");
      $("#text_file_aso").text("Salvo no GED").css("color", "#10b981");
      $("#sub_text_file_aso").text("Operação Concluída");

      $("#btn_enviar_aso").prop("disabled", true)
        .removeClass("btn-success").addClass("btn-default")
        .html('<i class="flaticon flaticon-check-circle-on icon-sm"></i> Arquivo no GED');

      if (typeof aplicarTravasDocumentosKit === "function") {
        aplicarTravasDocumentosKit();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      loading.hide();
      console.error("Erro GED:", textStatus, errorThrown);
      FLUIGC.toast({ title: 'Erro:', message: 'Erro ao publicar documento no GED.', type: 'danger' });
    }
  });
}

// Monitor Debugger - Adicionar no final do view.js
$(document).ready(function () {
  var atividadeAtual = (typeof getWKNumState !== 'undefined') ? getWKNumState() : 0;

  // Roda apenas na atividade do RH e na edição inicial
  if (atividadeAtual == 97 || atividadeAtual == 0 || atividadeAtual == 1 || atividadeAtual == 41) {
    console.log("[DEBUG ESTÁGIO] Monitor de tela ativado para a Atividade", atividadeAtual);

    var tentativasEstagio = 0;
    var intervaloEstagio = setInterval(function () {
      console.log("[DEBUG ESTÁGIO] Verificação de segurança #" + (tentativasEstagio + 1));
      gerenciarPainelContrato(false)

      // GARANTE QUE A SEQUÊNCIA SOBREVIVA AO REFRESH DO ESTÁGIO
      if (typeof window.liberarSequenciaTurno === "function") {
        window.liberarSequenciaTurno();
      }

      tentativasEstagio++;
      if (tentativasEstagio >= 5) {
        clearInterval(intervaloEstagio);
        console.log("[DEBUG ESTÁGIO] Monitor finalizado.");
      }
    }, 1000);
  }
});

