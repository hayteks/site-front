import { Component, OnInit } from '@angular/core';
import { Globals, OPCCODY, CondPag, GradeOPCODE } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-grade-empenho',
  templateUrl: './grade-empenho.component.html',
  styleUrls: ['./grade-empenho.component.css']
})
export class GradeEmpenhoComponent implements OnInit {

  detLentes = false as boolean;
  naoConfirmado = false as boolean;
  lenNaoConfirmado: any;
  lenteAtual: string;

  constructor(
    public globals: Globals,
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.lenteAtual = this.route.snapshot.paramMap.get('id');
    this.carregaLente(this.lenteAtual);
  }

  carregaLente(len, click = false) {
    this.naoConfirmado = false;
    if (click) {
      // console.log('depois', this.globals.varsIO.LenteIO.total_lentes);
      // console.log('antes', this.globals.varsIO.total_lentes_check);
      if (this.globals.varsIO.LenteIO.total_lentes !== this.globals.varsIO.total_lentes_check) {
        this.naoConfirmado = true;
        this.lenNaoConfirmado = len;
        return false;
      }
    }
    this.detLentes = false;
    this.lenteAtual = len;
    this.api.getLenOPCCOD(len, this.globals.logged.Pedido_num, false);
    this.api.getLensDetails(this.lenteAtual);
    window.scrollTo(0, 0);
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

  onChange(condpag: CondPag) {
    this.api.setCondPag(this.globals.logged.Pedido_num, condpag.CODIGO);
    this.globals.logged.Pedido_condpag = condpag;
    this.api.atualizaTotalGrid();
  }

  onKeyUp(e) {
    this.api.atualizaTotalGrid();
  }

  onKeyDown(e) {
    this.trataDigitos(e, 4);
    const inputs: NodeListOf<Element> = document.querySelectorAll('.input');
    switch (e.key) {
      // case 'Backspace':
      //   return true;
      case 'Enter':
      case 'Tab':
      case 'ArrowRight':
        this.setaDireita(e, inputs);
        break;
      case 'ArrowLeft':
        this.setaEsquerda(e, inputs);
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

  private trataDigitos(e: any, max) {
    const coringa = ['Backspace', 'Delete', 'Control', 'v', 'V', 'Meta'];
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

  private setaEsquerda(e: any, inputs) {
    let ae_ant: any;
    inputs.forEach(x => {
      if (x === e.srcElement) {
        const _x = x as HTMLInputElement;
        ae_ant.focus();
      }
      ae_ant = x;
    });
  }
  private setaDireita(e: any, inputs) {
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
    const _x = e.srcElement.closest('tr').querySelectorAll('.input');
    const x_down: NodeListOf<Element> = e.srcElement.closest('tr').nextElementSibling.querySelectorAll('.input');

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

  empenha() {
    this.naoConfirmado = false;
    const OPCCODE_EMPENHA = new Array<OPCCODY>();
    const reduzida = this.globals.varsIO.LenteIO.GradesOPCODE.map(z => z.EIXO_X.map(x => x.EIXO_Y.filter(y => y.QTD > 0)));
    reduzida.forEach(x => {
      if (x.length > 0) {
        x.forEach(y => {
          if (y.length > 0) {
            y.forEach(opc => {
              console.log(opc);
              OPCCODE_EMPENHA.push(opc);
            });
          }
        });
      }
    });

    this.api.empenhaGrade(
      this.globals.logged.Pedido_num,
      this.route.snapshot.paramMap.get('id'),
      this.globals.logged.Pedido_condpag.CODIGO,
      OPCCODE_EMPENHA);
  }

  fechar() {
    this.globals.varsIO.LenteIO.Popup = false;
  }

  limpar() {
    const emp = new Array<OPCCODY>();
    const _emp = new OPCCODY();
    _emp.OPCCOD = this.globals.varsIO.LenteIO.GradesOPCODE[0].EIXO_X[0].EIXO_Y[0].OPCCOD;
    _emp.QTD = 0;
    emp.push(_emp);

    this.api.empenhaGrade(
      this.globals.logged.Pedido_num,
      this.route.snapshot.paramMap.get('id'),
      this.globals.logged.Pedido_condpag.CODIGO,
      emp, true);
  }

  finalizar() {
    this.globals.varsIO.LenteIO.Popup = false;
    this.router.navigate(['/admin/carrinho']);
  }

  continuar() {
    this.globals.varsIO.LenteIO.Popup = false;
    this.router.navigate(['/admin/grade']);
  }
}
