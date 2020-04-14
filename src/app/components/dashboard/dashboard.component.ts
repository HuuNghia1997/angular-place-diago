import { Component, OnInit } from '@angular/core';

import { OauthService } from '../../services/oauth.service';
import { rootLayout } from '../../../environments/environment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private auth: OauthService) { }

  ngOnInit(): void {

    // window.location.href = rootLayout + 'notification';
  }


}
