import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TemplatesService } from '../../../services/templates-service'; // <-- nombre real

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {

  constructor(
    private router: Router,
    private templateService: TemplatesService // <-- inyecta la clase real
  ) {}

  crearPlantilla() {
    console.log('Fufas????')
    const plantilla = this.templateService.createBlank(); // <-- función del servicio
    this.router.navigate(['/templates', plantilla.id]);
  }
}