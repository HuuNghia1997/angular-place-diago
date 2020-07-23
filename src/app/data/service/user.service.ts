import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiProviderService } from 'src/app/core/service/api-provider.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private apiProviderService: ApiProviderService) { }

  private getUserInfoPath = this.apiProviderService.getUrl('digoMicroservice', 'human') + '/user/';

  private getUserfilePath = this.apiProviderService.getUrl('digoMicroservice', 'fileman') + '/file/';

  getUserInfo(id: string): Observable<any> {
    return this.http.get(this.getUserInfoPath + id);
  }

  getUserAvatar(id: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getUserfilePath + id, { headers, responseType: 'blob' as 'json' });
  }

}
