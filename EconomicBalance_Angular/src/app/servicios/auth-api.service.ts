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

  constructor(private http: FetchNodeService) { }

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

  async loginGoogle(data: { token: string }): Promise<IRespuestaAuth> {
    try {
      const respuesta = await fetch('http://localhost:3000/api/cliente/login-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const body = await respuesta.json();

      return {
        ok: respuesta.ok,
        mensaje: body.mensaje || '',
        data: body.data
      };
    } catch (error) {
      console.error('Error login Google:', error);
      return { ok: false, mensaje: 'Error conectando con el servidor' };
    }
  }

  async registerGoogle(data: { token: string }): Promise<IRespuestaAuth> {
    try {
      const respuesta = await fetch('http://localhost:3000/api/cliente/register-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const body = await respuesta.json();

      return {
        ok: respuesta.ok,
        mensaje: body.mensaje || '',
        data: body.data
      };
    } catch (error) {
      console.error('Error register Google:', error);
      return { ok: false, mensaje: 'Error conectando con el servidor' };
    }
  }


  async activarCuenta(token: string): Promise<IRespuestaAuth> {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/cliente/activar?token=${token}`);
      const data = await respuesta.json();

      return {
        ok: data.ok === true,
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
  async restablecerPassword(payload: { token: string; password: string }): Promise<IRespuestaAuth> {
    try {
      const respuesta = await fetch('http://localhost:3000/api/cliente/restablecer-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const body = await respuesta.json();

      return {
        ok: respuesta.ok,
        mensaje: body.mensaje || '',
        data: body.data
      };
    } catch (error) {
      console.error('Error restablecerPassword:', error);
      return { ok: false, mensaje: 'Error conectando con el servidor' };
    }
  }

  async recuperarPassword(payload: { correo: string }) {
    const res = await fetch('http://localhost:3000/api/cliente/recuperar-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('STATUS RECUPERAR PASSWORD:', res.status);
    console.log('DATA RECUPERAR PASSWORD:', data);

    return data;
  }
}

