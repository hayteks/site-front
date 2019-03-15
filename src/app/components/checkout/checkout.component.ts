import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Globals, PedidoFinal, Endereco, LenteSugerida, ProdutoLente, SugereOtimizacao } from 'src/app/models/globals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  outrasTransp = '' as string;
  endereco_show = false as boolean;
  sugere_show = false as boolean;
  valor_anterior = 0 as number;

  lentesSugeridas: Array<LenteSugerida>;


  constructor(
    public api: ApiService,
    public globals: Globals,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.globals.logged.Pedido_Final = new PedidoFinal();
    this.globals.varsIO.SugestaoOtimizacao = new SugereOtimizacao();
    this.globals.logged.Pedido_Final.COD_FORMAPGTO = this.globals.logged.Pedido_condpag.CODIGO;
    this.globals.logged.Pedido_Final.TICKET = this.globals.logged.Pedido_ticket;
    this.globals.varsIO.loading_frete = 0;
    this.api.getFrete(this.globals.logged.Pedido_num, 40);
    this.api.getTransportadoras(this.globals.logged.Company_active.A1_COD, 25);
    this.api.getFormasPgto(this.globals.logged.Pedido_num, 35);
    this.api.getEnderecos(this.globals.logged.Company_active.A1_COD);
  }

  selectCodTrans(frete) {
    // window.scrollTo(0, 0);
    if (frete !== '0') {
      this.globals.logged.Pedido_Final.COD_TRANSPORTADORA = frete.ZHL_CODTRA;
      this.globals.logged.Pedido_peso_bruto = frete.PESO.toFixed(2);
      this.globals.logged.Pedido_valor_frete = frete.ZHL_VALOR;
      this.api.setTransportadora(this.globals.logged.Pedido_num, frete.ZHL_CODTRA, frete.ZHL_VALOR);
      this.api.getOtimizacao(this.globals.logged.Pedido_num, frete.ZHL_ID);
    }
  }

  selectOutrasTransp(frete_num) {
    this.globals.varsIO.SugestaoOtimizacao = new SugereOtimizacao();
    this.globals.logged.Pedido_Final.COD_TRANSPORTADORA = '0';
    this.globals.logged.Pedido_peso_bruto = 0;
    this.globals.logged.Pedido_valor_frete = 0;
    this.api.setTransportadora(this.globals.logged.Pedido_num, frete_num, 0);
  }
  reselectOutrasTransp() {
    this.selectOutrasTransp(this.outrasTransp);
  }

  selectFormaPGTO(pgto) {
    console.log(this.globals.logged.Enderecos);

    window.scrollTo(0, 0);
    this.globals.logged.Pedido_Final.COD_FORMAPGTO = pgto.CODIGO;
    this.api.setCondPag(this.globals.logged.Pedido_num, pgto.CODIGO);
  }

  goCheckout(el) {
    if (this.globals.logged.Pedido_Final.COD_TRANSPORTADORA) {
      if (this.globals.logged.Pedido_Final.COD_TRANSPORTADORA === '0' && this.outrasTransp === '') {
        el.scrollIntoView();
      } else {
        this.api.setFechaPedido(this.globals.logged.Pedido_num, this.globals.logged.Pedido_Final.CLI_PEDIDO);
      }
    } else {
      el.scrollIntoView();
    }
  }

  fechar() {
    this.api.carregaDashboard(this.globals.logged.Company_active.A1_COD);
    this.router.navigate(['/admin/dashboard']);
  }

  salvarEnd() {
    let end_new = false;
    if (!this.globals.varsIO.EnderecoIO.ID_ENDERECO) {
      end_new = true;
    }
    this.api.setEnderecos(
      this.globals.logged.Company_active.A1_COD,
      this.globals.varsIO.EnderecoIO.Z3_ENDEREC,
      this.globals.varsIO.EnderecoIO.Z3_COMPLEM,
      this.globals.varsIO.EnderecoIO.Z3_BAIRRO,
      this.globals.varsIO.EnderecoIO.Z3_MUN,
      this.globals.varsIO.EnderecoIO.Z3_CEP,
      this.globals.varsIO.EnderecoIO.Z3_UF,
      end_new,
      this.globals.varsIO.EnderecoIO.ID_ENDERECO);

      this.endereco_show = !this.endereco_show;
  }

  buscaCEP() {
    if (this.globals.varsIO.EnderecoIO.Z3_CEP.length === 8) {
      this.api.getCEP(this.globals.varsIO.EnderecoIO.Z3_CEP);
    }
  }

  maxCEP(e) {
    this.trataDigitos(e, 8);
  }

  sugereLentes() {
    this.sugere_show = true;
    this.valor_anterior = this.globals.logged.Pedido_valor_total_lentes;

    this.lentesSugeridas = Array<LenteSugerida>();

    const _lentes = new Set(this.globals.varsIO.Otimizacoes.map((otim) => otim.B1_BASE));

    _lentes.forEach(_len => {
      const _ls = new LenteSugerida();

      _ls.produtos = Array<ProdutoLente>();

      this.globals.varsIO.Otimizacoes.filter(x => x.B1_BASE === _len).forEach(_prod => {

        _ls.cod_lente = _prod.B1_BASE;
        _ls.cor = _prod.CORDOSITE;
        _ls.linha1 = _prod.CARAC_PRINCIPAL;
        _ls.linha2 = _prod.CARAC_SEGUNDARIA;
        _ls.linha3 = _prod.CARAC_TERCIARIA;
        _ls.linha4 = _prod.CARAC_QUARTENARIA;
        _ls.linha5 = _prod.CARAC_QUINTENARIA;
        _ls.material = _prod.MATERIAL;
        _ls.valor = _prod.ZZU_PRECO;


        const _pl = new ProdutoLente();
        _pl.cod_produto = _prod.ZZU_COD;
        _pl.nome = _prod.MEDIDAS;
        _pl.quantidade = _prod.SUGESTAO;

        _ls.produtos.push(_pl);
      });
      this.lentesSugeridas.push(_ls);
    });
  }

  qtdSugere(signal, prod_sug, valor) {
    if (signal === '-') {
      if (prod_sug.quantidade > 0) {
        prod_sug.quantidade = prod_sug.quantidade - 1;
        this.globals.varsIO.SugestaoOtimizacao.SUGESTAO = this.globals.varsIO.SugestaoOtimizacao.SUGESTAO + 1;
        this.globals.logged.Pedido_valor_total_lentes -= valor;
      }
    } else if (signal === '+') {
      if ((this.globals.varsIO.SugestaoOtimizacao.SUGESTAO) > 0) {
        prod_sug.quantidade = prod_sug.quantidade + 1;
        this.globals.varsIO.SugestaoOtimizacao.SUGESTAO = this.globals.varsIO.SugestaoOtimizacao.SUGESTAO - 1;
        this.globals.logged.Pedido_valor_total_lentes += valor;
      }
    }
  }

  addSugere() {
    this.lentesSugeridas.forEach(lenSug => {
      lenSug.produtos.forEach(prod => {
        if (prod.quantidade > 0) {
          this.api.setOtimizacao(this.globals.logged.Pedido_num, this.globals.logged.Pedido_frete[0].ZHL_ID,
            prod.cod_produto, prod.quantidade);
          this.sugere_show = false;
        }
      });
    });
  }


  private trataDigitos(e: any, max) {
    const coringa = ['Backspace', 'Delete'];
    const digitos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ','];
    if (coringa.indexOf(e.key) === -1) {
      if (digitos.indexOf(e.key) === -1) {
        event.preventDefault();
      } else {
        if (e.srcElement.value.length + 1 > max) {
          event.preventDefault();
        }
      }
    }
  }

}
