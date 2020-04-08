import { Injectable } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { AUTH, rootLayout } from '../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(private route: ActivatedRoute, public _http: HttpClient) { }

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
          window.location.href = rootLayout;
        }, err => {
          console.log(err);
          alert('Invalid Credentials');
        });
  }
}
