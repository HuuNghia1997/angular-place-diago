import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { rootLayout } from '../../../environments/environment';


import { OauthService } from 'src/app/services/oauth.service';

@Component({
  selector: 'app-token-auth',
  templateUrl: './token-auth.component.html',
  styleUrls: ['./token-auth.component.scss']
})
export class TokenAuthComponent implements OnInit {
  private orderObj;

  constructor(private route: ActivatedRoute, private authService: OauthService) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.orderObj = { ...params.keys, ...params };
      this.authService.retrieveToken(this.orderObj.params.code, (success) => {
        
        if (success) {
          this.authService.getUserInfo();
          window.location.href = rootLayout;
        }
      });
    });
  }
}
