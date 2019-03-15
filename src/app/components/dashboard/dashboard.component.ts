import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/models/globals';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public ticketIO = false;

  constructor(
    public globals: Globals
  ) { }

  ngOnInit() {
  }

  openTickets() {
    this.ticketIO = true;
  }

  closeTickets() {
    this.ticketIO = false;
  }

  seleciona_ticket(ticket) {
    this.globals.logged.Pedido_ticket = ticket.NUMERO_CUPOM;
    this.ticketIO = false;
  }
}
