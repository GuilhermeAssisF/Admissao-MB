<div id="Widget_Configuracao_Admissao_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="Widget_Configuracao_Admissao.instance()">
    
    <!-- CABEÇALHO GERAL -->
    <div class="row">
        <div class="col-md-12">
            <h2 class="page-header">
                <i class="flaticon flaticon-settings icon-lg"></i> 
                Configurações da Admissão IRHO
            </h2>
        </div>
    </div>

    <!-- TELA 1: DASHBOARD (Listagem / Acesso) -->
    <div id="view_dashboard_${instanceId}">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="flaticon flaticon-list icon-sm"></i> Status da Configuração</h3>
            </div>
            <div class="panel-body text-center" style="padding: 40px;">
                
                <!-- Ícone de Status Dinâmico -->
                <div id="status_icon_${instanceId}" style="font-size: 4em; color: #ccc; margin-bottom: 20px;">
                    <i class="flaticon flaticon-system-clock"></i>
                </div>

                <h3 id="status_text_${instanceId}">Carregando dados...</h3>
                <p id="status_subtext_${instanceId}" class="text-muted">Verificando se já existe uma configuração ativa neste servidor.</p>

                <div style="max-width: 400px; margin: 30px auto;">
                    
                    <!-- Botão de Criar (Aparece só se não tiver config) -->
                    <button type="button" class="btn btn-success btn-lg btn-block" id="btn_criar_config_${instanceId}" style="display:none;" data-new-config>
                        <i class="flaticon flaticon-add-plus icon-sm"></i> CRIAR NOVA CONFIGURAÇÃO
                    </button>

                    <!-- Área de Autenticação (Aparece se já tiver config) -->
                    <div id="area_autenticacao_${instanceId}" style="display:none; text-align: left;">
                        <div class="alert alert-warning text-center">Configuração já existe. <br>Por segurança, insira a senha administrativa para editar.</div>
                        <div class="form-group">
                            <label>Senha de Acesso Módulo</label>
                            <input type="password" class="form-control" id="pwd_acesso_${instanceId}" placeholder="Digite a senha para habilitar a edição">
                        </div>
                        <button type="button" class="btn btn-primary btn-block" id="btn_editar_config_${instanceId}" disabled>
                            <i class="flaticon flaticon-edit icon-sm"></i> LIBERAR EDIÇÃO
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- TELA 2: FORMULÁRIO DE EDIÇÃO (Visível apenas após Criar ou Autenticar) -->
    <div id="view_formulario_${instanceId}" style="display:none;">
        <div class="text-right" style="margin-bottom: 15px;">
            <button type="button" class="btn btn-default" data-back-dashboard>
                <i class="flaticon flaticon-arrow-left icon-sm"></i> Voltar ao Painel Interno
            </button>
        </div>

        <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="flaticon flaticon-security icon-sm"></i> Credenciais de Integração (RM e Fluig)</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <!-- Campo Hidden para o Upsert (Criar vs Editar) -->
                <input type="hidden" id="config_doc_id_${instanceId}" name="config_doc_id">
                
                <div class="col-md-6 form-group">
                    <label for="FLUIG_SOAP_USER_${instanceId}">Usuário Integração Fluig (SOAP)</label>
                    <input type="text" class="form-control" id="FLUIG_SOAP_USER_${instanceId}" name="FLUIG_SOAP_USER" placeholder="ex: app.candidato">
                </div>
                <div class="col-md-6 form-group">
                    <label for="FLUIG_SOAP_PASS_${instanceId}">Senha Integração Fluig (SOAP)</label>
                    <input type="password" class="form-control" id="FLUIG_SOAP_PASS_${instanceId}" name="FLUIG_SOAP_PASS">
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 form-group">
                    <label for="RM_USER_${instanceId}">Usuário TOTVS RM</label>
                    <input type="text" class="form-control" id="RM_USER_${instanceId}" name="RM_USER">
                </div>
                <div class="col-md-6 form-group">
                    <label for="RM_PASS_${instanceId}">Senha TOTVS RM</label>
                    <input type="password" class="form-control" id="RM_PASS_${instanceId}" name="RM_PASS">
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 form-group">
                    <label for="RM_ENDPOINT_WS_${instanceId}">Endpoint WSDATASERVER (RM)</label>
                    <input type="text" class="form-control" id="RM_ENDPOINT_WS_${instanceId}" name="RM_ENDPOINT_WS" placeholder="ex: http://rm.suaempresa.com.br:8051">
                </div>
            </div>

            <hr>
            <h4>Parâmetros OAuth (Fluig Public API)</h4>
            <div class="row">
                <div class="col-md-6 form-group">
                    <label for="FLUIG_OAUTH_CONSUMER_KEY_${instanceId}">Consumer Key</label>
                    <input type="text" class="form-control" id="FLUIG_OAUTH_CONSUMER_KEY_${instanceId}" name="FLUIG_OAUTH_CONSUMER_KEY">
                </div>
                <div class="col-md-6 form-group">
                    <label for="FLUIG_OAUTH_CONSUMER_SECRET_${instanceId}">Consumer Secret</label>
                    <input type="password" class="form-control" id="FLUIG_OAUTH_CONSUMER_SECRET_${instanceId}" name="FLUIG_OAUTH_CONSUMER_SECRET">
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 form-group">
                    <label for="FLUIG_OAUTH_TOKEN_${instanceId}">Access Token</label>
                    <input type="text" class="form-control" id="FLUIG_OAUTH_TOKEN_${instanceId}" name="FLUIG_OAUTH_TOKEN">
                </div>
                <div class="col-md-6 form-group">
                    <label for="FLUIG_OAUTH_TOKEN_SECRET_${instanceId}">Token Secret</label>
                    <input type="password" class="form-control" id="FLUIG_OAUTH_TOKEN_SECRET_${instanceId}" name="FLUIG_OAUTH_TOKEN_SECRET">
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-info">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="flaticon flaticon-link icon-sm"></i> URLs das Páginas Públicas</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-12 form-group">
                    <label for="URL_PAGINA_CANDIDATO_${instanceId}">URL Página do Candidato</label>
                    <input type="text" class="form-control" id="URL_PAGINA_CANDIDATO_${instanceId}" name="URL_PAGINA_CANDIDATO" placeholder="ex: https://portal.suaempresa.com.br/portal/candidato">
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 form-group">
                    <label for="URL_PAGINA_CORRECAO_${instanceId}">URL Página de Correção</label>
                    <input type="text" class="form-control" id="URL_PAGINA_CORRECAO_${instanceId}" name="URL_PAGINA_CORRECAO">
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 form-group">
                    <label for="URL_PAGINA_ASSINATURA_${instanceId}">URL Página de Assinatura</label>
                    <input type="text" class="form-control" id="URL_PAGINA_ASSINATURA_${instanceId}" name="URL_PAGINA_ASSINATURA">
                </div>
            </div>
        </div>

        <div class="text-right">
            <button type="button" class="btn btn-success btn-lg" data-save-config>
                <i class="flaticon flaticon-save icon-sm"></i> SALVAR CONFIGURAÇÕES
            </button>
        </div>
    </div> <!-- /view_formulario -->

</div>

