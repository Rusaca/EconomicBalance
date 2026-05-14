import { Injectable } from '@angular/core';

export interface AjustesUsuario {
  idioma: 'es' | 'en';
  notificacionesEmail: boolean;
  notificacionesApp: boolean;
  modoOscuro: boolean;
  recordatorios: boolean;
  sincronizacion: boolean;
  autoguardado: boolean;
}

export interface RespuestaAjustes {
  ok: boolean;
  mensaje?: string;
  data?: {
    ajustes: AjustesUsuario;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AjustesService {

  private apiUrl = 'http://localhost:3000/api/cliente/ajustes';

  async obtenerAjustes(usuarioId: string): Promise<RespuestaAjustes> {
    const response = await fetch(`${this.apiUrl}/${usuarioId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return await response.json();
  }

  async guardarAjustes(
    usuarioId: string,
    payload: AjustesUsuario
  ): Promise<RespuestaAjustes> {
    const response = await fetch(`${this.apiUrl}/${usuarioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  }
}
