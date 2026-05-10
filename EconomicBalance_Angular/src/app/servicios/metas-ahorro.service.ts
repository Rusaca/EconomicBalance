import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PresupuestosService } from './presupuestos.service';

@Injectable({
  providedIn: 'root'
})
export class MetasAhorroService {
  constructor(private presupuestosService: PresupuestosService) {}

  obtenerAhorroTotal(): Observable<number> {
    return this.presupuestosService.obtenerPlantillas().pipe(
      map((respuesta: any) => {
        const plantillas = respuesta?.data || [];
        let total = 0;

        plantillas.forEach((plantilla: any) => {
          plantilla.blocks?.forEach((block: any) => {
            block.campos?.forEach((campo: any) => {
              const importe = Number(campo.importe || 0);

              if (campo.tipo === 'ingreso') total += importe;
              if (campo.tipo === 'gasto') total -= importe;
            });
          });
        });

        return total > 0 ? total : 0;
      })
    );
  }

  obtenerPlantillasParaResumen(): Observable<any[]> {
    return this.presupuestosService.obtenerPlantillas().pipe(
      map((respuesta: any) => respuesta?.data || [])
    );
  }
}
