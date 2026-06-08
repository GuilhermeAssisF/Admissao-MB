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

<<<<<<< HEAD
  // Prevenção de erro caso a atividade venha vazia
  var wkNumState = getValue("WKNumState");
  var atividade = (wkNumState != null && wkNumState != "") ? parseInt(wkNumState) : 0;

  var Campos = new Array(
    // PAINEL: DOCUMENTOS PARA ASSINATURA (Bloqueio nas demais etapas)
    { campo: "zoom_kit_proposta_admissao", atividade: "0,1,4" },
    { campo: "zoom_kit_lgpd_admissao", atividade: "0,1,4" },

    // PAINEL: DADOS DO COLABORADOR E FILIAÇÃO
    { campo: "cpfcnpj", atividade: "0,1,41,97" },
    { campo: "txtNomeColaborador", atividade: "0,1,41,97" },
    { campo: "dtDataNascColaborador", atividade: "0,1,41,97" },
    { campo: "txtSexo", atividade: "0,1,41,97" },
    { campo: "txtEstCivilCod", atividade: "0,1,41,97" },
    { campo: "CORRACA", atividade: "0,1,41,97" },
    { campo: "NACIONALIDADECod", atividade: "0,1,41,97" },
    { campo: "txtNaturalidadeCod", atividade: "0,1,41,97" },
    { campo: "ESTADONatalCod", atividade: "0,1,41,97" },
    { campo: "GRAUINSTRUCAOCod", atividade: "0,1,41,97" },
    { campo: "NomeMae", atividade: "0,1,41,97" },
    { campo: "NomePai", atividade: "0,1,41,97" },

    // PAINEL: COMPLEMENTOS E EMERGÊNCIA
    { campo: "txtTamanhoCamisa", atividade: "0,1,41,97" },
    { campo: "txtTamanhoCalcado", atividade: "0,1,41,97" },
    { campo: "txtNomeEmergencia", atividade: "0,1,41,97" },
    { campo: "txtParentescoEmergencia", atividade: "0,1,41,97" },
    { campo: "txtTelefoneEmergencia", atividade: "0,1,41,97" },

    // PAINEL: DEFICIÊNCIAS
    { campo: "DEFICIENTEFISICO", atividade: "0,1,41,97" },
    { campo: "DEFICIENTEAUDITIVO", atividade: "0,1,41,97" },
    { campo: "DEFICIENTEFALA", atividade: "0,1,41,97" },
    { campo: "DEFICIENTEVISUAL", atividade: "0,1,41,97" },
    { campo: "DEFICIENTEMENTAL", atividade: "0,1,41,97" },
    { campo: "DEFICIENTEINTELECTUAL", atividade: "0,1,41,97" },
    { campo: "DEFICIENTEREAB", atividade: "0,1,41,97" },

    // PAINEL: DOCUMENTOS
    { campo: "TxtRg", atividade: "0,1,41,97" },
    { campo: "UFCARTIDENTIDADE", atividade: "0,1,41,97" },
    { campo: "ORGAOCARTIDENTIDADE", atividade: "0,1,41,97" },
    { campo: "DTEMISSAOIDENT", atividade: "0,1,41,97" },
    { campo: "TITULOELEITOR", atividade: "0,1,41,97" },
    { campo: "ZONATITELEITOR", atividade: "0,1,41,97" },
    { campo: "DTTITELEITOR", atividade: "0,1,41,97" },
    { campo: "SECAOTITELEITOR", atividade: "0,1,41,97" },
    { campo: "UFTITULO", atividade: "0,1,41,97" },
    { campo: "txtCartTrab", atividade: "0,1,41,97" },
    { campo: "txtSerieCart", atividade: "0,1,41,97" },
    { campo: "dtDataEmissaoCartTrab", atividade: "0,1,41,97" },
    { campo: "CODUFCTPS", atividade: "0,1,41,97" },
    { campo: "UFCARTTRAB", atividade: "0,1,41,97" },
    { campo: "NIT", atividade: "0,1,41,97" },
    { campo: "CARTMOTORISTA", atividade: "0,1,41,97" },
    { campo: "TIPOCARTHABILIT", atividade: "0,1,41,97" },
    { campo: "DTVENCHABILIT", atividade: "0,1,41,97" },
    { campo: "ORGEMISSORCNH", atividade: "0,1,41,97" },
    { campo: "DTEMISSAOCNH", atividade: "0,1,41,97" },
    { campo: "PIS", atividade: "0,1,41,97" },
    { campo: "BancoPIS", atividade: "0,1,41,97" },
    { campo: "CERTIFRESERV", atividade: "0,1,41,97" },
    { campo: "DtCERTIFRESERV", atividade: "0,1,41,97" },
    { campo: "SitMilitar", atividade: "0,1,41,97" },
    { campo: "NumRic", atividade: "0,1,41,97" },
    { campo: "OrgEmRIC", atividade: "0,1,41,97" },
    { campo: "DtEmRIC", atividade: "0,1,41,97" },
    { campo: "DtChegBras", atividade: "0,1,41,97" },
    { campo: "Visto", atividade: "0,1,41,97" },
    { campo: "RNE", atividade: "0,1,41,97" },
    { campo: "DTRNE", atividade: "0,1,41,97" },
    { campo: "OrgRNE", atividade: "0,1,41,97" },

    // PAINEL: ENDEREÇO E CONTATO
    { campo: "txtNomeSocial", atividade: "0,1,41,97" },
    { campo: "txtCEP", atividade: "0,1,41,97" },
    { campo: "txtNOMETIPORUA", atividade: "0,1,41,97" },
    { campo: "txtRUA", atividade: "0,1,41,97" },
    { campo: "txtNUMERO", atividade: "0,1,41,97" },
    { campo: "txtCOMPLEMENTO", atividade: "0,1,41,97" },
    { campo: "txtCODTIPOBAIRRO", atividade: "0,1,41,97" },
    { campo: "txtBAIRRO", atividade: "0,1,41,97" },
    { campo: "txtCODETD", atividade: "0,1,41,97" },
    { campo: "txtCODMUNICIPIO", atividade: "0,1,41,97" },
    { campo: "txtCODPAIS", atividade: "0,1,41,97" },
    { campo: "txtTELEFONE", atividade: "0,1,41,97" },
    { campo: "txtCELULAR", atividade: "0,1,41,97" },
    { campo: "txtTElCont", atividade: "0,1,41,97" },
    { campo: "txtEmail", atividade: "0,1,41,97" },

    // PAINEL: DADOS DA CONTRATAÇÃO
=======
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
    { campo: "txtTamanhoCamisa", atividade: "0,1,41" },
    { campo: "txtTamanhoCalcado", atividade: "0,1,41" },
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
    { campo: "Visto", atividade: "0,1,41" },
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
>>>>>>> 1b64ab32b8425e2be9acbab1de2a499f633a6b67
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
<<<<<<< HEAD
=======
    { campo: "FUN_INTEGRCONTABIL_IDDESC", atividade: "0,1,41,97" },
    { campo: "FUN_INTEGRGERENCIAL_IDDESC", atividade: "0,1,41,97" },
<<<<<<< HEAD
>>>>>>> 8f64a19d4998e2e5f65abfabc3aa85d224e96d61
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
=======

    // ==========================================
    // PAINEL: BENEFÍCIOS E INFORMAÇÕES GERAIS
    // ==========================================
>>>>>>> 1b64ab32b8425e2be9acbab1de2a499f633a6b67
    { campo: "ValeTransp", atividade: "0,1,41,97" },
    { campo: "ValeAlim", atividade: "0,1,41,97" },
    { campo: "ValeCesta", atividade: "0,1,41,97" },
    { campo: "ValeRefeicao", atividade: "0,1,41,97" },
    { campo: "ValeRef", atividade: "0,1,41,97" },
    { campo: "Planodonto", atividade: "0,1,41,97" },
    { campo: "PlanoSaude", atividade: "0,1,41,97" },
    { campo: "txtInteresseSaude", atividade: "0,1,41,97" },
    { campo: "txtInteresseOdonto", atividade: "0,1,41,97" },
    { campo: "cpUpFront", atividade: "0,1,41" },
    { campo: "cpUpFrontTipo", atividade: "0,1,41" },
    { campo: "cpHiringBonus", atividade: "0,1,41" },
    { campo: "cpHiringBonusTipo", atividade: "0,1,41" },
    { campo: "cpBonusValor", atividade: "0,1,41" },
    { campo: "cpBonusTipo", atividade: "0,1,41" },
    { campo: "cpAcordoNegociacao", atividade: "0,1,41" },
    { campo: "cpDataHoraExame", atividade: "0,1,41" },
    { campo: "cpEnderecoClinica", atividade: "0,1,41" },
    { campo: "cpNomeClinica", atividade: "0,1,41" },
    { campo: "cpEmailCandidatoInicio", atividade: "0,1,41" },
    { campo: "cpTpRecrutamento", atividade: "0,1,41" },
    { campo: "cpTpContratacao", atividade: "0,1,41" },
    { campo: "MarcaPonto", atividade: "0,1,41" },
    { campo: "ContSalBrad", atividade: "0,1,41" },
    { campo: "CatPonto", atividade: "0,1,41" },
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

<<<<<<< HEAD
    // PAINEL: DADOS BANCÁRIOS E CHAPA
    { campo: "TxtChapa", atividade: "0,1,41" },
    { campo: "BancoPAgto", atividade: "0,1,41" },
    { campo: "AgPagto", atividade: "0,1,41,97" },
    { campo: "ContPagto", atividade: "0,1,41,97" },
    { campo: "TipodeContPagto", atividade: "0,1,41,97" },

    // PAINEL: PREENCHIMENTO EXCLUSIVO ÁREA RH (Somente Atividade 97)
=======
    // ==========================================
    // PAINEL: DADOS BANCÁRIOS E CHAPA
    // ==========================================
    { campo: "TxtChapa", atividade: "0,1,41" },
    { campo: "BancoPAgto", atividade: "0,1,41" },
    { campo: "AgPagto", atividade: "0,1,41" },
    { campo: "ContPagto", atividade: "0,1,41" },
    { campo: "TipodeContPagto", atividade: "0,1,41" },

    // ==========================================
    // PAINEL: PREENCHIMENTO EXCLUSIVO DA ÁREA RH
    // ==========================================
>>>>>>> 1b64ab32b8425e2be9acbab1de2a499f633a6b67
    { campo: "zoom_sindicato", atividade: "97" },
    { campo: "zoom_categoriaEsocial", atividade: "97" },
    { campo: "FUN_CATESOCIAL", atividade: "97" },
    { campo: "FUN_NATATIV", atividade: "97" },
    { campo: "FUN_INDADMISSAO", atividade: "97" },
<<<<<<< HEAD
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
    { campo: "FUN_INSS", atividade: "97" },
    { campo: "FUN_IRRF", atividade: "97" },
    { campo: "FUN_ALTFGTS", atividade: "97" },
    { campo: "cpDataUltimoSaldoFGTS", atividade: "97" },
    { campo: "cpRegimePrevidenciario", atividade: "97" },
    { campo: "cpRegimeTrabalhista", atividade: "97" },
    { campo: "zoom_sindicato_filiacao", atividade: "97" },
    { campo: "zoom_contribuicao_sindical", atividade: "97" },
    { campo: "zoom_ocorrencia_sefip", atividade: "97" },
    { campo: "zoom_categoria_sefip", atividade: "97" },
    { campo: "zoom_situacao_rais", atividade: "97" },
    { campo: "zoom_vinculo_rais", atividade: "97" },
    { campo: "zoom_quiosque", atividade: "97" },
    { campo: "zoom_equipe", atividade: "97" },
    { campo: "cpIndiceInicioHorario", atividade: "97" },
    { campo: "zoom_centroCusto", atividade: "97" },
    { campo: "FUN_INTEGRCONTABIL_IDDESC", atividade: "97" },
    { campo: "FUN_INTEGRGERENCIAL_IDDESC", atividade: "97" },

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
=======
    { campo: "FUN_INSS", atividade: "97" },
    { campo: "FUN_IRRF", atividade: "97" },
    { campo: "FUN_ALTFGTS", atividade: "97" },
    { campo: "FUN_SEQTURN_IDDESC_AD", atividade: "97" },
    { campo: "FUN_CONTRATOPARCIAL", atividade: "97" },
    { campo: "FUN_TPJORNADA", atividade: "97" },

    // ==========================================
    // CHECKLIST
    // ==========================================
>>>>>>> 1b64ab32b8425e2be9acbab1de2a499f633a6b67
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

<<<<<<< HEAD
    // PAINEL: ETAPAS DO PROCESSO (Aprovações)
=======
    // ==========================================
    // PAINEL: ETAPAS DO PROCESSO (Aprovações)
    // ==========================================
>>>>>>> 1b64ab32b8425e2be9acbab1de2a499f633a6b67
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

<<<<<<< HEAD
    // CAMPOS LEGADOS OU OCULTOS
=======
    // ==========================================
    // CAMPOS LEGADOS OU OCULTOS
    // ==========================================
>>>>>>> 1b64ab32b8425e2be9acbab1de2a499f633a6b67
    { campo: "TipoSanguineo", atividade: "0,1,41" },
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

<<<<<<< HEAD
  // ==========================================================
  // LOOP SEGURO: Desbloqueia só o que está no Array acima
  // ==========================================================
  for (var i = 0; i < Campos.length; i++) {
    var Campo = Campos[i];
    var atividades = Campo["atividade"].split(",");
=======
  for (var item in Campos) {
    var Campo = Campos[item],
      atividades = Campo["atividade"].split(",");
>>>>>>> 1b64ab32b8425e2be9acbab1de2a499f633a6b67

    if (atividades.indexOf(atividade.toString()) >= 0) {
      form.setEnabled(Campo["campo"], true);
    } else {
      form.setEnabled(Campo["campo"], false);
    }
  }

<<<<<<< HEAD
  // ==========================================================
  // REGRAS DE SEGURANÇA EXCLUSIVAS DA ATIVIDADE 97
  // ==========================================================
  if (atividade == 97) {
    // Bloqueia o Painel: Dados do Solicitante
    form.setEnabled("cpNumeroSolicitacao", false);
    form.setEnabled("cpDataAbertura", false);
    form.setEnabled("cpNomeSolicitante", false);
    form.setEnabled("cpFuncaoSolicitante", false);
    form.setEnabled("cpEmpresaSolicitante", false);
    form.setEnabled("cpDepartamentoObraSolicitante", false);
    form.setEnabled("cpEmailSolicitante", false);
    form.setEnabled("cpEstadoSolicitante", false);

    // Bloqueia o Painel: Informe a chapa do Colaborador
    form.setEnabled("TxtChapa", false);
    form.setEnabled("FUN_CODPESSOA", false);

    // Bloqueia Banco e Agência de Pagamento
    form.setEnabled("BancoPAgto", false);
    form.setEnabled("AgPagto", false);
  }

<<<<<<< HEAD
=======
  // ==========================================================
  // TRAVA DE SEGURANÇA PARA ESTÁGIO
  // ==========================================================
  var jornada = form.getValue("cpJornadaAdmissao");
  if (jornada == "Estagio" || jornada == "Estágio") {
    var camposBloqueadosEstagio = [
      "zoom_sindicato", "FUN_CODDESCSINDICATOFILIACAO", "FUN_PGCTSIN_IDDESC_AD",
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

=======
>>>>>>> 1b64ab32b8425e2be9acbab1de2a499f633a6b67
>>>>>>> 8f64a19d4998e2e5f65abfabc3aa85d224e96d61
  log.info("Fim do EnableFields do formulário FLUIG-0002 - ADMISSAO");
}