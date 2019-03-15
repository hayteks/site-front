// console.log('abriu empenho.js');

function handlePaste(e) {
    // console.log('chamou handlePaste');
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    pastedData = pastedData.replace(/[^\x20-\xFF]/gi, '');


    if (pastedData.indexOf(',') > -1 || pastedData.indexOf('.') > -1) {
        alert("Prezado Cliente,\nO Valor copiado deve conter apenas números inteiros.\nPor favor, inserir apenas os valores totais de cada lente.\n\nAgradecemos a sua compreensão!\n\nObrigado,\nEquipe Haytek");
        return false;
    }

    // Do whatever with pasteddata

    console.log(pastedData);

    var inputs = $('.input');

    var cursor = $(this);
    var primeiraEq = $(cursor).parent().parent().find('.input').index(cursor);

    var linhas = pastedData.split('\n');
    $.each(linhas, function (l_i, l_val) {

        var colunas = l_val.split('\t');
        $.each(colunas, function (c_i, c_val) {
            var totalLinhas = $(cursor).parent().parent().find('.input').length;
            var todosValidas = $(cursor).parent().parent().find('.input');
            var cursor_linha = primeiraEq + c_i;

            if (cursor_linha < totalLinhas) {
                    $(cursor).val(c_val.replace('%0A', ''));
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

//document.getElementsByClassName('validaNumero')[0].addEventListener('paste', handlePaste);
var forEach = Array.prototype.forEach,
$$ = document.querySelectorAll.bind(document);

forEach.call($$('.input'), function (v) {
    v.addEventListener('paste', handlePaste, false);
});

$(document).ready(function () {




    $('.validaNumero').tiraEnter();

    $('.validaNumero').colorirFundoOnFocus();

    $('.validaNumero').SoNumeroseMaximoDigitos(4);

    $('.validaNumero').ControlaSetas();

    $('.validaNumero').keyup(function () {
        atualizaTotais();
    });

});

function isEven(n) {
    return (n % 2 == 0);
}

jQuery.fn.colorirFundoOnFocus = function () {
    var inputs = this;
    return this.each(function () {
        $(this).focusin(function () {
            $(this).css({ backgroundColor: '#e6ec8b' });

            var linha = 0;

            if ($(this).attr("tabela") == "t2") {
                linha = $(this).attr("linha") - 1;
            } else {
                linha = $(this).attr("linha");
            }
            var coluna = $(this).attr("coluna");
            var tabela = $(this).attr("tabela");

            $("." + tabela + " ." + "colunaTH:eq(" + coluna + ")").css({ backgroundColor: '#e6ec8b' });
            $("." + tabela + " thead").each(function () {
                $(this).find(" ." + "linhaTH:eq(" + linha + ")").css({ backgroundColor: '#e6ec8b' });
            });
        });
        $(this).focusout(function () {

            $(this).css({ backgroundColor: 'transparent' });

            var linha = $(this).attr("linha");
            var coluna = $(this).attr("coluna");
            var tabela = $(this).attr("tabela");

            if (isEven(coluna)) {
                $("." + tabela + " ." + "colunaTH:eq(" + coluna + ")").css({ backgroundColor: '#fff' });
            } else {
                $("." + tabela + " ." + "colunaTH:eq(" + coluna + ")").css({ backgroundColor: '#D5D5D5' });
            }
            $("." + tabela + " thead").each(function () {
                $(this).find(" ." + "linhaTH").css({ backgroundColor: '#fff' });
            });
        });
    });
}

jQuery.fn.ControlaSetas = function () {
    var inputs = this;
    return this.each(function () {
        $(this).keydown(function (e) {
            inputSelecionado = $(this).attr("id");
            var key = e.charCode || e.keyCode || 0;

            switch (key) {
                case 13: //enter
                    //var totalLinhasProx = $(this).parent().parent().next().find('.validaNumero').length;
                    //if (totalLinhasProx > 0) {
                        inputs.eq(inputs.index(this) + 1).focus();
                    //}
                    return false;
                    break;
                case 37:
                    var totalLinhasPrev = $(this).parent().parent().prev().find('.input').length;
                    if (totalLinhasPrev > 0) {
                        inputs.eq(inputs.index(this) - 1).focus();
                    } else {
                        var trAtual = $(this).parent().parent().find('.input');
                        var posicaoNaLinha = trAtual.index(this) + 1;

                        if (posicaoNaLinha > 1) {
                            inputs.eq(inputs.index(this) - 1).focus();
                        }
                    }
                    break;
                case 40:
                    var trAtual = $(this).parent().parent().find('.input');
                    var totalLinhasProx = $(this).parent().parent().next().find('.input').length;
                    var totalLinhas = $(this).parent().parent().find('.input').length;

                    if (totalLinhasProx == totalLinhas || totalLinhasProx > totalLinhas) {
                        inputs.eq(inputs.index(this) + totalLinhas).focus();
                    } else {
                        var posicaoNaLinha = trAtual.index(this) + 1;
                        if (posicaoNaLinha > totalLinhasProx) {
                            inputs.eq(inputs.index(this) + totalLinhas - posicaoNaLinha + totalLinhasProx).focus();
                        } else {
                            inputs.eq(inputs.index(this) + totalLinhas).focus();
                        }
                    }
                    break;
                case 39:
                    var totalLinhasProx = $(this).parent().parent().next().find('.input').length;
                    if (totalLinhasProx > 0) {
                        inputs.eq(inputs.index(this) + 1).focus();
                    } else {
                        var trAtual = $(this).parent().parent().find('.input');
                        var posicaoNaLinha = trAtual.index(this) + 1;
                        var totalLinhas = $(this).parent().parent().find('.input').length;

                        if (posicaoNaLinha < totalLinhas) {
                            inputs.eq(inputs.index(this) + 1).focus();
                        }
                    }
                    break;
                case 38:
                    var trAtual = $(this).parent().parent().find('.input');
                    var totalLinhasPrev = $(this).parent().parent().prev().find('.input').length;
                    var totalLinhas = $(this).parent().parent().find('.input').length;


                    if (totalLinhasPrev == totalLinhas) {
                        inputs.eq(inputs.index(this) - totalLinhas).focus();
                    } else {
                        var posicaoNaLinha = trAtual.index(this) + 1;
                        if (totalLinhasPrev == 0) {
                            inputs.eq(inputs.index(this) - posicaoNaLinha + 1).focus();
                        } else if (posicaoNaLinha > totalLinhasPrev) {
                            inputs.eq(inputs.index(this) - posicaoNaLinha).focus();
                        } else {
                            inputs.eq(inputs.index(this) - totalLinhasPrev).focus();
                        }
                    }
                    break;
                default:
                    break;

            }
        });
    });
}

function atualizaTotais() {
    //CALCULANDO CAMPOS
    var valorTotal = 0;
    var precoTotal = 0;
    $('.input').each(function () {
        //quantidade de lentes
        if ($(this).val().trim() != "") {
            valorTotal += parseInt($(this).val());
        }
        //calculo valor total
        cor = $(this).attr('cor');

        val = $('.' + cor.replace('#', 'COR')).find('.valorCor').val();

        if ($(this).val().trim() != "") {
            precoTotal += parseInt($(this).val()) * val;
        }
    });
    $('#totalValor').html(precoTotal.formatMoney(2, ',', '.'));

    $('#totalLentes').html(valorTotal.formatMoney(0, ',', '.'));
}