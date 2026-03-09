import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFormService } from '../../../servicios/auth-form.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './Registro.html',
  styleUrl: './Registro.css', // si lo tienes, si no quita esta línea
})
export class Registro {
  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authFormService: AuthFormService) {}

  register() {
    const payload = this.authFormService.collectRegistroData({
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });

    console.log('payload registro listo para backend', payload);
  }
}