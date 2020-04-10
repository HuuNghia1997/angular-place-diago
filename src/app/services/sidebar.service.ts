import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OauthService } from './oauth.service';
import { rootURL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor(
    private http: HttpClient,
    private auth: OauthService
    ) { }

    private getUserInfoPath = rootURL + 'hu/user/';

    getUserInfo(id: string) {
      const token = localStorage.getItem('OAuth2TOKEN');
      let headers = new HttpHeaders();
      headers = headers.append('Authorization', 'Bearer ' + token);
      headers = headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      return this.http.get(this.getUserInfoPath + id, { headers }).pipe();
    }

}
