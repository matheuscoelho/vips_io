app.initialize();

var socket = io.connect("http://vipsio.com.br:3001");

socket.on('notificacoes_cliente', function (mensagem) {
    //alert(mensagem);
});

var html_menu_rapido = '<div id="menu_rapido" class="col-md-12 col-sm-12 col-xs-12">' + 
                                '<div id="mr_inicio"><i class="fa fa-home"></i></div>' + 
                                '<div id="mr_pesquisa"><i class="fa fa-search"></i></div>' + 
                                '<div id="mr_camera"><i class="fa fa-camera-retro"></i></div>' + 
                                '<div id="mr_galeria"><i class="fa fa-picture-o"></i></div>' + 
                                '<div id="mr_perfil"><i class="fa fa-user"></i></div>' + 
                            '</div>';

var html_dados_credito = ' <div id="dados_cartao_div" class="view" tela="7">' +
                            '<form method="POST" id="dados_cartao_form">' +
                            '<div class="form">' +
                                '<p>Informe os dados do cartão de crédito.</p>' +
                                '<p id="pBandeira"></p>' + 
                                '<input type="number" placeholder="Número do cartão" required="required" id="cardNumber" name="cardNumber" />' +
                                '<input type="text" placeholder="Mês" id="expirationMonth" name="expirationMonth" />' +
                                '<input type="text" placeholder="Ano" id="expirationYear" name="expirationYear" />' +
                                '<input type="text" placeholder="CVC" required="" id="cvv" name="cvv" />' +
                                '<input type="text" placeholder="Nome no cartão" required="required" id="cardName" name="cardName" />' +  
                                '<div id="divParcelamento"></div>' +  
                                '<button type="submit">Finalizar</button>' +

                                '<p>Informações pessoais.</p>' +
                                estados +
                                '<input type="text" placeholder="Nome completo" id="nomeCliente" name="nomeCliente" />' +
                                '<input type="text" placeholder="Email" id="email_cliente" name="email_cliente" />' +
                                '<input type="text" placeholder="Cpf ou cnpj" id="cpf_cnpj_cliente" name="cpf_cnpj_cliente" />' +
                                '<input type="text" placeholder="Logradouro" id="logradouro_cliente" name="logradouro_cliente" />' +
                                '<input type="text" placeholder="Numero" id="n_cliente" name="n_cliente" />' +
                                '<input type="text" placeholder="Bairro" id="bairro_cliente" name="bairro_cliente" />' +
                                '<button type="submit">Finalizar</button>' +
                            '</div>' +
                            '</form>' +
                        '</div>';

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


        var isValidDate = function (str) {
            return !!new Date(str).getTime();
        }

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


        $(document).on('click', '#agendar_a', function () {
            $('#conteudo_pag').html($('#pesquisa').html());

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

        $(document).on('click', '#mr_pesquisa', function () {
            $('#conteudo_pag').html($('#pesquisa').html());
            $('#pesquisar_text input').focus();
        });

        $(document).on('click', '.linha_pesquisa', function () {

            var id_empresa = $(this).attr('id_empresa');
            jQuery.ajax({
                type: "POST",
                url: "http://vipsio.com.br/admin/api_2/consultar_empresa_api.php",
                data: {id_empresa:id_empresa, usuario: localStorage.usuario, token: localStorage.token },
                success: function (data) {
                    var resultado = JSON.parse(data);
                    if(resultado['return'] == 'sucesso'){
                        console.log(resultado);


                        $('#conteudo_pag').html('');
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
                    console.log(data);
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
            var qtde = $(this).next( ".quantidade_menu" ).find('input');
            if(parseInt(qtde.val()) > 0){
                qtde.val(parseInt(qtde.val()) - 1);
            }
        });

        $(document).on('click', '.mais_menu', function () {
            var qtde = $(this).prev( ".quantidade_menu" ).find('input');
            qtde.val(parseInt(qtde.val()) + 1);

        });


        var msgPedido = "Confirme seu pedido.</br>";

        var id_empresa_finaliza  = $('#id_empresa_finaliza').val();
        var total       = 0;
        var total_geral = 0;
        var msg = '';
        var cont = 0;
        var id_produto = [];
        var qtde       = [];
        var metodo_pagamento = '';

        $(document).on('submit', '#pedido_form', function () {
            msgPedido = "Confirme seu pedido.</br>";

            id_empresa_finaliza  = $('#id_empresa_finaliza').val();
            total       = 0;
            total_geral = 0;
            msg = '';
            cont = 0;
            id_produto = [];
            qtde       = [];

            msg = '<h2>Pedido</h2>';
            $(".id_produto").each( function(index, value) { 
                total = 0;
                if(parseInt($(this).val()) > 0){ 
                    console.log(parseInt($(this).val()));
                    total = parseFloat($(this).val()) * parseFloat($(this).attr('preco_produto'));
                    msg += $(this).attr('nome_produto') + '. qtde: ' + $(this).val() + ', subtotal: R$' + total + '<br>';
                    total_geral += total;

                    id_produto.push($(this).attr('id_produto'));
                    qtde.push($(this).val());
                    cont++;
                }
            });
            msg += '\nTotal: R$ ' + total_geral;

            if(total_geral > 0){
                $('#conteudo_pag').html(msg + $('#metodo_de_pagamento').html());
                telas.push(6);
            }           

            $("#conteudo_pag").append($('#menu_rapido_div').html());

            jQuery.ajax({
                type: "POST",
                url: "http://vipsio.com.br/admin/api_2/pag_inicia_sessao.php",
                data: {usuario: localStorage.usuario, token: localStorage.token },
                success: function (data) {

                    var resultado = JSON.parse(data);
                        console.log(data);
                    if(resultado['return'] == 'sucesso'){
                        PagSeguroDirectPayment.setSessionId(resultado['sessionId']);


                        /* não deixar isso no onload da pagina */
                        var senderHash = PagSeguroDirectPayment.getSenderHash();
                        console.log('hash ' + senderHash);

                        var bandeiras_credito = '<div>';
                        /* pega os metodoss de pagamento */
                        PagSeguroDirectPayment.getPaymentMethods({
                            amount: total_geral,
                            success: function(response) {
                                console.log(response);
                                $.each( response['paymentMethods'], function( key, value ) {
                                    if(key == 'CREDIT_CARD'){
                                        bandeiras_credito += '<div class="divBandeiras">';
                                        bandeiras_credito += '<p>Pagar com cartão de crédioto.</p>';
                                        $.each( response['paymentMethods']['CREDIT_CARD']['options'], function( key, value ) {
                                            if(value['status'] == 'AVAILABLE'){
                                                bandeiras_credito += '<div class="bandeiras"><input type="radio" tipo="credito" name="cartoes_radio" cartao="' + value['displayName'] + '" value="' + value['code'] + '" required>';
                                                bandeiras_credito += '<img src="https://stc.pagseguro.uol.com.br' + value['images']['SMALL']['path'] + '">';
                                                bandeiras_credito += '</div>';
                                            }
                                        });
                                        bandeiras_credito += '</div>';
                                    }

                                    if(key == 'ONLINE_DEBIT'){
                                        bandeiras_credito += '<div class="divBandeiras">';
                                        bandeiras_credito += '<p>Pagar com cartão de débito.</p>';
                                        $.each( response['paymentMethods']['ONLINE_DEBIT']['options'], function( key, value ) {
                                            if(value['status'] == 'AVAILABLE'){
                                                bandeiras_credito += '<div class="bandeiras"><input type="radio" tipo="debito" name="cartoes_radio" cartao="' + value['displayName'] + '" value="' + value['code'] + '" required>';
                                                bandeiras_credito += '<img src="https://stc.pagseguro.uol.com.br' + value['images']['SMALL']['path'] + '">';
                                                bandeiras_credito += '</div>';
                                            }
                                        });
                                        bandeiras_credito += '</div>';
                                    }
                                });
                                bandeiras_credito += '</div>';
                                $("#bandeiras_credito").html(bandeiras_credito);
                            },
                            error: function(response) {
                                    //console.log(response);
                                $("#bandeiras_credito").html('Carregando');
                                console.log(response);

                            },
                            complete: function(response) {
                                 //   alert('c');
                            }
                         });

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



            return false;
        });

        
        $(document).on('submit', '#cartoes_form', function () {


            var tipo_card = $('input:radio[name="cartoes_radio"]:checked').attr('tipo');
            var nome_card = $('input:radio[name="cartoes_radio"]:checked').attr('nome');
            var cod_card  = $('input:radio[name="cartoes_radio"]:checked').attr('value');

            $('#conteudo_pag').html(msg);
            $('#conteudo_pag').append(html_dados_credito);
            $("#conteudo_pag").append(html_menu_rapido);

            var config = {
                '.chosen-select'           : {},
                '.chosen-select-deselect'  : {allow_single_deselect:true},
                '.chosen-select-no-single' : {disable_search_threshold:10},
                '.chosen-select-no-results': {no_results_text:'Oops, nada encontrado!'},
                '.chosen-select-width'     : {width:"100%"}
            }
            for (var selector in config) {
                $(selector).chosen(config[selector]);
            }

            return false;
        });

        var bandeiraCartao = '';
        $(document).on('change', 'input#cardNumber', function () {
            alert($("input#cardNumber").val());
            PagSeguroDirectPayment.getBrand({
                cardBin: $("input#cardNumber").val(),
                success: function(response) {
                    bandeiraCartao = response['brand']['name'];   
                    $('#pBandeira').html(bandeiraCartao);

                    PagSeguroDirectPayment.getInstallments({
                        amount: total_geral,
                        brand: bandeiraCartao,
                        maxInstallmentNoInterest: 0,
                        success: function(response) {
                           console.log(response);

                            html_parcelamento = '<select id="parcelamento">'; 
                            $(response['installments'][bandeiraCartao]).each( function(index, value) { 
                                if(value['quantity'] == 1){
                                     html_parcelamento += '<option value="'+ index +'">' + value['quantity'] + 'x de ' + value['installmentAmount'] + ' R$. Sem juros e taxas.</option>';
                                }else{
                                     html_parcelamento += '<option value="'+ index +'">' + value['quantity'] + 'x de ' + value['installmentAmount'] + ' R$. Total com juros ' + value['totalAmount'] + ' R$.</option>';
                                }                       
                            });
                            html_parcelamento += '</select>'; 

                            $('#divParcelamento').html(html_parcelamento);
                        },
                        error: function(response) {
                            alert('erro');
                        },
                        complete: function(response) {
                            //tratamento comum para todas chamadas
                        }
                    });
                },
                error: function(response) {
                    console.log(response);    
                },
                complete: function(response) {
                    //tratamento comum para todas chamadas
                }
            });
        });


        var tokenCartao = '';
        var cardNumber = '';
        var expirationMonth = '';
        var expirationYear = '';
        var cvv = '';
        var cardName = '';

        var tokenCartao = '';
        var html_parcelamento = '';
        $(document).on('submit', '#dados_cartao_form', function () {

            var tamanho = $("input#expirationYear").val().length;
            if(tamanho == 2){
                $("input#expirationYear").val('20' + $("input#expirationYear").val());
            }else if(tamanho == 3){
                $("input#expirationYear").val('2' + $("input#expirationYear").val());
            }
            var param = {
                cardNumber: $("input#cardNumber").val(),
                cvv: $("input#cvv").val(),
                expirationMonth: $("input#expirationMonth").val(),
                expirationYear: $("input#expirationYear").val(),
                success: function(response) {
                    //token gerado, esse deve ser usado na chamada da API do Checkout Transparente
                    tokenCartao = response['card']['token'];

                    cardNumber = $("input#cardNumber").val();
                    expirationMonth = $("input#expirationMonth").val();
                    expirationYear = $("input#expirationYear").val();
                    cvv = $("input#cvv").val();
                    cardName = $("input#expirationYear").val();

                    console.log('Token cartão: ' + tokenCartao);


                    $('#conteudo_pag').html(msg);
                    $('#conteudo_pag').append(html_dados_credito);
                    $("#conteudo_pag").append(html_menu_rapido);


                },
                error: function(response) {
                    //tratamento do erro
                    console.log(response);
                },
                complete: function(response) {
                    //tratamento comum para todas chamadas
                }
            }

            PagSeguroDirectPayment.createCardToken(param);


            return false;
        });















        $("#conteudo_pag").append(html_menu_rapido);







    }
});



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

