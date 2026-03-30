import { Injectable } from '@angular/core';
import { FetchNodeService } from './fetch-node';
import { ILoginPayload, IRegistroPayload } from '../modelos/auth.interfaces';

export interface IUsuarioAuth {
  id: string;
  nombre: string;
  apellidos: string;
  correo: string;
}

export interface IRespuestaAuth {
  ok: boolean;
  mensaje: string;
  data?: {
    token?: string;
    usuario?: IUsuarioAuth;
  };
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
    const respuesta = await this.http.post('/cliente/login', {
      correo: payload.correo,
      password: payload.password
    });

    console.log('AuthApiService - respuesta login:', respuesta);

    return respuesta;
  }

  async obtenerUsuarios(): Promise<IRespuestaAuth> {
    return await this.http.get('/cliente/users');
  }
}