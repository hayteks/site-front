import { Component, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Globals, Usuario } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  test = true as boolean;
  usuario_show = false as boolean;

  constructor(
    public globals: Globals,
    public api: ApiService
  ) { }

  ngOnInit() {
    this.globals.varsIO.UsuarioIO = new Usuario();
    this.api.getUsuarios(this.globals.logged.Company_active.A1_COD);
  }

  alterar(usu) {
    this.usuario_show = !this.usuario_show;
    this.globals.varsIO.UsuarioIO = new Usuario();
    this.globals.varsIO.UsuarioIO = usu;
  }
  cadastrar() {
    this.usuario_show = !this.usuario_show;
    this.globals.varsIO.UsuarioIO = new Usuario();
  }

  salvar() {
    let new_user = false;
    if (!this.globals.varsIO.UsuarioIO.ID) {
      new_user = true;
    }
    this.api.setUsuario(this.globals.logged.Company_active.A1_COD, this.globals.varsIO.UsuarioIO, new_user);
    this.usuario_show = !this.usuario_show;
  }

  excluir(usu) {
    this.api.delUsuario(usu.EMAIL);
  }

}
