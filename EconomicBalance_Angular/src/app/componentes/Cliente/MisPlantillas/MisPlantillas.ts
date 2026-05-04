import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplatesService } from '../../../services/templates-service';
import { Plantilla } from '../../../modelos/template.intetrfaces';
import { HeaderAutenticado } from '../../Portal/HeaderAutenticado/HeaderAutenticado';

type PlantillaDashboard = Plantilla & {
  _id?: string;
};

@Component({
  selector: 'app-mis-plantillas',
  standalone: true,
  imports: [CommonModule, HeaderAutenticado],
  templateUrl: './MisPlantillas.html',
  styleUrl: './MisPlantillas.css'
})
export class MisPlantillas implements OnInit {
  plantillas: PlantillaDashboard[] = [];
  cargandoPlantillas = false;

  constructor(
    private router: Router,
    private templateService: TemplatesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('MisPlantillas cargado');

    if (!this.sesionIniciada) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarPlantillas();
  }

  get sesionIniciada(): boolean {
    return !!localStorage.getItem('usuario') && !!localStorage.getItem('token');
  }

  nuevaPlantilla(): void {
    this.router.navigate(['/templates/nueva']);
  }

  abrirPlantilla(plantilla: PlantillaDashboard): void {
    const id = plantilla.id || plantilla._id;

    if (!id) {
      console.error('No se puede abrir la plantilla porque no tiene id:', plantilla);
      return;
    }

    this.router.navigate(['/templates', id]);
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  private cargarPlantillas(): void {
    console.log('Entrando en cargarPlantillas');
    this.cargandoPlantillas = true;
    this.cdr.detectChanges();

    this.templateService.getMisPlantillas().subscribe({
      next: (respuesta) => {
        console.log('RESPUESTA COMPLETA:', respuesta);

        const plantillas = Array.isArray(respuesta?.data) ? respuesta.data : [];

        this.plantillas = plantillas.map((plantilla: any) => ({
          ...plantilla,
          id: plantilla.id || plantilla._id || ''
        }));

        this.cargandoPlantillas = false;

        console.log('Plantillas cargadas:', this.plantillas);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando plantillas:', error);
        this.plantillas = [];
        this.cargandoPlantillas = false;
        this.cdr.detectChanges();
      }
    });
  }
}
