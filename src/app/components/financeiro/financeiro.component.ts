import { Component, OnInit } from '@angular/core';

import { Globals } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.css']
})
export class FinanceiroComponent implements OnInit {

  public cod_cliente = this.globals.logged.Company_active.A1_COD;
  public pagina = 1;
  public qtd = 10;
  public status = 'T';
  public data_ini = '19000101';
  public data_fim = '21000101';
  public campo = '';
  public order = '';
  public cod_master = false;

  constructor(
    public globals: Globals,
    public api: ApiService
  ) { }

  ngOnInit() {
    this.filtrarFinanceiro();
  }

  filtrarFinanceiro() {
    this.api.getOrderFinancial(this.cod_cliente, this.pagina, this.qtd, this.status,
      this.data_ini.replace('-', '').replace('-', ''), this.data_fim.replace('-', '').replace('-', ''),
      this.campo, this.order, this.cod_master);
  }

  paginacao(pag) {
    if (pag > 0 && pag < (this.globals.varsIO.financeiroPagina + 1)) {
      this.pagina = pag;
      this.filtrarFinanceiro();
    }
  }

  orderDetails(f) {
    f.LOADING = 0;
    this.api.getOrderFinancialDetails(f);
  }

}
