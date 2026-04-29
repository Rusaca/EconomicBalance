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
  telefono: string = '';
  prefijoTelefono: string = '+34';
  password: string = '';
  confirmPassword: string = '';
  mensajeError: string = '';

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  constructor(
    private authApiService: AuthApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  async ngOnInit(): Promise<void> { }

  async ngAfterViewInit(): Promise<void> {
    const video = this.videoElement.nativeElement;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.load();
    video.oncanplay = () => video.play().catch(() => { });

    await this.loadGoogleScript();

    window.google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleRegister(response)
    });
  }
  mostrarPrefijos: boolean = false;

  seleccionarPrefijo(prefijo: string): void {
    this.prefijoTelefono = prefijo;
    this.mostrarPrefijos = false;
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  async register() {
    this.mensajeError = '';

    if (
      !this.nombre ||
      !this.apellidos ||
      !this.correo ||
      !this.telefono ||
      !this.prefijoTelefono ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.mensajeError = 'Faltan campos obligatorios';
      return;
    }

    if (!this.correo.includes('@')) {
      this.mensajeError = 'El correo debe contener @';
      return;
    }

    if (!/^[0-9\s()-]{7,20}$/.test(this.telefono.trim())) {
      this.mensajeError = 'Introduce un numero de telefono valido';
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
      nombre: this.nombre.trim(),
      apellidos: this.apellidos.trim(),
      correo: this.correo.trim(),
      telefono: this.telefono.trim(),
      prefijoTelefono: this.prefijoTelefono,
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

  async registroGoogle() {
    this.mensajeError = '';

    try {
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Error con Google:', error);
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

      this.ngZone.run(() => {
        if (!respuesta || !respuesta.ok) {
          this.mensajeError = respuesta?.mensaje || 'No se pudo registrar con Google';
          this.cdr.detectChanges();
          return;
        }

        alert('Correo de activacion enviado');
        this.router.navigate(['/login']);
        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('ERROR REGISTER GOOGLE:', error);

      this.ngZone.run(() => {
        this.mensajeError = 'Error conectando con Google';
        this.cdr.detectChanges();
      });
    }
  }
}
