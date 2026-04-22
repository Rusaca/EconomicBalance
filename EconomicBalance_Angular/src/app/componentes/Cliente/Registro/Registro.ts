import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../../servicios/auth-api.service';
import { environment } from '../../../environments/environment';

declare const google: any;

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

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  constructor(
    private authApiService: AuthApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleRegister(response)
    });
  }

  ngAfterViewInit(): void {
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
      this.mensajeError = 'La contraseña debe tener 6 caracteres o más, una mayúscula y un número';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.mensajeError = 'Las contraseñas no coinciden';
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
        alert('Correo de activacion enviado 📧');
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

  loginGoogle() {
    this.mensajeError = '';
    google.accounts.id.prompt();
  }

async handleGoogleRegister(response: any) {
  try {
    const googleToken = response.credential;
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

}
