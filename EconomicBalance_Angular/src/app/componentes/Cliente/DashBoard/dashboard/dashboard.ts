import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TemplatesService } from '../../../../services/templates-service';
import { Plantilla } from '../../../../modelos/template.intetrfaces';

type PlantillaDashboard = Plantilla & {
  _id?: string;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  nombreUsuario = '';
  plantillas: PlantillaDashboard[] = [];
  cargandoPlantillas = false;

  constructor(
    private router: Router,
    private templateService: TemplatesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Dashboard cargado');

    if (!this.sesionIniciada) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarNombreUsuario();
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

  private cargarNombreUsuario(): void {
    const usuarioRaw = localStorage.getItem('usuario');

    if (!usuarioRaw || usuarioRaw === 'undefined') {
      this.nombreUsuario = '';
      return;
    }

    try {
      const usuario = JSON.parse(usuarioRaw);
      this.nombreUsuario = usuario?.nombre ?? '';
    } catch {
      this.nombreUsuario = '';
    }
  }
}
