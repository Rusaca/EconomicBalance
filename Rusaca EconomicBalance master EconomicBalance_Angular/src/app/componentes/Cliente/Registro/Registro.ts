import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './Registro.html',
  styleUrl: './Registro.css',
})
export class Registro {
  private authService = inject(AuthService);
  
  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  password: string = '';
  confirmPassword: string = '';

  register() {
    // Validación de contraseñas
    if (this.password !== this.confirmPassword) {
      console.error('❌ Las contraseñas no coinciden');
      return;
    }

    // Enviar datos al servicio
    this.authService.register({
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      password: this.password
    });
    
    // TODO: Cuando conectemos el backend, navegar según la respuesta
    // this.router.navigate(['/inicio']);
  }
}