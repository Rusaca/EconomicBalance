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

  async loginGoogle(data: { token: string }) {
  try {
    const respuesta = await fetch('http://localhost:3000/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await respuesta.json();
  } catch (error) {
    console.error('Error login Google:', error);
    return { ok: false, mensaje: 'Error conectando con el servidor' };
  }
}

async activarCuenta(token: string): Promise<IRespuestaAuth> {
  try {
    const respuesta = await fetch(`http://localhost:3000/api/cliente/activar?token=${token}`);

    const data = await respuesta.json();

    return {
      ok: data.ok === true,     // <-- ESTA ES LA CLAVE
      mensaje: data.mensaje || '',
      data
    };

  } catch (error) {
    return {
      ok: false,
      mensaje: 'Error conectando con el servidor'
    };
  }
}
}