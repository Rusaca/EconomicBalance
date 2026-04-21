import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthFormService } from '../../../servicios/auth-form.service';
import { AuthApiService } from '../../../servicios/auth-api.service';

declare const google: any; // ← AÑADIDO

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './Login.html',
  styleUrl: './Login.css',
})
export class Login  {   // ← AÑADIDO implements OnInit, AfterViewInit

  correo: string = '';
  password: string = '';
  remember: boolean = false;

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

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

      if (!respuesta.ok) {
        alert(respuesta.mensaje);
        return;
      }

      if (!respuesta.data || !respuesta.data.token || !respuesta.data.usuario) {
        alert('El login no devolvió token o usuario correctamente');
        return;
      }

      localStorage.setItem('token', respuesta.data.token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario));

      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error conectando con el servidor');
    }
  }

  // ← MODIFICADO: ahora abre el popup de Google
  loginGoogle() {
    console.log('login google');
  }

  loginApple() {
    console.log('login apple');
  }
}

