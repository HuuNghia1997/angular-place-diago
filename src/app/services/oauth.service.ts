import { Injectable } from '@angular/core';

import { AUTH, rootLayout, tokenURL } from '../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor( public http: HttpClient) { }

  refeshToken(callback) {
    const params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', localStorage.getItem('TOKEN_Refresh'));

    const headers =
      new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        // tslint:disable-next-line:object-literal-key-quotes
        'Authorization': 'Basic ' + btoa( AUTH.CLIENT_ID + ':' + AUTH.CLIENT_SECRET)
      });

    this.http.post(
      tokenURL + '?redirect_uri=http://localhost:4200/oauth',
      params.toString(), { headers }).subscribe(
        data => {
          // tslint:disable-next-line:no-string-literal
          localStorage.setItem('OAuth2TOKEN', data['access_token']);
          // refresh_token
          // tslint:disable-next-line:no-string-literal
          localStorage.setItem('TOKEN_Refresh', data['refresh_token']);

          callback(true);
        }, err => {
          console.log(err);
          // alert('refesh fails');
        });
  }

  retrieveToken(code, success) {
    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', 'first-client');
    params.set('code', code);

    const headers =
      new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        // tslint:disable-next-line:object-literal-key-quotes
        'Authorization': 'Basic ' + btoa( AUTH.CLIENT_ID + ':' + AUTH.CLIENT_SECRET)
      });

    this.http.post(
      tokenURL + '?redirect_uri=http://localhost:4200/oauth',
      params.toString(), { headers }).subscribe(
        data => {
          // tslint:disable-next-line:no-string-literal
          localStorage.setItem('OAuth2TOKEN', data['access_token']);
          // refresh_token
          // tslint:disable-next-line:no-string-literal
          localStorage.setItem('TOKEN_Refresh', data['refresh_token']);
          // window.location.href = rootLayout;

          success(true);
        }, err => {
          console.log(err);
          alert('Invalid Credentials');
        });
  }
}
