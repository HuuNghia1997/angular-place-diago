import { Injectable } from '@angular/core';

import { AUTH, tokenURL, tempRedirect, getCodeURL, logoutURL, auth_token, token_refresh } from '../../environments/environment';

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
      let userinfo = this.helper.decodeToken(localStorage.getItem('auth_token'));
      // tslint:disable-next-line:no-string-literal
      localStorage.setItem('USER_INFO_ID', userinfo['user']['id'] );
      localStorage.setItem('USER_INFO_NAME', userinfo['user']['fullname'] );
      localStorage.setItem('USER_INFO_ACCOUNT', userinfo['user']['account'] );

      localStorage.setItem('jti', userinfo['jti'] );
    }
    const user: User = {
      // tslint:disable-next-line:no-string-literal
      id: localStorage.getItem('USER_INFO_ID'),
      fullname: localStorage.getItem('USER_INFO_NAME'),
      account: localStorage.getItem('USER_INFO_ACCOUNT'),
    };

    return user;

  }

  refeshToken(callback) {
      const params = new URLSearchParams();
      params.set('grant_type', 'refresh_token');
      params.set('refresh_token', localStorage.getItem('token_refresh'));

      const headers =
        new HttpHeaders({

          'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
          // tslint:disable-next-line:object-literal-key-quotes
          'Authorization': 'Basic ' + btoa( AUTH.CLIENT_ID + ':' + AUTH.CLIENT_SECRET)
        });

      this.http.post(
        tokenURL,
        params.toString(), { headers }).subscribe(
          data => {
            // tslint:disable-next-line:no-string-literal
            localStorage.setItem(auth_token, data['access_token']);
            // refresh_token
            // tslint:disable-next-line:no-string-literal
            localStorage.setItem(token_refresh, data['refresh_token']);

            callback(true);
          }, err => {
            // alert('hết hạn đăng nhập')
            // localStorage.setItem(auth_token, '');
            // window.location.href = getCodeURL + getCodeParams + '&' + tempRedirect;
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
          localStorage.setItem(auth_token, data['access_token']);
          // tslint:disable-next-line:no-string-literal
          localStorage.setItem(token_refresh, data['refresh_token']);
          success(true);
        }, err => {
          console.log(err);
          // alert('Invalid Credentials');
        });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_refresh');
    localStorage.removeItem('USER_INFO_ID');
    localStorage.removeItem('USER_INFO_NAME');
    localStorage.removeItem('USER_INFO_ACCOUNT');
    alert('Đăng xuất thành công');
    



    const params = new URLSearchParams();
    params.set('_csrf', localStorage.getItem('jti'));

    const headers =
      new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        // tslint:disable-next-line:object-literal-key-quotes
        // 'Authorization': 'Basic ' + btoa( AUTH.CLIENT_ID + ':' + AUTH.CLIENT_SECRET) 
      });

    this.http.post(
      'https://digo-sso.vnptigate.vn/account/perform-logout',
      params.toString(), { headers }).subscribe(
        data => {
          console.log(data);
          window.location.href = logoutURL;
        }, err => {
          console.log(err);
          window.location.href = logoutURL;
        });

  }
}
