import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthFormService } from '../../../servicios/auth-form.service';
import { AuthApiService } from '../../../servicios/auth-api.service';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './Login.html',
  styleUrl: './Login.css',
})
export class Login implements OnInit, AfterViewInit {
  correo: string = '';
  password: string = '';
  remember: boolean = false;
  mensajeError: string = '';

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  constructor(
    private authFormService: AuthFormService,
    private authApiService: AuthApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    console.log('Google Client ID:', environment.googleClientId);

    if (!google?.accounts?.id) {
      this.mensajeError = 'Google no está disponible en este momento';
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleCredential(response)
    });
  }

  ngAfterViewInit() {
    const video = this.videoElement.nativeElement;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.load();

    video.oncanplay = () => {
      video.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    };
  }

  limpiarError() {
    this.mensajeError = '';
  }

  async login() {
    this.mensajeError = '';

    const payload = this.authFormService.collectLoginData({
      correo: this.correo,
      password: this.password,
      remember: this.remember,
    });

    try {
      const respuesta = await this.authApiService.loginUsuario(payload);

      this.ngZone.run(() => {
        if (!respuesta?.ok) {
          this.mensajeError = 'Correo o contraseña incorrectos';
          this.cdr.detectChanges();
          return;
        }

        localStorage.setItem('usuario', JSON.stringify(respuesta.data));
        this.router.navigate(['/']);
        this.cdr.detectChanges();
      });
    } catch (error: any) {
      this.ngZone.run(() => {
        if (error?.status === 401) {
          this.mensajeError = 'Correo o contraseña incorrectos';
        } else {
          this.mensajeError = 'Error conectando con el servidor';
        }
        this.cdr.detectChanges();
      });
    }
  }

  loginGoogle() {
    this.mensajeError = '';

    try {
      google.accounts.id.prompt((notification: any) => {
        console.log('Google prompt notification:', notification);
      });
    } catch (error) {
      console.error('Error abriendo Google prompt:', error);
      this.mensajeError = 'No se pudo iniciar sesión con Google';
    }
  }

  async handleGoogleCredential(response: any) {
    this.mensajeError = '';

    try {
      const googleToken = response.credential;
      console.log('TOKEN GOOGLE:', googleToken);

      const respuesta = await this.authApiService.loginGoogle({ token: googleToken });
      console.log('RESPUESTA BACKEND LOGIN GOOGLE:', respuesta);

      this.ngZone.run(() => {
        if (!respuesta?.ok) {
          this.mensajeError = respuesta?.mensaje || 'No se pudo iniciar sesión con Google';
          this.cdr.detectChanges();
          return;
        }

        localStorage.setItem('usuario', JSON.stringify(respuesta.data));
        this.router.navigate(['/']);
        this.cdr.detectChanges();
      });
    } catch (error: any) {
      console.error('ERROR LOGIN GOOGLE FRONT:', error);

      this.ngZone.run(() => {
        this.mensajeError = 'Error conectando con Google';
        this.cdr.detectChanges();
      });
    }
  }

}
