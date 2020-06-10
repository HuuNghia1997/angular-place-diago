import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'env/environment';
import { Observable, of } from 'rxjs';
import { ApiProviderService } from './api-provider.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private apiProvider: ApiProviderService) { }

  getPasswordToken(): Observable<Object> {
    let url: string = env.keycloakOptions.config.url;
    url += "/realms/" + env.keycloakOptions.config.realm;
    url += "/protocol/openid-connect/token";

    let httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/x-www-form-urlencoded' 
      })
    };
    
    return this.http.post(url, 'grant_type=password&username=demo&password=demo&client_id=test&scope=openid', httpOptions);
  }

  getPasswordTokenAJAX(): Observable<Object> {
    let url: string = env.keycloakOptions.config.url;
    url += "/realms/" + env.keycloakOptions.config.realm;
    url += "/protocol/openid-connect/token";

    return new Observable<Object>(s => {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        s.next(this.responseText);
      };
      xhttp.open("POST", url, true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send("grant_type=password&username=demo&password=demo&client_id=test&scope=openid");
    });
    
  }

}

