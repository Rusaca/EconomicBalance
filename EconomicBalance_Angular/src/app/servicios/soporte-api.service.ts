import { Injectable } from '@angular/core';

export interface ISoportePayload {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}

export interface IRespuestaSoporte {
  ok: boolean;
  mensaje: string;
  data?: {
    token?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SoporteApiService {
  async enviarSolicitud(payload: ISoportePayload): Promise<IRespuestaSoporte> {
    const response = await fetch('http://localhost:3000/api/tienda/soporte', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return {
      ok: response.ok,
      mensaje: data.mensaje || '',
      data: data.data
    };
  }
}
