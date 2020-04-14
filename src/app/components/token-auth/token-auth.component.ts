import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
    console.log('it run');
    this.route.queryParamMap.subscribe(params => {
      this.orderObj = { ...params.keys, ...params };
      this.authService.retrieveToken(this.orderObj.params.code, (success) => {
        // this is a wait for full refresh
        console.log('it run');
      });
    });
  }
}
