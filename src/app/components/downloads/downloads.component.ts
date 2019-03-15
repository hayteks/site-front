import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/models/globals';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {

  constructor(
    public globals: Globals,
    public api: ApiService
  ) {
  }

  ngOnInit() {
    this.api.getDownloads();
  }

}
