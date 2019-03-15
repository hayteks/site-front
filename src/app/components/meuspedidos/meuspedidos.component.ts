import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-meuspedidos',
  templateUrl: './meuspedidos.component.html',
  styleUrls: ['./meuspedidos.component.css']
})
export class MeuspedidosComponent implements OnInit {

  public cod_cliente = '';
  public pagina = 1;
  public qtd = 10;
  public status = 'T';
  public data_ini = '19000101';
  public data_fim = '21000101';
  public cod_master = false;

  constructor(
    public globals: Globals,
    public api: ApiService
  ) { }

  ngOnInit() {
  }

  filtrarHistorico() {
    this.cod_cliente = this.globals.logged.Company_active.A1_COD;
    this.api.getOrderHistory(this.cod_cliente, this.pagina, this.qtd, this.status,
      this.data_ini.replace('-', '').replace('-', ''), this.data_fim.replace('-', '').replace('-', ''), this.cod_master);
  }

}
