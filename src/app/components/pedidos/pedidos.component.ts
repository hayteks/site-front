import { Component, OnInit } from '@angular/core';

import { Globals, PedDetalhePAP, Lente, GradeOPCODE } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  paginaAtual = 1;
  popPAP = false;
  popGrade = false;
  esfAnt: number;
  pedDetalhePAP: PedDetalhePAP;
  popPAPLente: Lente;

  constructor(
    public globals: Globals,
    public api: ApiService
  ) {
  }

  ngOnInit() {
  }

  orderDetails(ped) {
    ped.LOADING = 0;
    this.api.getOrderHistoryDetails(ped, 25);
    this.api.getOrderHistoryRastreio(ped, 25);
    this.api.getOrderHistoryBoletos(ped, 25);
    this.api.getOrderHistoryDanfes(ped, 25);
  }

  paginacao(pagina) {
    if (pagina > 0 && pagina < (this.globals.varsIO.historicoPagina + 1)) {
      this.paginaAtual = pagina;
      this.api.getOrderHistory(this.globals.logged.Company_active.A1_COD, pagina);
    }
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

  openGrade(detGrade, cod_pedido) {
    this.api.getLenOPCCOD(detGrade.PRODUTO, cod_pedido, true);
    this.popGrade = true;
    const a = detGrade.PEDIDO;
    const b = detGrade.PRODUTO;
  }

  openPAP(detPAP) {
    this.popPAPLente = new Lente();
    this.popPAPLente = detPAP.Lente;

    this.pedDetalhePAP = new PedDetalhePAP();
    this.pedDetalhePAP = detPAP;
    this.popPAP = true;
    const a = detPAP.PEDIDO;
    const b = detPAP.PRODUTO;
  }

  closePop() {
    this.popPAP = false;
    this.popGrade = false;
  }
}
