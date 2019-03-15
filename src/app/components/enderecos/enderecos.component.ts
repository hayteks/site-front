import { Component, OnInit } from '@angular/core';
import { Globals, Endereco } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-enderecos',
  templateUrl: './enderecos.component.html',
  styleUrls: ['./enderecos.component.css']
})
export class EnderecosComponent implements OnInit {

  endereco_show = false as boolean;
  constructor(
    public globals: Globals,
    public api: ApiService
  ) { }

  ngOnInit() {
    this.globals.varsIO.EnderecoIO = new Endereco();
    this.api.getEnderecos(this.globals.logged.Company_active.A1_COD);
  }

  tornarPadrao(end) {
    this.api.setEnderecoDefault(this.globals.logged.Company_active.A1_COD, end.ID_ENDERECO);
  }

  alterar(end) {
    this.endereco_show = !this.endereco_show;
    this.globals.varsIO.EnderecoIO = new Endereco();
    this.globals.varsIO.EnderecoIO = end;
  }
  cadastrar() {
    this.endereco_show = !this.endereco_show;
    this.globals.varsIO.EnderecoIO = new Endereco();
  }

  salvar() {
    let end_new = false;
    if (!this.globals.varsIO.EnderecoIO.ID_ENDERECO) {
      end_new = true;
    }
    this.api.setEnderecos(
      this.globals.logged.Company_active.A1_COD,
      this.globals.varsIO.EnderecoIO.Z3_ENDEREC + ' , ' + this.globals.varsIO.EnderecoIO.Z3_NUMERO,
      this.globals.varsIO.EnderecoIO.Z3_COMPLEM,
      this.globals.varsIO.EnderecoIO.Z3_BAIRRO,
      this.globals.varsIO.EnderecoIO.Z3_MUN,
      this.globals.varsIO.EnderecoIO.Z3_CEP,
      this.globals.varsIO.EnderecoIO.Z3_UF,
      end_new,
      this.globals.varsIO.EnderecoIO.ID_ENDERECO);

      this.endereco_show = !this.endereco_show;
  }

  excluir(end) {
    this.api.delEndereco(this.globals.logged.Company_active.A1_COD, end.ID_ENDERECO);
  }

  buscaCEP() {
    if (this.globals.varsIO.EnderecoIO.Z3_CEP.length === 8) {
      this.api.getCEP(this.globals.varsIO.EnderecoIO.Z3_CEP);
    }
  }

  maxCEP(e) {
    this.trataDigitos(e, 8);
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
