import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderAutenticado } from '../../Portal/HeaderAutenticado/HeaderAutenticado';
import { MetasAhorroService } from '../../../servicios/metas-ahorro.service';

interface MetaAhorro {
  titulo: string;
  objetivo: number;
  actual: number;
  fechaLimite: string;
}

interface AhorroMensual {
  mes: string;
  anio: number;
  etiqueta: string;
  total: number;
}

@Component({
  selector: 'app-metas-ahorro',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderAutenticado],
  templateUrl: './MetasAhorro.html',
  styleUrl: './MetasAhorro.css'
})
export class MetasAhorroComponent implements OnInit {
  metas: MetaAhorro[] = [];
  ahorroMensual: AhorroMensual[] = [];
  mostrarFormulario = false;

  nuevaMetaData: MetaAhorro = {
    titulo: '',
    objetivo: 0,
    actual: 0,
    fechaLimite: ''
  };

  constructor(private metasAhorroService: MetasAhorroService) {}

  ngOnInit(): void {
    this.cargarMetas();
    this.cargarAhorroMensual();
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.resetFormulario();
  }

  guardarMeta(): void {
    if (
      !this.nuevaMetaData.titulo.trim() ||
      this.nuevaMetaData.objetivo <= 0 ||
      !this.nuevaMetaData.fechaLimite
    ) {
      alert('Completa titulo, objetivo y fecha limite');
      return;
    }

    this.metas.push({
      titulo: this.nuevaMetaData.titulo.trim(),
      objetivo: Number(this.nuevaMetaData.objetivo),
      actual: Number(this.nuevaMetaData.actual || 0),
      fechaLimite: this.nuevaMetaData.fechaLimite
    });

    this.mostrarFormulario = false;
    this.resetFormulario();
  }

  eliminarMeta(index: number): void {
    this.metas.splice(index, 1);
  }

  resetFormulario(): void {
    this.nuevaMetaData = {
      titulo: '',
      objetivo: 0,
      actual: 0,
      fechaLimite: ''
    };
  }

  cargarMetas(): void {
    this.metasAhorroService.obtenerAhorroTotal().subscribe({
      next: (totalAhorrado) => {
        if (this.metas.length === 0) {
          this.metas = [
            {
              titulo: 'Meta principal',
              objetivo: 3000,
              actual: totalAhorrado,
              fechaLimite: '2026-12-31'
            }
          ];
        }
      },
      error: (error) => {
        console.error('Error cargando metas:', error);
      }
    });
  }

  cargarAhorroMensual(): void {
    this.metasAhorroService.obtenerPlantillasParaResumen().subscribe({
      next: (plantillas: any[]) => {
        const mesesMap = new Map<string, AhorroMensual>();

        plantillas.forEach((plantilla: any) => {
          const fechaBase = plantilla.createdAt ? new Date(plantilla.createdAt) : new Date();

          const mes = fechaBase.toLocaleDateString('es-ES', { month: 'long' });
          const anio = fechaBase.getFullYear();
          const clave = `${anio}-${String(fechaBase.getMonth() + 1).padStart(2, '0')}`;

          let totalMes = 0;

          plantilla.blocks?.forEach((block: any) => {
            block.campos?.forEach((campo: any) => {
              const importe = Number(campo.importe || 0);

              if (campo.tipo === 'ingreso') totalMes += importe;
              if (campo.tipo === 'gasto') totalMes -= importe;
            });
          });

          const existente = mesesMap.get(clave);

          if (existente) {
            existente.total += totalMes;
          } else {
            mesesMap.set(clave, {
              mes,
              anio,
              etiqueta: `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${anio}`,
              total: totalMes
            });
          }
        });

        this.ahorroMensual = Array.from(mesesMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([, valor]) => valor);
      },
      error: (error) => {
        console.error('Error cargando ahorro mensual:', error);
      }
    });
  }

  calcularProgreso(meta: MetaAhorro): number {
    if (!meta.objetivo || meta.objetivo <= 0) return 0;
    return Math.min(Math.round((meta.actual / meta.objetivo) * 100), 100);
  }
}
