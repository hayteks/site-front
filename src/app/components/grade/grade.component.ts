import { Component, OnInit } from '@angular/core';
import { Globals, Lente } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {

  showAll = true;
  showSim = false;
  showPro = false;
  showFaz = false;
  showMul = false;
  showBlo = false;

  constructor(
    public globals: Globals,
    public api: ApiService,
    public router: Router
  ) {
    if (!(this.globals.logged.Lentes && this.globals.logged.Lentes.length > 0)) {
      this.api.getLens(this.globals.logged.Company_active.A1_COD);
    }
  }

  filterGrade(_len: Lente) {
    return _len.GRADE === true;
  }

  fshowAll() {
    this.showAll = true;
    this.showSim = false;
    this.showPro = false;
    this.showFaz = false;
    this.showMul = false;
    this.showBlo = false;
  }
  fshowSim() {
    this.showAll = false;
    this.showSim = true;
    this.showPro = false;
    this.showFaz = false;
    this.showMul = false;
    this.showBlo = false;
  }
  fshowPro() {
    this.showAll = false;
    this.showSim = false;
    this.showPro = true;
    this.showFaz = false;
    this.showMul = false;
    this.showBlo = false;
  }
  fshowFaz() {
    this.showAll = false;
    this.showSim = false;
    this.showPro = false;
    this.showFaz = true;
    this.showMul = false;
    this.showBlo = false;
  }
  fshowMul() {
    this.showAll = false;
    this.showSim = false;
    this.showPro = false;
    this.showFaz = false;
    this.showMul = true;
    this.showBlo = false;
  }
  fshowBlo() {
    this.showAll = false;
    this.showSim = false;
    this.showPro = false;
    this.showFaz = false;
    this.showMul = false;
    this.showBlo = true;
  }

  abrePedido(len) {
    this.router.navigate(['/admin/grade/empenho/' + len.PRODUTO]);
  }

  ngOnInit() {
  }

}
