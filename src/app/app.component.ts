import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OauthService } from './services/oauth.service';
import { getCodeURL, getCodeParams } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Chính Quyền Số';
  token = localStorage.getItem('OAuth2TOKEN');
  refresh = localStorage.getItem('TOKEN_Refresh');

  constructor( private auth: OauthService ) {}

  ngOnInit() {
    if (this.token != null ) {
      const helper = new JwtHelperService();
      const isExpired = helper.isTokenExpired(this.token);
      if (isExpired) {
        console.log('token is exp');
        this.auth.refeshToken(callback => {
          console.log('refresh success');
        });
      } else if (helper.isTokenExpired(this.refresh)) {
        localStorage.setItem('OAuth2TOKEN', '');
        window.location.href = getCodeURL + getCodeParams + '&redirect_uri=http://localhost:4200/oauth';
      }
    } else {
      localStorage.setItem('OAuth2TOKEN', '');
      window.location.href = getCodeURL + getCodeParams + '&redirect_uri=http://localhost:4200/oauth';
    }
  }
}
