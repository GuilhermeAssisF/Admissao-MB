function Zoom() {
  var Element = this;

  this.Id = "Temp";

  this.Titulo = "";

  this.DataSet = "colleague";

  this.FieldsName = [];

  this.Renderizado = false;

  this.Colunas = new Array({
    title: "NOME",
    name: "colleagueName",
    display: true,
  });

  this.RegistrosPorPagina = 8;

  this.Renderizado = false;

  this.Width = 660;

  this.Linhas = [];

  this.UseTemplate = false;

  this.Template = "<tr>";
  this.Template += "<td style='font-size:12px;'>{{EMPRESA}}</td>";
  this.Template += "<td style='font-size:12px;'>{{CODSECAO}}</td>";
  this.Template += "<td style='font-size:12px;'>{{DEPARTAMENTO}}</td>";
  this.Template += "<td></td>";
  this.Template += "</tr>";

  var fields = new Array("de0150481");

  this.page = 1;

  this.totalPags = 1;

  this.Abrir = function () {
    this.RenderizarModal();

    $("#" + this.Id + "_Modal").modal("show");

    setTimeout(function () {
      Element.BuscarDados();
    }, 300);

    this.Renderizado = true;

    $(".container-modal").css({
      zIndex: "9999",
      //left: "50%",
      "margin-top": "10px",
      //"margin-left": "-" + this.Width / 2 + "px",
    });
  };

  this.RenderizarModal = function () {
    // Container da Modal
    var htmlDialog =
      '<div class="modal" id="' +
      this.Id +
      '_Modal" tabindex="-1" role="dialog">';
    htmlDialog += '<div class="modal-dialog">';
    htmlDialog +=
      '<div class="modal-content" style="width:' + this.Width + 'px;">';

    // Header da Modal
    htmlDialog += '<div class="modal-header">';
    htmlDialog += "<table style='width: 100%;'>";
    htmlDialog += "<tr>";
    htmlDialog += "<td nowrap='nowrap'>";
    htmlDialog += '<h4 class="modal-title">';
    htmlDialog +=
      '<span class="fluigicon fluigicon-search-test fluigicon-xl"></span>';
    htmlDialog += "&nbsp;&nbsp;<b>" + this.Titulo + "</b>";
    htmlDialog += "</h4>";
    htmlDialog += "</td>";
    htmlDialog += "<td><div class='searchinput'>&nbsp;</div></td>";
    htmlDialog += "</tr>";
    htmlDialog += "</table>";
    htmlDialog += "</div>";
    // Fim do Header

    // Body da Modal
    htmlDialog +=
      '<div class="modal-body" style="overflow:auto; height:300px; padding:0px; padding-right:0px;">';
    htmlDialog +=
      '<div id="' + this.Id + '_dataTable" style="display:none;"></div>';
    htmlDialog +=
      '<div id="' +
      this.Id +
      '_dataTable_carregando"><h3 align="center"><img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB5NDY1b2NyeWFrM3M1YWh5eWhhOHJqdzd6eXljbGZwd3JiMWdydCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KG4PMQ0jyimywxNt8i/giphy.gif" width="120" height="120">&nbsp;Aguarde... <br><br>processando as informações solicitadas :)</h3></div>';
    htmlDialog += "</div>";
    // FIM do Body

    // Footer da Modal
    htmlDialog += '<div class="modal-footer">';

    htmlDialog +=
      '<button type="button" id="' +
      this.Id +
      '_prev" class="btn btn-warning">';
    htmlDialog +=
      '<span class="fluigicon fluigicon-chevron-left fluigicon-sm"></span>';
    htmlDialog +=
      '<span class="fluigicon fluigicon-chevron-left fluigicon-sm"></span>';
    htmlDialog += "</button>";

    htmlDialog +=
      ' [ <span id="' +
      this.Id +
      '_pgAtual">1</span> de <span id="' +
      this.Id +
      '_pgTotal">1</span> ] ';

    htmlDialog +=
      '<button type="button" id="' +
      this.Id +
      '_next" class="btn btn-warning">';
    htmlDialog +=
      '<span class="fluigicon fluigicon-chevron-right fluigicon-sm"></span>';
    htmlDialog +=
      '<span class="fluigicon fluigicon-chevron-right fluigicon-sm"></span>';
    htmlDialog += "</button>";

    htmlDialog +=
      '<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>';

    htmlDialog += "</div>";
    // FIM do Footer

    htmlDialog += "</div>";
    htmlDialog += "</div>";
    htmlDialog += "</div>";
    // FIM do Container

    $("body").append(htmlDialog);
  };

  this.Renderizar = function () {
    $("#" + this.Id + "_dataTable_carregando").hide();
    $("#" + this.Id + "_dataTable").show();

    // Renderizar Template de datatable
    var TemplateHTML =
      "<script type='text/template' class='" +
      this.Id +
      "_template_datatable'>";

    if (this.UseTemplate) {
      TemplateHTML += this.Template;
    } else {
      TemplateHTML += "<tr>";

      for (var col in Element.Colunas) {
        TemplateHTML +=
          "<td style='font-size:10px;font-family: Tahoma;'>{{" +
          Element.Colunas[col].name +
          "}}</td>";
      }

      TemplateHTML += "</tr>";
    }

    TemplateHTML += "</script>";

    $("body").append(TemplateHTML);

    // Gerar cabecalho
    var Headers = [];

    for (var item in Element.Colunas) {
      var HeaderObj = {};

      HeaderObj.title = Element.Colunas[item].title;

      if (typeof this.Colunas[item].display === "undefined") {
        HeaderObj.display = true;
      } else {
        HeaderObj.display = Element.Colunas[item].display;
      }

      Headers.push(HeaderObj);
    }

    // Armazenar primeira pÃƒÂ¡gina
    var PrimeiraTela = [];
    var count = 1;
    for (var index in Element.Linhas) {
      PrimeiraTela.push(Element.Linhas[index]);
      if (count == this.RegistrosPorPagina) break;
      count++;
    }

    //var counter2 = 1;

    this.DataTableObject = FLUIGC.datatable(
      "#" + this.Id + "_dataTable",
      {
        dataRequest: PrimeiraTela,
        renderContent: "." + Element.Id + "_template_datatable",
        header: Headers,
        tableStyle: "table-striped table-hover",
        search: {
          enabled: true,
          onlyEnterkey: true,
          onSearch: function (a) {
            $("#" + Element.Id + "_dataTable")
              .find("[data-nav-prev]")
              .hide();
            $("#" + Element.Id + "_dataTable")
              .find("[data-nav-next]")
              .hide();

            var b = Element.Linhas.filter(function (b) {
              for (var item in Element.Colunas) {
                if (
                  b[Element.Colunas[item].name]
                    .toUpperCase()
                    .indexOf(a.toUpperCase()) >= 0
                ) {
                  return true;
                }
              }
              return false;
            });

            Element.DataTableObject.reload(b);

            if (b.length) {
              $("#" + Element.Id + "_dataTable tbody tr").each(function () {
                Element.BindClick(this);
              });
            }
          },
        },
        scroll: {
          enabled: false,
        },
        navButtons: {
          enabled: false,
          forwardstyle: "btn-warning",
          backwardstyle: "btn-warning",
          
          onBackward: function () {
            $("#" + Element.Id + "_Modal")
              .find("#fluig-data-table-input")
              .val("");

            //counter2--;
            Element.page--;

            //var inicio = (counter2 - 1) * Element.RegistrosPorPagina;
            var inicio = (Element.page - 1) * Element.RegistrosPorPagina;

            var newData = [];
            for (var i = inicio; i < inicio + Element.RegistrosPorPagina; i++) {
              if (Element.Linhas[i]) {
                newData.push(Element.Linhas[i]);
              }
            }

            Element.DataTableObject.addPage(
              newData,
              "." + Element.Id + "_template_datatable",
              !1
            );

            $("#" + Element.Id + "_dataTable tbody tr").each(function () {
              Element.BindClick(this);
            });

            $("#" + Element.Id + "_dataTable")
              .find("[data-nav-next]")
              .removeClass("disabled");

            //if (counter2 == 1) {
            if (Element.page == 1) {
              $("#" + Element.Id + "_dataTable")
                .find("[data-nav-prev]")
                .addClass("disabled");
            }

            $("#" + Element.Id + "_pgAtual").html(Element.page);
          },
          onForward: function () {
            
            $("#" + Element.Id + "_Modal")
              .find("#fluig-data-table-input")
              .val("");

            $("#" + Element.Id + "_dataTable")
              .find("[data-nav-prev]")
              .removeClass("disabled");

            //var inicio = counter2 * Element.RegistrosPorPagina;
            var inicio = Element.page * Element.RegistrosPorPagina;

            var newData = [];
            for (var i = inicio; i < inicio + Element.RegistrosPorPagina; i++) {
              if (Element.Linhas[i]) {
                newData.push(Element.Linhas[i]);
              }
            }

            Element.DataTableObject.addPage(
              newData,
              "." + Element.Id + "_template_datatable",
              !1
            );

            //counter2++;
            Element.page++;

            var ProximaPagina = inicio + Element.RegistrosPorPagina;

            if (ProximaPagina >= Element.Linhas.length) {
              $("#" + Element.Id + "_dataTable")
                .find("[data-nav-next]")
                .addClass("disabled");
            }

            $("#" + Element.Id + "_dataTable tbody tr").each(function () {
              Element.BindClick(this);
            });

            $("#" + Element.Id + "_pgAtual").html(Element.page);
          },
        }
      },
      function (err, data) {
        if (Element.Linhas.length <= Element.RegistrosPorPagina) {
          $("#" + Element.Id + "_dataTable")
            .find("[data-nav-next]")
            .addClass("disabled");
          $("#" + Element.Id + "_dataTable")
            .find("[data-nav-prev]")
            .hide();
          $("#" + Element.Id + "_dataTable")
            .find("[data-nav-next]")
            .hide();
        }

        $("#" + Element.Id + "_dataTable")
          .find("th")
          .each(function () {
            $(this).attr("style", "font-size:11px;background-color:#ececec;");
          });

        $(".modal-body .panel-heading").hide();

        var SearchArea = $("#fluig-data-table-input").clone(true, true);
        $("#datatable-area-search").hide();
        $(".searchinput").html(SearchArea);
        $(".searchinput input").keyup(function (e) {
          $("#datatable-area-search input").val($(this).val());
          var press = jQuery.Event("keypress");
          press.ctrlKey = false;
          press.which = 13;
          $("#datatable-area-search input").trigger(press);
        });

        for (var item in Element.Colunas) {
          if (typeof Element.Colunas[item].display === "undefined") {
            $("#" + Element.Id + "_dataTable thead th")
              .eq(item)
              .show();
          } else {
            $("#" + Element.Id + "_dataTable thead th")
              .eq(item)
              .hide();
          }
        }

        $("#" + Element.Id + "_dataTable tbody tr").each(function () {
          Element.BindClick(this);
        });
      }
    );
  };

  this.BindClick = function (element) {
    $(element).click(function () {
      var Data = [];
      $(this)
        .find("td")
        .each(function (i) {
          Data[i] = $(this).html();
        });

      Element.Retorno(Data);
      $("#" + Element.Id + "_Modal").modal("hide");
    });
  };

  this.Retorno = function (Data) {};

  this.rawFilters = {};

  this.setRawFilters = function (campo, raw) {
    this.rawFilters[campo] = raw;
  };

  this.getFiltros = function () {
    var filtros = [];

    for (var i = 0; i < Element.FieldsName.length; i++) {
      var campo = Element.FieldsName[i];

      if (this.rawFilters.hasOwnProperty(campo)) {
        filtros.push(this.rawFilters[campo]);
      } else {
        filtros.push(document.getElementById(campo).value);
      }
    }

    return filtros;
  };

  this.preData = null;

  this.setPreData = function (data) {
    this.preData = data;
  };

  var loadDs = function (dataset, filter) {
    var datasetReturn = Compartilhados.searchCustomDataset(dataset, filter);
    return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
  };

  this.BuscarDados = function () {
    try {
      if (this.Linhas.length === 0) {
        var tabela = this.preData;
        var tabela2 = this.preData;

        if (!tabela) {
          //tabela2 = DatasetFactory.getDataset(Element.DataSet, Element.getFiltros(), null, null);
          tabela = Compartilhados.defaultGetDataSet(
            Element.DataSet,
            Element.getFiltros(),
            loadDs
          );
        }

        Element.totalPags = Math.ceil(
          tabela.values.length / Element.RegistrosPorPagina
        );

        if (tabela === null || tabela.values.length === 0) {
          throw "Não há informações para exibir.";
        }

        if (tabela.values.length == 1) {
          var vazia = true,
            row = tabela.values[0];

          for (var prop in row) {
            if (row[prop] !== null) {
              vazia = false;
              break;
            }
          }

          if (vazia) {
            throw "Não há informações para exibir.";
          }
        }

        for (var i = 0; i < tabela.values.length; i++) {
          var Temp = [];

          for (var FieldKey in Element.Colunas) {
            var myString = tabela.values[i][Element.Colunas[FieldKey].name];

            if (myString === null) {
              myString = "";
            }

            if (myString == undefined) {
              myString = "";
            }

            Temp[Element.Colunas[FieldKey].name] = myString.toString();
          }

          Element.Linhas.push(Temp);
        }
      }

      this.Renderizar();

      this.bindNewPager();
    } catch (erro) {
      $("#" + Element.Id + "_Modal").modal("hide");
      FLUIGC.message.alert({
        message: erro,
        title: "Não foi possível fornecer dados para essa busca.",
        label: "OK",
      });
    }
  };

  this.bindNewPager = function () {
    // Botoẽs do paginador original
    var ori_prev_btn = $("#" + Element.Id + "_dataTable").find(
        "[data-nav-prev]"
      ),
      ori_next_btn = $("#" + Element.Id + "_dataTable").find("[data-nav-next]");

    // Esconde paginador padão da dataTable
    $("#" + Element.Id + "_dataTable")
      .find("#area-nav-button")
      .hide();

    // Novo paginador - página anterior
    $("#" + Element.Id + "_prev").click(function () {
      if (!ori_prev_btn.hasClass("disabled")) {
        ori_prev_btn.trigger("click");
      }
    });

    // Novo paginador - página seguinte
    $("#" + Element.Id + "_next").click(function () {
      if (!ori_next_btn.hasClass("disabled")) {
        ori_next_btn.trigger("click");
      }
    });

    // Altera número total de páginas
    $("#" + Element.Id + "_pgTotal").html(Element.totalPags);
  };
}
