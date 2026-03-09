import { Injectable } from '@angular/core';
import { FetchNodeService } from './fetch-node';
import { ILoginPayload, IRegistroPayload } from '../modelos/auth.interfaces';

export interface IRespuestaAuth {
  ok: boolean;
  mensaje: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {

  constructor(private http: FetchNodeService) {}

  async registrarUsuario(payload: IRegistroPayload): Promise<IRespuestaAuth> {
    return await this.http.post('/cliente/register', payload);
  }

  async loginUsuario(payload: ILoginPayload): Promise<IRespuestaAuth> {
    return await this.http.post('/cliente/login', {
      correo: payload.correo,
      password: payload.password
    });
  }

  async obtenerUsuarios(): Promise<IRespuestaAuth> {
    return await this.http.get('/cliente/users');
  }

}