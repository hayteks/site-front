import { Component } from '@angular/core';
import { Globals, VarsIO } from './models/globals';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'haytek';

  constructor(
    public globals: Globals
  ) {
    registerLocaleData(localePt);

    this.globals.varsIO = new VarsIO;
  }
}
