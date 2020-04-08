import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AUTH } from '../../../environments/environment';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-token-auth',
  templateUrl: './token-auth.component.html',
  styleUrls: ['./token-auth.component.scss']
})
export class TokenAuthComponent implements OnInit {
  private orderObj;
  public redirectUri = 'http://localhost:8080/';

  constructor(private route: ActivatedRoute, public _http: HttpClient) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.orderObj = { ...params.keys, ...params };
    });

    this.retrieveToken(this.orderObj.params.code);
  }

  refeshToken() {
    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', 'first-client');

    const headers =
      new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Basic ' + btoa( AUTH.CLIENT_ID + ':' + AUTH.CLIENT_SECRET)
      });


    this._http.post(
      'https://digo-sso.vnptigate.vn/oauth/token',
      params.toString(), { headers }).subscribe(
        data => {
          // console.log(data['access_token']);
          localStorage.setItem('OAuth2TOKEN', data['access_token']);
          // refresh_token
          // tslint:disable-next-line:no-string-literal
          localStorage.setItem('TOKEN_Refresh', data['refresh_token']);
        }, err => {
          console.log(err);
          alert('Invalid Credentials');
        });
  }

  retrieveToken(code) {
    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', 'first-client');
    params.set('code', code);

    const headers =
      new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Basic ' + btoa( AUTH.CLIENT_ID + ':' + AUTH.CLIENT_SECRET)
      });

    this._http.post(
      'https://digo-sso.vnptigate.vn/oauth/token',
      params.toString(), { headers }).subscribe(
        data => {
          // console.log(data['access_token']);
          localStorage.setItem('OAuth2TOKEN', data['access_token']);
          // refresh_token
          localStorage.setItem('TOKEN_Refresh', data['refresh_token']);
          window.location.href = this.redirectUri;
        }, err => {
          console.log(err);
          alert('Invalid Credentials');
        });
  }

}
