import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LentesComponent } from './components/lentes/lentes.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { MeuspedidosComponent } from './components/meuspedidos/meuspedidos.component';
import { DownloadsComponent } from './components/downloads/downloads.component';
import { FinanceiroComponent } from './components/financeiro/financeiro.component';
import { GradeComponent } from './components/grade/grade.component';
import { ParaparComponent } from './components/parapar/parapar.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { EnderecosComponent } from './components/enderecos/enderecos.component';
import { DuvidasecontatoComponent } from './components/duvidasecontato/duvidasecontato.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { IndexComponent } from './index/index.component';
import { LoggedComponent } from './components/logged/logged.component';
import { GradeEmpenhoComponent } from './components/grade-empenho/grade-empenho.component';
import { ParaparEmpenhoComponent } from './components/parapar-empenho/parapar-empenho.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent},
  { path: 'admin', component: LoggedComponent, children: [
    {
      path: 'dashboard', component: DashboardComponent, children: [
        {
          path: '', component: LentesComponent, outlet: 'dashboard_child_len'
        },
        {
          path: '', component: PedidosComponent, outlet: 'dashboard_child_ped'
        }]
    },
    { path: 'pedidos', component: DashboardComponent, children: [
      {
        path: '', component: PedidosComponent, outlet: 'dashboard_child'
      }]
    },
    { path: 'meuspedidos', component: MeuspedidosComponent, children: [
      {
        path: '', component: PedidosComponent, outlet: 'dashboard_child'
      }]
    },
    { path: 'financeiro', component: FinanceiroComponent},
    { path: 'lentes', component: LentesComponent},
    { path: 'grade', component: GradeComponent},
    { path: 'grade/empenho/:id', component: GradeEmpenhoComponent},
    { path: 'parapar', component: ParaparComponent},
    { path: 'parapar/empenho/:id', component: ParaparEmpenhoComponent},
    { path: 'parapar/empenho/:id/:os', component: ParaparEmpenhoComponent},
    { path: 'downloads', component: DownloadsComponent},
    { path: 'usuarios', component: UsuariosComponent},
    { path: 'enderecos', component: EnderecosComponent},
    { path: 'duvidasecontato', component: DuvidasecontatoComponent},
    { path: 'carrinho', component: CarrinhoComponent},
    { path: 'checkout', component: CheckoutComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
