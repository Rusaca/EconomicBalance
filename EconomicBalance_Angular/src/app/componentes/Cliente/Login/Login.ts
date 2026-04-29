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
import { AuthApiService } from '../../../servicios/auth-api.service';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    google?: any;
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './Login.html',
  styleUrl: './Login.css',
})
export class Login implements OnInit, AfterViewInit {
  identificador: string = '';
  password: string = '';
  remember: boolean = false;
  mensajeError: string = '';

  googleReady: boolean = false;
  cargandoGoogle: boolean = false;

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  constructor(
    private authApiService: AuthApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    await this.inicializarGoogleAuth(true);
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

    try {
      const respuesta = await this.authApiService.loginUsuario({
        identificador: this.identificador,
        password: this.password,
        remember: this.remember
      });

      this.ngZone.run(() => {
        if (!respuesta?.ok) {
          this.mensajeError = 'Correo, telefono o contrasena incorrectos';
          this.cdr.detectChanges();
          return;
        }

        if (!respuesta.data?.token || !respuesta.data?.usuario) {
          this.mensajeError = 'Respuesta de login incompleta';
          this.cdr.detectChanges();
          return;
        }

        localStorage.setItem('token', respuesta.data.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario));
        this.router.navigate(['/dashboard']);
        this.cdr.detectChanges();
      });
    } catch (error: any) {
      this.ngZone.run(() => {
        if (error?.status === 401) {
          this.mensajeError = 'Correo, telefono o contrasena incorrectos';
        } else {
          this.mensajeError = 'Error conectando con el servidor';
        }
        this.cdr.detectChanges();
      });
    }
  }

  async loginGoogle() {
    this.mensajeError = '';

    try {
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error(error);
      this.mensajeError = 'No se pudo iniciar sesión con Google';
    }
  }

  async handleGoogleCredential(response: any) {
    const googleToken = response?.credential;

    if (!googleToken) {
      this.mensajeError = 'No se pudo obtener el token';
      return;
    }

    try {
      const respuesta = await this.authApiService.loginGoogle({ token: googleToken });

      if (
        !respuesta ||
        !respuesta.ok ||
        !respuesta.data ||
        !respuesta.data.token ||
        !respuesta.data.usuario
      ) {
        this.mensajeError = 'Respuesta inválida del servidor';
        return;
      }

      const token = respuesta.data.token;
      const usuario = respuesta.data.usuario;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });
    } catch (error) {
      console.error('ERROR LOGIN GOOGLE:', error);
      this.mensajeError = 'Error conectando con Google';
    }
  }

  private async inicializarGoogleAuth(mostrarError: boolean): Promise<boolean> {
    if (this.googleReady) {
      return true;
    }

    if (!environment.googleClientId) {
      if (mostrarError) {
        this.mensajeError = 'Falta configurar el Client ID de Google';
        this.cdr.detectChanges();
      }
      return false;
    }

    this.cargandoGoogle = true;
    this.cdr.detectChanges();

    try {
      await this.cargarScriptGoogle();

      if (!window.google?.accounts?.id) {
        throw new Error('Google Identity Services no disponible');
      }

      window.google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (credentialResponse: any) => this.handleGoogleCredential(credentialResponse)
      });

      this.googleReady = true;
      return true;
    } catch (error) {
      console.error('Error inicializando Google Auth:', error);

      if (mostrarError) {
        this.mensajeError = 'Google no esta disponible en este momento';
        this.cdr.detectChanges();
      }

      return false;
    } finally {
      this.cargandoGoogle = false;
      this.cdr.detectChanges();
    }
  }

  private cargarScriptGoogle(): Promise<void> {
    if (window.google?.accounts?.id) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const idScript = 'google-gsi-client';
      const scriptExistente = document.getElementById(idScript) as HTMLScriptElement | null;

      if (scriptExistente) {
        scriptExistente.addEventListener('load', () => resolve(), { once: true });
        scriptExistente.addEventListener('error', () => reject(new Error('No se pudo cargar Google GSI')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = idScript;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar Google GSI'));
      document.head.appendChild(script);
    });
  }
}
