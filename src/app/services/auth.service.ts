import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AUTH, tokenURL } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()

export class AuthService {
  status: boolean;

  constructor(private http: HttpClient) {}

  getToken(): Observable<any> {
    const headers = {
      Authorization: 'Basic ' + btoa(AUTH.CLIENT_ID + ':' + AUTH.CLIENT_SECRET),
      'Content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    };
    const body = new HttpParams()
      .set('username', AUTH.CLIENT_ID)
      .set('password', AUTH.CLIENT_SECRET)
      .set('grant_type', AUTH.GRANT_TYPE);

    return this.http.post(tokenURL, body, {headers}).pipe();
  }
}
