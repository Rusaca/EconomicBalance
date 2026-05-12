import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  private obtenerUserId(): string {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario.id || usuario._id || localStorage.getItem('usuarioId') || '';
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

    const data: any = await firstValueFrom(
      this.http.get(`${this.baseUrl}?userId=${encodeURIComponent(userId)}`)
    );

    return {
      ok: data?.ok === true,
      mensaje: data?.mensaje || '',
      data: {
        metas: (data?.data?.metas || []).map((meta: any) => this.normalizarMeta(meta))
      }
    };
  }

  async crearMeta(payload: CrearMetaAhorroPayload): Promise<ApiResponse<{ meta: MetaAhorro }>> {
    const userId = this.obtenerUserId();

    const data: any = await firstValueFrom(
      this.http.post(this.baseUrl, {
        ...payload,
        userId
      })
    );

    return {
      ok: data?.ok === true,
      mensaje: data?.mensaje || '',
      data: data?.data?.meta
        ? { meta: this.normalizarMeta(data.data.meta) }
        : undefined
    };
  }

  async eliminarMeta(id: string): Promise<ApiResponse<null>> {
    const userId = this.obtenerUserId();

    const data: any = await firstValueFrom(
      this.http.delete(`${this.baseUrl}/${id}?userId=${encodeURIComponent(userId)}`)
    );

    return {
      ok: data?.ok === true,
      mensaje: data?.mensaje || '',
      data: data?.data ?? null
    };
  }

  async obtenerResumenMensual(): Promise<ApiResponse<{ resumen: ResumenMensualAhorro[] }>> {
    const userId = this.obtenerUserId();

    const data: any = await firstValueFrom(
      this.http.get(`${this.baseUrl}/resumen-mensual?userId=${encodeURIComponent(userId)}`)
    );

    return {
      ok: data?.ok === true,
      mensaje: data?.mensaje || '',
      data: {
        resumen: (data?.data?.resumen || []).map((item: any) => ({
          mes: item.mes || '',
          anio: Number(item.anio || 0),
          etiqueta: item.etiqueta || '',
          total: Number(item.total || 0)
        }))
      }
    };
  }
  async editarMeta(
  id: string,
  payload: CrearMetaAhorroPayload
): Promise<ApiResponse<{ meta: MetaAhorro }>> {

  const userId = this.obtenerUserId();

  const data: any = await firstValueFrom(
    this.http.put(`${this.baseUrl}/${id}`, {
      ...payload,
      userId
    })
  );

  return {
    ok: data?.ok === true,
    mensaje: data?.mensaje || '',
    data: data?.data?.meta
      ? { meta: this.normalizarMeta(data.data.meta) }
      : undefined
  };
}
}
