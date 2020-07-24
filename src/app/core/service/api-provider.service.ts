import { Injectable } from '@angular/core';
import { environment } from 'env/environment';
import { EnvService } from './env.service';

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

  private apiProviders;

  constructor(private envService: EnvService) {
    this.apiProviders = envService.getConfig().apiProviders;
  }

  getUrl(providerName: string, serviceName?: string): string {
    let url: string = null;
    if (this.apiProviders[providerName]) {
      let provider: Provider = this.apiProviders[providerName];
      url = provider.rootUrl;
      if (serviceName && provider.services && provider.services[serviceName]) {
        let service: Service = provider.services[serviceName];
        if (service.rootUrl) {
          url = service.rootUrl;
        }
        url += service.path;
      }
    }
    return url;
  }
}
