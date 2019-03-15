import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import LOCALE_ID from '@angular/common/locales/pt';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoggedComponent } from './components/logged/logged.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AlertasComponent } from './components/alertas/alertas.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { LentesComponent } from './components/lentes/lentes.component';
import { MeuspedidosComponent } from './components/meuspedidos/meuspedidos.component';
import { DownloadsComponent } from './components/downloads/downloads.component';
import { FinanceiroComponent } from './components/financeiro/financeiro.component';
import { GradeComponent } from './components/grade/grade.component';
import { ParaparComponent } from './components/parapar/parapar.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { EnderecosComponent } from './components/enderecos/enderecos.component';
import { DuvidasecontatoComponent } from './components/duvidasecontato/duvidasecontato.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { IndexComponent } from './index/index.component';
import { Globals } from './models/globals';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxMaskModule } from 'ngx-mask';
import { CallbackForPipe } from './callback-for.pipe';
import { GradeEmpenhoComponent } from './components/grade-empenho/grade-empenho.component';
import { ParaparEmpenhoComponent } from './components/parapar-empenho/parapar-empenho.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatSelectModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    LoggedComponent,
    DashboardComponent,
    AlertasComponent,
    PedidosComponent,
    LentesComponent,
    MeuspedidosComponent,
    DownloadsComponent,
    FinanceiroComponent,
    GradeComponent,
    ParaparComponent,
    UsuariosComponent,
    EnderecosComponent,
    DuvidasecontatoComponent,
    CarrinhoComponent,
    CheckoutComponent,
    IndexComponent,
    CallbackForPipe,
    GradeEmpenhoComponent,
    ParaparEmpenhoComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({}),
    NgxMaskModule.forRoot(),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    BrowserAnimationsModule
  ],
  providers: [
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
