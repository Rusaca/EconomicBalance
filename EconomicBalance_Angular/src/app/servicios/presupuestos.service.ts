import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresupuestosService {

  private apiUrl = 'http://localhost:3000/api/plantillas';

  constructor(private http: HttpClient) {}

  obtenerPlantillas(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${userId}`);
  }
}
