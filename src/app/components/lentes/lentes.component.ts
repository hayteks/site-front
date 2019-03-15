import { Component, OnInit } from '@angular/core';

import { Globals } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lentes',
  templateUrl: './lentes.component.html',
  styleUrls: ['./lentes.component.css']
})
export class LentesComponent implements OnInit {

  showAll = true;
  showInd = false;
  showMven = false;

  _lente = {
    ativa: false,
    produto: '',
    espessura: '',
    tipo: '',
    descricao: '',
    cor: '',
    grade: false,
    parapar: false
  };

  constructor(
    public globals: Globals,
    public api: ApiService,
    public router: Router
  ) {
  }

  todasLentes() {
    this.showAll = true;
    this.showInd = false;
    this.showMven = false;
  }
  maisVendidas() {
    this.showAll = false;
    this.showInd = false;
    this.showMven = true;
  }
  nossasIndicacoes() {
    this.showAll = false;
    this.showInd = true;
    this.showMven = false;
  }

  abrePedidoGrade(len) {
    this.router.navigate(['/admin/grade/empenho/' + len]);
  }
  abrePedidoPAP(len) {
    this.router.navigate(['/admin/parapar/empenho/' + len]);
  }

  fechaPopup() {
    this._lente.ativa = false;
    this._lente.cor = '';
    this._lente.descricao = '';
    this._lente.espessura = '';
    this._lente.grade = false;
    this._lente.parapar = false;
    this._lente.produto = '';
    this._lente.tipo = '';
  }

  abrePopup(len) {
    this._lente.ativa = true;
    this._lente.cor = '#' + len.CORDOSITE;
    this._lente.grade = len.GRADE;
    this._lente.parapar = len.PAR_A_PAR;
    this._lente.produto = len.PRODUTO;
    this._lente.espessura = len.MATERIAL;
    this._lente.tipo = len.CARAC_PRINCIPAL;
    this._lente.descricao = len.CARAC_SEGUNDARIA + '<br/>' + len.CARAC_TERCIARIA + '<br/>' + len.CARAC_QUARTENARIA;
  }

  ngOnInit() {
  }

}
