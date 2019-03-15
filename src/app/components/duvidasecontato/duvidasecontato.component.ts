import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-duvidasecontato',
  templateUrl: './duvidasecontato.component.html',
  styleUrls: ['./duvidasecontato.component.css']
})
export class DuvidasecontatoComponent implements OnInit {

  constructor(
    public globals: Globals,
    public api: ApiService
  ) {
    this.api.getSales(this.globals.logged.Company_active.A1_COD);
    this.api.getFAQ();
  }

  ngOnInit() {
  }

}
