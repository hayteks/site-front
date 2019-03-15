function fadeIn_black(){
    $('.btn-pedido-js').click(function () {
        $('#fadeIn_black').fadeIn();
        $('.formularioTopo').css('z-index','10000');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;               
    }); 
      
}

function callCopyPaste(){
    var forEach = Array.prototype.forEach,
    $$ = document.querySelectorAll.bind(document);

    forEach.call($$('.input'), function (v) {
        v.addEventListener('paste', handlePaste, false);
    });
}

function handlePaste(e) {
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    //pastedData = pastedData.replace(/[^\x20-\xFF]/gi, '');

    if (pastedData.indexOf(',') > -1 || pastedData.indexOf('.') > -1) {
        alert("Prezado Cliente,\nO Valor copiado deve conter apenas números inteiros.\nPor favor, inserir apenas os valores totais de cada lente.\n\nAgradecemos a sua compreensão!\n\nObrigado,\nEquipe Haytek");
        return false;
    }

    // Do whatever with pasteddata

    //console.log(pastedData);

    var inputs = $('.input');

    var cursor = $(this);
    var primeiraEq = $(cursor).parent().parent().find('.input').index(cursor);
    pastedData = escape(pastedData);
    var linhas = pastedData.split('%0D');
    
    $.each(linhas, function (l_i, l_val) {
        var colunas = l_val.split('%09');
        
        $.each(colunas, function (c_i, c_val) {
            var totalLinhas = $(cursor).parent().parent().find('.input').length;
            var todosValidas = $(cursor).parent().parent().find('.input');
            var cursor_linha = primeiraEq + c_i;

            if (cursor_linha < totalLinhas) {
                //if (c_val > 0) {
                    $(cursor).val(c_val.replace('%0A',''));
                //}
                if (cursor_linha < (totalLinhas - 1)) {
                    cursor = inputs.eq(inputs.index(cursor) + 1);
                }
            }

        });

        var trNaLinha = $(cursor).parent().parent().find('.input');
        var totalNaLinha = $(cursor).parent().parent().find('.input').length;

        var LinhasProx = $(cursor).parent().parent().next().find('.input');
        var totalLinhasProx = $(cursor).parent().parent().next().find('.input').length;

        cursor = LinhasProx.eq(primeiraEq);

    });
}

$(window).ready(function () {  
    $(function($){
        $('#verMais_159').click(function () {
                $('.vermelho_000').click();
                $('body,html').animate({
                    scrollTop: 633
                }, 800);
                return false;               
            });
        $('#verMais_174').click(function () {
                $('.black_174').click();
                $('body,html').animate({
                    scrollTop: 633
                }, 800);
                return false;               
            });
        $('#verMais_156').click(function () {
                $('.verde_156_2').click();
                $('body,html').animate({
                    scrollTop: 633
                }, 800);
                return false;               
            }); 
        $('.fadeIn_close').click(function(e){
                $('#fadeIn_black').fadeOut();
                $('.formularioTopo').css('z-index','9997');
                e.preventDefault();
                
            });

    });

    var width = $(window).width();
    
    /* animacao scrollMagic */
    
    var controller = new ScrollMagic.Controller();
    
    var scene = new ScrollMagic.Scene({triggerElement: "#nossas-lentes", duration: 1300})
    .setTween("div[data-js='lenteBack']", {y: 200, opacity: 1})
    .addTo(controller);
    
    var scene2 = new ScrollMagic.Scene({triggerElement: "#nossas-lentes", duration: 800})
    .setTween("div[data-js='lenteFront']", {y: 180, opacity: 1})
    .addTo(controller);
    
     var scene3 = new ScrollMagic.Scene({triggerElement: ".quadrado", duration: 500})
    .setTween("div[data-js='animacaoTop']", {y: 0, opacity: 1})
    .addTo(controller);
    
    var scene4 = new ScrollMagic.Scene({triggerElement: ".quadrado", duration: 500})
    .setTween("div[data-js='animacaoBottom']", {y: 0, opacity: 1})
    .addTo(controller);
    
    var circlePqHaytek1 = new ScrollMagic.Scene({triggerElement: ".grid2", duration: 700})
    .setTween(".circle-pq-haytek", {y: -100})
    .addTo(controller);
    
    var circlePqHaytek2 = new ScrollMagic.Scene({triggerElement: ".grid2", duration: 900})
    .setTween(".circle-pq-haytek2", {x: -4})
    .addTo(controller);
    
    var circleHomem = new ScrollMagic.Scene({triggerElement: ".txtGrid2", duration: 700})
    .setTween(".circuloHomem", {x: 89, y: -190})
    .addTo(controller);
    
    var circleHomem2 = new ScrollMagic.Scene({triggerElement: ".txtGrid2", duration: 700})
    .setTween(".circuloHomem2", {x: 129})
    .addTo(controller);
    
    var circleHomem3 = new ScrollMagic.Scene({triggerElement: ".txtGrid2", duration: 700})
    .setTween(".circuloHomem3", {x: -314})
    .addTo(controller);
    
    /* fixed menu */ 
    var scrollTop = $(this).scrollTop();
    if(scrollTop > 10 && width > 1272){
        $('.header-nav').addClass('active');
        $('.menu ul li a').addClass('active');
    }
    
    $(window).resize(function() {
        var resizeWidth = $(this).width();
        if(resizeWidth > 1254) {
            $('.header-nav').addClass('active');
            $('.menu ul li a').addClass('active');
        }else  {
            $('.header-nav').removeClass('active');
            $('.menu ul li a').removeClass('active');
        }
    });
    
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        if(scrollTop > 10 && width > 1272) {
            $('.header-nav').addClass('active shrink_navbar');
            $('.logo-home a img').css('display', 'none');
            $('.logo-shrink').css('display', 'block');
            $('.menu ul li a').addClass('active shrink_menu');
        }else {
            $('.header-nav').removeClass('active shrink_navbar');
            $('.logo-home a img').css('display', 'block');
            $('.logo-shrink').css('display', 'none');
            $('.menu ul li a').removeClass('active shrink_menu');
        }
    });

    /* Swiper */

    var swiper = new Swiper('.swiper-container', {
        spaceBetween: 100,
        
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

    var swiper2 = new Swiper('.swiper-container-nossas-lentes', {
        spaceBetween: 100,

        pagination: {
            el: '.swiper-pagination2',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next-2',
            prevEl: '.swiper-button-prev-2',
        }
    });


    $('.lentes').click(function () {
        var index = $(this).attr('data-id');

        swiper.slideTo(index);

        $('.lentes').removeClass('active');
        $(this).addClass('active');
    });


    swiper.on('slideChangeTransitionStart', function () {
        var slides = $('.swiper-slide');
        $('.lentes').removeClass('active');

        for (var i = 0; i < slides.length; i++) {
            if ($(slides[i]).hasClass('swiper-slide-active')) {
                $('.lentes[data-id="' + i + '"]').addClass('active');
            }
        }
    });

    swiper2.on('slideChangeTransitionStart', function () {
        var slides = $('.swiper-slide.expandirLentes');
        $('.boxLentes').removeClass('active');
        for (var i = 0; i < slides.length; i++) {
            if ($(slides[i]).hasClass('swiper-slide-active')) {
                var classe = $(slides[i]).data("target");
                if(classe != undefined || classe != null){
                    $('.boxLentes[data-element="' + classe + '"]').addClass('active');
                    if (ativo) {
                        var lastClass = $('#nossas-lentes').attr('class').split(' ').pop();
                        $('#nossas-lentes').removeClass(lastClass);
                    }
                    $('#nossas-lentes').addClass(classe);
                }
            }
        }
    });

    /* termina Swiper */


    /* menu mobile */

    function menuActive() {
        var height = $('.menu').height();
        $(this).toggleClass('active');
        $('.menu').toggleClass('active');
        $('.menu ul').toggleClass('active');
        $('.menu ul li a').toggleClass('active');
        $('.divFormulario').toggleClass('active');
        $('.header-nav').toggleClass('mobile');
        $('.containerNossasLentes').toggleClass('active');
        $('.porqueHaytek').toggleClass('active');

//        if ($('.menu').hasClass('active')) {
//            $('.menu').animate({
//                height: 'auto'
//            })
//        }else {
//            $('.menu').animate({
//                height: '100%'
//            })
//        }
    }

    $('.mobileMenu').click(menuActive);

    /* fecha menu mobile */


    /* animaçoes scroll */

    var offsetBoxDiferenciais = $('.boxDiferenciais').offset().top;
    var offsetLentes = $('.lenteFront, .lenteBack').offset().top;
    
    function animacoesTranslate() {
        var scrollTop = $(this).scrollTop();
        if (scrollTop > offsetLentes - 500) {
//            $('[data-js="lenteBack"]').addClass('translateY');
//            $('[data-js="lenteFront"]').addClass('translateY');
        }
        
        if (scrollTop > offsetBoxDiferenciais - 500) {
//            $('[data-js="animacaoTop"]').addClass('translateY');
//            $('[data-js="animacaoBottom"]').addClass('translateY');
        }
    }

    $(window).scroll(animacoesTranslate);

    /* termina animaçoes scroll */


    /* scroll deslizante */

    function scrollDeslizante(e) {
        e.preventDefault();
        var id = $(this).attr('href'),
            targetOffset = $(id).offset().top;
        $('html, body').animate({
            scrollTop: targetOffset
        }, 700);
    }
    $('.menu a').click(scrollDeslizante);

    /* termina scroll deslizante */


    //    $('[data-element]').click(function () {
    //
    //        var parentWidth = $(this).parent().parent().innerWidth();
    //        var parentHeight = $(this).parent().parent().innerHeight();
    //
    //        $(this).addClass('activeBox');
    //        $(this).animate({
    //            width: parentWidth,
    //            height: parentHeight
    //        })
    //
    //        $('.containerNossasLentes').addClass('esconderContainer');
    //
    //        $('.boxNossasLentes').css({
    //            width: '100%'
    //        })
    //
    //        //        $('[data-js="displayNone"]').addClass('displayNone');
    //    })


    /* animaçao numeros */

    var offsetDados = $('.divDados').offset().top;

    function animandoDados() {
        var scrollTop = $(this).scrollTop();

        if (scrollTop > offsetDados - 650) {
            $('.count, .countVirgula').css({
                display: 'inline'
            })
            $('[data-js="spanNone"]').hide();
            $('.count').each(function () {
                $(this).prop('Counter', -1).animate({
                    Counter: $(this).text()
                }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }
                });
            });
            $(this).off('scroll');
        }
        
    }

    $(this).scroll(animandoDados);

    /* termina animaçao numeros */


    /* select estados */

    function nomeEstado(e) {
        e.preventDefault();
        var nomeEstado = $(this).attr('name');
        var estado = $(this).attr('id');
        if(estado == 'saopaulo') {
            $('.nomeEstado').text(nomeEstado);
            $('.perfilGerente').hide();
            $('.perfilGerente.saopaulo').show();
        }
        
        if(estado == 'acre' || estado == 'roraima' || estado == 'amazonas' || estado == 'rondonia') {
            $('.nomeEstado').text(nomeEstado);
            $('.perfilGerente').hide();
            $('.perfilGerente.acre').show();
        }
        
        if(estado == 'minasgerais' || estado == 'espiritosanto') {
            $('.nomeEstado').text(nomeEstado);
            $('.perfilGerente').hide();
            $('.perfilGerente.minasgerais').show();
        }
        
        if(estado == 'riodejaneiro') {
            $('.nomeEstado').text(nomeEstado);
            $('.perfilGerente').hide();
            $('.perfilGerente.riodejaneiro').show();
        }
        
        if(estado == 'bahia' || estado == 'sergipe' || estado == 'alagoas') {
            $('.nomeEstado').text(nomeEstado);
            $('.perfilGerente').hide();
            $('.perfilGerente.bahia').show();
        }
        
        if(estado == 'parana' || estado == 'matogrossodosul') {
            $('.nomeEstado').text(nomeEstado);
            $('.perfilGerente').hide();
            $('.perfilGerente.parana').show();
        }
        
        if(estado == 'riograndedosul' || estado == 'santacatarina') {
            $('.nomeEstado').text(nomeEstado);
            $('.perfilGerente').hide();
            $('.perfilGerente.riograndedosul').show();
        }
        
        if(estado == 'distritofederal' || estado == 'goias' || estado == 'matogrosso' || estado == 'tocantins') {
            $('.nomeEstado').text(nomeEstado);
            $('.perfilGerente').hide();
            $('.perfilGerente.distritofederal').show();
        }
        
        if(estado == 'ceara' || estado == 'riograndedonorte' || estado == 'paraiba' || estado == 'pernambuco') {
            $('.nomeEstado').text(nomeEstado);
            $('.perfilGerente').hide();
            $('.perfilGerente.ceara').show();
        }
        
        if(estado == 'piaui' || estado == 'maranhao' || estado == 'para' || estado == 'amapa') {
            $('.nomeEstado').text(nomeEstado);
            $('.perfilGerente').hide();
            $('.perfilGerente.piaui').show();
        }
    }

    $('.estado').click(nomeEstado);

    function activeEstado(e) {
        e.preventDefault();
        $('.path-estado').removeClass('estadoActive');
        $(this).addClass('estadoActive');
    }

    $('.path-estado').click(activeEstado);

    $('select').change(function () {
        var width = $(window).width();
        var nomeEstado = $(this).val();
        var estado = $(this).attr('value');
        var title = $('#' + nomeEstado).attr('name');
        
        $('.estado .path-estado').removeClass('estadoActive');
        $('#' + nomeEstado + ' .path-estado').addClass('estadoActive');
        
//        $('.perfilGerente').fadeIn();
//        $('.perfilGerente').addClass('active');
        if(nomeEstado == 'saopaulo') {
            $('.nomeEstado').text(title);
            $('.perfilGerente').hide();
            $('.perfilGerente.saopaulo').show();
            
            if(width <= 1098) {
                $('footer').css({
                    marginTop: '398px'
                })
            } 
        }
        
        if(nomeEstado == 'acre' || nomeEstado == 'roraima' || nomeEstado == 'amazonas' || nomeEstado == 'rondonia') {
            $('.nomeEstado').text(title);
            $('.perfilGerente').hide();
            $('.perfilGerente.acre').show();
            
            $('footer').css({
                marginTop: '120px'
            })
        }
        
        if(nomeEstado == 'minasgerais' || nomeEstado == 'espiritosanto') {
            $('.nomeEstado').text(title);
            $('.perfilGerente').hide();
            $('.perfilGerente.minasgerais').show();
            
            $('footer').css({
                marginTop: '120px'
            })
        }
        
        if(nomeEstado == 'riodejaneiro') {
            $('.nomeEstado').text(title);
            $('.perfilGerente').hide();
            $('.perfilGerente.riodejaneiro').show();
            
            $('footer').css({
                marginTop: '120px'
            })
        }
        
        if(nomeEstado == 'bahia' || nomeEstado == 'sergipe' || nomeEstado == 'alagoas') {
            $('.nomeEstado').text(title);
            $('.perfilGerente').hide();
            $('.perfilGerente.bahia').show();
            
            $('footer').css({
                marginTop: '120px'
            })
        }
        
        if(nomeEstado == 'parana' || nomeEstado == 'matogrossodosul') {
            $('.nomeEstado').text(title);
            $('.perfilGerente').hide();
            $('.perfilGerente.parana').show();
            
            $('footer').css({
                marginTop: '120px'
            })
        }
        
        if(nomeEstado == 'riograndedosul' || nomeEstado == 'santacatarina') {
            $('.nomeEstado').text(title);
            $('.perfilGerente').hide();
            $('.perfilGerente.riograndedosul').show();
            
            $('footer').css({
                marginTop: '120px'
            })
        }
        
        if(nomeEstado == 'distritofederal' || nomeEstado == 'goias' || nomeEstado == 'matogrosso' || nomeEstado == 'tocantins') {
            $('.nomeEstado').text(title);
            $('.perfilGerente').hide();
            $('.perfilGerente.distritofederal').show();
            
            $('footer').css({
                marginTop: '120px'
            })
        }
        
        if(nomeEstado == 'ceara' || nomeEstado == 'riograndedonorte' || nomeEstado == 'paraiba' || nomeEstado == 'pernambuco') {
            $('.nomeEstado').text(title);
            $('.perfilGerente').hide();
            $('.perfilGerente.ceara').show();
            
            $('footer').css({
                marginTop: '120px'
            })
        }
        
        if(nomeEstado == 'piaui' || nomeEstado == 'maranhao' || nomeEstado == 'para' || nomeEstado == 'amapa') {
            $('.nomeEstado').text(title);
            $('.perfilGerente').hide();
            $('.perfilGerente.piaui').show();
            
            $('footer').css({
                marginTop: '120px'
            })
        }
    });

    /* termina select estados
    
    
    /* mostrar o texto mobile*/

    function mostrarMais() {
        var height = $('.divTxtGrid2').height();
        $('.divTxtGrid2').animate({
            height: height + 600
        }, 300, function() {
            $('.grid2 .btn').fadeOut(500);
        });
        
    }

    $('.grid2 .btn').click(mostrarMais);

    /* termina mostrar texto mobile */


    /* fechar  lentes */

    function fecharBoxLentes() {
        $('.expandirLentes').addClass('displayNone');
        $('.boxNossasLentes').slideDown(300);
        $('#nossas-lentes .tituloPrincipal').show();
        $('.header-expandirLentes').hide();
        $('.fecharBox').hide();
         var lastClass = $('#nossas-lentes').attr('class').split(' ').pop();
         $('#nossas-lentes').removeClass(lastClass); 
         ativo = false;
         $('.boxLentes').removeClass('active');
         $('.fazer-pedido').show();
    }

    $('.fecharBox').click(fecharBoxLentes);

    /* termina fechar lentes */


    /* abrir lentes */

    var ativo = false;

    function abrirBoxLentes() {
        $('.fazer-pedido').hide();
        $('.swiper-container-nossas-lentes').show();
        var tipo = $(this).attr('data-element');
        $('.boxLentes').removeClass('active');
        var slidesWrapper = $( ".swiper-container-nossas-lentes .swiper-wrapper" );
        swiper2.slideTo($(this).index());
        
        if (ativo) {
            var lastClass = $('#nossas-lentes').attr('class').split(' ').pop();
            $('#nossas-lentes').removeClass(lastClass);
            $(this).addClass("active");
            
          //  $(".header-expandirLentes").css("display", "flex").hide().fadeIn();
        }else{
            $(".header-expandirLentes").css("display", "flex").hide().fadeIn();
        }


        var a = $(this).data('element');
        $('.lentes-navigation .boxLentes[data-element="' + a + '"]').addClass("active");

        ativo = true;

        $('#nossas-lentes').addClass(tipo);
        //        $('.caracteristicasLentes').append('<div></div>').addClass('swiper-button-prev-2');
        //        $('.lentesMini').append('<div></div>').addClass('swiper-button-next-2');


        var data = $(this).attr('data-target');
        $('.expandirLentes').removeClass('displayNone');
        //        $('.containerNossasLentes').addClass('swiper-container');
        //        $('.expandirLentes').addClass('swiper-slide');
        $('.fecharBox').show();
        $('.boxNossasLentes').hide(300);
        $('#nossas-lentes .tituloPrincipal').hide(300);
        swiper2.update();

    }

    $('.boxLentes[data-element]').click(abrirBoxLentes);

    /* termina abrir lentes */
    
    
    /* removendo id */
    
    if(width <= 343) {
        var attr = $('.containerNossasLentes').removeAttr('id');
    }
    
    
    /*  limpando formulario  */
    
    $('.btn').click(function(e) {
        var email = $('[name="email"]').val('');
        var nome =  $('[name="nome"]').val('');
        var pass1 = $('[name="password"]').val('');
        var pass2 = $('[name="password2"]').val('');
        var msg =   $('[name="mensagem"]').val('');
    });
    
    $('.btnLimpar').click(function(e) {
        e.preventDefault();
        var nome    = $('[name="nome"]').val('');
        var pass2   = $('[name="password2"]').val('');
        var msg     = $('[name="mensagem"]').val('');
        var assunto = $('[name="assunto"]').val('');
    });
    
    /*  validate  */
    
    $('form[name="login"]').validate({
        rules: {
            email: {
                required: true
            },
            password: {
                required: true
            }
        },
        errorPlacement: function (error, element) {
            element.addClass("formError");
            //error.insertAfter(element);
        }
    });
    
    $('form[name="mande_mensagem"]').validate({
        rules: {
            nome: {
                required: true
            },
            password2: {
                required: true
            },
            assunto: {
                required: true
            },
            mensagem: {
                required: true
            }
        },
        errorPlacement: function (error, element) {
            element.addClass("formError");
            //error.insertAfter(element);
        }
    })
});
