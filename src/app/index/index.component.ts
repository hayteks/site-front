import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Globals } from '../models/globals';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public login = {
    email: '',
    password: ''
  };

  constructor(
    private api: ApiService,
    public globals: Globals
  ) {
  }

  ngOnInit() {
  }

  public do_login() {
    if (this.login.email && this.login.password) {
      this.api.doLogin(this.login.email, this.login.password);
    }
  }

  public getLens() {
    // this.api.getLentes('all').subscribe((data: Array<object>) => {
    //   console.log(data);
    // });
  }
}
