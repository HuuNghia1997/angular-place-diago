import { Injectable } from '@angular/core';
import { environment } from 'env/environment';

export interface Service {
  name: string,
  path: string,
  rootUrl?: string
}

export interface Provider {
  name: string,
  rootUrl: string,
  services?: Service[]
}

@Injectable({
  providedIn: 'root'
})
export class ApiProviderService {

  private apiProviders: Provider[];

  constructor() {
    this.apiProviders = <Provider[]>environment.apiProviders;
  }

  getUrl(providerName: string, serviceName?: string): string {
    let url: string = null;
    if (this.apiProviders && this.apiProviders.length > 0) {
      let provider: Provider = this.apiProviders.find(p => p.name === providerName);
      if (provider) {
        url = provider.rootUrl;
        if (serviceName && provider.services && provider.services.length) {
          let service: Service = provider.services.find(s => s.name === serviceName);
          if (service.rootUrl) {
            url = service.rootUrl;
          }
          url += service.path;
        }
      }
    }
    return url;
  }
}
