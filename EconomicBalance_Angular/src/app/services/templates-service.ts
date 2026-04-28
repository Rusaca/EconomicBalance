import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Plantilla } from '../modelos/template.intetrfaces';

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private apiUrl = 'http://localhost:3000/api/plantillas';

  constructor(private http: HttpClient) {}

  createTemplate(
    nombre: string,
    blocks: Plantilla['blocks'] = [],
    graficas: Plantilla['graficas'] = []
  ): Observable<{ ok: boolean; mensaje: string; data: Plantilla }> {
    return this.http.post<{ ok: boolean; mensaje: string; data: Plantilla }>(this.apiUrl, {
      nombre,
      blocks,
      graficas
    });
  }

  getById(id: string): Observable<{ ok: boolean; mensaje: string; data: Plantilla }> {
    return this.http.get<{ ok: boolean; mensaje: string; data: Plantilla }>(
      `${this.apiUrl}/${id}`
    );
  }

  updateTemplate(
    id: string,
    plantilla: Plantilla
  ): Observable<{ ok: boolean; mensaje: string; data: Plantilla }> {
    return this.http.put<{ ok: boolean; mensaje: string; data: Plantilla }>(
      `${this.apiUrl}/${id}`,
      {
        nombre: plantilla.nombre,
        blocks: plantilla.blocks,
        graficas: plantilla.graficas || []
      }
    );
  }

  getMisPlantillas(): Observable<{ ok: boolean; mensaje: string; data: Plantilla[] }> {
    return this.http.get<{ ok: boolean; mensaje: string; data: Plantilla[] }>(
      `${this.apiUrl}/mis-plantillas`
    );
  }
}
