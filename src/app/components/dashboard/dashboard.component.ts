import { Component, OnInit } from '@angular/core';

import { getCodeURL, getCodeParams } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('OAuth2TOKEN') === null) {
      window.location.href = getCodeURL + getCodeParams;
    } else {
      
    }
  }


}
