import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Globals, PedidoGradeDetalhes, PedidoGrade, PedidoPAP } from 'src/app/models/globals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {

  constructor(
    public api: ApiService,
    public globals: Globals,
    public router: Router
  ) { }

  ngOnInit() {
    this.api.getCartGrade(this.globals.logged.Pedido_num);
    this.api.getCartPAP(this.globals.logged.Pedido_num);
  }

  abreDetalheGrade(pedido: PedidoGrade) {
    pedido.Loading = 0;
    this.api.getCartGradeDetalhes(this.globals.logged.Pedido_num, pedido.PRODUTO, pedido);
  }

  abreDetalhePap(pedido: PedidoPAP) {
    pedido.Loading = 0;
    if (pedido.MONTAGEM === 'E') {
      this.globals.logged.Pedido_pap.forEach(element => {
        element.DetalheIO = false;
      });
      pedido.DetalheIO = true;
      this.api.getCartPAPDetalhes(this.globals.logged.Pedido_num, pedido.OSHTK, pedido);
    }
  }

  editarItemGrade(pedDetGrade: PedidoGradeDetalhes) {
    this.router.navigate(['/admin/grade/empenho/' + pedDetGrade.PRODUTO]);
  }

  excluirItemGrade(pedidoGrade) {
    this.api.removeItem(this.globals.logged.Pedido_num, pedidoGrade.PRODUTO, this.globals.logged.Pedido_condpag.CODIGO);
    this.globals.logged.Pedido_grade.splice(this.globals.logged.Pedido_grade.indexOf(pedidoGrade), 1);
  }

  excluirItemPap(pedidoPap) {
    this.api.removeItemParapar(this.globals.logged.Pedido_num, pedidoPap.OSHTK, pedidoPap.PRODUTO);
    this.globals.logged.Pedido_pap.splice(this.globals.logged.Pedido_pap.indexOf(pedidoPap), 1);
  }

  cancelarPedido() {
    this.api.orderCancel(this.globals.logged.Pedido_num);
  }

}
