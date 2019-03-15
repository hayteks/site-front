import { Component, OnInit, HostListener } from '@angular/core';
import { Globals, Company } from 'src/app/models/globals';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.css']
})
export class LoggedComponent implements OnInit {

  public menuMob = false as boolean;
  public _passAnt = '';
  public _passNew = '';
  public _passCnf = '';

  constructor(
    public globals: Globals,
    public router: Router,
    public api: ApiService
  ) {

    if (this.globals.logged) {
      if (this.globals.logged.User.TROCARSENHA) {
        this.globals.varsIO.altSenhaIO = true;
      } else {
        this.fillCompanies();
      }
    } else {
      this.globals.varsIO.loading = false;
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
  }

  toggleMenu() {
    this.menuMob = !this.menuMob;
  }

  closeMenu() {
    this.menuMob = false;
  }

  public fillCompanies() {
    if ( !this.globals.logged.Company_active ) {
      this.api.listCompanies(this.globals.logged.User.ID);
    }
  }

  public fillDashboard() {
    this.api.carregaDashboard(this.globals.logged.Company_active.A1_COD);
  }

  public trocarEmpresa() {
    this.closeMenu();
    this.globals.varsIO.selecaoEmpresa = true;
  }

  public seleciona_empresa(index) {
    this.globals.varsIO.selecaoEmpresa = false;
    this.globals.logged.Company_active = this.globals.logged.Companies[index];
    window.scrollTo(0, 0);
    this.fillDashboard();
    this.router.navigate(['/admin/dashboard']);
  }

  public alterarSenha() {
    this.closeMenu();
    this.globals.varsIO.altSenhaIO = !this.globals.varsIO.altSenhaIO;
  }

  public salvarSenha() {
    if (this._passNew) {
      if (this._passNew === this._passCnf) {
        this.api.alterPass(this._passAnt, this._passNew);
        this._passAnt = '';
        this._passNew = '';
        this._passCnf = '';
      } else {
        this.globals.varsIO._passError = true;
        this.globals.varsIO._passErrorTXT = 'A senha não confere com a confirmação.';
      }
    } else {
      this.globals.varsIO._passError = true;
      this.globals.varsIO._passErrorTXT = 'Digite a nova senha.';
    }
  }
}
