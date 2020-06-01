import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiProviderService } from 'src/app/core/service/api-provider.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private apiProviderService: ApiProviderService) { }

    private getUserInfoPath = this.apiProviderService.getUrl('digo-microservice', 'human') + '/user/';

    private getUserfilePath = this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/';

    getUserInfo(id: string) {
      const token = localStorage.getItem('auth_token');
      let headers = new HttpHeaders();
      headers = headers.append('Authorization', 'Bearer ' + token);
      headers = headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      return this.http.get(this.getUserInfoPath + id, { headers }).pipe();
    }

    getUserAvatar(id: string) {
      const token = localStorage.getItem('auth_token');
      let headers = new HttpHeaders();
      headers = headers.append('Authorization', 'Bearer ' + token);
      headers.append('Access-Control-Allow-Origin', '*');
      return this.http.get(this.getUserfilePath + id, {responseType: 'blob' as 'json', headers });
    }

}
