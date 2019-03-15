import { Component, OnInit } from '@angular/core';
import { Globals, OPCCODY, Preco, PedidoPAP, PedidoPAPDetalhes } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-parapar-empenho',
  templateUrl: './parapar-empenho.component.html',
  styleUrls: ['./parapar-empenho.component.css']
})
export class ParaparEmpenhoComponent implements OnInit {

  public req_os = false as boolean;
  public req_nome = false as boolean;
  public req_odcil = false as boolean;
  public req_oecil = false as boolean;
  public req_odesf = false as boolean;
  public req_oeesf = false as boolean;

  public req_RDNP = false as boolean;
  public req_RALTURA = false as boolean;
  public req_MARCA = false as boolean;
  public req_MODELO = false as boolean;
  public req_COR = false as boolean;
  public req_LDNP = false as boolean;
  public req_LALTURA = false as boolean;
  public req_TIPOARO = false as boolean;
  public req_MATERIAL = false as boolean;
  public req_Aro = false as boolean;
  public req_PONTE = false as boolean;

  constructor(
    public globals: Globals,
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log(0);
  }

  ngOnInit() {
    this.carregaLente(this.route.snapshot.paramMap.get('id'), this.route.snapshot.paramMap.get('os'));
  }

  carregaLente(len, os = null) {
    this.limparDados();
    // this.api.getLenOPCCOD(len, this.globals.logged.Pedido_num, false);
    this.api.getLenOPCCOD(len, this.globals.logged.Pedido_num, false, os);
    window.scrollTo(0, 0);
    this.globals.varsIO.tmp_od_cilladd_y = new Array<OPCCODY>();
    this.globals.varsIO.tmp_oe_cilladd_y = new Array<OPCCODY>();
  }

  carregaCilAdd_OE() {
    this.removeRequiredAll();

    if (this.globals.varsIO.empenhoPAP.ESQ_ESFER) {
      const a = this.globals.varsIO.empenhoPAP.ESQ_ESFER.split('|')[0];
      const b = this.globals.varsIO.empenhoPAP.ESQ_ESFER.split('|')[1];
      this.globals.varsIO.empenhoPAP.ESQ_CIL = '';
      this.globals.varsIO.tmp_oe_cilladd_y = new Array<OPCCODY>();
      this.globals.varsIO.tmp_oe_cilladd_y = this.globals.varsIO.LenteIO.GradesOPCODE[a].EIXO_X[b].EIXO_Y;
      this.nextTabIndex(event, true);
    }
  }

  carregaCilAdd_OD() {
    this.removeRequiredAll();
    if (this.globals.varsIO.empenhoPAP.DIR_ESFER) {
      const a = this.globals.varsIO.empenhoPAP.DIR_ESFER.split('|')[0];
      const b = this.globals.varsIO.empenhoPAP.DIR_ESFER.split('|')[1];
      this.globals.varsIO.empenhoPAP.DIR_CIL = '';
      this.globals.varsIO.tmp_od_cilladd_y = new Array<OPCCODY>();
      this.globals.varsIO.tmp_od_cilladd_y = this.globals.varsIO.LenteIO.GradesOPCODE[a].EIXO_X[b].EIXO_Y;
      this.nextTabIndex(event, true);
    }
  }

  getVal_OE() {
    this.removeRequiredOeCil();
    if (this.globals.varsIO.empenhoPAP.ESQ_ESFER && this.globals.varsIO.empenhoPAP.ESQ_CIL) {
      this.globals.varsIO.empenhoPAP.E_VALOR = 0;
      const a = this.globals.varsIO.empenhoPAP.ESQ_ESFER.split('|')[0];
      const b = this.globals.varsIO.empenhoPAP.ESQ_ESFER.split('|')[1];
      const c = this.globals.varsIO.empenhoPAP.ESQ_CIL;
      const valor = this.globals.varsIO.LenteIO.Precos.find(x => x.TIPO === this.globals.logged.Pedido_condpag.PRECO * 1 ) as Preco;

      if (this.globals.varsIO.LenteIO.GradesOPCODE[a].EIXO_X[b].EIXO_Y[c].CHAVE === 1) {
        this.globals.varsIO.empenhoPAP.E_VALOR = valor.CHAVE_1;
      } else {
        this.globals.varsIO.empenhoPAP.E_VALOR = valor.CHAVE_2;
      }
      this.globals.varsIO.LenteIO.valor_total_lentes = this.globals.varsIO.empenhoPAP.E_VALOR + this.globals.varsIO.empenhoPAP.D_VALOR;
      this.nextTabIndex(event);
    }
  }
  getVal_OD() {
    this.removeRequiredOdCil();
    if (this.globals.varsIO.empenhoPAP.DIR_ESFER && this.globals.varsIO.empenhoPAP.DIR_CIL) {
      this.globals.varsIO.empenhoPAP.D_VALOR = 0;
      const a = this.globals.varsIO.empenhoPAP.DIR_ESFER.split('|')[0];
      const b = this.globals.varsIO.empenhoPAP.DIR_ESFER.split('|')[1];
      const c = this.globals.varsIO.empenhoPAP.DIR_CIL;
      const valor = this.globals.varsIO.LenteIO.Precos.find(x => x.TIPO === this.globals.logged.Pedido_condpag.PRECO * 1 ) as Preco;

      if (this.globals.varsIO.LenteIO.GradesOPCODE[a].EIXO_X[b].EIXO_Y[c].CHAVE === 1) {
        this.globals.varsIO.empenhoPAP.D_VALOR = valor.CHAVE_1;
      } else {
        this.globals.varsIO.empenhoPAP.D_VALOR = valor.CHAVE_2;
      }
      this.globals.varsIO.LenteIO.valor_total_lentes = this.globals.varsIO.empenhoPAP.E_VALOR + this.globals.varsIO.empenhoPAP.D_VALOR;
      this.nextTabIndex(event);
    }
  }

  limparDados() {
    this.req_os = this.req_nome = this.req_odcil = this.req_oecil = this.req_odesf = this.req_oeesf = false;
    this.req_RDNP = this.req_RALTURA = this.req_MARCA = this.req_MODELO = this.req_COR = this.req_LDNP = false;
    this.req_LALTURA = this.req_TIPOARO = this.req_MATERIAL = this.req_Aro = this.req_PONTE = false;
    this.globals.varsIO.empenhoPAP = new PedidoPAP();

    this.globals.varsIO.tmp_od_cilladd_y = new Array<OPCCODY>();
    this.globals.varsIO.tmp_oe_cilladd_y = new Array<OPCCODY>();
    this.globals.varsIO.papTemMontagem = false;
  }

  mudaGrade(grade) {
    this.globals.varsIO.LenteIO.GradesOPCODE.forEach(el => {
      if (el.GRADE === grade) {
        el.EXIBE = true;
      } else {
        el.EXIBE = false;
      }
    });
  }

  onChange(e) {
    this.globals.logged.Pedido_condpag = this.globals.varsIO.CondPag.find(y => y.CODIGO === e.srcElement.value);
    this.api.atualizaTotalGrid();
  }

  downDrop(e) {
    const el = e as HTMLSelectElement;
    el.click();
  }

  onKeyUp(e) {
    this.api.atualizaTotalGrid();
  }

  onKeyDown(e) {
    switch (e.key) {
      // case 'Backspace':
      //   return true;
      case 'Enter':
        this.nextTabIndex(e);
        break;
      case 'ArrowRight':
        this.setaDireita(e);
        break;
      case 'ArrowLeft':
        this.setaEsquerda(e);
        break;
      case 'ArrowDown':
        this.setaBaixo(e);
        break;
      case 'ArrowUp':
        this.setaCima(e);
        break;
          break;
      default:
          break;

    }
  }

  limitEixoD() {
    this.globals.varsIO.empenhoPAP.DIR_EIXO = this.trataEixo(this.globals.varsIO.empenhoPAP.DIR_EIXO);
  }

  limitEixoE() {
    this.globals.varsIO.empenhoPAP.ESQ_EIXO = this.trataEixo(this.globals.varsIO.empenhoPAP.ESQ_EIXO);
  }

  trataEixo(n) {
    if (Number(n)) {
      if (n > 180) {
        return '180';
      } else if (n < 0) {
        return '0';
      } else {
        return String(Number(n));
      }
    } else {
      return '0';
    }
  }

  removeRequiredOs() {
    this.req_os = false;
  }
  removeRequiredNome() {
    this.req_nome = false;
  }
  removeRequiredOdCil() {
    this.req_odcil = false;
  }
  removeRequiredOeCil() {
    this.req_oecil = false;
  }
  removeRequiredAll() {
    this.req_odcil = this.req_oecil = this.req_odesf = this.req_oeesf = false;
  }
  removeREQ(e) {
    // e.srcElement.ClassList.remove('required')
    const _e = e.srcElement as HTMLElement;
    _e.classList.remove('required');
  }

  addParapar(montagem = false) {
    if (this.globals.varsIO.papTemMontagem) {
      let validado = true as boolean;
      if (
        this.globals.varsIO.empenhoPAP.Detalhes.MARCA
        && this.globals.varsIO.empenhoPAP.Detalhes.MODELO
        && this.globals.varsIO.empenhoPAP.Detalhes.COR
        && this.globals.varsIO.empenhoPAP.Detalhes.TIPOARO
        && this.globals.varsIO.empenhoPAP.Detalhes.MATERIAL
        && this.globals.varsIO.empenhoPAP.Detalhes.Aro
        && this.globals.varsIO.empenhoPAP.Detalhes.PONTE
        ) {
        if (this.globals.varsIO.empenhoPAP.DIR_ESFER) {
          if (!(this.globals.varsIO.empenhoPAP.Detalhes.RDNP && this.globals.varsIO.empenhoPAP.Detalhes.RALTURA)) {
            this.req_RDNP = this.req_RALTURA = true;
            validado = false;
          }
        }
        if (this.globals.varsIO.empenhoPAP.ESQ_ESFER) {
          if (!(this.globals.varsIO.empenhoPAP.Detalhes.LDNP && this.globals.varsIO.empenhoPAP.Detalhes.LALTURA)) {
            this.req_LDNP = this.req_LALTURA = true;
            validado = false;
          }
        }
        if (validado) {
          this.addMontagem();
        }
      } else {
        !this.globals.varsIO.empenhoPAP.Detalhes.MARCA ? this.req_MARCA = true : this.req_MARCA = false;
        !this.globals.varsIO.empenhoPAP.Detalhes.MODELO ? this.req_MODELO = true : this.req_MODELO = false;
        !this.globals.varsIO.empenhoPAP.Detalhes.COR ? this.req_COR = true : this.req_COR = false;
        !this.globals.varsIO.empenhoPAP.Detalhes.TIPOARO ? this.req_TIPOARO = true : this.req_TIPOARO = false;
        !this.globals.varsIO.empenhoPAP.Detalhes.MATERIAL ? this.req_MATERIAL = true : this.req_MATERIAL = false;
        !this.globals.varsIO.empenhoPAP.Detalhes.Aro ? this.req_Aro = true : this.req_Aro = false;
        !this.globals.varsIO.empenhoPAP.Detalhes.PONTE ? this.req_PONTE = true : this.req_PONTE = false;
      }
    } else {
      this.req_os = this.req_nome = false;
      let validado = true as boolean;
      if (this.globals.varsIO.empenhoPAP.OSCLI
        && this.globals.varsIO.empenhoPAP.NOME
        && ((this.globals.varsIO.empenhoPAP.DIR_ESFER) || (this.globals.varsIO.empenhoPAP.ESQ_ESFER))) {
        let os_htk = this.route.snapshot.paramMap.get('os');
        if (!os_htk) {
          os_htk = '';
        }

        let odesf = '';
        let oeesf = '';
        let odcil = '';
        let oecil = '';

        if (this.globals.varsIO.empenhoPAP.DIR_ESFER && !this.globals.varsIO.empenhoPAP.DIR_CIL) {
          validado = false;
          this.req_odcil = true;
        } else if (this.globals.varsIO.empenhoPAP.DIR_ESFER && this.globals.varsIO.empenhoPAP.DIR_CIL) {
          const od_esf_a = this.globals.varsIO.empenhoPAP.DIR_ESFER.split('|')[0];
          const od_esf_b = this.globals.varsIO.empenhoPAP.DIR_ESFER.split('|')[1];
          odesf = this.globals.varsIO.LenteIO.GradesOPCODE[od_esf_a].EIXO_X[od_esf_b].ESFERICO;
          odcil = this.globals.varsIO.LenteIO.GradesOPCODE[od_esf_a].EIXO_X[od_esf_b].EIXO_Y[this.globals.varsIO.empenhoPAP.DIR_CIL].EIXO;
        }

        if (this.globals.varsIO.empenhoPAP.ESQ_ESFER && !this.globals.varsIO.empenhoPAP.ESQ_CIL) {
          validado = false;
          this.req_oecil = true;
        } else if (this.globals.varsIO.empenhoPAP.ESQ_ESFER && this.globals.varsIO.empenhoPAP.ESQ_CIL) {
          const oe_esf_a = this.globals.varsIO.empenhoPAP.ESQ_ESFER.split('|')[0];
          const oe_esf_b = this.globals.varsIO.empenhoPAP.ESQ_ESFER.split('|')[1];
          oeesf = this.globals.varsIO.LenteIO.GradesOPCODE[oe_esf_a].EIXO_X[oe_esf_b].ESFERICO;
          oecil = this.globals.varsIO.LenteIO.GradesOPCODE[oe_esf_a].EIXO_X[oe_esf_b].EIXO_Y[this.globals.varsIO.empenhoPAP.ESQ_CIL].EIXO;
        }
        if (validado) {
          this.api.empenhaParapar(
            this.globals.logged.Pedido_num,
            this.route.snapshot.paramMap.get('id'),
            os_htk,
            odesf,
            odcil,
            this.globals.varsIO.empenhoPAP.DIR_EIXO,
            oeesf,
            oecil,
            this.globals.varsIO.empenhoPAP.ESQ_EIXO,
            this.globals.varsIO.empenhoPAP.OSCLI,
            this.globals.varsIO.empenhoPAP.NOME,
            montagem
          );
        }
      } else {
        if (!this.globals.varsIO.empenhoPAP.OSCLI) {
          this.req_os = true;
        }
        if (!this.globals.varsIO.empenhoPAP.NOME) {
          this.req_nome = true;
        }
        if (!this.globals.varsIO.empenhoPAP.DIR_ESFER
          && !this.globals.varsIO.empenhoPAP.ESQ_ESFER
          && !this.globals.varsIO.empenhoPAP.DIR_CIL
          && !this.globals.varsIO.empenhoPAP.ESQ_CIL) {
          this.req_odcil = this.req_oecil = this.req_odesf = this.req_oeesf = true;
        }
      }
    }
  }

  addMontagem() {
    this.api.empenhaMontagem(
      this.globals.logged.Pedido_num,
      this.globals.varsIO.empenhoPAP.OSHTK,
      '', // uid
      this.globals.varsIO.empenhoPAP.Detalhes.RDNP,
      this.globals.varsIO.empenhoPAP.Detalhes.RALTURA,
      this.globals.varsIO.empenhoPAP.Detalhes.LDNP,
      this.globals.varsIO.empenhoPAP.Detalhes.LALTURA,
      this.globals.varsIO.empenhoPAP.Detalhes.MARCA,
      this.globals.varsIO.empenhoPAP.Detalhes.COR,
      this.globals.varsIO.empenhoPAP.Detalhes.Aro,
      this.globals.varsIO.empenhoPAP.Detalhes.MODELO,
      this.globals.varsIO.empenhoPAP.Detalhes.TIPOARO,
      this.globals.varsIO.empenhoPAP.Detalhes.PONTE,
      this.globals.varsIO.empenhoPAP.Detalhes.POLIMENTO,
      this.globals.varsIO.empenhoPAP.Detalhes.QUEBRACANTO,
      this.globals.varsIO.empenhoPAP.Detalhes.MATERIAL
    );
  }

  toggleMontagem() {
    if (this.globals.varsIO.papTemMontagem) {
      this.globals.varsIO.papTemMontagem = false;
      this.globals.varsIO.LenteIO.Popup = true;
    } else {
      this.addParapar(true);
    }
  }

  private nextTabIndex(e: any, click = false) {
    const inputs = Array.from(document.querySelectorAll('.input'));
    inputs.forEach(el => {
      const _item = el as HTMLElement;
      if (_item.tabIndex === (e.srcElement.tabIndex + 1)) {
        _item.focus();
      }
    });
  }

  fechar() {
    this.globals.varsIO.LenteIO.Popup = false;
    this.limparDados();
  }

  finalizar() {
    this.globals.varsIO.LenteIO.Popup = false;
    this.router.navigate(['/admin/carrinho']);
  }

  continuar() {
    this.globals.varsIO.LenteIO.Popup = false;
    this.limparDados();
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

  private setaEsquerda(e: any) {
    const inputs = Array.from(document.querySelectorAll('.input'));
    let ae_ant: any;
    inputs.forEach(x => {
      if (x === e.srcElement) {
        const _x = x as HTMLInputElement;
        ae_ant.focus();
      }
      ae_ant = x;
    });
  }
  private setaDireita(e: any) {
    const inputs = Array.from(document.querySelectorAll('.input'));
    let ad = -1;
    let zd = 0;
    inputs.forEach(x => {
      if (x === e.srcElement) {
        ad = zd + 1;
      }
      if (ad === zd) {
        const _ad = x as HTMLInputElement;
        _ad.focus();
      }
      zd++;
    });
  }
  private setaBaixo(e: any) {
    let z_x_down = 0;
    let pos_x = 0;
    if (e.srcElement.closest('tr').nextElementSibling) {
      const x_down: NodeListOf<Element> = e.srcElement.closest('tr').nextElementSibling.querySelectorAll('.input');
      const _x = e.srcElement.closest('tr').querySelectorAll('.input');

      _x.forEach(el => {
        if (el === e.srcElement) {
          pos_x = z_x_down;
        }
        z_x_down++;
      });

      if (pos_x < x_down.length) {
        const _item = x_down.item(pos_x) as HTMLInputElement;
        _item.focus();
      } else {
        const _item = x_down.item(x_down.length - 1) as HTMLInputElement;
        _item.focus();
      }
    }
  }
  private setaCima(e: any) {
    let z_x_up = 0;
    let pos_x = 0;
    const _x = e.srcElement.closest('tr').querySelectorAll('.input');
    const x_up = e.srcElement.closest('tr').previousElementSibling as HTMLTableRowElement;
    if (x_up.className !== 'primeira') {
      const _x_up: NodeListOf<Element> = e.srcElement.closest('tr').previousElementSibling.querySelectorAll('.input');
      _x.forEach(el => {
        if (el === e.srcElement) {
          pos_x = z_x_up;
        }
        z_x_up++;
      });
      const _item = _x_up.item(pos_x) as HTMLInputElement;
      _item.focus();
    }
  }

}
