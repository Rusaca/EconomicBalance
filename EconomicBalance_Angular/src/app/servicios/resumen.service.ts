import { Injectable } from '@angular/core';
import { FetchNodeService } from './fetch-node';

@Injectable({
    providedIn: 'root'
})
export class ResumenService {

    constructor(
        private http: FetchNodeService
    ) { }

async enviarResumenCorreo(data: any) {
  return await this.http.post(
    '/metas-ahorro/enviar-correo',
    data
  );
}

async enviarResumenMovil(data: any) {
  return await this.http.post(
    '/metas-ahorro/enviar-movil',
    data
  );
}



}