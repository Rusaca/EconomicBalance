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

  constructor(private http: FetchNodeService) { }

  async registrarUsuario(payload: IRegistroPayload): Promise<IRespuestaAuth> {
    return await this.http.post('/cliente/registro', payload);
  }

  async loginUsuario(payload: ILoginPayload): Promise<IRespuestaAuth> {
    const respuesta = await this.http.post('/cliente/login', {
      identificador: payload.identificador,
      password: payload.password
    });

    console.log('AuthApiService - respuesta login:', respuesta);

    return respuesta;
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


  async actualizarPerfil(data: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono?: string;
    prefijoTelefono?: string;
    genero?: string;
    fotoPerfil?: string;
  }) {
    const response = await fetch('http://localhost:3000/api/cliente/actualizar-perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  async subirFoto(file: File) {
    const formData = new FormData();
    formData.append('foto', file);

    const response = await fetch('http://localhost:3000/api/cliente/subir-foto', {
      method: 'POST',
      body: formData
    });

    return await response.json();
  }

}

