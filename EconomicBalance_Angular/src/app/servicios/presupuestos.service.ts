import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresupuestosService {
  private apiUrl = 'http://localhost:3000/api/plantillas';

  constructor(private http: HttpClient) {}

  obtenerPlantillas(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get(`${this.apiUrl}/mis-plantillas`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }
}
