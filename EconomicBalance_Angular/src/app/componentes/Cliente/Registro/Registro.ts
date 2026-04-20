import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../../servicios/auth-api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './Registro.html',
  styleUrl: './Registro.css',
})
export class Registro {

  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authApiService: AuthApiService,
    private router: Router
  ) {}

  async register() {

    // 🔴 VALIDACIÓN FRONTEND
    if (!this.nombre || !this.apellidos || !this.correo || !this.password) {
      alert('Faltan campos obligatorios');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const payload = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      password: this.password
    };

    console.log('Payload registro:', payload);

    try {

      const respuesta = await this.authApiService.registrarUsuario(payload);

      console.log('Respuesta backend:', respuesta);

      if (!respuesta.ok) {
        alert(respuesta.mensaje);
        return;
      }

      alert('Usuario registrado correctamente. Revisa tu correo 📩');

      // 🔄 LIMPIAR FORMULARIO
      this.nombre = '';
      this.apellidos = '';
      this.correo = '';
      this.password = '';
      this.confirmPassword = '';

      // 🔁 IR A LOGIN
      this.router.navigate(['/login']);

    } catch (error) {
      console.error('Error en registro:', error);
      alert('Error conectando con el servidor');
    }
  }

  loginGoogle() {
    console.log("Login con Google desde registro");
  }
}