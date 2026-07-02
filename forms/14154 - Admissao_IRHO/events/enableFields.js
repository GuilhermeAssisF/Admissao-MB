/*
GESTOR - 7
DIRETOR - 8
CORREÇÃO - 41
ADMISSAO - 74
GERAR KIT - 89
VALIDA KIT - 97
*/

function enableFields(form) {
  log.info("INICIO do EnableFields do formulário FLUIG-0002 - ADMISSAO");

  var atividade = parseInt(getValue("WKNumState"));

  var Campos = new Array(

    // ==========================================
    // PAINEL: DADOS DO COLABORADOR E FILIAÇÃO
    // ==========================================
    { campo: "cpfcnpj", atividade: "0,1,41" },
    { campo: "txtNomeColaborador", atividade: "0,1,41" },
    { campo: "dtDataNascColaborador", atividade: "0,1,41" },
    { campo: "txtSexo", atividade: "0,1,41" },
    { campo: "txtEstCivilCod", atividade: "0,1,41" },
    { campo: "CORRACA", atividade: "0,1,41" },
    { campo: "NACIONALIDADECod", atividade: "0,1,41" },
    { campo: "txtNaturalidadeCod", atividade: "0,1,41" },
    { campo: "ESTADONatalCod", atividade: "0,1,41" },
    { campo: "GRAUINSTRUCAOCod", atividade: "0,1,41" },
    { campo: "NomeMae", atividade: "0,1,41" },
    { campo: "NomePai", atividade: "0,1,41" },

    // ==========================================
    // PAINEL: COMPLEMENTOS E EMERGÊNCIA
    // ==========================================
    { campo: "txtNomeEmergencia", atividade: "0,1,41" },
    { campo: "txtParentescoEmergencia", atividade: "0,1,41" },
    { campo: "txtTelefoneEmergencia", atividade: "0,1,41" },

    // ==========================================
    // PAINEL: DEFICIÊNCIAS
    // ==========================================
    { campo: "DEFICIENTEFISICO", atividade: "0,1,41" },
    { campo: "DEFICIENTEAUDITIVO", atividade: "0,1,41" },
    { campo: "DEFICIENTEFALA", atividade: "0,1,41" },
    { campo: "DEFICIENTEVISUAL", atividade: "0,1,41" },
    { campo: "DEFICIENTEMENTAL", atividade: "0,1,41" },
    { campo: "DEFICIENTEINTELECTUAL", atividade: "0,1,41" },
    { campo: "DEFICIENTEREAB", atividade: "0,1,41" },

    // ==========================================
    // PAINEL: DOCUMENTOS
    // ==========================================
    { campo: "TxtRg", atividade: "0,1,41" },
    { campo: "UFCARTIDENTIDADE", atividade: "0,1,41" },
    { campo: "ORGAOCARTIDENTIDADE", atividade: "0,1,41" },
    { campo: "DTEMISSAOIDENT", atividade: "0,1,41" },
    { campo: "TITULOELEITOR", atividade: "0,1,41" },
    { campo: "ZONATITELEITOR", atividade: "0,1,41" },
    { campo: "DTTITELEITOR", atividade: "0,1,41" },
    { campo: "SECAOTITELEITOR", atividade: "0,1,41" },
    { campo: "UFTITULO", atividade: "0,1,41" },
    { campo: "txtCartTrab", atividade: "0,1,41" },
    { campo: "txtSerieCart", atividade: "0,1,41" },
    { campo: "dtDataEmissaoCartTrab", atividade: "0,1,41" },
    { campo: "CODUFCTPS", atividade: "0,1,41" },
    { campo: "UFCARTTRAB", atividade: "0,1,41" },
    { campo: "NIT", atividade: "0,1,41" },
    { campo: "CARTMOTORISTA", atividade: "0,1,41" },
    { campo: "TIPOCARTHABILIT", atividade: "0,1,41" },
    { campo: "DTVENCHABILIT", atividade: "0,1,41" },
    { campo: "ORGEMISSORCNH", atividade: "0,1,41" },
    { campo: "DTEMISSAOCNH", atividade: "0,1,41" },
    { campo: "PIS", atividade: "0,1,41" },
    { campo: "BancoPIS", atividade: "0,1,41" },
    { campo: "CERTIFRESERV", atividade: "0,1,41" },
    { campo: "DtCERTIFRESERV", atividade: "0,1,41" },
    { campo: "SitMilitar", atividade: "0,1,41" },
    { campo: "NumRic", atividade: "0,1,41" },
    { campo: "OrgEmRIC", atividade: "0,1,41" },
    { campo: "DtEmRIC", atividade: "0,1,41" },
    { campo: "DtChegBras", atividade: "0,1,41" },
    { campo: "RNE", atividade: "0,1,41" },
    { campo: "DTRNE", atividade: "0,1,41" },
    { campo: "OrgRNE", atividade: "0,1,41" },

    // ==========================================
    // PAINEL: ENDEREÇO E CONTATO
    // ==========================================
    { campo: "txtCEP", atividade: "0,1,41" },
    { campo: "txtNOMETIPORUA", atividade: "0,1,41" },
    { campo: "txtRUA", atividade: "0,1,41" },
    { campo: "txtNUMERO", atividade: "0,1,41" },
    { campo: "txtCOMPLEMENTO", atividade: "0,1,41" },
    { campo: "txtCODTIPOBAIRRO", atividade: "0,1,41" },
    { campo: "txtBAIRRO", atividade: "0,1,41" },
    { campo: "txtCODETD", atividade: "0,1,41" },
    { campo: "txtCODMUNICIPIO", atividade: "0,1,41" },
    { campo: "txtCODPAIS", atividade: "0,1,41" },
    { campo: "txtTELEFONE", atividade: "0,1,41" },
    { campo: "txtCELULAR", atividade: "0,1,41" },
    { campo: "txtTElCont", atividade: "0,1,41" },
    { campo: "txtEmail", atividade: "0,1,41" },

    // ==========================================
    // PAINEL: DADOS DA CONTRATAÇÃO
    // ==========================================
    { campo: "IDDESC_EMPRESAFILIAL", atividade: "0,1,41,97" },
    { campo: "descricaoJornada", atividade: "0,1,41,97" },
    { campo: "desc_kitAssinatura", atividade: "0,1,41,97" },
    { campo: "desc_kitAssinaturaValidFinal", atividade: "0,1,41,97" },
    { campo: "FUN_CHAPA", atividade: "0,1,41,97" },
    { campo: "FUN_MATRICULAESOCIAL", atividade: "0,1,41,97" },
    { campo: "FUN_EMAIL_CORPORATIVO", atividade: "0,1,41,97" },
    { campo: "FUN_ADMISSAO", atividade: "0,1,41,97" },
    { campo: "FUN_DATABASE", atividade: "0,1,41,97" },
    { campo: "FUN_TPADMISSAO_IDDESC_AD", atividade: "0,1,41,97" },
    { campo: "FUN_CCIDDESC", atividade: "0,1,41,97" },
    { campo: "FUN_SECAO_IDDESC_AD", atividade: "0,1,41,97" },
    { campo: "FUN_TPREGIMEPREV", atividade: "0,1,41,97" },
    { campo: "FUN_HRMENSAIS", atividade: "0,1,41,97" },
    { campo: "FUN_HRSEMANAIS", atividade: "0,1,41,97" },
    { campo: "FUN_HRDIAS", atividade: "0,1,41,97" },
    { campo: "FUN_CATEGORIA_IDDESC_AD", atividade: "0,1,41,97" },
    { campo: "FUN_IDDESCFUN", atividade: "0,1,41,97" },
    { campo: "FUN_CARGO_DESC_AD", atividade: "0,1,41,97" },
    { campo: "selectTemRemuneracao", atividade: "0,1,41,97" },
    { campo: "FUN_TIPOPGTO_IDDESC_AD", atividade: "0,1,41,97" },
    { campo: "FUN_NIVELFUNCAO", atividade: "0,1,41,97" },
    { campo: "FUN_FAIXASALARIAL", atividade: "0,1,41,97" },
    { campo: "FUN_VLRSALARIO", atividade: "0,1,41,97" },
    { campo: "FUN_IDDESCTURN", atividade: "0,1,41,97" },
    { campo: "FUN_SALARIOBASE", atividade: "0,1,41,97" },
    { campo: "FUN_PADT", atividade: "0,1,41,97" },
    { campo: "FUN_CATESOCIAL_IDDESC_AD", atividade: "0,1,41,97" },
    { campo: "FUN_PGCTSIN_IDDESC_AD", atividade: "0,1,41,97" },
    { campo: "FUN_IDDESCSIND", atividade: "0,1,41,97" },
    { campo: "FUN_CODDESCSINDICATOFILIACAO", atividade: "0,1,41,97" },
    { campo: "FUN_APOSENTADO", atividade: "0,1,41,97" },
    { campo: "FUN_PROCMENOR", atividade: "0,1,41,97" },
    { campo: "FUN_CATSEFIP_IDDESC", atividade: "0,1,41,97" },
    { campo: "FUN_CODOCORRENCIA_IDDESC", atividade: "0,1,41,97" },
    { campo: "FUN_VINCEMPREG_IDDESC_AD", atividade: "0,1,41,97" },
    { campo: "FUN_CODQUIOSQUE_IDDESC", atividade: "0,1,41,97" },
    { campo: "FUN_AJUDACUSTO", atividade: "0,1,41,97" },
    { campo: "FUN_DIASUTEISMES", atividade: "0,1,41,97" },
    { campo: "FUN_DIASUTPROXMES", atividade: "0,1,41,97" },

    { campo: "cpJornadaAdmissao", atividade: "0,1,41" },
    { campo: "cpTipoContrato", atividade: "0,1,41,97" },
    { campo: "cpEmailCandidato", atividade: "0,1,41,97" },
    { campo: "zoomTipoFuncionario", atividade: "0,1,41,97" },
    { campo: "zoomCBO", atividade: "0,1,41,97" },
    { campo: "zoomCargo", atividade: "0,1,41,97" },
    { campo: "FUN_VALORHORA", atividade: "97" },

    // PAINEL: CONTRATO DE TRABALHO
    { campo: "cpContratoPrazo", atividade: "0,1,41" },
    { campo: "cpTerminoContrato", atividade: "0,1,41" },
    { campo: "cpClausulaAssecuratoria", atividade: "0,1,41" },
    { campo: "cpDiasVencPrimeiraExp", atividade: "0,1,41" },
    { campo: "cpVencPrimeiraExp", atividade: "0,1,41" },
    { campo: "cpDiasVencSegundaExp", atividade: "0,1,41" },
    { campo: "cpVencSegundaExp", atividade: "0,1,41" },
    { campo: "cpComplementoContrato", atividade: "0,1,41" },

    // PAINEL: BENEFÍCIOS E INFORMAÇÕES GERAIS


    // ==========================================
    // PAINEL: BENEFÍCIOS E INFORMAÇÕES GERAIS
    // ==========================================
    { campo: "ValeTransp", atividade: "0,1,41,97" },
    { campo: "ValeAlim", atividade: "0,1,41,97" },
    { campo: "ValeCesta", atividade: "0,1,41,97" },
    { campo: "ValeRefeicao", atividade: "0,1,41,97" },
    { campo: "ValeRef", atividade: "0,1,41,97" },
    { campo: "Planodonto", atividade: "0,1,41,97" },
    { campo: "PlanoSaude", atividade: "0,1,41,97" },
    { campo: "txtInteresseSaude", atividade: "0,1,41,97" },
    { campo: "txtInteresseOdonto", atividade: "0,1,41,97" },
    { campo: "cpDataHoraExame", atividade: "0,1,41" },
    { campo: "cpEnderecoClinica", atividade: "0,1,41" },
    { campo: "cpNomeClinica", atividade: "0,1,41" },
    { campo: "cpEmailCandidatoInicio", atividade: "0,1,41" },
    { campo: "cpTpRecrutamento", atividade: "0,1,41" },
    { campo: "cpTpContratacao", atividade: "0,1,41" },
    { campo: "ContSalBrad", atividade: "0,1,41" },
    { campo: "Substituicao", atividade: "0,1,41" },
    { campo: "TreinRH", atividade: "0,1,41" },
    { campo: "cpNecTreinamento", atividade: "0,1,41" },
    { campo: "cpJustTrein", atividade: "0,1,41" },
    { campo: "cpAtendComp", atividade: "0,1,41" },
    { campo: "cpJustComp", atividade: "0,1,41" },
    { campo: "AddInsul", atividade: "0,1,41" },
    { campo: "AddPericulosidade", atividade: "0,1,41" },
    { campo: "gratificacao", atividade: "0,1,41" },
    { campo: "AuxMoradia", atividade: "0,1,41" },
    { campo: "AddCombust", atividade: "0,1,41" },

    // PAINEL: DADOS BANCÁRIOS E CHAPA
    { campo: "TxtChapa", atividade: "0,1,41" },
    { campo: "BancoPAgto", atividade: "0,1,41" },
    { campo: "AgPagto", atividade: "0,1,41,97" },
    { campo: "ContPagto", atividade: "0,1,41,97" },
    { campo: "TipodeContPagto", atividade: "0,1,41,97" },

    // PAINEL: PREENCHIMENTO EXCLUSIVO ÁREA RH (Somente Atividade 97)
    // PAINEL: PREENCHIMENTO EXCLUSIVO ÁREA RH (Somente Atividade 97)
    { campo: "zoom_sindicato", atividade: "97" },
    { campo: "cod_sindicato", atividade: "97" },

    { campo: "zoom_categoriaEsocial", atividade: "97" },
    { campo: "FUN_CATESOCIAL", atividade: "97" },

    { campo: "FUN_NATATIV", atividade: "97" },
    { campo: "FUN_INDADMISSAO", atividade: "97" },
    { campo: "FUN_CONTRATOPARCIAL", atividade: "97" },
    { campo: "FUN_TPJORNADA", atividade: "97" },
    { campo: "FUN_SEQTURN_IDDESC_AD", atividade: "97" },

    { campo: "FUN_TIPOPGTO_IDDESC_AD", atividade: "97" },
    { campo: "cpUsaSalarioComposto", atividade: "97" },
    { campo: "FUN_SALARIOBASE", atividade: "97" },
    { campo: "FUN_PADT", atividade: "97" },
    { campo: "cpArredondamento", atividade: "97" },
    { campo: "FUN_AJUDACUSTO", atividade: "97" },
    { campo: "cpQtdHorasMes", atividade: "97" },

    { campo: "FUN_ALTFGTS", atividade: "97" },
    { campo: "cpDataUltimoSaldoFGTS", atividade: "97" },
    { campo: "cpDataOpcaoFGTS", atividade: "97" },
    { campo: "cpValorSaldoFGTS", atividade: "97" },
    { campo: "cpSaldoFGTSFinsRescisorios", atividade: "97" },
    { campo: "zoom_banco_fgts", atividade: "97" },
    { campo: "FUN_BANCOFGTS", atividade: "97" },
    { campo: "cpContaFGTS", atividade: "97" },

    { campo: "cpRegimePrevidenciario", atividade: "97" },
    { campo: "cpRegimeTrabalhista", atividade: "97" },
    { campo: "zoom_sindicato_filiacao", atividade: "97" },
    { campo: "FUN_CODDESCSINDICATOFILIACAO", atividade: "97" },

    { campo: "FUN_PGCTSIN", atividade: "97" },
    { campo: "FUN_PGCTSIN_IDDESC_AD", atividade: "97" },

    { campo: "FUN_INSS", atividade: "97" },
    { campo: "FUN_IRRF", atividade: "97" },
    { campo: "zoom_ocorrencia_sefip", atividade: "97" },
    { campo: "FUN_CODOCORRENCIA_IDDESC", atividade: "97" },
    { campo: "zoom_categoria_sefip", atividade: "97" },
    { campo: "FUN_CATSEFIP_IDDESC", atividade: "97" },
    { campo: "zoom_situacao_rais", atividade: "97" },
    { campo: "cpSituacaoRais", atividade: "97" },
    { campo: "zoom_vinculo_rais", atividade: "97" },
    { campo: "FUN_VINCEMPREG", atividade: "97" },
    { campo: "FUN_VINCEMPREG_IDDESC_AD", atividade: "97" },

    { campo: "zoom_quiosque", atividade: "97" },
    { campo: "FUN_CODQUIOSQUE_IDDESC", atividade: "97" },
    { campo: "zoom_equipe", atividade: "97" },
    { campo: "cpCodigoEquipe", atividade: "97" },
    { campo: "zoom_centroCusto", atividade: "97" },
    { campo: "FUN_CC", atividade: "97" },
    //{ campo: "cpIndiceInicioHorario", atividade: "97" },

    { campo: "FUN_INTEGRCONTABIL_IDDESC", atividade: "97" },
    { campo: "FUN_INTEGRGERENCIAL_IDDESC", atividade: "97" },

    // Campos Complementares RH - Controle de Ponto e Portal
    { campo: "MarcaPonto", atividade: "97" },
    { campo: "cpHabilitaPortalRM", atividade: "97" },
    { campo: "cpCodigoUsuarioPortalPonto", atividade: "97" },
    { campo: "cpNomeUsuarioPortalPonto", atividade: "97" },
    { campo: "CatPonto", atividade: "97" },

    // Campos Complementares RH - Valores Associados
    // Campos Complementares RH - Eventos Programados
    { campo: "cpUpFront", atividade: "97" },
    { campo: "cpUpFrontValor", atividade: "97" },
    { campo: "cpUpFrontObservacao", atividade: "97" },
    { campo: "cpUpFrontDataInicio", atividade: "97" },
    { campo: "cpHiringBonus", atividade: "97" },
    { campo: "cpHiringBonusValor", atividade: "97" },
    { campo: "cpHiringBonusObservacao", atividade: "97" },
    { campo: "cpHiringBonusDataInicio", atividade: "97" },

    // Campos Complementares RH - Valores Associados
    { campo: "cpTipoPLR", atividade: "97" },
    { campo: "cpValorPLR", atividade: "97" },
    { campo: "cpDataPLR", atividade: "97" },
    { campo: "cpObservacaoPLR", atividade: "97" },
    { campo: "cpPrazoClawback", atividade: "97" },

    // Campos de incidência dos dependentes
    { campo: "TxtIncIRRF", atividade: "97" },
    { campo: "TxtIncPensao", atividade: "97" },

    // Campos Complementares RH - Benefícios Integráveis
    { campo: "cpDataInclusaoAM", atividade: "97" },
    { campo: "cpDataInclusaoAO", atividade: "97" },

    // Campos Complementares RH - Estágio / Aprendiz
    { campo: "cpEstagioDataInicio", atividade: "97" },
    { campo: "cpEstagioDataFim", atividade: "97" },
    { campo: "cpEstagioTipoContrato", atividade: "97" },
    { campo: "cpEstagioTipo", atividade: "97" },
    { campo: "cpEstagioInstituicaoEnsino", atividade: "97" },
    { campo: "cpEstagioGestor", atividade: "97" },
    { campo: "cpEstagioModalidadeContratacao", atividade: "97" },
    { campo: "cpEstagioCnpjAtivPrat", atividade: "97" },

    // Campos Complementares RH - Anotações RM
    { campo: "cpAnotacoesPessoaisRM", atividade: "97" },

    // PAINEL: INFORMAÇÕES ADICIONAIS (Atividade 97)
    { campo: "cpNomeGestorImediato", atividade: "97" },
    { campo: "cpPlantaUnidade", atividade: "97" },
    { campo: "cpModeloTrabalho", atividade: "97" },
    { campo: "cpFormacaoFuncionario", atividade: "97" },
    { campo: "cpNivelIngles", atividade: "97" },
    { campo: "cpPracaAtuacao", atividade: "97" },
    { campo: "cpDescricaoAtividades", atividade: "97" },
    { campo: "cpNecessitaNotebook", atividade: "97" },
    { campo: "cpNecessitaEPI", atividade: "97" },
    { campo: "cpFirstName", atividade: "97" },
    { campo: "cpLastName", atividade: "97" },
    { campo: "cpWorkOnPlant", atividade: "97" },
    { campo: "cpJobTitle", atividade: "97" },
    { campo: "cpDepartment", atividade: "97" },
    { campo: "cpEmailDirectManager", atividade: "97" },
    { campo: "cpUserStatus", atividade: "97" },
    { campo: "cpNetzeroInternalGroup", atividade: "97" },
    { campo: "cpCadastroHierarquia", atividade: "97" },
    { campo: "cpRequisitosAcesso", atividade: "97" },
    { campo: "cpLocalExameAdmissional", atividade: "97" },
    { campo: "cpDataExameAdmissional", atividade: "97" },

    // PAINEL: APROVAÇÕES RH (Somente Atividade 97)
    { campo: "cpAprovacaoAdmissao", atividade: "97" },
    { campo: "cpParecerAprovaAdmissao", atividade: "97" },

    // PAINEL: GERAR KIT DE ADMISSÃO (Editável apenas na 135)
    { campo: "zoom_kit_contrato_clt", atividade: "135" },
    { campo: "zoom_kit_ponto_excecao", atividade: "135" },
    { campo: "zoom_kit_uso_veiculo", atividade: "135" },
    { campo: "zoom_kit_nda", atividade: "135" },
    { campo: "zoom_kit_tce", atividade: "135" },
    { campo: "zoom_kit_comp_horas", atividade: "135" },
    { campo: "zoom_kit_prorrog_horas", atividade: "135" },
    { campo: "zoom_kit_renuncia_vt", atividade: "135" },
    { campo: "zoom_kit_solic_vt", atividade: "135" },
    { campo: "zoom_kit_ir", atividade: "135" },
    { campo: "zoom_kit_sal_familia", atividade: "135" },
    { campo: "zoom_kit_termo_resp", atividade: "135" },
    { campo: "zoom_kit_ficha_reg", atividade: "135" },
    { campo: "zoom_kit_sigilo", atividade: "135" },

    // CHECKLIST
    { campo: "Ckb1", atividade: "0,1,41" },
    { campo: "Ckb2", atividade: "0,1,41" },
    { campo: "Ckb3", atividade: "0,1,41" },
    { campo: "Ckb4", atividade: "0,1,41" },
    { campo: "Ckb5", atividade: "0,1,41" },
    { campo: "Ckb6", atividade: "0,1,41" },
    { campo: "Ckb7", atividade: "0,1,41" },
    { campo: "Ckb8", atividade: "0,1,41" },
    { campo: "Ckb10", atividade: "0,1,41" },
    { campo: "Ckb11", atividade: "0,1,41" },
    { campo: "Ckb12", atividade: "0,1,41" },
    { campo: "Ckb13", atividade: "0,1,41" },
    { campo: "Ckb14", atividade: "0,1,41" },
    { campo: "Ckb15", atividade: "0,1,41" },
    { campo: "Ckb16", atividade: "0,1,41" },
    { campo: "Ckb17", atividade: "0,1,41" },
    { campo: "Ckb18", atividade: "0,1,41" },
    { campo: "Ckb19", atividade: "0,1,41" },
    { campo: "Ckb20", atividade: "0,1,41" },
    { campo: "Ckb21", atividade: "0,1,41" },
    { campo: "Ckb22", atividade: "0,1,41" },
    { campo: "Ckb23", atividade: "0,1,41" },
    { campo: "Ckb24", atividade: "0,1,41" },
    { campo: "Ckb25", atividade: "0,1,41" },
    { campo: "Ckb26", atividade: "0,1,41" },
    { campo: "Ckb27", atividade: "0,1,41" },
    { campo: "Ckb28", atividade: "0,1,41" },
    { campo: "Ckb29", atividade: "0,1,41" },
    { campo: "Ckb30", atividade: "0,1,41" },
    { campo: "Ckb31", atividade: "0,1,41" },
    { campo: "Ckb32", atividade: "0,1,41" },
    { campo: "Ckb33", atividade: "0,1,41" },
    { campo: "Ckb34", atividade: "0,1,41" },
    { campo: "Ckb35", atividade: "0,1,41" },
    { campo: "Ckb36", atividade: "0,1,41" },
    { campo: "Ckb37", atividade: "0,1,41" },
    { campo: "Ckb38", atividade: "0,1,41" },
    { campo: "Ckb39", atividade: "0,1,41" },
    { campo: "Ckb40", atividade: "0,1,41" },

    // PAINEL: ETAPAS DO PROCESSO (Aprovações)
    { campo: "cpReaberturaChamado", atividade: "41" },
    { campo: "cpParecerReabertura", atividade: "41" },
    { campo: "cpAprovacaoGestor", atividade: "7" },
    { campo: "cpParecerAprovGestor", atividade: "7" },
    { campo: "cpRespGestor", atividade: "7" },
    { campo: "cpAprovacaoDiretor", atividade: "8" },
    { campo: "cpParecerAprovaDiretor", atividade: "8" },
    { campo: "cpRespDiretor", atividade: "8" },
    { campo: "cpAprovacaoRH", atividade: "74" },
    { campo: "cpParecerAprovaRH", atividade: "74" },
    { campo: "txtChapaJaExiste", atividade: "74" },
    { campo: "cpRespRH", atividade: "74" },
    { campo: "cpAprovacaoKit", atividade: "97,128" },
    { campo: "cpParecerAprovaKit", atividade: "97" },
    { campo: "cpRespKIT", atividade: "97" },
    { campo: "cpParecerValidaKit", atividade: "128" },
    { campo: "cpRespValidaKit", atividade: "128" },
    { campo: "cpParecerBPO", atividade: "89" },

    // CAMPOS LEGADOS OU OCULTOS
    { campo: "TxtSegDesemprego", atividade: "0,1,41" },
    { campo: "FGTSBANPagto", atividade: "0,1,41" },
    { campo: "PlanSaude", atividade: "0,1,41" },
    { campo: "DescAssist", atividade: "0,1,41" },
    { campo: "txtCentroCusto", atividade: "0,1,41" },
    { campo: "txtUnidadeArea", atividade: "0,1,41" },
    { campo: "txtTipoFuncao", atividade: "0,1,41" },
    { campo: "txtAdmissao", atividade: "0,1,41" },
    { campo: "txtSalario", atividade: "0,1,41" },
    { campo: "txtSindicato", atividade: "0,1,41" },
    { campo: "TxtHorario", atividade: "0,1,41" },
    { campo: "TxtCodIndi", atividade: "0,1,41" },
    { campo: "TxtContSind", atividade: "0,1,41" },
    { campo: "TxtTPADM", atividade: "0,1,41" },
    { campo: "TxtMotADM", atividade: "0,1,41" },
    { campo: "TxtSitFGTS", atividade: "0,1,41" },
    { campo: "TxtSITRais", atividade: "0,1,41" },
    { campo: "TxtVINCRais", atividade: "0,1,41" },
    { campo: "txtNvHiera", atividade: "0,1,41" },
    { campo: "txtJornada", atividade: "0,1,41" },
    { campo: "txtGerRH", atividade: "0,1,41" },
    { campo: "txtDataRH", atividade: "0,1,41" },
    { campo: "TxtVlrContSind", atividade: "0,1,41" },
    { campo: "TxtDtContSind", atividade: "0,1,41" },
    { campo: "TxtDiretoriaRH", atividade: "0,1,41" }
  );

  // ==========================================================
  // CAMPOS PROTEGIDOS DURANTE CORREÇÃO DA INTEGRAÇÃO
  // ==========================================================
  function campoProtegidoNaCorrecaoIntegracao(nomeCampo) {
    var camposProtegidos = {
      // Chaves geradas/controladas pelo processo e pelo RM
      "TxtChapa": true,
      "FUN_CHAPA": true,
      "FUN_CODPESSOA": true,

      // Aprovação da reabertura
      "cpReaberturaChamado": true,
      "cpParecerReabertura": true,

      // Aprovação do gestor
      "cpAprovacaoGestor": true,
      "cpParecerAprovGestor": true,
      "cpRespGestor": true,

      // Aprovação do diretor
      "cpAprovacaoDiretor": true,
      "cpParecerAprovaDiretor": true,
      "cpRespDiretor": true,

      // Aprovação inicial do RH
      "cpAprovacaoRH": true,
      "cpParecerAprovaRH": true,
      "txtChapaJaExiste": true,
      "cpRespRH": true,

      // Validação posterior do kit
      "cpParecerValidaKit": true,
      "cpRespValidaKit": true,
      "cpParecerBPO": true
    };

    if (camposProtegidos[nomeCampo]) {
      return true;
    }

    // Não libera checklists antigos.
    if (nomeCampo.indexOf("Ckb") === 0) {
      return true;
    }

    // Não libera campos usados somente na geração do kit.
    if (nomeCampo.indexOf("zoom_kit_") === 0) {
      return true;
    }

    return false;
  }

  // ==========================================================
  // LOOP SEGURO: Desbloqueia só o que está no Array acima
  // ==========================================================
  for (var i = 0; i < Campos.length; i++) {
    var Campo = Campos[i];
    var nomeCampo = Campo["campo"];
    var atividades = Campo["atividade"].split(",");

    if (atividade == 97) {
      form.setEnabled(
        nomeCampo,
        !campoProtegidoNaCorrecaoIntegracao(nomeCampo)
      );
    } else if (atividades.indexOf(atividade.toString()) >= 0) {
      form.setEnabled(nomeCampo, true);
    } else {
      form.setEnabled(nomeCampo, false);
    }
  }

  // ==========================================================
  // REGRAS DE SEGURANÇA EXCLUSIVAS DA ATIVIDADE 97
  // ==========================================================
  if (atividade == 97) {
    var jornadaEventos = String(
      (form.getValue("cpJornadaAdmissao") || "") +
      " " +
      (form.getValue("cpJornadaAdmissaoDescricao") || "")
    )
      .replace(/^\s+|\s+$/g, "")
      .toLowerCase()
      .replace(/[áàâãä]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[íìîï]/g, "i")
      .replace(/[óòôõö]/g, "o")
      .replace(/[úùûü]/g, "u")
      .replace(/ç/g, "c");

    var permiteUpFront =
      jornadaEventos.indexOf("associado") >= 0;

    var permiteHiringBonus =
      !permiteUpFront &&
      jornadaEventos.indexOf("clt") >= 0;

    var camposUpFront = [
      "cpUpFront",
      "cpUpFrontValor",
      "cpUpFrontDataInicio",
      "cpUpFrontObservacao"
    ];

    var camposHiringBonus = [
      "cpHiringBonus",
      "cpHiringBonusValor",
      "cpHiringBonusDataInicio",
      "cpHiringBonusObservacao"
    ];

    for (var up = 0; up < camposUpFront.length; up++) {
      form.setEnabled(
        camposUpFront[up],
        permiteUpFront
      );
    }

    for (var hb = 0; hb < camposHiringBonus.length; hb++) {
      form.setEnabled(
        camposHiringBonus[hb],
        permiteHiringBonus
      );
    }
  }

  // ==========================================================
  // TRAVA DE SEGURANÇA PARA ESTÁGIO
  // ==========================================================
  var jornada = form.getValue("cpJornadaAdmissao");
  if (jornada == "Estagio" || jornada == "Estágio") {
    var camposBloqueadosEstagio = [
      "zoom_sindicato", "FUN_CODDESCSINDICATOFILIACAO",
      "FUN_INSS", "FUN_IRRF", "FUN_ALTFGTS", "cpDataUltimoSaldoFGTS",
      "FUN_CODOCORRENCIA_IDDESC", "FUN_CATSEFIP_IDDESC", "cpSituacaoRais", "FUN_VINCEMPREG_IDDESC_AD",
      "cpContratoPrazo", "cpDiasVencPrimeiraExp", "cpVencPrimeiraExp",
      "cpDiasVencSegundaExp", "cpVencSegundaExp", "cpTerminoContrato",
      "cpClausulaAssecuratoria", "cpComplementoContrato"
    ];

    for (var c = 0; c < camposBloqueadosEstagio.length; c++) {
      form.setEnabled(camposBloqueadosEstagio[c], false);
    }
  }

  log.info("Fim do EnableFields do formulário FLUIG-0002 - ADMISSAO");
}
