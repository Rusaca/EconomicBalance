import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthFormService } from '../../../servicios/auth-form.service';
import { AuthApiService } from '../../../servicios/auth-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './Login.html',
  styleUrl: './Login.css',
})
export class Login {
  correo: string = '';
  password: string = '';
  remember: boolean = false;

  constructor(
    private authFormService: AuthFormService,
    private authApiService: AuthApiService,
    private router: Router
  ) {}

  async login() {
    const payload = this.authFormService.collectLoginData({
      correo: this.correo,
      password: this.password,
      remember: this.remember,
    });

    try {
      const respuesta = await this.authApiService.loginUsuario(payload);

      console.log('RESPUESTA LOGIN COMPLETA:', respuesta);
      console.log('respuesta.ok:', respuesta?.ok);
      console.log('respuesta.data:', respuesta?.data);
      console.log('respuesta.data?.token:', respuesta?.data?.token);
      console.log('respuesta.data?.usuario:', respuesta?.data?.usuario);

      if (!respuesta.ok) {
        alert(respuesta.mensaje);
        return;
      }

      if (!respuesta.data || !respuesta.data.token || !respuesta.data.usuario) {
        console.error('La respuesta del login no tiene la estructura esperada:', respuesta);
        alert('El login no devolvió token o usuario correctamente');
        return;
      }

      localStorage.setItem('token', respuesta.data.token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario));

      alert('Login correcto');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error conectando con el servidor');
    }
  }

  loginGoogle() {
    console.log('login google');
  }

  loginApple() {
    console.log('login apple');
  }
}