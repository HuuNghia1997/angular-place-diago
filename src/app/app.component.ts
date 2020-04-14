import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OauthService } from './services/oauth.service';
import { getCodeURL, getCodeParams, tempRedirect } from '../environments/environment';
import { callbackify } from 'util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Chính Quyền Số';
  token = localStorage.getItem('OAuth2TOKEN');
  refresh = localStorage.getItem('TOKEN_Refresh');

  isLogging: boolean;

  constructor( private auth: OauthService ) {

  }

  ngOnInit() {
    console.log(this.isLogging);
    if (this.token != null ) {

      const helper = new JwtHelperService();
      const isExpired = helper.isTokenExpired(this.token);
      this.isLogging = !isExpired;
      if (isExpired) {
        console.log('token is exp');
        this.auth.refeshToken(callback => {
          this.isLogging = callback;

          console.log('this.isLogging');
        });
      } else if (helper.isTokenExpired(this.refresh)) {
        console.log('token is exp 2');
        localStorage.setItem('OAuth2TOKEN', '');
        window.location.href = getCodeURL + getCodeParams + '&' + tempRedirect;
      }
    } else {
        localStorage.setItem('OAuth2TOKEN', '');
        window.location.href = getCodeURL + getCodeParams + '&' + tempRedirect;
    }
  }
}
