import { Injectable } from '@angular/core';
import {
  ApiResponse,
  CrearMetaAhorroPayload,
  MetaAhorro,
  ResumenMensualAhorro
} from '../modelos/metas-ahorro-model';

@Injectable({
  providedIn: 'root'
})
export class MetasAhorroService {
  private readonly baseUrl = 'http://localhost:3000/api/metas-ahorro';

  private obtenerUserId(): string {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario.id || usuario._id || localStorage.getItem('usuarioId') || '';
  }

  private async leerJson(response: Response) {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Respuesta no valida del servidor (${response.status})`);
    }
  }

  private normalizarMeta(meta: any): MetaAhorro {
    return {
      id: meta.id || meta._id || '',
      titulo: meta.titulo || '',
      objetivo: Number(meta.objetivo || 0),
      actual: Number(meta.actual || 0),
      fechaLimite: meta.fechaLimite || '',
      createdAt: meta.createdAt || ''
    };
  }

  async obtenerMetas(): Promise<ApiResponse<{ metas: MetaAhorro[] }>> {
    const userId = this.obtenerUserId();
    const response = await fetch(`${this.baseUrl}?userId=${encodeURIComponent(userId)}`);
    const data = await this.leerJson(response);

    return {
      ok: response.ok,
      mensaje: data.mensaje || '',
      data: {
        metas: (data.data?.metas || []).map((meta: any) => this.normalizarMeta(meta))
      }
    };
  }

  async crearMeta(payload: CrearMetaAhorroPayload): Promise<ApiResponse<{ meta: MetaAhorro }>> {
    const userId = this.obtenerUserId();

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...payload,
        userId
      })
    });

    const data = await this.leerJson(response);

    return {
      ok: response.ok,
      mensaje: data.mensaje || '',
      data: data.data?.meta
        ? { meta: this.normalizarMeta(data.data.meta) }
        : undefined
    };
  }

  async eliminarMeta(id: string): Promise<ApiResponse<null>> {
    const userId = this.obtenerUserId();

    const response = await fetch(`${this.baseUrl}/${id}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    });

    const data = await this.leerJson(response);

    return {
      ok: response.ok,
      mensaje: data.mensaje || '',
      data: data.data
    };
  }

  async obtenerResumenMensual(): Promise<ApiResponse<{ resumen: ResumenMensualAhorro[] }>> {
    const userId = this.obtenerUserId();
    const response = await fetch(`${this.baseUrl}/resumen-mensual?userId=${encodeURIComponent(userId)}`);
    const data = await this.leerJson(response);

    return {
      ok: response.ok,
      mensaje: data.mensaje || '',
      data: {
        resumen: (data.data?.resumen || []).map((item: any) => ({
          mes: item.mes || '',
          anio: Number(item.anio || 0),
          etiqueta: item.etiqueta || '',
          total: Number(item.total || 0)
        }))
      }
    };
  }
}
