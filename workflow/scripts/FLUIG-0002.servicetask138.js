function servicetask138(attempt, message) {
    log.info("### Admissão SOAP RM (V_INTEGRADA_FINAL) - INICIO ###");

    try {
        // =========================================================================
        // 1. FUNÇÕES AUXILIARES DE FORMATAÇÃO E LEITURA (ROBUSTAS)
        // =========================================================================
        var getStr = function (name) {
            var v = hAPI.getCardValue(name);
            if (v == null || v == undefined) return "";
            return String(v).trim();
        };

        function tag(n, v) {
            if (v === null || v === undefined || String(v).trim() === "") return "";
            return "<" + n + ">" + escapeXML(v) + "</" + n + ">";
        }

        function tagInt(n, v) {
            var val = String(v || "").trim();
            if (val === "" || val === "null" || val === "undefined") return "<" + n + ">0</" + n + ">";
            return "<" + n + ">" + escapeXML(val) + "</" + n + ">";
        }

        function escapeXML(str) {
            return String(str || "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function formatarDataRM(d) {
            if (!d || d == "") return "";
            var p = d.split("/");
            if (p.length == 3) {
                return p[2] + "-" + p[1] + "-" + p[0] + "T00:00:00";
            }
            return d;
        }

        function limparPontuacao(v) {
            return String(v || "").replace(/[^\w\s]/gi, '');
        }

        function formatarSalario(v) {
            if (!v || v === "") return "0,00";
            var limpo = String(v).replace("R$", "").trim();
            if (limpo.indexOf(",") > -1) {
                return limpo.replace(/\./g, "");
            } else {
                if (limpo.indexOf(".") > -1) {
                    return limpo.replace(/\./g, ",");
                } else {
                    return limpo + ",00";
                }
            }
        }

        function getUF(val) {
            if (!val || val === "") return "";
            var uf = String(val).trim().toUpperCase();
            if (uf === "UF" || uf === "SELECIONE") return "";
            var ufs = {
                "SÃO PAULO": "SP", "SAO PAULO": "SP", "MINAS GERAIS": "MG", "RIO DE JANEIRO": "RJ", "ESPÍRITO SANTO": "ES", "ESPIRITO SANTO": "ES",
                "BAHIA": "BA", "PARANÁ": "PR", "PARANA": "PR", "RIO GRANDE DO SUL": "RS", "SANTA CATARINA": "SC", "GOIÁS": "GO", "GOIAS": "GO",
                "DISTRITO FEDERAL": "DF", "MATO GROSSO": "MT", "MATO GROSSO DO SUL": "MS", "CEARÁ": "CE", "CEARA": "CE", "PERNAMBUCO": "PE",
                "PARÁ": "PA", "PARA": "PA", "AMAZONAS": "AM", "MARANHÃO": "MA", "MARANHAO": "MA", "PIAUÍ": "PI", "PIAUI": "PI",
                "RIO GRANDE DO NORTE": "RN", "PARAÍBA": "PB", "PARAIBA": "PB", "ALAGOAS": "AL", "SERGIPE": "SE", "TOCANTINS": "TO",
                "RONDÔNIA": "RO", "RONDONIA": "RO", "ACRE": "AC", "AMAPÁ": "AP", "AMAPA": "AP", "RORAIMA": "RR"
            };
            var sigla = ufs[uf] || uf.substring(0, 2);
            var validas = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO", "EX"];
            if (validas.indexOf(sigla) === -1) return "";
            return sigla;
        }

        function getTipoRua(val) {
            if (!val || val === "") return "";
            var tipo = String(val).trim().toUpperCase();
            if (!isNaN(tipo)) return tipo;
            var map = { "RUA": "1", "AVENIDA": "6", "ALAMEDA": "4", "ESTRADA": "18", "RODOVIA": "34", "PRAÇA": "30", "PRACA": "30", "TRAVESSA": "39", "VIELA": "42" };
            return map[tipo] || "1";
        }

        function getTipoBairro(val) {
            if (!val || val === "") return "";
            var tipo = String(val).trim().toUpperCase();
            if (!isNaN(tipo)) return tipo;
            var map = { "BAIRRO": "1", "JARDIM": "11", "VILA": "18", "PARQUE": "14", "RESIDENCIAL": "15", "DISTRITO": "6", "SITIO": "16", "SÍTIO": "16" };
            return map[tipo] || "1";
        }

        function getEstadoCivilRM(val) {
            if (!val || val === "") return "S";
            var tipo = String(val).trim().toUpperCase();
            if (tipo.length === 1) return tipo;
            var map = { "SOLTEIRO": "S", "SOLTEIRA": "S", "CASADO": "C", "CASADA": "C", "DIVORCIADO": "D", "DIVORCIADA": "D", "VIÚVO": "V", "VIUVO": "V", "VIÚVA": "V", "VIUVA": "V", "SEPARADO": "P", "SEPARADA": "P", "UNIÃO ESTÁVEL": "E", "UNIAO ESTAVEL": "E", "COMPANHEIRO": "E", "DESQUITADO": "D", "OUTROS": "O" };
            return map[tipo] || "S";
        }

        function getGrauParentesco(val) {
            if (!val || val === "") return "";
            var tipo = String(val).trim().toUpperCase();
            if (tipo.indexOf("-") > -1) {
                var cod = tipo.split("-")[0].trim();
                if (cod.length === 1) return cod;
            }
            if (tipo.length === 1) return tipo;
            var map = { "FILHO(A) SEM DEFICIÊNCIA": "1", "FILHO": "1", "FILHA": "1", "FILHO(A)": "1", "FILHO(A) COM DEFICIÊNCIA": "3", "CÔNJUGE": "5", "CONJUGE": "5", "ESPOSA": "5", "MARIDO": "5", "PAI": "6", "MÃE": "7", "MAE": "7", "SOGRO(A)": "8", "SOGRO": "8", "SOGRA": "8", "OUTROS": "9" };
            return map[tipo] || "9";
        }

        function getGrauInstrucaoRM(val) {
            if (!val || val === "") return "7"; // Fallback padrão: 7 - Ensino Médio Completo

            var tipo = String(val).trim().toUpperCase();

            // Se já vier o código limpo do Fluig com 1 caractere (ex: "6", "9", "A", "B"), retorna direto
            if (tipo.length === 1) {
                return tipo;
            }

            // Mapeamento exato com base na tabela do RM
            var map = {
                "ANALFABETO": "1",
                "ATÉ O 5º ANO INCOMPLETO DO ENSINO FUNDAMENTAL": "2",
                "5º ANO COMPLETO DO ENSINO FUNDAMENTAL": "3",
                "DO 6º AO 9º ANO DO ENSINO FUNDAMENTAL": "4",
                "ENSINO FUNDAMENTAL COMPLETO": "5",
                "ENSINO MÉDIO INCOMPLETO": "6",
                "ENSINO MÉDIO COMPLETO": "7",
                "EDUCAÇÃO SUPERIOR INCOMPLETO": "8",
                "EDUCAÇÃO SUPERIOR COMPLETO": "9",
                "PÓS GRAD. INCOMPLETO": "A",
                "PÓS GRAD. COMPLETO": "B",
                "MESTRADO INCOMPLETO": "C",
                "MESTRADO COMPLETO": "D",
                "DOUTORADO INCOMPLETO": "E",
                "DOUTORADO COMPLETO": "F",
                "PÓS DOUT.INCOMPLETO": "G",
                "PÓS DOUT.COMPLETO": "H"
            };

            // Retorna o código mapeado ou, se não encontrar, manda "7" (Ensino Médio Completo)
            return map[tipo] || "7";
        }

        // =========================================================================
        // 2. CONFIGURAÇÕES DO WEBSERVICE 
        // =========================================================================
        var dsConfig = DatasetFactory.getDataset("Form_Configuracoes_Admissao", null, [
            DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST)
        ], null);

        if (!dsConfig || dsConfig.rowsCount === 0) throw "ERRO FATAL: Configurações não encontradas.";

        var NOME_SERVICO_FLUIG = "WSDATASERVER";
        var RM_USER = dsConfig.getValue(0, "RM_USER");
        var RM_PASS = dsConfig.getValue(0, "RM_PASS");
        var ENDPOINT_URL = dsConfig.getValue(0, "RM_ENDPOINT_WS");

        var COLIGADA = getStr("FUN_EMPRESA");
        if (!COLIGADA || COLIGADA === "") throw "ERRO FATAL: A Coligada não foi informada.";
        var RM_CONTEXTO = "CODCOLIGADA=" + COLIGADA + ";CODSISTEMA=P;CODUSUARIO=" + RM_USER;

        // =========================================================================
        // 3. LÓGICA DE GERAÇÃO DE CHAPA (SEGURA)
        // =========================================================================
        var chapa = getStr("TxtChapa") || getStr("FUN_CHAPA");
        if (chapa == null || chapa == "" || chapa == "0000000") {
            try {
                var c1 = DatasetFactory.createConstraint("CODCOLIGADA", COLIGADA, COLIGADA, ConstraintType.MUST);
                var dsUltimaChapa = DatasetFactory.getDataset("ds_busca_ultima_chapa_rm", new Array(), new Array(c1), new Array());

                var numLinhas = (dsUltimaChapa != null && dsUltimaChapa.rowsCount !== undefined) ? dsUltimaChapa.rowsCount :
                    (dsUltimaChapa != null && dsUltimaChapa.values !== undefined) ? dsUltimaChapa.values.length : 0;

                if (numLinhas > 0) {
                    var ultimaChapaRaw = (typeof dsUltimaChapa.getValue === "function") ? dsUltimaChapa.getValue(0, "ULTIMA_CHAPA_CADASTRADA") : dsUltimaChapa.values[0]["ULTIMA_CHAPA_CADASTRADA"];
                    var tamanhoChapaRaw = (typeof dsUltimaChapa.getValue === "function") ? dsUltimaChapa.getValue(0, "TAMCHAPA") : dsUltimaChapa.values[0]["TAMCHAPA"];

                    var ultimaChapaStr = String(ultimaChapaRaw || "");
                    var tamanhoChapa = parseInt(String(tamanhoChapaRaw || "5"), 10);

                    if (ultimaChapaStr && ultimaChapaStr.indexOf("ERRO") === -1) {
                        var novaChapa = (parseInt(ultimaChapaStr, 10) + 1).toString();
                        while (novaChapa.length < tamanhoChapa) novaChapa = "0" + novaChapa;
                        chapa = novaChapa;
                    } else throw "Falha interna RM: " + ultimaChapaStr;
                }
            } catch (errChapa) { throw "ERRO AO CALCULAR A PRÓXIMA CHAPA: " + errChapa; }
        }

        // =========================================================================
        // 4. EXTRAÇÃO DOS DADOS (COM BLINDAGEM DE STRING E SPLIT)
        // =========================================================================
        var codPessoa = getStr("FUN_CODPESSOA");
        if (codPessoa === "0" || codPessoa.toUpperCase() === "NULL" || codPessoa.toUpperCase() === "UNDEFINED") codPessoa = "";

        var cpf = limparPontuacao(getStr("cpfcnpj"));
        var dtNasc = formatarDataRM(getStr("dtDataNascColaborador"));

        // Tratamento robusto Raça/Cor
        var racaCorRaw = getStr("CORRACA").toUpperCase();
        var racaCor = "";
        if (racaCorRaw === "0" || racaCorRaw.indexOf("INDIGENA") > -1) racaCor = "0";
        else if (racaCorRaw === "2" || racaCorRaw === "1" || racaCorRaw.indexOf("BRANCA") > -1) racaCor = "2";
        else if (racaCorRaw === "4" || racaCorRaw.indexOf("PRETA") > -1 || racaCorRaw.indexOf("NEGRA") > -1) racaCor = "4";
        else if (racaCorRaw === "6" || racaCorRaw.indexOf("AMARELA") > -1) racaCor = "6";
        else if (racaCorRaw === "8" || racaCorRaw.indexOf("PARDA") > -1) racaCor = "8";
        else if (racaCorRaw === "9" || racaCorRaw.indexOf("NÃO INFORMADO") > -1) racaCor = "9";
        else racaCor = "10";

        var grauInstrucao = getGrauInstrucaoRM(getStr("txtEscolaridade"));
        var estadoEnd = getUF(getStr("txtEstado"));
        var pais = getStr("txtPAIS");
        var dtAdmissaoXML = formatarDataRM(getStr("FUN_ADMISSAO"));
        if (!dtAdmissaoXML) throw "ERRO: Data de Admissão obrigatória não preenchida.";

        var salario = formatarSalario(getStr("FUN_VLRSALARIO"));
        var horasMensaisNum = parseFloat(getStr("cpQtdHorasMes") || getStr("FUN_HRMENSAIS") || "220");
        var usaSalComposto = getStr("cpUsaSalarioComposto") === "Sim" ? "1" : "0";

        // Funções genéricas de limpeza de IDs (pegando só o que vem antes do traço)
        var cleanId = function (val) { return val && val.indexOf("-") > -1 ? val.split("-")[0].trim() : val; };

        var codCCusto = cleanId(getStr("FUN_CC") || getStr("FUN_CCIDDESC"));
        var catESocial = cleanId(getStr("FUN_CATESOCIAL") || getStr("FUN_CATESOCIAL_IDDESC_AD"));
        var codSindicato = cleanId(getStr("cod_sindicato"));
        var seqTurno = cleanId(getStr("FUN_SEQTURN_IDDESC_AD") || getStr("FUN_SEQTURN"));
        var motivoAdmissao = cleanId(getStr("zoom_motivoAdmissao")) || "01";
        var codHorario = cleanId(getStr("FUN_CODTURN") || getStr("FUN_IDDESCTURN")) || "0001";
        if (codHorario.toUpperCase() === "CLT") codHorario = "0001";
        if (codHorario && codHorario.toUpperCase() === "CLT") codHorario = "0001";
        var codSecao = cleanId(getStr("FUN_SECAO") || getStr("FUN_SECAO_IDDESC_AD"));
        var codFuncao = cleanId(getStr("FUN_FUNCAO") || getStr("FUN_IDDESCFUN"));
        var tipoAdmissao = cleanId(getStr("FUN_TPADMISSAO_IDDESC_AD") || getStr("FUN_TPADMISSAO")) || "N";
        var codTipoFunc = getStr("codTipoFuncionario") || "N";
        var codCategoria = cleanId(getStr("FUN_CATSEFIP_IDDESC"));
        var tipoRegimeTrab = cleanId(getStr("cpRegimeTrabalhista"));
        var tipoRegimePrev = cleanId(getStr("cpRegimePrevidenciario") || getStr("FUN_TPREGIMEPREV")) || "1";
        if (tipoRegimePrev.length > 1) tipoRegimePrev = tipoRegimePrev.substring(0, 1);

        var contribSindical = cleanId(getStr("FUN_PGCTSIN_IDDESC_AD"));
        var integrContabil = cleanId(getStr("FUN_INTEGRCONTABIL_IDDESC"));
        var integrGerencial = cleanId(getStr("FUN_INTEGRGERENCIAL_IDDESC"));
        var indicativoAdmissao = cleanId(getStr("FUN_INDADMISSAO"));

        // =========================================================================
        // 5. MONTAGEM DO XML DO RM (COM OMISSÃO AUTOMÁTICA DE TAGS VAZIAS)
        // =========================================================================
        var xmlFunc = "<FopFunc>\n  <PFunc>\n";

        xmlFunc += tag("CODCOLIGADA", COLIGADA);
        xmlFunc += tag("CODFILIAL", getStr("FUN_FILIAL") || "1");
        xmlFunc += tag("CHAPA", (chapa == null || chapa == "") ? "-1" : chapa);

        if (codPessoa !== "") {
            xmlFunc += tag("CODPESSOA", codPessoa);
            xmlFunc += tag("CODIGO", codPessoa);
        }

        xmlFunc += tag("CODSITUACAO", "A");
        xmlFunc += tag("CODTIPO", codTipoFunc);
        if (tipoAdmissao) xmlFunc += tag("TIPOADMISSAO", tipoAdmissao);
        xmlFunc += tag("MOTIVOADMISSAO", motivoAdmissao);
        xmlFunc += tag("CODRECEBIMENTO", getStr("FUN_TIPOPGTO_IDDESC_AD").substring(0, 1).toUpperCase());
        if (codCategoria) xmlFunc += tag("CODCATEGORIA", codCategoria);
        xmlFunc += tag("SALARIO", salario);
        xmlFunc += tag("DATAADMISSAO", dtAdmissaoXML);
        xmlFunc += tag("DTBASE", dtAdmissaoXML);
        xmlFunc += tag("DTMUDANCASALARIO", dtAdmissaoXML);
        xmlFunc += tag("MOTMUDANCASALARIO", cleanId(getStr("zoom_motivoMudancaSalario")) || "01");
        xmlFunc += tag("DTMUDANCAFUNCAO", dtAdmissaoXML);
        xmlFunc += tag("MOTMUDANCAFUNCAO", cleanId(getStr("zoom_motivoMudancaFuncao")) || "01");
        xmlFunc += tag("DTMUDANCASECAO", dtAdmissaoXML);
        xmlFunc += tag("MOTMUDANCASECAO", cleanId(getStr("zoom_motivoMudancaSecao")) || "01");
        xmlFunc += tag("DTMUDANCAHORARIO", dtAdmissaoXML);
        xmlFunc += tag("HSTSIT_DATAMUDANCA", dtAdmissaoXML);
        xmlFunc += tag("HSTSIT_MOTIVO", cleanId(getStr("zoom_motivoMudancaSituacao")) || "01");

        // O RM exige a data de SEFIP na inclusão para todos, não podemos bloquear
        xmlFunc += tag("HSTSEFIP_DTMUDANCA", dtAdmissaoXML);

        // MANTÉM A PROTEÇÃO APENAS NO SINDICATO (Que era o erro original)
        if (codSindicato && codSindicato !== "") {
            xmlFunc += tag("DTMUDANCACONTRIBSINDICAL", dtAdmissaoXML);
        }

        // =========================================================================
        // REGRAS DE CONTRATO COM PRAZO / EXPERIÊNCIA
        // =========================================================================
        var tipoContratoPrazo = getStr("cpContratoPrazo");
        var dtFimContrato = formatarDataRM(getStr("cpTerminoContrato"));
        var assecuratoria = getStr("cpClausulaAssecuratoria") === "sim" ? "1" : "0";

        if (tipoContratoPrazo === "determinado" || tipoContratoPrazo === "experiencia") {
            // Marca a Flag de Contrato com Prazo como Sim (1)
            xmlFunc += tagInt("TEMPRAZOCONTR", "1");

            // Envia a Data Final e a Cláusula
            if (dtFimContrato) xmlFunc += tag("FIMPRAZOCONTR", dtFimContrato);
            xmlFunc += tagInt("TEMCLAUASSEG", assecuratoria);

            // Define o Tipo de Contrato no RM (Geralmente 2 = Experiência, 1 = Prazo Determinado/Lei 9601)
            var codTipoPrazo = (tipoContratoPrazo === "experiencia") ? "2" : "1";
            xmlFunc += tag("TIPOCONTRATOPRAZO", codTipoPrazo);

        } else {
            // Se for Indeterminado ou vazio, a Flag fica Não (0)
            xmlFunc += tagInt("TEMPRAZOCONTR", "0");
        }

        xmlFunc += tag("CODHORARIO", codHorario);
        xmlFunc += tag("JORNADAMENSAL", parseInt(horasMensaisNum * 60));
        xmlFunc += tag("Jornada_Mensal", horasMensaisNum + ":00");
        xmlFunc += tag("INDINICIOHOR", getStr("cpIndiceInicioHorario") || seqTurno);
        xmlFunc += tag("TIPOREGIMEJORNADA", getStr("FUN_TPJORNADA") || "1");
        xmlFunc += tag("TPREGIMEPREV", tipoRegimePrev);
        if (tipoRegimeTrab) xmlFunc += tag("TIPOREGIMETRABALHISTA", tipoRegimeTrab);
        xmlFunc += tagInt("USASALCOMPOSTO", usaSalComposto);

        // O SEGREDO ESTÁ AQUI: Se a variável estiver vazia, o IF pula e a tag não é enviada! (Adeus erro de FK)
        if (codSecao) xmlFunc += tag("CODSECAO", codSecao);
        if (codCCusto) xmlFunc += tag("CODCCUSTO", codCCusto);
        if (catESocial) xmlFunc += tag("CODCATEGORIAESOCIAL", catESocial);
        if (codFuncao) xmlFunc += tag("CODFUNCAO", codFuncao);
        if (codSindicato) xmlFunc += tag("CODSINDICATO", codSindicato);

        var sindicatoFiliacao = cleanId(getStr("FUN_CODDESCSINDICATOFILIACAO"));
        if (sindicatoFiliacao) xmlFunc += tag("CODSINDICATOFILIACAO", sindicatoFiliacao);

        var vinculoEmpreg = cleanId(getStr("FUN_VINCEMPREG_IDDESC_AD") || getStr("FUN_VINCEMPREG"));
        if (vinculoEmpreg) xmlFunc += tag("VINCULORAIS", vinculoEmpreg);

        xmlFunc += tag("SITUACAORAIS", getStr("cpSituacaoRais") || "1");
        xmlFunc += tag("SITUACAOFGTS", getStr("FUN_ALTFGTS"));
        xmlFunc += tag("DTSALDOFGTS", formatarDataRM(getStr("cpDataUltimoSaldoFGTS")));
        xmlFunc += tag("ESOCIALNATATIVIDADE", getStr("FUN_NATATIV"));

        if (indicativoAdmissao && indicativoAdmissao !== "S" && indicativoAdmissao !== "N") xmlFunc += tag("INDADMISSAO", indicativoAdmissao);

        xmlFunc += tag("SITUACAOINSS", getStr("FUN_INSS"));
        xmlFunc += tag("SITUACAOIRRF", getStr("FUN_IRRF"));

        if (contribSindical && contribSindical !== "S" && contribSindical !== "N") xmlFunc += tag("CONTRIBSINDICAL", contribSindical);
        // if (integrContabil && integrContabil !== "S" && integrContabil !== "N") xmlFunc += tag("INTEGRCONTABIL", integrContabil);
        //if (integrGerencial && integrGerencial !== "S" && integrGerencial !== "N") xmlFunc += tag("INTEGRGERENCIAL", integrGerencial);

        var codOcorrencia = cleanId(getStr("FUN_CODOCORRENCIA_IDDESC"));
        if (codOcorrencia) xmlFunc += tag("CODOCORRENCIA", codOcorrencia);

        // var codEquipe = getStr("cpCodigoEquipe");
        // if (codEquipe) xmlFunc += tag("CODEQUIPE", codEquipe);

        var codQuiosque = cleanId(getStr("FUN_CODQUIOSQUE_IDDESC"));
        if (codQuiosque) xmlFunc += tag("CODGRPQUIOSQUE", codQuiosque);

        xmlFunc += tagInt("USAVALETRANSP", getStr("ValeTransp") === "1" ? "1" : "0");
        xmlFunc += tagInt("TEMPOPARCIAL", getStr("FUN_CONTRATOPARCIAL") || "0");

        // Dados Pessoais
        xmlFunc += tag("NOME", getStr("txtNomeColaborador"));
        xmlFunc += tag("NOMESOCIAL", getStr("txtNomeSocial"));
        xmlFunc += tag("NOMEMAE", getStr("cand_mae_nome_") || getStr("txtNomDepen2"));
        xmlFunc += tag("NOMEPAI", getStr("cand_pai_nome_") || getStr("txtNomDepen3"));
        xmlFunc += tag("CPF", cpf);
        xmlFunc += tag("DTNASCIMENTO", dtNasc);
        xmlFunc += tag("SEXO", getStr("txtSexo"));
        xmlFunc += tag("ESTADOCIVIL", getEstadoCivilRM(getStr("txtEstadoCivil")));
        xmlFunc += tag("CORRACA", racaCor);
        xmlFunc += tag("GRAUINSTRUCAO", grauInstrucao);
        xmlFunc += tag("NACIONALIDADE", getStr("NACIONALIDADECod"));
        xmlFunc += tag("NATURALIDADE", getStr("txtNaturalidade"));
        xmlFunc += tag("CODNATURALIDADE", getStr("txtNaturalidadeCod"));
        xmlFunc += tag("ESTADONATAL", getUF(getStr("ESTADO")));

        var tpSanguineo = cleanId(getStr("TipoSanguineo"));
        if (tpSanguineo) xmlFunc += tag("TIPOSANG", tpSanguineo);

        // Endereço
        xmlFunc += tag("CEP", limparPontuacao(getStr("txtCEP")));
        xmlFunc += tag("CODTIPORUA", getTipoRua(getStr("_txtNOMETIPORUA") || getStr("txtNOMETIPORUA")));
        xmlFunc += tag("RUA", getStr("txtRUA"));
        xmlFunc += tag("NUMERO", getStr("txtNUMERO"));
        xmlFunc += tag("COMPLEMENTO", getStr("txtCOMPLEMENTO"));
        xmlFunc += tag("CODTIPOBAIRRO", getTipoBairro(getStr("txtNOMETIPOBAIRRO") || getStr("_txtNOMETIPOBAIRRO")));
        xmlFunc += tag("BAIRRO", getStr("txtBAIRRO"));
        xmlFunc += tag("CIDADE", getStr("txtNOMEMUNICIPIO"));
        var codMunicipio = getStr("txtCODMUNICIPIO");
        if (codMunicipio) xmlFunc += tag("CODMUNICIPIO", codMunicipio);
        xmlFunc += tag("ESTADO", getUF(getStr("txtNOMECODETD")));
        xmlFunc += tag("PAIS", pais);


        // Contato e Docs
        xmlFunc += tag("TELEFONE1", limparPontuacao(getStr("txtTELEFONE")));
        xmlFunc += tag("TELEFONE2", limparPontuacao(getStr("txtCELULAR")));
        xmlFunc += tag("EMAIL", getStr("txtEmail"));
        xmlFunc += tag("EMAILPESSOAL", getStr("txtEmail"));

        xmlFunc += tagInt("NIT", "0");
        xmlFunc += tagInt("ANO1EMPREGO", getStr("PIS_Ano_Primeiro_Emp"));
        xmlFunc += tagInt("DEFICIENTEFISICO", getStr("DEFICIENTEFISICO"));
        xmlFunc += tagInt("DEFICIENTEAUDITIVO", getStr("DEFICIENTEAUDITIVO"));
        xmlFunc += tagInt("DEFICIENTEFALA", getStr("DEFICIENTEFALA"));
        xmlFunc += tagInt("DEFICIENTEVISUAL", getStr("DEFICIENTEVISUAL"));
        xmlFunc += tagInt("DEFICIENTEMENTAL", getStr("DEFICIENTEMENTAL"));
        xmlFunc += tagInt("DEFICIENTEINTELECTUAL", getStr("DEFICIENTEINTELECTUAL"));

        xmlFunc += tag("CARTIDENTIDADE", getStr("TxtRg"));
        xmlFunc += tag("UFCARTIDENT", getUF(getStr("UFCARTIDENTIDADE")));
        xmlFunc += tag("ORGEMISSORIDENT", getStr("ORGAOCARTIDENTIDADE"));
        xmlFunc += tag("DTEMISSAOIDENT", formatarDataRM(getStr("DTEMISSAOIDENT")));

        xmlFunc += tag("TITULOELEITOR", getStr("TITULOELEITOR"));
        xmlFunc += tag("ZONATITELEITOR", getStr("ZONATITELEITOR"));
        xmlFunc += tag("SECAOTITELEITOR", getStr("SECAOTITELEITOR"));
        xmlFunc += tag("DTTITELEITOR", formatarDataRM(getStr("DTTITELEITOR")));
        xmlFunc += tag("ESTELEIT", getUF(getStr("UFTITULO")));

        xmlFunc += tag("CARTEIRATRAB", getStr("txtCartTrab"));
        xmlFunc += tag("SERIECARTTRAB", getStr("txtSerieCart"));
        xmlFunc += tag("UFCARTTRAB", getUF(getStr("UFCARTTRAB")));
        xmlFunc += tag("DTCARTTRAB", formatarDataRM(getStr("dtDataEmissaoCartTrab")));

        xmlFunc += tag("CARTMOTORISTA", getStr("CARTMOTORISTA"));
        xmlFunc += tag("TIPOCARTHABILIT", getStr("TIPOCARTHABILIT"));
        xmlFunc += tag("DTVENCHABILIT", formatarDataRM(getStr("DTVENCHABILIT")));
        xmlFunc += tag("ORGEMISSORCNH", getStr("ORGEMISSORCNH"));
        xmlFunc += tag("DTEMISSAOCNH", formatarDataRM(getStr("DTEMISSAOCNH")));
        xmlFunc += tag("DATAPRIMEIRACNH", formatarDataRM(getStr("DTEmPrimCNH")));
        xmlFunc += tag("UFCNH", getUF(getStr("CodUFCNH") || getStr("UFCNH")));

        xmlFunc += tag("CERTIFRESERV", getStr("CERTIFRESERV"));
        xmlFunc += tag("CATEGMILITAR", getStr("Reservista_Categoria"));
        xmlFunc += tag("CSM", getStr("Reservista_Circunscricao"));
        xmlFunc += tag("RM", getStr("Reservista_Regiao"));
        xmlFunc += tag("DTEXPCML", formatarDataRM(getStr("DtCERTIFRESERV")));
        xmlFunc += tag("EXPED", getStr("Reservista_Orgao"));
        xmlFunc += tag("SITMILITAR", getStr("SitMilitar"));

        xmlFunc += tag("NUMEROCARTAOSUS", limparPontuacao(getStr("Cartao_SUS")));

        xmlFunc += tag("PISPASEP", limparPontuacao(getStr("PIS")));

        xmlFunc += tag("NPASSAPORTE", getStr("Passaporte_Num"));
        xmlFunc += tag("DTEMISSPASSAPORTE", formatarDataRM(getStr("Passaporte_Emissao")));
        xmlFunc += tag("DTVALPASSAPORTE", formatarDataRM(getStr("Passaporte_Validade")));

        // Dados Bancários
        var codBanco = cleanId(getStr("txtCodBanPgto") || getStr("num_banco"));
        var codAgencia = cleanId(getStr("CodAgPagto") || getStr("num_agencia"));
        var contaCorrente = getStr("ContPagto");

        if (codBanco && contaCorrente) {
            xmlFunc += tag("CODBANCOPAGTO", codBanco);
            xmlFunc += tag("CODAGENCIAPAGTO", codAgencia);
            xmlFunc += tag("CONTAPAGAMENTO", contaCorrente);
            xmlFunc += tag("TPCONTABANCARIA", getStr("TipodeContPagto"));
            xmlFunc += tag("HSTBANCO_DTMUDANCA", dtAdmissaoXML);

            var bancoFGTS = cleanId(getStr("FUN_BANCOFGTS"));
            if (bancoFGTS) xmlFunc += tag("CODBANCOFGTS", bancoFGTS);

            var contaFGTS = getStr("cpContaFGTS");
            if (contaFGTS) xmlFunc += tag("CONTAFGTS", contaFGTS);

            var bancoPIS = cleanId(getStr("FUN_CODBANCOPIS"));
            if (bancoPIS) xmlFunc += tag("CODBANCOPIS", bancoPIS);

            var opBancaria = getStr("cpOperacaoBancaria");
            if (opBancaria) xmlFunc += tag("OPBANCARIA", opBancaria);
        }

        xmlFunc += tag("PERCENTADIANT", getStr("FUN_PADT"));
        xmlFunc += tag("AJUDACUSTO", formatarSalario(getStr("FUN_AJUDACUSTO")));
        var arredondamento = getStr("cpArredondamento") === "Sim" ? "1" : "0";
        xmlFunc += tag("ARREDONDAMENTO", arredondamento);


        xmlFunc += "  </PFunc>\n</FopFunc>";

        log.info("### XML DE INTEGRAÇÃO MONTADO (FUNCIONÁRIO): \n" + xmlFunc);

        // =========================================================================
        // 6. CONSUMO DO WEBSERVICE SOAP DO RM
        // =========================================================================
        var serviceProvider = ServiceManager.getService(NOME_SERVICO_FLUIG);
        var serviceLocator = serviceProvider.instantiate("com.totvs.WsDataServer");
        var authService = serviceLocator.getRMIwsDataServer();

        var client = authService;
        var bindingProvider = client;
        var requestContext = bindingProvider.getRequestContext();
        requestContext.put("javax.xml.ws.security.auth.username", RM_USER);
        requestContext.put("javax.xml.ws.security.auth.password", RM_PASS);

        try { requestContext.put("javax.xml.ws.service.endpoint.address", ENDPOINT_URL); } catch (e) { }

        var result = authService.saveRecord("FopFuncData", xmlFunc, RM_CONTEXTO);
        log.info("### RETORNO RM (FUNCIONÁRIO): " + result);

        // =========================================================================
        // TRATAMENTO DE AUTO-CORREÇÃO (PESSOA JÁ EXISTENTE)
        // =========================================================================
        if (result && result.indexOf("Foi encontrada uma pessoa com os mesmos dados") > -1) {
            var matchPessoa = result.match(/(\d+)\s+-/);
            if (matchPessoa && matchPessoa.length > 1) {
                var codPessoaExtraido = matchPessoa[1];
                log.info("### AUTO-CORREÇÃO: Injetando CODPESSOA: " + codPessoaExtraido);

                if (xmlFunc.indexOf("<CODPESSOA>") > -1) {
                    xmlFunc = xmlFunc.replace(/<CODPESSOA>.*?<\/CODPESSOA>/, "<CODPESSOA>" + codPessoaExtraido + "</CODPESSOA>\n    <CODIGO>" + codPessoaExtraido + "</CODIGO>");
                } else {
                    xmlFunc = xmlFunc.replace("</CHAPA>", "</CHAPA>\n    <CODPESSOA>" + codPessoaExtraido + "</CODPESSOA>\n    <CODIGO>" + codPessoaExtraido + "</CODIGO>");
                }

                result = authService.saveRecord("FopFuncData", xmlFunc, RM_CONTEXTO);
                hAPI.setCardValue("FUN_CODPESSOA", codPessoaExtraido);
            }
        }

        // =========================================================================
        // 7. VALIDAÇÃO DO RETORNO E CAPTURA DE CODPESSOA
        // =========================================================================
        var chapaFinal = "";
        if (result && result.indexOf("===") == -1) {
            chapaFinal = result.indexOf(";") > -1 ? result.split(";")[1] : result;
            hAPI.setCardValue("FUN_CHAPA", chapaFinal);
            hAPI.setCardValue("TxtChapa", chapaFinal);
            log.info("### SUCESSO! CHAPA GERADA: " + chapaFinal);

            // Captura o CodPessoa gerado pelo RM (Se for pessoa nova)
            try {
                if (!getStr("FUN_CODPESSOA")) {
                    var pkFuncionario = COLIGADA + ";" + chapaFinal;
                    var xmlRetornoRM = authService.readRecord("FopFuncData", pkFuncionario, RM_CONTEXTO);
                    var matchCodPessoaLeitura = String(xmlRetornoRM).match(/<CODPESSOA>(.*?)<\/CODPESSOA>/);

                    if (matchCodPessoaLeitura && matchCodPessoaLeitura.length > 1) {
                        hAPI.setCardValue("FUN_CODPESSOA", matchCodPessoaLeitura[1]);
                    }
                }
            } catch (errRead) { log.warn("### Falha ao ler CODPESSOA: " + errRead); }

        } else {
            throw "O RM rejeitou a admissão. Detalhes: " + result;
        }

        // =========================================================================
        // 8. INTEGRAÇÃO DOS DEPENDENTES (MANTIDA DO SEU PROJETO ATUAL)
        // =========================================================================
        try {
            var xmlDepend = "";
            var nroDepend = 0;
            var indexesDep = hAPI.getChildrenIndexes("tbItens");

            for (var i = 0; i < indexesDep.length; i++) {
                var idx = indexesDep[i];
                var nomeDep = getStr("txtNomDepen___" + idx);

                if (nomeDep !== "") {
                    nroDepend++;
                    var cpfDep = limparPontuacao(getStr("TxtCPFDep___" + idx));
                    var dtNascDep = formatarDataRM(getStr("cpDataNascimentoDep___" + idx));
                    var sexoDep = getStr("txtSexoDepen___" + idx);
                    var grauParentesco = getGrauParentesco(getStr("codParentesco___" + idx) || getStr("txtParentescoDepen___" + idx));

                    xmlDepend += "  <PFDepend>\n";
                    xmlDepend += tag("CODCOLIGADA", COLIGADA);
                    xmlDepend += tag("CHAPA", chapaFinal);
                    xmlDepend += tag("NRODEPEND", nroDepend.toString());
                    xmlDepend += tag("NOME", nomeDep);
                    if (cpfDep !== "") xmlDepend += tag("CPF", cpfDep);
                    if (dtNascDep !== "") xmlDepend += tag("DTNASCIMENTO", dtNascDep);
                    if (sexoDep !== "") xmlDepend += tag("SEXO", sexoDep.substring(0, 1).toUpperCase());
                    xmlDepend += tag("ESTADOCIVIL", getEstadoCivilRM(getStr("txtEstCivilCodDepen___" + idx) || getStr("txtEstadoCivilDepen___" + idx)));

                    xmlDepend += tag("NUMEROCARTAOSUS", limparPontuacao(getStr("TxtCartaoSusDep___" + idx)));
                    xmlDepend += tag("OBSERVACAO", getStr("TxtObsDep___" + idx));

                    xmlDepend += tag("INCIRRF", getStr("TxtIncIRRF___" + idx) || "0");
                    xmlDepend += tag("INCINSS", getStr("TxtIncINSS___" + idx) || "0");
                    xmlDepend += tag("INCASSISTMEDICA", getStr("TxtIncMedica___" + idx) || "0");
                    xmlDepend += tag("INCASSISTODONTO", getStr("TxtIncOdonto___" + idx) || "0");
                    xmlDepend += tag("INCPENSAO", getStr("TxtIncPensao___" + idx) || "0");

                    if (grauParentesco !== "") xmlDepend += tag("GRAUPARENTESCO", grauParentesco);

                    xmlDepend += tag("PERCENTUAL", "0.00");
                    xmlDepend += tag("BRUTO", "0");
                    xmlDepend += tag("UNIVERSITARIO", "0");
                    xmlDepend += tag("INCSALFAM", getStr("TxtIncSalFamilia___" + idx) || "0");

                    var cartorio = getStr("TxtCartorio___" + idx);
                    if (cartorio !== "") xmlDepend += tag("CARTORIO", cartorio);
                    var registro = getStr("TxtRegistro___" + idx);
                    if (registro !== "") xmlDepend += tag("NROREGISTRO", registro);
                    var livro = getStr("TxtLivro___" + idx);
                    if (livro !== "") xmlDepend += tag("NROLIVRO", livro);
                    var folha = getStr("TxtFolha___" + idx);
                    if (folha !== "") xmlDepend += tag("NROFOLHA", folha);

                    xmlDepend += "  </PFDepend>\n";

                    var incMedicaDep = getStr("TxtIncMedica___" + idx) || "0";
                    var incOdontoDep = getStr("TxtIncOdonto___" + idx) || "0";

                    var dataAMDep = formatarDataRM(
                        getStr("cpDataInclusaoAMDep___" + idx) ||
                        getStr("cpDataInclusaoAM")
                    );

                    var dataAODep = formatarDataRM(
                        getStr("cpDataInclusaoAODep___" + idx) ||
                        getStr("cpDataInclusaoAO")
                    );

                    if (incMedicaDep === "1" || incOdontoDep === "1") {
                        xmlDepend += "  <PFDEPENDCOMPL>\n";
                        xmlDepend += tag("CODCOLIGADA", COLIGADA);
                        xmlDepend += tag("CHAPA", chapaFinal);
                        xmlDepend += tag("NRODEPEND", nroDepend.toString());

                        if (incMedicaDep === "1" && dataAMDep !== "") {
                            xmlDepend += tag("DTASSMED", dataAMDep);
                        }

                        if (incOdontoDep === "1" && dataAODep !== "") {
                            xmlDepend += tag("DTASSODO", dataAODep);
                        }

                        xmlDepend += "  </PFDEPENDCOMPL>\n";
                    }
                }
            }

            if (xmlDepend !== "") {
                var xmlDependFull = "<FopDepend>\n" + xmlDepend + "</FopDepend>";
                var resultDep = authService.saveRecord("FopDependData", xmlDependFull, RM_CONTEXTO);
                if (resultDep && resultDep.indexOf("===") != -1) throw "Erro dependentes: " + resultDep;
            }
        } catch (errDep) { throw errDep; }

    } catch (e) {
        log.error("### ERRO FATAL NA INTEGRAÇÃO RM: " + e);
        throw e;
    }
}