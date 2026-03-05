import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './Registro.html',
  styleUrl: './Registro.css', // si lo tienes, si no quita esta línea
})
export class Registro {
  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  password: string = '';
  confirmPassword: string = '';

  register() {
    console.log('register', {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
    });
  }
}