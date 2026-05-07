import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CampoMaestro {
  _id: string;
  nombre: string;
  tipo: 'ingreso' | 'gasto';
  categoria: 'fijo' | 'variable';
  scope: 'system' | 'user';
}

@Injectable({ providedIn: 'root' })
export class CamposMaestrosService {
  private apiUrl = 'http://localhost:3000/api/campos-maestros';

  constructor(private http: HttpClient) {}

  getCampos(): Observable<{ ok: boolean; data: CampoMaestro[]; mensaje?: string }> {
    return this.http.get<{ ok: boolean; data: CampoMaestro[]; mensaje?: string }>(this.apiUrl);
  }

  crearCampo(payload: {
    nombre: string;
    tipo: 'ingreso' | 'gasto';
    categoria: 'fijo' | 'variable';
  }): Observable<{ ok: boolean; data?: CampoMaestro; mensaje?: string }> {
    return this.http.post<{ ok: boolean; data?: CampoMaestro; mensaje?: string }>(this.apiUrl, payload);
  }

  eliminarCampo(id: string): Observable<{ ok: boolean; mensaje?: string }> {
    return this.http.delete<{ ok: boolean; mensaje?: string }>(`${this.apiUrl}/${id}`);
  }
}
