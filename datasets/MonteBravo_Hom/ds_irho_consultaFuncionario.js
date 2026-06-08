function getDescEstadoCivil(val) {
    var v = String(val || "").trim().toUpperCase();
    var map = { "S": "Solteiro(a)", "C": "Casado(a)", "D": "Divorciado(a)", "V": "Viúvo(a)", "P": "Separado(a)", "E": "União Estável", "O": "Outros" };
    return map[v] || v;
}

function getDescEscolaridade(val) {
    var v = String(val || "").trim().toUpperCase();
    var map = {
        "1": "Analfabeto", "2": "Até o 5º ano incompleto do ensino fundamental", "3": "5º ano completo do ensino fundamental", "4": "Do 6º ao 9º ano do ensino fundamental",
        "5": "Ensino fundamental completo", "6": "Ensino médio incompleto", "7": "Ensino médio completo", "8": "Educação superior incompleto", "9": "Educação superior completo",
        "A": "Pós Grad. incompleto", "B": "Pós Grad. completo", "C": "Mestrado incompleto", "D": "Mestrado completo", "E": "Doutorado incompleto", "F": "Doutorado completo",
        "G": "Pós Dout. incompleto", "H": "Pós Dout. completo"
    };
    return map[v] || v;
}

function getDescTipoRua(val) {
    var v = String(val || "").trim().toUpperCase();
    var map = { "1": "Rua", "6": "Avenida", "4": "Alameda", "18": "Estrada", "34": "Rodovia", "30": "Praça", "39": "Travessa", "42": "Viela" };
    return map[v] || v;
}

function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();

    // 1. Colunas Mapeadas EXATAMENTE como o preencherInfoFuncionario() do view.js espera receber
    var colunas = [
        "FUN_NOME", "FUN_NASCIMENTO", "FUN_RACACOR", "FUN_NACIONALIDADE", "FUN_UFNASCIMENTO",
        "FUN_CODMUNASC", "FUN_SEXO", "FUN_ESTADOCIV", "FUN_CODGINRAI", "FUN_TIPOSANG",
        "FUN_MNOME", "FUN_PNOME", "FUN_DEFICIENTEFISICO", "FUN_DEFICIENTEAUDITIVO",
        "FUN_DEFICIENTEFALA", "FUN_DEFICIENTEVISUAL", "FUN_DEFICIENTEMENTAL", "FUN_DEFICIENTEINTELECTUAL",
        "FUN_RG", "FUN_RGUF", "FUN_RGORG", "FUN_DTRG", "FUN_TITULOELEITOR", "FUN_TITULOELEITOR_ZONA",
        "FUN_DTTITELEITOR", "FUN_TITULOELEITOR_SECAO", "FUN_ESTELEIT", "FUN_CARTEIRAPROF",
        "FUN_SERCART", "FUN_DTCARTTRAB", "FUN_UFCP", "FUN_HABILIT", "FUN_CNHCAT", "FUN_DTCNHVALID",
        "FUN_CNHORG", "FUN_DATAPRIMEIRACNH", "FUN_UFCNH", "FUN_PIS", "FUN_NR_CART_RESERVISTA",
        "DtCERTIFRESERV", "FUN_CEP", "FUN_TPLOGRADOURO", "FUN_LOGRADOURODESC", "FUN_NUMLOGRADOURO",
        "FUN_ENDERECOM", "FUN_BAIRRO", "FUN_UF", "FUN_CODIBGE", "FUN_PAIS_ENDERECO",
        "FUN_TELEFONE", "FUN_CELULAR", "FUN_EMAIL",
        "FUN_NATURALIDADE_DESC_AD", "FUN_ESTADOCIV_DESC_AD", "FUN_CODGINRAI_DESC_AD", "FUN_TPLOGRADOURO_DESC_AD",
        "ERROR"
    ];

    for (var c = 0; c < colunas.length; c++) {
        dataset.addColumn(colunas[c]);
    }

    // 2. Leitura do CPF enviado pelo view.js
    var filtroCpf = "16227127655";

    if (constraints != null && constraints.length > 0) {
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "cpf" || constraints[i].fieldName == "CPF") {
                // Pega o CPF e remove qualquer ponto ou traço que possa ter vindo
                filtroCpf = String(constraints[i].initialValue).replace(/[^\d]/g, '');
            }
        }
    }

    // Se a tela não enviou CPF, não faz a busca
    if (filtroCpf === "") {
        dataset.addRow(criarLinhaVazia(colunas, "CPF não informado na busca."));
        return dataset;
    }

    // 3. Montagem dos Parâmetros para a Query FLUIG.0001
    var nomeConsulta = "FLUIG.0001";
    var parametros = "CPF=" + filtroCpf;

    try {
        log.info("### BUSCA DE FUNCIONARIO - RM | PARAMS: " + parametros);

        var paramFields = new Array(nomeConsulta, parametros);
        var dsConector = DatasetFactory.getDataset("ds_connector_irho", paramFields, null, null);

        if (dsConector != null && dsConector.rowsCount > 0) {
            var resultadoRaw = String(dsConector.getValue(0, "RESULTADO") || "");

            if (resultadoRaw.indexOf("ERRO") === 0) {
                throw "Falha no conector base: " + resultadoRaw;
            }

            if (resultadoRaw && resultadoRaw != "") {
                var parsedData = JSON.parse(resultadoRaw);
                var rows = parsedData.Resultado;

                if (rows) {
                    // Pega apenas o primeiro registro (caso retorne mais de um)
                    var item = Array.isArray(rows) ? rows[0] : rows;

                    var linha = new Array(colunas.length);
                    for (var x = 0; x < linha.length; x++) linha[x] = ""; // Inicializa tudo vazio

                    // =======================================================
                    // MAPEAMENTO DE-PARA (SQL DO RM -> VARIÁVEIS DO FLUIG)
                    // =======================================================

                    // Dados Pessoais
                    linha[0] = String(item.NOME || "");                   // FUN_NOME
                    linha[1] = String(item.DTNASCIMENTO || "");           // FUN_NASCIMENTO
                    linha[2] = String(item.CORRACA || "");                // FUN_RACACOR
                    linha[3] = String(item.NACIONALIDADE || "");          // FUN_NACIONALIDADE
                    linha[4] = String(item.ESTADONATAL || "");            // FUN_UFNASCIMENTO
                    linha[5] = String(item.CODMUNICIPIO || "");           // FUN_CODMUNASC
                    linha[6] = String(item.SEXO || "");                   // FUN_SEXO
                    linha[7] = String(item.ESTADOCIVIL || "");            // FUN_ESTADOCIV
                    linha[8] = String(item.GRAUINSTRUCAO || "");          // FUN_CODGINRAI
                    linha[9] = String(item.TIPOSANG || "");               // FUN_TIPOSANG
                    linha[10] = String(item.MAE || "");                    // FUN_MNOME
                    linha[11] = String(item.PAI || "");                    // FUN_PNOME

                    // Deficiências
                    linha[12] = String(item.DEFICIENTEFISICO || "0");      // FUN_DEFICIENTEFISICO
                    linha[13] = String(item.DEFICIENTEAUDITIVO || "0");    // FUN_DEFICIENTEAUDITIVO
                    linha[14] = String(item.DEFICIENTEFALA || "0");        // FUN_DEFICIENTEFALA
                    linha[15] = String(item.DEFICIENTEVISUAL || "0");      // FUN_DEFICIENTEVISUAL
                    linha[16] = String(item.DEFICIENTEMENTAL || "0");      // FUN_DEFICIENTEMENTAL
                    linha[17] = String(item.DEFICIENTEINTELECTUAL || "0"); // FUN_DEFICIENTEINTELECTUAL

                    // Documentos
                    linha[18] = String(item.CARTIDENTIDADE || "");         // FUN_RG
                    linha[19] = String(item.UFCARTIDENT || "");            // FUN_RGUF
                    linha[20] = String(item.ORGEMISSORIDENT || "");        // FUN_RGORG
                    linha[21] = String(item.DTEMISSAOIDENT || "");         // FUN_DTRG
                    linha[22] = String(item.TITULOELEITOR || "");          // FUN_TITULOELEITOR
                    linha[23] = String(item.ZONATITELEITOR || "");         // FUN_TITULOELEITOR_ZONA
                    linha[24] = String(item.DTTITELEITOR || "");           // FUN_DTTITELEITOR
                    linha[25] = String(item.SECAOTITELEITOR || "");        // FUN_TITULOELEITOR_SECAO
                    linha[26] = String(item.ESTELEIT || "");               // FUN_ESTELEIT
                    linha[27] = String(item.CARTEIRATRAB || "");           // FUN_CARTEIRAPROF
                    linha[28] = String(item.SERIECARTTRAB || "");          // FUN_SERCART
                    linha[29] = String(item.DTCARTTRAB || "");             // FUN_DTCARTTRAB
                    linha[30] = String(item.UFCARTTRAB || "");             // FUN_UFCP
                    linha[31] = String(item.CARTMOTORISTA || "");          // FUN_HABILIT
                    linha[32] = String(item.TIPOCARTHABILIT || "");        // FUN_CNHCAT
                    linha[33] = String(item.DTVENCHABILIT || "");          // FUN_DTCNHVALID
                    linha[34] = String(item.ORGEMISSORCNH || "");          // FUN_CNHORG
                    linha[35] = String(item.DATAPRIMEIRACNH || "");        // FUN_DATAPRIMEIRACNH
                    linha[36] = String(item.UFCNH || "");                  // FUN_UFCNH
                    linha[37] = String(item.PISPASEP || "");               // FUN_PIS
                    linha[38] = String(item.CERTIFRESERV || "");           // FUN_NR_CART_RESERVISTA
                    linha[39] = "";                                        // DtCERTIFRESERV (Não vi na query original, deixei em branco)

                    // Endereço
                    linha[40] = String(item.CEP || "");                    // FUN_CEP
                    linha[41] = String(item.CODTIPORUA || "");             // FUN_TPLOGRADOURO
                    linha[42] = String(item.RUA || "");                    // FUN_LOGRADOURODESC
                    linha[43] = String(item.NUMERO || "");                 // FUN_NUMLOGRADOURO
                    linha[44] = String(item.COMPLEMENTO || "");            // FUN_ENDERECOM
                    linha[45] = String(item.BAIRRO || "");                 // FUN_BAIRRO
                    linha[46] = String(item.ESTADO || "");                 // FUN_UF
                    linha[47] = String(item.CODMUNICIPIO || "");           // FUN_CODIBGE
                    linha[48] = String(item.PAIS || "");                   // FUN_PAIS_ENDERECO

                    // Contato
                    linha[49] = String(item.TELEFONE1 || item.TELEFONE2 || ""); // FUN_TELEFONE
                    linha[50] = String(item.TELEFONE3 || "");                   // FUN_CELULAR (Assumi tel3 como celular)
                    linha[51] = String(item.EMAIL || item.EMAILPESSOAL || "");  // FUN_EMAIL

                    // Descrições via Dicionário Hardcoded (De-Para reverso)
                    linha[52] = String(item.ESTADONATAL || "");                 // FUN_NATURALIDADE_DESC_AD (Igual o código UF)
                    linha[53] = getDescEstadoCivil(item.ESTADOCIVIL);           // FUN_ESTADOCIV_DESC_AD
                    linha[54] = getDescEscolaridade(item.GRAUINSTRUCAO);        // FUN_CODGINRAI_DESC_AD
                    linha[55] = getDescTipoRua(item.CODTIPORUA);                // FUN_TPLOGRADOURO_DESC_AD

                    // A ÚLTIMA COLUNA É A DE ERROR (Deixamos vazia = SUCESSO)
                    linha[56] = "";
                    dataset.addRow(linha);

                } else {
                    // MENSAGEM EXATA QUE O VIEW.JS ESPERA PARA BUSCAR NO SERPRO
                    dataset.addRow(criarLinhaVazia(colunas, "CPF não encontrado na base"));
                }
            }
        }
    } catch (e) {
        log.error("+++ ERRO NO DATASET ds_irho_consultaFuncionario +++");
        log.error("DETALHES: " + e);
        dataset.addRow(criarLinhaVazia(colunas, "ERRO API: " + e));
    }

    return dataset;
}

// Função auxiliar para criar linhas vazias com o erro na última coluna
function criarLinhaVazia(colunas, msgErro) {
    var linhaErro = new Array(colunas.length);
    for (var c = 0; c < colunas.length; c++) { linhaErro[c] = ""; }
    linhaErro[colunas.length - 1] = msgErro;
    return linhaErro;
}