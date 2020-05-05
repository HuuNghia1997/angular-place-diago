import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OauthService } from './services/oauth.service';
import { getCodeURL, getCodeParams, tempRedirect, auth_token } from '../environments/environment';
import { callbackify } from 'util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Chính Quyền Số';
  token = localStorage.getItem('auth_token');
  refresh = localStorage.getItem('token_refresh');

  constructor( private auth: OauthService ) {

  }

  ngOnInit() {

    if (this.token != null ) {
      const helper = new JwtHelperService();
      const isExpired = helper.isTokenExpired(this.token);
      if (!isExpired) {
        this.auth.refeshToken(callback => {
        });
      } else if (!helper.isTokenExpired(this.refresh)) {
        localStorage.setItem('auth_token', '');
        window.location.href = getCodeURL + getCodeParams + '&' + tempRedirect;
      }
    } else {
        localStorage.setItem(auth_token, '');
        window.location.href = getCodeURL + getCodeParams + '&' + tempRedirect;
    }
  }
}
