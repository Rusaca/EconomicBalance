import {
  Component,
  AfterViewInit,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../../servicios/auth-api.service';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    google?: any;
  }
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './Registro.html',
  styleUrl: './Registro.css',
})
export class Registro implements OnInit, AfterViewInit {
  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  password: string = '';
  confirmPassword: string = '';
  mensajeError: string = '';

  private googleInicializado = false;

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  constructor(
    private authApiService: AuthApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  async ngOnInit(): Promise<void> {
    await this.inicializarGoogleRegistro(false);
  }

  ngAfterViewInit(): void {
    const video = this.videoElement.nativeElement;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.load();

    video.oncanplay = () => {
      video.play().catch((error) => {
        console.log('Video autoplay failed:', error);
      });
    };
  }

  async register() {
    this.mensajeError = '';

    if (!this.nombre || !this.apellidos || !this.correo || !this.password || !this.confirmPassword) {
      this.mensajeError = 'Faltan campos obligatorios';
      return;
    }

    if (!this.correo.includes('@')) {
      this.mensajeError = 'El correo debe contener @';
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(this.password)) {
      this.mensajeError = 'La contrasena debe tener 6 caracteres o mas, una mayuscula y un numero';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.mensajeError = 'Las contrasenas no coinciden';
      return;
    }

    const payload = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      password: this.password
    };

    try {
      const respuesta = await this.authApiService.registrarUsuario(payload);

      this.ngZone.run(() => {
        if (!respuesta?.ok) {
          this.mensajeError = respuesta?.mensaje || 'No se pudo registrar el usuario';
          this.cdr.detectChanges();
          return;
        }

        this.mensajeError = '';
        alert('Correo de activacion enviado');
        this.router.navigate(['/login']);
        this.cdr.detectChanges();
      });
    } catch (error: any) {
      this.ngZone.run(() => {
        if (error?.status === 409) {
          this.mensajeError = 'Correo ya usado';
        } else {
          this.mensajeError = 'Error conectando con el servidor';
        }
        this.cdr.detectChanges();
      });
    }
  }

  async loginGoogle() {
    this.mensajeError = '';

    const listo = await this.inicializarGoogleRegistro(true);
    if (!listo) {
      return;
    }

    try {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification?.isNotDisplayed?.()) {
          console.warn('Google prompt no mostrado:', notification.getNotDisplayedReason?.());
        }
        if (notification?.isSkippedMoment?.()) {
          console.warn('Google prompt omitido:', notification.getSkippedReason?.());
        }
        if (notification?.isDismissedMoment?.()) {
          console.warn('Google prompt cerrado:', notification.getDismissedReason?.());
        }
      });
    } catch (error) {
      console.error('Error abriendo Google prompt:', error);
      this.mensajeError = 'No se pudo iniciar registro con Google';
      this.cdr.detectChanges();
    }
  }

  async handleGoogleRegister(response: any) {
    try {
      const googleToken = response?.credential;

      if (!googleToken) {
        this.mensajeError = 'No se pudo obtener el token de Google';
        this.cdr.detectChanges();
        return;
      }

      const respuesta = await this.authApiService.registerGoogle({ token: googleToken });
      console.log('RESPUESTA REGISTER GOOGLE:', respuesta);

      this.ngZone.run(() => {
        if (!respuesta?.ok) {
          this.mensajeError = respuesta?.mensaje || 'No se pudo registrar con Google';
          this.cdr.detectChanges();
          return;
        }

        alert('Correo de activacion enviado');
        this.router.navigate(['/login']);
        this.cdr.detectChanges();
      });
    } catch (error: any) {
      this.ngZone.run(() => {
        this.mensajeError = 'Error al registrarse con Google';
        this.cdr.detectChanges();
      });
    }
  }

  private async inicializarGoogleRegistro(mostrarError: boolean): Promise<boolean> {
    if (this.googleInicializado) {
      return true;
    }

    if (!environment.googleClientId) {
      if (mostrarError) {
        this.mensajeError = 'Falta configurar el Client ID de Google';
        this.cdr.detectChanges();
      }
      return false;
    }

    if (!window.google?.accounts?.id) {
      if (mostrarError) {
        this.mensajeError = 'Google no esta disponible en este momento';
        this.cdr.detectChanges();
      }
      return false;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (credentialResponse: any) => this.handleGoogleRegister(credentialResponse)
      });

      this.googleInicializado = true;
      return true;
    } catch (error) {
      console.error('Error inicializando Google en registro:', error);

      if (mostrarError) {
        this.mensajeError = 'No se pudo iniciar registro con Google';
        this.cdr.detectChanges();
      }

      return false;
    }
  }
}
