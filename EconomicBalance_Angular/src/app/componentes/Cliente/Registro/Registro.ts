import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthFormService } from '../../../servicios/auth-form.service';
import { AuthApiService } from '../../../servicios/auth-api.service';

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

   constructor(
    private authFormService: AuthFormService,
    private authApiService: AuthApiService,
    private router: Router
  ) {}

 async register() {
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const payload = this.authFormService.collectRegistroData({
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });
    console.log('Payload registro:', payload);
    try {
      const respuesta = await this.authApiService.registrarUsuario(payload);

      console.log('respuesta registro backend:', respuesta);

      if (!respuesta.ok) {
        alert(respuesta.mensaje);
        return;
      }

      alert('Usuario registrado correctamente');

      this.nombre = '';
      this.apellidos = '';
      this.correo = '';
      this.password = '';
      this.confirmPassword = '';

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en registro:', error);
      alert('Error conectando con el servidor');
    }
  }
}