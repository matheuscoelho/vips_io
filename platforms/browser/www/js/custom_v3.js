app.initialize();

var socket = io.connect("http://vipsio.com.br:3001");

socket.on('notificacoes_cliente', function (mensagem) {
    //alert(mensagem);
});

var link_pagseguro = 'https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js';
//var link_pagseguro = 'https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js';



function getImage() {
 navigator.camera.getPicture(uploadPhoto, function(message) {
    alert('get picture failed');
 }, {
 quality: 100,
 destinationType: navigator.camera.DestinationType.FILE_URI,
 sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
 });
}

function uploadPhoto(imageURI) {
 var options = new FileUploadOptions();
 options.fileKey = "file";
 options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
 options.mimeType = "image/jpeg";
 console.log(options.fileName);
 var params = new Object();
 params.value1 = "test";
 params.value2 = "param";
 options.params = params;
 options.chunkedMode = false;

var ft = new FileTransfer();
 ft.upload(imageURI, "http://vipsio.com.br/admin/api/upload_fotos_api.php", function(result){
 console.log(JSON.stringify(result));
 }, function(error){
 console.log(JSON.stringify(error));
 }, options);
 }








//não ta muito certo esse nome, esses são os dados para entrega sim, mas poderá ficar salvo como endereço pessoal tbm
var dados_pessoais_entrega;

var sessionId = '';

var html_sucesso = '<div id="div_msg_sucesso" class="col-md-12 col-sm-12 col-xs-12">' +
    '<p id="msg_retorno">SUCESSO</p>' +
    '</div>';

var html_erro = '<div id="div_msg_erro" class="col-md-12 col-sm-12 col-xs-12">' +
    '<p id="msg_retorno">Sucesso</p>' +
    '</div>';


var html_menu_rapido = '<div id="menu_rapido" class="col-md-12 col-sm-12 col-xs-12">' +
    '<div id="mr_inicio"><i class="fa fa-home"></i></div>' +
    '<div id="mr_pesquisa"><i class="fa fa-search"></i></div>' +
    '<div id="mr_camera"><i class="fa fa-camera-retro"></i></div>' +
    '<div id="mr_galeria"><i class="fa fa-picture-o"></i></div>' +
    '<div id="mr_perfil"><i class="fa fa-user"></i></div>' +
    '</div>';

var html_metodo_de_pagamento = '<div id="metodo_de_pagamento" class="view" tela="6">' +
    '<div id="metodo_de_pagamento_div">' +
    '<form method="POST" id="cartoes_form">' +
    '<button type="submit" id="pagar_cartao">Pagar com cartão</button>' +
    '</form>' +
    '<form method="POST" id="dinheiro_form">' +
    '<button type="submit" id="pagar_dinheiro">Pagar em dinheiro</button>' +
    '</form>' +
    '<hr><div id="bandeiras_credito"></div>' +
    '</div>' +
    '</div>';

var html_informacoes_pessoais = '<h1>Dados entrega</h1>' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="text" value="" required="required" placeholder="Nome completo" id="nome_cliente" name="nomeCliente" />' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="text" value="" required="required" placeholder="Cpf ou cnpj" id="cpf_cnpj_cliente" name="cpf_cnpj_cliente" />' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="text" value="" required="required" placeholder="Email" id="email_cliente" name="email_cliente" />' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="text" value="" required="required" placeholder="DDD" id="ddd_cliente" name="ddd_cliente" />' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="text" value="" required="required" placeholder="Celular" id="celular_cliente" name="celular_cliente" />' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="date" value="" required="required" placeholder="Nascimento" id="nasc_cliente" name="nasc_cliente" />' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="text" value="" required="required" placeholder="Logradouro" id="logradouro_cliente" name="logradouro_cliente" />' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="text" value="" required="required" placeholder="Numero" id="n_cliente" name="n_cliente" />' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="text" value="" required="required" placeholder="Bairro" id="bairro_cliente" name="bairro_cliente" />' +
    estados +
    '<select required="required" id="cidade_cliente" name="cidade_cliente" class="control-label col-md-12 col-sm-12 col-xs-12">' +
    '</select>' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="text" value="" required="required" placeholder="CEP" id="cep_cliente" name="cep_cliente" />' +
    '<input class="control-label col-md-12 col-sm-12 col-xs-12" type="text" value="" placeholder="Complemento" id="comp_cliente" name="comp_cliente" />';

var html_dados_credito = '<hr><div id="dados_cartao_div" class="view" tela="7">' +
    '<form method="POST" id="dados_cartao_form">' +
    '<div class="form">' +
    '<p>Informe os dados do cartão de crédito.</p>' +
    '<p id="pBandeira"></p>' +
    '<input type="number" placeholder="Número do cartão" required="required" id="n_credito_cliente" name="cardNumber" />' +
    '<input type="text" placeholder="Mês" id="mes_credito_cliente" name="expirationMonth" />' +
    '<input type="text" placeholder="Ano" id="ano_credito_cliente" name="expirationYear" />' +
    '<input type="text" placeholder="CVC" required="" id="cvv" name="cvv" />' +
    '<input type="text" placeholder="Nome no cartão" required="required" id="nome_credito_cliente" name="cardName" />' + 
    '<input type="text" value="" required="required" placeholder="Cpf ou cnpj" id="cpf_cnpj_credito_cliente" name="cpf_cnpj_credito_cliente" />' +
    '<div id="divParcelamento"></div>' +
    '</div>' +
    '</form>' +
    '</div>';

var html_salvar_dados = '<p><input type="checkbox" name="salvar_dados" id="salvar_dados" checked> Deseja salvar seus dados?</p>';

var html_lay_empresa = '<div id="lay_empresa" tela="8">' +
    '<div id="capa_perfil">' +
    '<div id="subcapa_perfil">' +
    '<div id="foto_perfil">' +
    '<img src="">' +
    '</div>' +
    '<div id="nome_perfil"></div>' +
    '<div id="descricao_perfil"></div>' +
    '</div>' +
    '<div id="menu_perfil">' +
    '<div id="linha_perfil">' +
    '<p><i class="fa fa-rss"></i></p>' +
    '</div>' +
    '<div id="menul_perfil" class="ativo2">' +
    '<p><i class="fa fa-bolt"></i></p>' +
    '</div>' +
    '<div id="fotos_perfil">' +
    '<p><i class="fa fa-folder-open-o"></i></p>' +
    '</div>' +
    '</div>' +
    '<div id="pesquisa_menu">' +
    '<span id="pesquisa_icon_menu">' +
    '<i class="fa fa-search"></i>' +
    '</span>' +
    '<span id="pesquisar_text_menu">' +
    '<input type="text" name="pesquisar_text_menu" id="pesquisar_in_menu" placeholder="Pesquisar">' +
    '</span>' +
    '</div>' +
    '<div id="menu_cardapio">' +
    '<form method="POST" id="escolher_entrega_form">' +
    '<input type="hidden" name="id_empresa" id="id_empresa_finaliza" value="">' +
    '<div id="conteiner_linha_menu"></div>' +
    '<div id="escolher_entrega">' +
    '<input type="submit" id="btn_entrega" value="ESCOLHER FORMA DE ENTREGA">' +
    '</div>' +
    '</form> ' +
    '</div>' +
    '</div>' +
    '</div>';

var html_lay_cliente = '<div id="lay_cliente">' +
                            '<div id="capa_perfil">' +
                                '<div id="subcapa_perfil">' +
                                    '<div id="foto_perfil">' +
                                        '<img src="">' +
                                    '</div>' +
                                    '<div id="nome_perfil"></div>' +
                                    '<div id="descricao_perfil"></div>' +
                                '</div>' +
                                '<div id="menu_perfil">' +
                                    '<div id="linha_perfil">' +
                                        '<p><i class="fa fa-rss"></i></p>' +
                                    '</div>' +
                                    '<div id="menul_perfil" class="ativo2">' +
                                        '<p><i class="fa fa-bolt"></i></p>' +
                                    '</div>' +
                                    '<div id="fotos_perfil">' +
                                        '<p><i class="fa fa-folder-open-o"></i></p>' +
                                    '</div>' +
                                '</div>' +
                                '<div id="fotos_cliente">' +
                                '</div>' +
                            '</div>' +
                        '</div>';

//pagamento_pedido  pedido_form

var html_pesquisa = '<div id="pesquisa" class="view" tela="6">' +
                        '<div id="pesquisar_div">' +
                            '<span id="pesquisa_icon">' +
                                '<i class="fa fa-search"></i>' +
                            '</span>' +
                            '<span id="pesquisar_text">' +
                                '<input type="text" name="pesquisar_text" id="pesquisar_in" placeholder="Pesquisar">' +
                            '</span>' +
                            '<hr>' +
                        '</div>' +
                        '<div id="div_tipo_pesquisa">' +
                            '<span>Empresas <input name="pesquisa_empresas" id="pesquisa_empresas" type="checkbox" class="js-switch" checked /></span>' +
                            '<span>Pessoas <input name="pesquisa_clientes" id="pesquisa_clientes" type="checkbox" class="js-switch" /></span>' +
                        '<div>'+
                        '<div id="pesquisa_conteudo"></div>' +
                    '</div>';

//balcao_form  mesa_form   casa_form
var html_dados_entrega_1 = '<div id="dados_entrega_1">' +
                                '<div id="metodo_de_entrega_div">' +
                                    '<h2>Entrega</h2>' +
                                    '<label for="balcao"><input class="radio_entrega" name="radio_entrega" type="radio" id="balcao" value="balcao">Retirar no balcão</label>' +
                                    '<label for="mesa"><input class="radio_entrega" name="radio_entrega" type="radio" id="mesa" value="mesa">Entrega na mesa</label>' +
                                    '<label for="casa"><input class="radio_entrega" name="radio_entrega" type="radio" id="casa" value="casa">Entrega no endereço</label>' +
                                    '<h2>Pagamento</h2>' +
                                    '<label for="dinheiro"><input class="radio_pagamento" name="radio_pagamento" type="radio" id="dinheiro" value="dinheiro">Dinheiro</label>' +
                                    '<label for="credito"><input class="radio_pagamento" name="radio_pagamento" type="radio" id="credito" value="credito">Cartão de crédito</label>' +
                                '</div>' +
                                '<div id="div_proximo">' +
                                    '<p>PRÓXIMO</p>' +
                                '</div>'+
                           '</div>';


var html_mesa = '<div id="mesa">' +
    '<form method="POST" id="mesa_form">' +
    '</form>' +
    '</div>';

var html_finaliza = '<div id="finaliza_pedido">' +
    '<p>FINALIZAR PEDIDO</p>' +
    '</div>';

var html_div_proximo2 = '<div id="div_proximo2">' +
    '<p>PRÓXIMO</p>' +
    '</div>';

var carregando = '<center><img src="build/images/loading.gif" style="width:20%;"></center>';

var salvar_dados = '';

var msgPedido2 = '';

var senderHash = '';

var response_credito = '';

var mesa = '';
 
//errei no nome, essa é a variavel com os dados do cartão de credito
var dadosCliente = '';



var msgPedido = "<h1>Dados do pedido<h1></br>";

var id_empresa_finaliza = '';
var total = 0;
var total_geral = 0;
var cont = 0;
var metodo_pagamento = '';


var id_produto = [];
var qtde = [];
var produtos = [];
var preco = [];


function carrega_notificacoes(id_destinatario) {

    $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });

    jQuery.ajax({
        type: "POST",
        url: "http://vipsio.com.br/admin/api/consultar_notificacoes_api.php",
        data: { id_destinatario: id_destinatario },
        success: function (data) {
            var resultado = JSON.parse(data);
            if (resultado['return'] == 'sucesso') {
                $('#menu1').html(resultado['html']);
                $('#qtde_notificacoes').html(resultado['qtde_notificacoes']);
            } else {
                /*$(".div_erro").html(resultado['return']);*/
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
        },
        complete: function (XMLHttpRequest, textStatus, errorThrown) {

            $.unblockUI();
        }
    });
}

function carrega_dados_usuario(dados_pessoais, dados_cartao) {

    jQuery.ajax({
        type: "POST",
        url: "http://vipsio.com.br/admin/api_2/consultar_dados_pessoais_api.php",
        data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token },
        success: function (data) {

            var resultado = JSON.parse(data);

            if (resultado['return'] == 'sucesso') {


                if (dados_pessoais) {
                    $('#nome_cliente').attr('value', resultado['dados_pessoais']['nome_cliente']);
                    $('#email_cliente').attr('value', resultado['dados_pessoais']['email_cliente']);
                    $('#cpf_cnpj_cliente').attr('value', resultado['dados_pessoais']['cpf_cnpj_cliente']);
                    $('#ddd_cliente').attr('value', resultado['dados_pessoais']['ddd_cliente']);
                    $('#celular_cliente').attr('value', resultado['dados_pessoais']['celular_cliente']);
                    $('#nasc_cliente').attr('value', resultado['dados_pessoais']['nasc_cliente']);
                    $('#logradouro_cliente').attr('value', resultado['dados_pessoais']['logradouro_cliente']);
                    $('#n_cliente').attr('value', resultado['dados_pessoais']['n_cliente']);
                    $('#bairro_cliente').attr('value', resultado['dados_pessoais']['bairro_cliente']);
                    $('#estado_cliente option[value="' + resultado['dados_pessoais']['estado_cliente'] + '"]').attr({ selected: "selected" });
                    $('#cidade_cliente').html(resultado['dados_pessoais']['option_cidades']);
                    $('#cep_cliente').attr('value', resultado['dados_pessoais']['cep_cliente']);
                    $('#comp_cliente').attr('value', resultado['dados_pessoais']['comp_cliente']);
                }

                if (dados_cartao) {

                    $('#n_credito_cliente').attr('value', resultado['dados_pessoais']['n_credito_cliente']);
                    $('#mes_credito_cliente').attr('value', resultado['dados_pessoais']['mes_credito_cliente']);
                    $('#ano_credito_cliente').attr('value', resultado['dados_pessoais']['ano_credito_cliente']);
                    $('#nome_credito_cliente').attr('value', resultado['dados_pessoais']['nome_credito_cliente']);
                    $('#cpf_cnpj_credito_cliente').attr('value', resultado['dados_pessoais']['cpf_cnpj_credito_cliente']);

                    carrega_bandeiras_credito();

                }
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
        },
        complete: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

var bandeiraCartao = '';

function carrega_bandeiras_credito() {
    $.getScript('https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js', function () {
        PagSeguroDirectPayment.getBrand({
            cardBin: $("input#n_credito_cliente").val(),
            success: function (response) {
                response_credito = response;
                bandeiraCartao = response['brand']['name'];
                $('#pBandeira').html(bandeiraCartao);

                PagSeguroDirectPayment.getInstallments({
                    amount: total_geral,
                    brand: bandeiraCartao,
                    maxInstallmentNoInterest: 0,
                    success: function (response) {

                        html_parcelamento = '<select id="parcelamento">';
                        $(response['installments'][bandeiraCartao]).each(function (index, value) {
                            if (value['quantity'] == 1) {
                                html_parcelamento += '<option quantity="' + value['quantity'] + '" installmentAmount="' + value['installmentAmount'] + '">' + value['quantity'] + 'x de ' + value['installmentAmount'] + ' R$. Sem juros e taxas.</option>';
                            } else {
                                html_parcelamento += '<option quantity="' + value['quantity'] + '" installmentAmount="' + value['installmentAmount'] + '">' + value['quantity'] + 'x de ' + value['installmentAmount'] + ' R$. Total com juros ' + value['totalAmount'] + ' R$.</option>';
                            }
                        });
                        html_parcelamento += '</select>';

                        $('#divParcelamento').html(html_parcelamento);
                    },
                    error: function (response) {
                        alert('erro');
                    },
                    complete: function (response) {
                        //tratamento comum para todas chamadas
                    }
                });
            },
            error: function (response) {
                console.log(response);
            },
            complete: function (response) {
                //tratamento comum para todas chamadas
            }
        });
    });
}

$(document).ready(function () {

    $('#menu_rapido div').click(function () {
        $('#menu_rapido div').removeClass('ativo');
        $(this).addClass('ativo');
    });


    /*setar no bd localStorage.myname = "Greg";*/
    /*pegar no bd localStorage.registrationId*/

    /*inicia array que vai guardas as telas*/
    var telas = [];


    /* BOTÃO VOLTAR ********************************************************
    vai gerando o caminho q a pessoa fez adicionando as telas no array durante a navegação
    quando chega aqui eu tiro a ultima posição do array e volto a tela do historico*/
    document.addEventListener("backbutton", function (e) {
        if (telas.length > 1) {
            if (telas[telas.length - 1] > 1) {
                telas.pop();
                if (telas[telas.length - 1] <= 3) {
                    $('.view').css('display', 'none');
                    $('div[tela="' + telas[telas.length - 1] + '"]').css('display', 'block');
                } else if (telas[telas.length - 1] == 3) {
                    /*carrega templete*/
                    $('#template').css('display', 'block');
                    $('#telas_container').css('display', 'none');
                    /*carrega pagina inicial*/
                    $('#titulo_pag').html('Faça seu agendamento!');
                    $('#conteudo_pag').html($('#agendamento').html());
                    navigator.app.exitApp();
                }
            } else {
                navigator.app.exitApp();
            }
        } else {
            navigator.app.exitApp();
        }

        e.preventDefault();
    }, false);

    /* tela com opção pra entrar ou cadastrar */
    $("#inicio").css('display', 'block');
    telas.push(1);

    /* botão na tela inical q leva ao cadastro */

    $(document).on('click', '.entrar_bnt', function () {
        $("#entrar").css('display', 'block');
        $("#inicio").css('display', 'none');

        telas.push(2);
    });

    $(document).on('click', '.cadastrar_bnt', function () {
        $("#cadastrar").css('display', 'block');
        $("#inicio").css('display', 'none');

        $('input[name="cel"]').mask("(99)99999999?9");
        telas.push(3);
    });

    $(document).on('submit', '#cadastrar_form', function () {
        $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
        jQuery.ajax({
            type: "POST",
            url: "http://vipsio.com.br/admin/api/cadastro_cliente_api.php",
            data: { cad_usuario: $('#cad_usuario').val(), cad_senha: $('#cad_senha').val(), cad_cel: $('#cad_cel').val() },
            success: function (data) {
                var resultado = JSON.parse(data);
                if (resultado['return'] == 'sucesso') {
                    $("#cadastrar").css('display', 'block');
                    $("#entrar").css('display', 'block');

                    telas.push(1);

                    $("#entrar_sussesso").html('Usuário criado com sucesso!');
                } else {
                    $("#cad_div_erro").html(resultado['return']);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
            },
            complete: function (XMLHttpRequest, textStatus, errorThrown) {

                $.unblockUI();
            }
        });
        return false;
    });

    localStorage.registrationId = 'cdYVMBI9WRc:APA91bGBsrPS0GNr_w3hYQUAyBBC1zLKJSxj6LZk8B14SasVGlLCeF6evdGWsDaAc_UST9HDriDcqQmOZ9A0JjP_Agx_7RX-nB9t1lQQoeFl5dJjZs_kg7uUNHe9P7O4T-XcBuBinknS';
    localStorage.usuario = 'matheus';
    localStorage.id_usuario = 16;
    localStorage.id_cliente = 234;
    localStorage.token = 'token';


    if ((!localStorage.registrationId) || (!localStorage.usuario) || (!localStorage.id_usuario) || (!localStorage.token)) {
        /* formulario que leva a pagina inicial do sistema */
        $(document).on('submit', '#entrar_form', function () {
            $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });

            jQuery.ajax({
                type: "POST",
                url: "http://vipsio.com.br/admin/api/login_api.php",
                data: { usuario: $("#usuario").val(), senha: $("#senha").val() },
                success: function (data) {
                    var resultado = JSON.parse(data);

                    if (resultado['return'] == 'sucesso') {
                        localStorage.usuario = resultado['sis_prime']['usuario'];
                        localStorage.id_usuario = resultado['sis_prime']['id_usuario'];
                        $("#usuario_span").html(localStorage.usuario);

                        resultado = '';
                        $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });

                        jQuery.ajax({
                            type: "POST",
                            url: "http://vipsio.com.br/admin/api_2/registrationId_api.php",
                            data: { usuario: localStorage.usuario, senha: $("#senha").val(), registrationId: localStorage.registrationId, operadora: 'google_registrationId' },
                            success: function (data) {
                                var resultado = JSON.parse(data);
                                /*se o login passar*/
                                if (resultado['return'] == 'sucesso') {
                                    localStorage.token = resultado['token'];

                                    socket.emit('create-room', Date.now(), localStorage.usuario);

                                    /* carrega templete */
                                    $('#template').css('display', 'block');
                                    $('#telas_container').css('display', 'none');
                                    /* carrega pagina inicial */
                                    $('#titulo_pag').html('Faça seu agendamento!');
                                    $('#conteudo_pag').html($('#agendamento').html());
                                    telas.push(5);

                                    carrega_notificacoes(localStorage.id_usuario);

                                    $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
                                    /* carrega os servicos na pagina de agendamentos*/
                                    jQuery.ajax({
                                        type: "POST",
                                        url: "http://vipsio.com.br/admin/api/consultar_servicos_api.php",
                                        data: { ok: 'ok' },
                                        success: function (data) {
                                            var resultado = JSON.parse(data);
                                            if (resultado['return'] == 'sucesso') {
                                                $('.servicos_div').html(resultado['html']);

                                                var elems = Array.prototype.slice.call(document.querySelectorAll('#conteudo_pag input[type="checkbox"]'));
                                                elems.forEach(function (html) {
                                                    var switchery = new Switchery(html, { size: 'small' });
                                                });
                                            } else {
                                                $(".div_erro").css('display', 'block');
                                                $(".div_erro").html(resultado['return']);
                                            }
                                        },
                                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                                        },
                                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                                            $.unblockUI();
                                        }
                                    });


                                    $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
                                    /* carrega os funcionarios na pagina de agendamentos */
                                    jQuery.ajax({
                                        type: "POST",
                                        url: "http://vipsio.com.br/admin/api/consultar_funcionarios_api.php",
                                        data: { id_empresa: 3 },
                                        success: function (data) {
                                            var resultado = JSON.parse(data);
                                            if (resultado['return'] == 'sucesso') {
                                                $('.funcionarios_div').html(resultado['html']);
                                            } else {
                                                $(".div_erro").css('display', 'block');
                                                $(".div_erro").html(resultado['return']);
                                            }
                                        },
                                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                                        },
                                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                                            $.unblockUI();
                                        }
                                    });



                                } else {
                                    $(".div_erro").css('display', 'block');
                                    $(".div_erro").html(resultado['return']);
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                            },
                            complete: function (XMLHttpRequest, textStatus, errorThrown) {

                                $.unblockUI();
                            }

                        });

                    } else {
                        $(".div_erro").css('display', 'block');
                        $(".div_erro").html(resultado['return']);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                },
                complete: function (XMLHttpRequest, textStatus, errorThrown) {

                    $.unblockUI();
                }
            });

            return false;
        });
    } else {

        socket.emit('create-room', Date.now(), localStorage.usuario);

        /* carrega templete */
        $('#template').css('display', 'block');
        $('#telas_container').css('display', 'none');
        /* carrega pagina inicial 
        //$('#titulo_pag').html('Faça seu agendamento!');
        //$('#conteudo_pag').html($('#agendamento').html());
        //telas.push(5);*/

        carrega_notificacoes(localStorage.id_usuario);

        $("#usuario_span").html(localStorage.usuario);

        $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
        /* carrega os servicos na pagina de agendamentos */
        jQuery.ajax({
            type: "POST",
            url: "http://vipsio.com.br/admin/api/consultar_servicos_api.php",
            data: { ok: 'ok' },
            success: function (data) {
                var resultado = JSON.parse(data);
                if (resultado['return'] == 'sucesso') {
                    $('.servicos_div').html(resultado['html']);

                    var elems = Array.prototype.slice.call(document.querySelectorAll('#conteudo_pag input[type="checkbox"]'));
                    elems.forEach(function (html) {
                        var switchery = new Switchery(html, { size: 'small' });
                    });
                } else {
                    $(".div_erro").css('display', 'block');
                    $(".div_erro").html(resultado['return']);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
            },
            complete: function (XMLHttpRequest, textStatus, errorThrown) {

                $.unblockUI();
            }
        });

        $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
        /* carrega os funcionarios na pagina de agendamentos */
        jQuery.ajax({
            type: "POST",
            url: "http://vipsio.com.br/admin/api/consultar_funcionarios_api.php",
            data: { id_empresa: 1 },
            success: function (data) {
                var resultado = JSON.parse(data);
                if (resultado['return'] == 'sucesso') {
                    $('.funcionarios_div').html(resultado['html']);
                } else {
                    $(".div_erro").css('display', 'block');
                    $(".div_erro").html(resultado['return']);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
            },
            complete: function (XMLHttpRequest, textStatus, errorThrown) {

                $.unblockUI();
            }
        });


        var isValidDate = function (str) {
            return !!new Date(str).getTime();
        }


        $(document).on('change', '#estado_cliente', function () {
            $("#cidade_cliente").html('<option value="">Carregando cidades...</option>');

            jQuery.ajax({
                type: "POST",
                url: "http://vipsio.com.br/admin/api_2/consultar_cidades_api.php",
                data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token, siglas_estado: $("#estado_cliente option:selected").val()},
                success: function (data) {

                    var resultado = JSON.parse(data);
                    if (resultado['return'] == 'sucesso') {
                        $('#cidade_cliente').html(resultado['option_cidades']);
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                },
                complete: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        });

        $(document).on('click', '.servicos_div .switchery', function () {
            var data_sel = $("#data_agendamento").val();
            var funcionario_sel = $('input:radio[name=funcionario]:checked').val();

            if (isValidDate(data_sel)) {

                var servicos_sel = [];
                var tempoTotal = 0;

                var valor = [];
                var tempo = [];
                var id_produto = [];
                var nome = [];

                $(".serv:checked").each(function () {
                    tempoTotal += parseInt($(this).attr("tempo"));

                    valor.push($(this).attr("valor"));
                    tempo.push($(this).attr("tempo"));
                    id_produto.push($(this).attr("id_produto"));
                    nome.push($(this).attr("value"));

                });

                data = '';

                if ((id_produto.length > 0) && (data_sel.length > 0) && (funcionario_sel.length > 0)) {

                    $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
                    jQuery.ajax({
                        type: "POST",
                        url: "http://vipsio.com.br/admin/api/consultar_agenda_api.php",
                        data: { valor: valor, tempo: tempo, id_produto: id_produto, nome: nome, data_sel: data_sel, funcionario_sel: funcionario_sel, tempoTotal: tempoTotal },
                        success: function (data) {
                            var resultado = JSON.parse(data);
                            $('.horario_div').html(resultado['html']);

                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                        },
                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                            $.unblockUI();
                        }
                    });
                }
            }
        });

        $(document).on('change', '#data_agendamento', function () {
            var data_sel = $("#data_agendamento").val();
            var funcionario_sel = $('input:radio[name=funcionario]:checked').val();

            if (isValidDate(data_sel)) {

                var servicos_sel = [];
                var tempoTotal = 0;

                var valor = [];
                var tempo = [];
                var id_produto = [];
                var nome = [];

                $(".serv:checked").each(function () {
                    tempoTotal += parseInt($(this).attr("tempo"));

                    valor.push($(this).attr("valor"));
                    tempo.push($(this).attr("tempo"));
                    id_produto.push($(this).attr("id_produto"));
                    nome.push($(this).attr("value"));

                });

                data = '';
                if ((id_produto.length > 0) && (data_sel.length > 0) && (funcionario_sel.length > 0)) {
                    $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
                    jQuery.ajax({
                        type: "POST",
                        url: "http://vipsio.com.br/admin/api/consultar_agenda_api.php",
                        data: { valor: valor, tempo: tempo, id_produto: id_produto, nome: nome, data_sel: data_sel, funcionario_sel: funcionario_sel, tempoTotal: tempoTotal },
                        success: function (data) {
                            var resultado = JSON.parse(data);
                            $('.horario_div').html(resultado['html']);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                        },
                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                            $.unblockUI();
                        }
                    });
                }
            }
        });

        $(document).on('click', 'input:radio[name=funcionario]', function () {
            var data_sel = $("#data_agendamento").val();
            var funcionario_sel = $('input:radio[name=funcionario]:checked').val();

            if (isValidDate(data_sel)) {

                var servicos_sel = [];
                var tempoTotal = 0;

                var valor = [];
                var tempo = [];
                var id_produto = [];
                var nome = [];

                $(".serv:checked").each(function () {
                    tempoTotal += parseInt($(this).attr("tempo"));

                    valor.push($(this).attr("valor"));
                    tempo.push($(this).attr("tempo"));
                    id_produto.push($(this).attr("id_produto"));
                    nome.push($(this).attr("value"));

                });

                data = '';
                if ((id_produto.length > 0) && (data_sel.length > 0) && (funcionario_sel.length > 0)) {
                    $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
                    jQuery.ajax({
                        type: "POST",
                        url: "http://vipsio.com.br/admin/api/consultar_agenda_api.php",
                        data: { valor: valor, tempo: tempo, id_produto: id_produto, nome: nome, data_sel: data_sel, funcionario_sel: funcionario_sel, tempoTotal: tempoTotal },
                        success: function (data) {
                            var resultado = JSON.parse(data);
                            $('.horario_div').html(resultado['html']);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                        },
                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                            $.unblockUI();
                        }
                    });
                }
            }
        });


        $(document).on('submit', '#agendamento_form', function () {

            /* funcionario, data, serviços e horario escolhido */
            var data_sel = $("#data_agendamento").val();
            var funcionario_sel = $('input:radio[name=funcionario]:checked').val();
            var hora_sel = $('.hora_sel:checked').attr('hora_inicio');

            if (isValidDate(data_sel)) {

                var servicos_sel = [];
                var tempoTotal = 0;

                var valor = [];
                var tempo = [];
                var id_produto = [];
                var nome = [];

                $(".serv:checked").each(function () {
                    tempoTotal += parseInt($(this).attr("tempo"));

                    valor.push($(this).attr("valor"));
                    tempo.push($(this).attr("tempo"));
                    id_produto.push($(this).attr("id_produto"));
                    nome.push($(this).attr("value"));

                });

                data = '';

                var r = confirm("Confirme essa mensagem para finalizar sua reserva!");
                if (r == true) {

                    if ((id_produto.length > 0) && (data_sel.length > 0) && (funcionario_sel.length > 0) && (typeof hora_sel != 'undefined')) {

                        $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
                        jQuery.ajax({
                            type: "POST",
                            url: "http://vipsio.com.br/admin/api/agendar_api.php",
                            data: { valor: valor, tempo: tempo, id_produto: id_produto, nome: nome, data_sel: data_sel, funcionario_sel: funcionario_sel, tempoTotal: tempoTotal, hora_sel: hora_sel, id_empresa: 3, cliente: localStorage.usuario },
                            success: function (data) {
                                /* função, titulo, mensagem, remetente, id_mysql do destinatario */
                                socket.emit('notifica_agendamento', 'Sr. Emilio', localStorage.usuario + ' solicitou uma reserva.', localStorage.id_usuario, funcionario_sel);

                                $("#data_agendamento").val('');

                                var resultado = JSON.parse(data);

                                $('#titulo_pag').html('Reservas');
                                $('#conteudo_pag').html('Carregando...');

                                $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
                                jQuery.ajax({
                                    type: "POST",
                                    url: "http://vipsio.com.br/admin/api/consultar_reservas_api.php",
                                    data: { usuario: localStorage.usuario, id_empresa: 3 },
                                    success: function (data) {

                                        var resultado = JSON.parse(data);
                                        $('#pedidos').html(resultado['html']);

                                        $('#titulo_pag').html('Reservas');
                                        $('#conteudo_pag').html($('#pedidos').html());
                                        telas.push(5);


                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                                    },
                                    complete: function (XMLHttpRequest, textStatus, errorThrown) {

                                        $.unblockUI();
                                    }
                                });

                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                            },
                            complete: function (XMLHttpRequest, textStatus, errorThrown) {

                                $.unblockUI();
                            }
                        });
                    }
                }
            }
            return false;
        });

        $(document).on('click', '#reservas_a', function () {

            $('#titulo_pag').html('Reservas');
            $('#conteudo_pag').html('Carregando...');

            $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
            jQuery.ajax({
                type: "POST",
                url: "http://vipsio.com.br/admin/api/consultar_reservas_api.php",
                data: { usuario: localStorage.usuario, id_empresa: 3 },
                success: function (data) {

                    var resultado = JSON.parse(data);

                    $('#pedidos').html(resultado['html']);

                    $('#titulo_pag').html('Reservas');
                    $('#conteudo_pag').html($('#pedidos').html());

                    telas.push(5);


                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                },
                complete: function (XMLHttpRequest, textStatus, errorThrown) {

                    $.unblockUI();
                }
            });
        });


        $(document).on('click', '#compras_a', function () {

            $('#titulo_pag').html('Compras');
            $('#conteudo_pag').html('<center><img src="images/box.gif" width="50px" /></center>');

            jQuery.ajax({
                type: "POST",
                url: "http://vipsio.com.br/admin/api_2/consultar_compras_api.php",
                data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token },
                success: function (data) {

                    var resultado = JSON.parse(data);
                    var compras = '';

                    if (resultado['return'] == 'sucesso') {

                        for (var i = 0; i < resultado['lote'].length; i++) {
                            compras += '<div class="linhaS_compras">' + resultado['lote'][i]['produtos'] + '<p class="green">Total: R$ ' + resultado['lote'][i]['valor_loteF'] + '</p></div>';
                        }

                    }

                    $('#titulo_pag').html('Compras');
                    $('#conteudo_pag').html(compras);
                    $("#conteudo_pag").append(html_menu_rapido);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                },
                complete: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        });

        $(document).on('click', '#mr_pesquisa', function () {
            $('#conteudo_pag').html(html_pesquisa);

            var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

            elems.forEach(function(html) {
              var switchery = new Switchery(html, { size: 'small' });
            });

            $('#pesquisar_text input').focus();
        });

        $(document).on('click', '#mr_camera', function () {
           getImage();
        });

        $(document).on('click', '#agendar_a', function () {
            $('#conteudo_pag').html(html_pesquisa);

            var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

            elems.forEach(function(html) {
              var switchery = new Switchery(html, { size: 'small' });
            });

            var elems = Array.prototype.slice.call(document.querySelectorAll('#conteudo_pag input[type="checkbox"]'));
            elems.forEach(function (html) {
                var switchery = new Switchery(html, { size: 'small' });
            });
        });

        $("#menu_rapido").click(function () {
            var setContentHeight = function () {
                $RIGHT_COL.css('min-height', $(window).height());

                var bodyHeight = $BODY.outerHeight(),
                    footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
                    leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
                    contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

                contentHeight -= $NAV_MENU.height() + footerHeight;

                $RIGHT_COL.css('min-height', contentHeight);
            };

            if ($BODY.hasClass('nav-md')) {
                $SIDEBAR_MENU.find('li.active ul').hide();
                $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
            } else {
                $SIDEBAR_MENU.find('li.active-sm ul').show();
                $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
            }

            $BODY.removeClass('nav-sm');
            $BODY.addClass('nav-md');

            setContentHeight();
            $RIGHT_COL.css('min-height', '100vh');

        });

        $(".right_col").click(function () {
            var setContentHeight = function () {
                $RIGHT_COL.css('min-height', $(window).height());

                var bodyHeight = $BODY.outerHeight(),
                    footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
                    leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
                    contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

                contentHeight -= $NAV_MENU.height() + footerHeight;

                $RIGHT_COL.css('min-height', contentHeight);
            };

            if ($BODY.hasClass('nav-md')) {
                $SIDEBAR_MENU.find('li.active ul').hide();
                $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
            } else {
                $SIDEBAR_MENU.find('li.active-sm ul').show();
                $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
            }

            $BODY.removeClass('nav-sm');
            $BODY.addClass('nav-md');

            setContentHeight();
            $RIGHT_COL.css('min-height', '100vh');

        });


        $(document).on('click', '.linha_pesquisa', function () {

            var tipo = $(this).attr('tipo');

            if(tipo == 'empresa'){
                var id_empresa = $(this).attr('id_empresa');
                jQuery.ajax({
                    type: "POST",
                    url: "http://vipsio.com.br/admin/api_2/consultar_empresa_api.php",
                    data: { id_empresa: id_empresa, usuario: localStorage.usuario, token: localStorage.token },
                    success: function (data) {
                        var resultado = JSON.parse(data);
                        //esse result vemm com os dados da empresa
                        if (resultado['return'] == 'sucesso') {


                            $('#conteudo_pag').html(html_lay_empresa);

                            $('#capa_perfil').css('background', 'url(' + resultado['empresa']['capa_caminho'] + resultado['empresa']['capa_img'] + ')').css('backgroundPosition', 'top center').css('backgroundRepeat', 'no-repeat').css('backgroundSize', 'auto 110%');
                            $('#foto_perfil img').attr('src', resultado['empresa']['logo_caminho'] + resultado['empresa']['logo_img']);
                            $('#nome_perfil').html(resultado['empresa']['razao_social_empresa']);
                            $('#descricao_perfil').html(resultado['empresa']['slogan']);
                            $('#id_empresa_finaliza').html(resultado['empresa']['id_empresa']);

                            id_empresa_finaliza = resultado['empresa']['id_empresa'];

                            var linhas_produtos = '';
                            for (var i = 0; i < resultado['produtos'].length; i++) {
                                linhas_produtos += '<div class="linha_menu">' +
                                    '<div class="preco_menu"><p class="preco_menu">R$ ' + resultado['produtos'][i]['valor_produtoF'] + '</p></div>' +
                                    '<div class="loja_menu">' +
                                    '<p class="nome_menu">' + resultado['produtos'][i]['produto'] + '</p>' +
                                    '<p class="descricao_menu">' + resultado['produtos'][i]['descricao'] + '</p>' +
                                    '</div>' +
                                    '<div class="op_menu">' +
                                    '<div class="menos_menu"><i class="fa fa-minus"></i></div>' +
                                    '<div class="quantidade_menu"><input class="id_produto" name="id_produto[]" id_produto="' + resultado['produtos'][i]['id_produto'] + '" nome_produto="' + resultado['produtos'][i]['produto'] + '" preco_produto="' + resultado['produtos'][i]['valor_produto'] + '" type="number" value="0" min="0" step="1"></div>' +
                                    '<div class="mais_menu"><i class="fa fa-plus"></i></div>' +
                                    '</div>' +
                                    '</div>';
                            }

                            $("#conteiner_linha_menu").html(linhas_produtos);

                            $("#conteudo_pag").append(html_menu_rapido);

                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                    },
                    complete: function (XMLHttpRequest, textStatus, errorThrown) {

                        $.unblockUI();
                    }
                });
            }else if(tipo == 'cliente'){
                var id_cliente = $(this).attr('id_cliente');
                jQuery.ajax({
                    type: "POST",
                    url: "http://vipsio.com.br/admin/api_2/consultar_cliente_api.php",
                    data: { id_cliente: id_cliente, usuario: localStorage.usuario, token: localStorage.token },
                    success: function (data) {
                        var resultado = JSON.parse(data);

                        if (resultado['return'] == 'sucesso') {

                            $('#conteudo_pag').html(html_lay_cliente);

                            $('#capa_perfil').css('background', 'url(' + resultado['cliente']['capa_caminho'] + resultado['cliente']['capa_img'] + ')').css('backgroundPosition', 'top center').css('backgroundRepeat', 'no-repeat').css('backgroundSize', 'auto 110%');
                            $('#foto_perfil img').attr('src', resultado['cliente']['foto_perfil_caminho'] + resultado['cliente']['foto_perfil']);
                            $('#nome_perfil').html(resultado['cliente']['usuario']);
                            $('#descricao_perfil').html(resultado['cliente']['descricao']);

                            /*
                            var linhas_produtos = '';
                            for (var i = 0; i < resultado['produtos'].length; i++) {
                               
                            }

                            $("#conteiner_linha_menu").html(linhas_produtos);

                            $("#conteudo_pag").append(html_menu_rapido);
                            */

                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                    },
                    complete: function (XMLHttpRequest, textStatus, errorThrown) {

                        $.unblockUI();
                    }
                });
            }

        });


        $(document).on('click', '#sair_a', function () {
            $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
            jQuery.ajax({
                type: "POST",
                url: "http://vipsio.com.br/admin/api/sair_api.php",
                data: { id_usuario: localStorage.id_usuario },
                success: function (data) {
                    localStorage.usuario = '';

                    telas = '';
                    telas = [];

                    $('#template').css('display', 'none');
                    $('#telas_container').css('display', 'block');

                    $("#inicio").css('display', 'block');

                    telas.push(1);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                },
                complete: function (XMLHttpRequest, textStatus, errorThrown) {

                    $.unblockUI();
                }
            });

        });


        $('#qtde_notificacoes_li').click(function () {
            $.blockUI({ message: '<img src="images/box.gif" width="50px" /><p>Aguarde...</p>' });
            jQuery.ajax({
                type: "POST",
                url: "http://vipsio.com.br/admin/api/marca_visualizacao_notificacoes_api.php",
                data: { id_destinatario: localStorage.id_usuario },
                success: function (data) {

                    var resultado = JSON.parse(data);
                    if (resultado['return'] == 'sucesso') {
                        $('#qtde_notificacoes').html('');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                },
                complete: function (XMLHttpRequest, textStatus, errorThrown) {

                    $.unblockUI();
                }
            });
        });

        $(document).ready(function () {
            $('input[name="cep"]').mask("99999-999");
            $('input[name="fone"]').mask("(99)9999-9999?9");
            $('input[name="cpf"]').mask("999.999.999-99");
            $('input[name="cnpj"').mask("99.999.999/9999-99");
            $('input[name="tel"]').mask("(99)9999-9999?9");
            $('input[name="cel"]').mask("(99)9999-9999?9");
            $('.time').mask("99:99");
            $('.datetime').mask("99/99/9999 99:99:99");

            if ($('#tipo_doc_empresa').val() == 'cnpj') {
                $('#doc').mask("99.999.999/9999-99");
            } else if ($('#tipo_doc_empresa').val() == 'cpf') {
                $('#doc').mask("999.999.999-99");
                $('.cad_simplificado').css('display', 'none');
            }

            if ($('#tipo_doc').val() == 'cnpj') {
                $('#doc').mask("99.999.999/9999-99");
            } else if ($('#tipo_doc').val() == 'cpf') {
                $('#doc').mask("999.999.999-99");
                $('.cad_simplificado').css('display', 'none');
            }
        });

        $(document).on('click', '.menos_menu', function () {
            var qtde = $(this).next(".quantidade_menu").find('input');
            if (parseInt(qtde.val()) > 0) {
                qtde.val(parseInt(qtde.val()) - 1);
            }
        });

        $(document).on('click', '.mais_menu', function () {
            var qtde = $(this).prev(".quantidade_menu").find('input');
            qtde.val(parseInt(qtde.val()) + 1);

        });

        $(document).on('submit', '#escolher_entrega_form', function () {
            msgPedido = '<div class="confirmar_pedido"><h1>Dados do pedido</h1></br>';

            total = 0;
            total_geral = 0;
            cont = 0;

            id_produto = [];
            qtde = [];
            produtos = [];
            preco = [];

            $(".id_produto").each(function (index, value) {
                total = 0;
                if (parseInt($(this).val()) > 0) {

                    total = parseFloat($(this).val()) * parseFloat($(this).attr('preco_produto'));
                    msgPedido += '<p>' + $(this).attr('nome_produto') + '. Quantidade: ' + $(this).val() + '</p>';
                    total_geral += total;

                    id_produto.push($(this).attr('id_produto'));
                    qtde.push($(this).val());
                    produtos.push($(this).attr('nome_produto'));
                    preco.push($(this).attr('preco_produto'));

                    cont++;
                }
            });

            msgPedido += '<p id="p_total">Total: R$ ' + total_geral + '</p></div><hr>';

            if (total_geral > 0) {
                $('#conteudo_pag').html(msgPedido + html_dados_entrega_1 + html_menu_rapido);
            }

            return false;
        });

        var pagamento = '';
        var html_pagamento = '';
        var entrega = '';
        var html_entrega = '';


        $(document).on('click', '#div_proximo', function () {

            pagamento = $(".radio_pagamento:checked").val();
            entrega = $(".radio_entrega:checked").val();

            if(entrega == 'balcao'){

                html_entrega = '<p>Tipo de entrega: Balcão.</p>';

                if(pagamento == 'dinheiro'){

                    html_pagamento = '<p>Método de pagamento: Dinheiro.</p>';

                    $('#conteudo_pag').html(msgPedido + html_entrega + html_pagamento);
                    $("#conteudo_pag").append(html_menu_rapido);
                    $('#conteudo_pag').append(html_finaliza);

                }else if(pagamento == 'credito'){


                    html_pagamento = '<p>Método de pagamento: Crédito.</p>';

                    $('#conteudo_pag').html(msgPedido);
                    $('#conteudo_pag').html(msgPedido + html_entrega + html_pagamento);

                    if(entrega == 'mesa'){
                        $('#conteudo_pag').append(msgPedido2);
                    }

                    jQuery.ajax({
                        type: "POST",
                        url: "http://vipsio.com.br/admin/api_2/pag_inicia_sessao.php",
                        data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token },
                        success: function (data) {
                            var resultado = JSON.parse(data);
                            if (resultado['return'] == 'sucesso') {

                                sessionId = resultado['sessionId'];

                                $.getScript(link_pagseguro, function () {
                                    PagSeguroDirectPayment.setSessionId(sessionId);
                                    $('#conteudo_pag').append(html_dados_credito);
                                    carrega_dados_usuario(true, true);
                                });
                            } else {
                                alert('erro');
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                        },
                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                            $.unblockUI();
                        }
                    });


                    var tipo_card = $('input:radio[name="cartoes_radio"]:checked').attr('tipo');
                    var nome_card = $('input:radio[name="cartoes_radio"]:checked').attr('nome');
                    var cod_card = $('input:radio[name="cartoes_radio"]:checked').attr('value');

                    $("#conteudo_pag").append(html_menu_rapido);
                    $("#conteudo_pag").append(html_finaliza);

                }else{

                }
            }else if(entrega == 'mesa'){

                html_entrega = '<p>Tipo de entrega: Mesa.</p>';

                $('#conteudo_pag').html(msgPedido + html_pagamento + html_entrega + html_mesa);
                $("#conteudo_pag").append(html_div_proximo2);
                $("#conteudo_pag").append(html_menu_rapido);

                jQuery.ajax({
                    type: "POST",
                    url: "http://vipsio.com.br/admin/api_2/consultar_mesas_api.php",
                    data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token, id_empresa: id_empresa_finaliza },
                    success: function (data) {

                        var resultado = JSON.parse(data);


                        if (resultado['return'] == 'sucesso') {
                            $("#conteudo_pag").append(resultado['html']);
                        }

                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                    },
                    complete: function (XMLHttpRequest, textStatus, errorThrown) {

                    }
                });

            }else if(entrega == 'casa'){

                entrega = 'casa';
                html_entrega = '<p>Tipo de entrega: No endereço.</p>';

                if(pagamento == 'dinheiro'){
                    html_pagamento = '<p>Método de pagamento: Dinheiro.</p>';
                    $('#conteudo_pag').html(msgPedido + html_entrega + html_pagamento + html_informacoes_pessoais);
                    $("#conteudo_pag").append(html_salvar_dados);
                    $("#conteudo_pag").append(html_menu_rapido);
                    $("#conteudo_pag").append(html_div_proximo2);

                    //dados pessoais, dados do cartão
                    carrega_dados_usuario(true, false);

                }else if(pagamento == 'credito'){
                    html_pagamento = '<p>Método de pagamento: Crédito.</p>';

                    html_pagamento = '<p>Método de pagamento: Dinheiro.</p>';
                    $('#conteudo_pag').html(msgPedido + html_entrega + html_pagamento + html_informacoes_pessoais);
                    $("#conteudo_pag").append(html_salvar_dados);
                    $("#conteudo_pag").append(html_menu_rapido);
                    $("#conteudo_pag").append(html_div_proximo2);

                    //dados pessoais, dados do cartão
                    carrega_dados_usuario(true, false);
                }

                    
            }else{

            }
            return false;
        });


        //chama a pagina com os metodos de pagamento
        //para entrega na mesa precisa pegar a mesa antes
        //para entrega casa precisa pegar o endereço antes
        $(document).on('click', '#div_proximo2', function () {

            if(entrega == 'mesa'){

                if(pagamento == 'dinheiro'){

                    mesa = $("#sel_mesas option:selected").val();

                    msgPedido2 = '<p>Mesa: ' + mesa + '</p>';

                    $('#conteudo_pag').html(msgPedido + msgPedido2 + html_pagamento + html_entrega);
                    $("#conteudo_pag").append(html_finaliza);
                    $("#conteudo_pag").append(html_menu_rapido);

                }else if(pagamento == 'credito'){

                    html_pagamento = '<p>Método de pagamento: Crédito.</p>';

                    mesa = $("#sel_mesas option:selected").val();

                    msgPedido2 = '<p>Mesa: ' + mesa + '</p>';

                    $('#conteudo_pag').html(msgPedido + msgPedido2 + html_pagamento + html_entrega);
                

                    jQuery.ajax({
                        type: "POST",
                        url: "http://vipsio.com.br/admin/api_2/pag_inicia_sessao.php",
                        data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token },
                        success: function (data) {
                            var resultado = JSON.parse(data);
                            if (resultado['return'] == 'sucesso') {

                                sessionId = resultado['sessionId'];

                                $.getScript(link_pagseguro, function () {
                                    PagSeguroDirectPayment.setSessionId(sessionId);
                                    $('#conteudo_pag').append(html_dados_credito);
                                    carrega_dados_usuario(true, true);
                                });
                            } else {
                                alert('erro');
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                        },
                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                            $.unblockUI();
                        }
                    });


                    var tipo_card = $('input:radio[name="cartoes_radio"]:checked').attr('tipo');
                    var nome_card = $('input:radio[name="cartoes_radio"]:checked').attr('nome');
                    var cod_card = $('input:radio[name="cartoes_radio"]:checked').attr('value');

                    $("#conteudo_pag").append(html_menu_rapido);
                    $("#conteudo_pag").append(html_finaliza);                        
                }else{

                }

            }else if(entrega == 'casa'){


                dados_pessoais_entrega = {
                    'nome_cliente': $("input#nome_cliente").val(),
                    'email_cliente': $("input#email_cliente").val(),
                    'ddd_cliente': $("input#ddd_cliente").val(),
                    'celular_cliente': $("input#celular_cliente").val(),
                    'logradouro_cliente': $("input#logradouro_cliente").val(),
                    'n_cliente': $("input#n_cliente").val(),
                    'bairro_cliente': $("input#bairro_cliente").val(),
                    'estado_cliente': $('#estado_cliente option:selected').attr('value'),
                    'cidade_cliente': $('#cidade_cliente option:selected').attr('value'),
                    'cep_cliente': $("input#cep_cliente").val(),
                    'cpf_cnpj_cliente': $("input#cpf_cnpj_cliente").val(),
                    'comp_cliente': $("input#comp_cliente").val()
                };

                if ($("#salvar_dados").is(':checked')) {
                    salvar_dados = 1;
                } else {
                    salvar_dados = 0;
                }

                msgPedido2 = '<p>Nome: ' + dados_pessoais_entrega['nome_cliente'] + '</p>';
                msgPedido2 += '<p>Email: ' + dados_pessoais_entrega['email_cliente'] + '</p>';
                msgPedido2 += '<p>DDD: ' + dados_pessoais_entrega['ddd_cliente'] + '</p>';
                msgPedido2 += '<p>Celular: ' + dados_pessoais_entrega['celular_cliente'] + '</p>';
                msgPedido2 += '<p>Endereço: ' + dados_pessoais_entrega['logradouro_cliente'] + '</p>';
                msgPedido2 += '<p>N°: ' + dados_pessoais_entrega['n_cliente'] + '</p>';
                msgPedido2 += '<p>Bairro: ' + dados_pessoais_entrega['bairro_cliente'] + '</p>';
                msgPedido2 += '<p>Estado: ' + dados_pessoais_entrega['estado_cliente'] + '</p>';
                msgPedido2 += '<p>Cidade: ' + dados_pessoais_entrega['cidade_cliente'] + '</p>';
                msgPedido2 += '<p>CEP: ' + dados_pessoais_entrega['cep_cliente'] + '</p>';
                msgPedido2 += '<p>Complemento: ' + dados_pessoais_entrega['comp_cliente'] + '</p>';


                if(pagamento == 'dinheiro'){

                    html_pagamento = '<p>Método de pagamento: Dinheiro.</p>';
                    $('#conteudo_pag').html(msgPedido + html_entrega + html_pagamento + msgPedido2);
                    $("#conteudo_pag").append(html_finaliza);

                }else if(pagamento == 'credito'){

                    html_pagamento = '<p>Método de pagamento: Crédito.</p>';

                    $('#conteudo_pag').html(msgPedido);
                    $('#conteudo_pag').html(msgPedido + html_entrega + html_pagamento);

                    jQuery.ajax({
                        type: "POST",
                        url: "http://vipsio.com.br/admin/api_2/pag_inicia_sessao.php",
                        data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token },
                        success: function (data) {
                            var resultado = JSON.parse(data);
                            if (resultado['return'] == 'sucesso') {

                                sessionId = resultado['sessionId'];

                                $.getScript(link_pagseguro, function () {
                                    PagSeguroDirectPayment.setSessionId(sessionId);
                                    $('#conteudo_pag').append(html_dados_credito);
                                    carrega_dados_usuario(true, true);
                                });
                            } else {
                                alert('erro');
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                        },
                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                            $.unblockUI();
                        }
                    });

                    var tipo_card = $('input:radio[name="cartoes_radio"]:checked').attr('tipo');
                    var nome_card = $('input:radio[name="cartoes_radio"]:checked').attr('nome');
                    var cod_card = $('input:radio[name="cartoes_radio"]:checked').attr('value');

                    $("#conteudo_pag").append(html_finaliza);
                }else{

                }

                $("#conteudo_pag").append(html_menu_rapido);


            }

            return false;
        });

        /* ULTIMO PASSO, COMPRA EM DINHEIRO PARA ENTREGA EM CASA */

        /* FIM ULTIMO PASSO */


        /* FINALIZA COMPRA */
        $(document).on('click', '#finaliza_pedido', function () {

            if (pagamento == 'dinheiro') {
                if (entrega == 'balcao') {
                    jQuery.ajax({
                        type: "POST",
                        url: "http://vipsio.com.br/admin/api_2/checkout.php",
                        data: { id_produto: id_produto, qtde: qtde, produtos: produtos, preco: preco, dadosCliente: dadosCliente, id_empresa: id_empresa_finaliza, usuario: localStorage.usuario, token: localStorage.token, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, entrega: entrega },
                        success: function (data) {
                            var resultado = JSON.parse(data);

                            if (resultado['return'] == 'sucesso') {


                                /******************
                                1 Aguardando pagamento: o comprador iniciou a transação, mas até o momento o PagSeguro não recebeu nenhuma informação sobre o pagamento.
                                2 Em análise: o comprador optou por pagar com um cartão de crédito e o PagSeguro está analisando o risco da transação.
                                3 Paga: a transação foi paga pelo comprador e o PagSeguro já recebeu uma confirmação da instituição financeira responsável pelo processamento.
                                4 Disponível: a transação foi paga e chegou ao final de seu prazo de liberação sem ter sido retornada e sem que haja nenhuma disputa aberta.
                                5 Em disputa: o comprador, dentro do prazo de liberação da transação, abriu uma disputa.
                                6 Devolvida: o valor da transação foi devolvido para o comprador.
                                7 Cancelada: a transação foi cancelada sem ter sido finalizada.
                                *******************/

                                $('#conteudo_pag').html('<center><img src="images/box.gif" width="50px" /></center>');

                                jQuery.ajax({
                                    type: "POST",
                                    url: "http://vipsio.com.br/admin/api_2/consultar_compras_api.php",
                                    data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token },
                                    success: function (data) {

                                        var resultado = JSON.parse(data);
                                        var compras = '';

                                        if (resultado['return'] == 'sucesso') {

                                            for (var i = 0; i < resultado['lote'].length; i++) {
                                                compras += '<div class="linhaS_compras">' + resultado['lote'][i]['produtos'] + '<p class="green">Total: R$ ' + resultado['lote'][i]['valor_loteF'] + '</p></div>';
                                            }

                                        }

                                        $('#titulo_pag').html('Compras');
                                        $('#conteudo_pag').html(compras);
                                        $("#conteudo_pag").append(html_menu_rapido);

                                        $("#conteudo_pag").append(html_sucesso);
                                        $("#div_msg_sucesso").hide(4000);

                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                                    },
                                    complete: function (XMLHttpRequest, textStatus, errorThrown) {

                                    }
                                });
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                        },
                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                            $.unblockUI();
                        }
                    });
                } else if (entrega == 'mesa') {
                    jQuery.ajax({
                        type: "POST",
                        url: "http://vipsio.com.br/admin/api_2/checkout.php",
                        data: { id_produto: id_produto, qtde: qtde, produtos: produtos, preco: preco, dadosCliente: dadosCliente, id_empresa: id_empresa_finaliza, usuario: localStorage.usuario, token: localStorage.token, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, mesa: mesa, entrega: entrega },
                        success: function (data) {
                            var resultado = JSON.parse(data);

                            if (resultado['return'] == 'sucesso') {


                                /******************
                                1 Aguardando pagamento: o comprador iniciou a transação, mas até o momento o PagSeguro não recebeu nenhuma informação sobre o pagamento.
                                2 Em análise: o comprador optou por pagar com um cartão de crédito e o PagSeguro está analisando o risco da transação.
                                3 Paga: a transação foi paga pelo comprador e o PagSeguro já recebeu uma confirmação da instituição financeira responsável pelo processamento.
                                4 Disponível: a transação foi paga e chegou ao final de seu prazo de liberação sem ter sido retornada e sem que haja nenhuma disputa aberta.
                                5 Em disputa: o comprador, dentro do prazo de liberação da transação, abriu uma disputa.
                                6 Devolvida: o valor da transação foi devolvido para o comprador.
                                7 Cancelada: a transação foi cancelada sem ter sido finalizada.
                                *******************/

                                $('#conteudo_pag').html('<center><img src="images/box.gif" width="50px" /></center>');

                                jQuery.ajax({
                                    type: "POST",
                                    url: "http://vipsio.com.br/admin/api_2/consultar_compras_api.php",
                                    data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token },
                                    success: function (data) {

                                        var resultado = JSON.parse(data);
                                        var compras = '';

                                        if (resultado['return'] == 'sucesso') {

                                            for (var i = 0; i < resultado['lote'].length; i++) {
                                                compras += '<div class="linhaS_compras">' + resultado['lote'][i]['produtos'] + '<p class="green">Total: R$ ' + resultado['lote'][i]['valor_loteF'] + '</p></div>';
                                            }

                                        }

                                        $('#titulo_pag').html('Compras');
                                        $('#conteudo_pag').html(compras);
                                        $("#conteudo_pag").append(html_menu_rapido);

                                        $("#conteudo_pag").append(html_sucesso);
                                        $("#div_msg_sucesso").hide(4500);

                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                                    },
                                    complete: function (XMLHttpRequest, textStatus, errorThrown) {

                                    }
                                });
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                        },
                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                            $.unblockUI();
                        }
                    });
                } else if (entrega == 'casa') {

                    jQuery.ajax({
                        type: "POST",
                        url: "http://vipsio.com.br/admin/api_2/checkout.php",
                        data: { id_produto: id_produto, qtde: qtde, produtos: produtos, preco: preco, id_empresa: id_empresa_finaliza, usuario: localStorage.usuario, token: localStorage.token, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, entrega: entrega, dados_pessoais_entrega: dados_pessoais_entrega, salvar_dados: salvar_dados },
                        success: function (data) {

                            var resultado = JSON.parse(data);
                            console.log(resultado);

                            if (resultado['return'] == 'sucesso') {


                                /******************
                                1 Aguardando pagamento: o comprador iniciou a transação, mas até o momento o PagSeguro não recebeu nenhuma informação sobre o pagamento.
                                2 Em análise: o comprador optou por pagar com um cartão de crédito e o PagSeguro está analisando o risco da transação.
                                3 Paga: a transação foi paga pelo comprador e o PagSeguro já recebeu uma confirmação da instituição financeira responsável pelo processamento.
                                4 Disponível: a transação foi paga e chegou ao final de seu prazo de liberação sem ter sido retornada e sem que haja nenhuma disputa aberta.
                                5 Em disputa: o comprador, dentro do prazo de liberação da transação, abriu uma disputa.
                                6 Devolvida: o valor da transação foi devolvido para o comprador.
                                7 Cancelada: a transação foi cancelada sem ter sido finalizada.
                                *******************/


                                $('#conteudo_pag').html('<center><img src="images/box.gif" width="50px" /></center>');

                                jQuery.ajax({
                                    type: "POST",
                                    url: "http://vipsio.com.br/admin/api_2/consultar_compras_api.php",
                                    data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token },
                                    success: function (data) {

                                        var resultado = JSON.parse(data);
                                        var compras = '';

                                        if (resultado['return'] == 'sucesso') {

                                            for (var i = 0; i < resultado['lote'].length; i++) {
                                                compras += '<div class="linhaS_compras">' + resultado['lote'][i]['produtos'] + '<p class="green">Total: R$ ' + resultado['lote'][i]['valor_loteF'] + '</p></div>';
                                            }

                                        }


                                        $('#titulo_pag').html('Compras');
                                        $('#conteudo_pag').html(compras);
                                        $("#conteudo_pag").append(html_menu_rapido);

                                        $("#conteudo_pag").append(html_sucesso);
                                        $("#div_msg_sucesso").hide(4500);

                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                                    },
                                    complete: function (XMLHttpRequest, textStatus, errorThrown) {

                                    }
                                });
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                        },
                        complete: function (XMLHttpRequest, textStatus, errorThrown) {

                            $.unblockUI();
                        }
                    });
                }
            } else if (pagamento == 'credito') {

                var tokenCartao = '';
                var cardNumber = '';
                var expirationMonth = '';
                var expirationYear = '';
                var cvv = '';
                var cardName = '';

                var html_parcelamento = '';


                $.getScript("https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js", function () {


                    var tamanho = $("input#ano_credito_cliente").val().length;
                    if (tamanho == 2) {
                        $("input#ano_credito_cliente").val('20' + $("input#ano_credito_cliente").val());
                    } else if (tamanho == 3) {
                        $("input#ano_credito_cliente").val('2' + $("input#ano_credito_cliente").val());
                    }

                    senderHash = PagSeguroDirectPayment.getSenderHash();


                    var param = {
                        cardNumber: $("input#n_credito_cliente").val(),
                        cvv: $("input#cvv").val(),
                        expirationMonth: $("input#mes_credito_cliente").val(),
                        expirationYear: $("input#ano_credito_cliente").val(),
                        success: function (response) {
                            //token gerado, esse deve ser usado na chamada da API do Checkout Transparente
                            tokenCartao = response['card']['token'];

                            dadosCliente = {
                                'cardName': $("input#nome_credito_cliente").val(),
                                'cardNumber': $("input#n_credito_cliente").val(),
                                'expirationMonth': $("input#mes_credito_cliente").val(),
                                'expirationYear': $("input#ano_credito_cliente").val(),
                                'cvv': $("input#cvv").val(),
                                'cpf_cnpj_cliente': $("input#cpf_cnpj_credito_cliente").val(),
                                'tokenCartao': response['card']['token'],
                                'senderHash': senderHash,
                                'parcelamento': {
                                    'quantity': $("#parcelamento option:selected").attr('quantity'),
                                    'installmentAmount': $("#parcelamento option:selected").attr('installmentAmount')
                                }
                            };


                            jQuery.ajax({
                                type: "POST",
                                url: "http://vipsio.com.br/admin/api_2/pag_checkout_credito.php",
                                data: { id_produto: id_produto, qtde: qtde, produtos: produtos, preco: preco, dadosCliente: dadosCliente, dados_pessoais_entrega: dados_pessoais_entrega, id_empresa: id_empresa_finaliza, usuario: localStorage.usuario, token: localStorage.token, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, entrega: entrega, mesa:mesa, salvar_dados: salvar_dados },
                                success: function (data) {
                                    var resultado = JSON.parse(data);
                                    console.log(resultado);
                                    if (resultado['return'] == 'sucesso') {


                                        /******************
                                        1 Aguardando pagamento: o comprador iniciou a transação, mas até o momento o PagSeguro não recebeu nenhuma informação sobre o pagamento.
                                        2 Em análise: o comprador optou por pagar com um cartão de crédito e o PagSeguro está analisando o risco da transação.
                                        3 Paga: a transação foi paga pelo comprador e o PagSeguro já recebeu uma confirmação da instituição financeira responsável pelo processamento.
                                        4 Disponível: a transação foi paga e chegou ao final de seu prazo de liberação sem ter sido retornada e sem que haja nenhuma disputa aberta.
                                        5 Em disputa: o comprador, dentro do prazo de liberação da transação, abriu uma disputa.
                                        6 Devolvida: o valor da transação foi devolvido para o comprador.
                                        7 Cancelada: a transação foi cancelada sem ter sido finalizada.
                                        *******************/


                                        $('#conteudo_pag').html('<center><img src="images/box.gif" width="50px" /></center>');

                                        jQuery.ajax({
                                            type: "POST",
                                            url: "http://vipsio.com.br/admin/api_2/consultar_compras_api.php",
                                            data: { usuario: localStorage.usuario, id_usuario: localStorage.id_usuario, id_cliente: localStorage.id_cliente, token: localStorage.token },
                                            success: function (data) {

                                                var resultado = JSON.parse(data);
                                                var compras = '';

                                                if (resultado['return'] == 'sucesso') {

                                                    for (var i = 0; i < resultado['lote'].length; i++) {
                                                        compras += '<div class="linhaS_compras">' + resultado['lote'][i]['produtos'] + '<p class="green">Total: R$ ' + resultado['lote'][i]['valor_loteF'] + '</p></div>';
                                                    }

                                                }


                                                $('#conteudo_pag').html(compras);
                                                $("#conteudo_pag").append(html_menu_rapido);

                                                $("#conteudo_pag").append(html_sucesso);
                                                $("#div_msg_sucesso").hide(4000);

                                            },
                                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                                alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                                            },
                                            complete: function (XMLHttpRequest, textStatus, errorThrown) {

                                            }
                                        });
                                    }else{
                                        if(resultado['return'] == 'erro_pagseguro'){
                                            alert(resultado['msg'][0]);
                                        }
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                                },
                                complete: function (XMLHttpRequest, textStatus, errorThrown) {

                                    $.unblockUI();
                                }
                            });

                        },
                        error: function (response) {
                            //tratamento do erro
                            console.log(response);
                        },
                        complete: function (response) {
                            //tratamento comum para todas chamadas
                        }
                    }

                    PagSeguroDirectPayment.createCardToken(param);

                });

                /* FIM FINALIZA COMPRA */


                $(document).on('change', 'input#n_credito_cliente', function () {
                    carrega_bandeiras_credito();
                });



                $("#conteudo_pag").append(html_menu_rapido);


            }
        });

        $("#conteudo_pag").append(html_menu_rapido);

        $(document).on('keyup', '#pesquisar_in', function () {
            $('#pesquisa_conteudo').html(carregando);
            var pesquisa = $(this).val();
            jQuery.ajax({
                type: "POST",
                url: "http://vipsio.com.br/admin/api_2/pesquisar_api.php",
                data: {pesquisa:pesquisa, usuario: localStorage.usuario, token: localStorage.token, pesquisa_empresas:$('#pesquisa_empresas').is(':checked'), pesquisa_clientes:$('#pesquisa_clientes').is(':checked') },
                success: function (data) {
                    var resultado = JSON.parse(data);
                    console.log(data);
                    if(resultado['return'] == 'sucesso'){
                        $('#pesquisa_conteudo').html(resultado['html']);
                    }else{
                        $("#pesquisa_conteudo").html('Nenhum resultado encontrado.');
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Erro crítico, reinicie sua aplicação, se o problema persistir entre em contato com o suporte.");
                }
            });
        });
    }

    $("input").focus(function (e) {
        var container = $(this).closest('div'),
            scrollTo = $(this);

        setTimeout((function () {
            container.animate({
                scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
            });
        }), 500);

    });

    $("input").click(function (e) {
        e.stopPropagation();
        var container = $(this).closest('div'),
            scrollTo = $(this);

        setTimeout((function () {
            container.animate({
                scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
            });
        }), 500);
    });



});
