import { Injectable } from '@angular/core';
import { environment } from 'env/environment'
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EnvService {
  private env;

  constructor(private httpClient: HttpClient) {    
    this.env = environment;
  }

  getEnv() {
    return this.env;
  }

  getConfig() {
    return this.env.config;
  }

  loadConfig(): Promise<any> {
    let inst = this;
    return new Promise<any>(function (resolve, reject) {
      if (inst.env.loadConfigFromUrl && inst.env.configUrl) {
        inst.httpClient.get(inst.env.configUrl, {
          responseType: 'json',
          params: new HttpParams().set("t", new Date().getTime().toString())
        }).toPromise().then(function (config) {
          inst.env.config = {...inst.env.config, ...config}
          resolve(inst.env.config);
        });
      } else {
        resolve(inst.env.config );
      }
    });
  }

}
