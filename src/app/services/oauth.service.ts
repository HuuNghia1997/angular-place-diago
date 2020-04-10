import { Injectable } from '@angular/core';

import { AUTH, tokenURL, tempRedirect, getCodeURL, getCodeParams, rootLayout } from '../../environments/environment';

import { JwtHelperService } from '@auth0/angular-jwt';

import { HttpClient, HttpHeaders } from '@angular/common/http';

interface User {
  id: string;
  fullname: string;
  account: string;
}

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  helper = new JwtHelperService();

  constructor( public http: HttpClient) { }

  getUserInfo(): User {
    if (localStorage.getItem('USER_INFO_ID') === null){
      let userinfo = this.helper.decodeToken(localStorage.getItem('OAuth2TOKEN'));
      // tslint:disable-next-line:no-string-literal
      localStorage.setItem('USER_INFO_ID', userinfo['user']['id'] );
      localStorage.setItem('USER_INFO_NAME', userinfo['user']['fullname'] );
      localStorage.setItem('USER_INFO_ACCOUNT', userinfo['user']['account'] );
    }
    const user: User = {
      // tslint:disable-next-line:no-string-literal
      id: localStorage.getItem('USER_INFO_ID'),
      // tslint:disable-next-line:no-string-literal
      fullname: localStorage.getItem('USER_INFO_NAME'),
      // tslint:disable-next-line:no-string-literal
      account: localStorage.getItem('USER_INFO_ACCOUNT'),
    };

    return user;

  }

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
        tokenURL + '?' + tempRedirect,
        params.toString(), { headers }).subscribe(
          data => {
            // tslint:disable-next-line:no-string-literal
            localStorage.setItem('OAuth2TOKEN', data['access_token']);
            // refresh_token
            // tslint:disable-next-line:no-string-literal
            localStorage.setItem('TOKEN_Refresh', data['refresh_token']);

            console.log('refresh is run');
            callback(true);
          }, err => {
            console.log(err);
            localStorage.setItem('OAuth2TOKEN', '');
            window.location.href = getCodeURL + getCodeParams + '&' + tempRedirect;
          });
  }

  retrieveToken(code, success) {
    const params = new URLSearchParams();
    params.set('grant_type', AUTH.GRANT_TYPE_CODE);
    params.set('client_id', AUTH.CLIENT_ID);
    params.set('code', code);

    const headers =
      new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        // tslint:disable-next-line:object-literal-key-quotes
        'Authorization': 'Basic ' + btoa( AUTH.CLIENT_ID + ':' + AUTH.CLIENT_SECRET)
      });

    this.http.post(
      tokenURL + '?' + tempRedirect,
      params.toString(), { headers }).subscribe(
        data => {
          // tslint:disable-next-line:no-string-literal
          localStorage.setItem('OAuth2TOKEN', data['access_token']);
          // refresh_token
          // tslint:disable-next-line:no-string-literal
          localStorage.setItem('TOKEN_Refresh', data['refresh_token']);

          window.location.href = rootLayout;
          success(true);
        }, err => {
          console.log(err);
          // alert('Invalid Credentials');
        });
  }

  logout() {
    localStorage.removeItem('OAuth2TOKEN');
    localStorage.removeItem('TOKEN_Refresh');
  }
}
