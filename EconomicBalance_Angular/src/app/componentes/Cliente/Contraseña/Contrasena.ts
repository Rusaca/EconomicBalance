import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthApiService } from '../../../servicios/auth-api.service';

@Component({
  selector: 'app-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './Contrasena.html',
  styleUrl: './Contrasena.css'
})
export class Contrasena {
  correo: string = '';
  mensaje: string = '';
  mensajeError: string = '';

  constructor(
    private authApiService: AuthApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  limpiarMensajes() {
    this.mensaje = '';
    this.mensajeError = '';
  }

  async recuperarPassword() {
    this.mensaje = '';
    this.mensajeError = '';

    console.log('BOTON PULSADO');
    console.log('CORREO:', this.correo);

    if (!this.correo) {
      this.mensajeError = 'Indica el correo para la recuperación de la cuenta';
      this.cdr.detectChanges();
      return;
    }

    try {
      const respuesta = await this.authApiService.recuperarPassword({
        correo: this.correo
      });

      console.log('RESPUESTA BACKEND:', respuesta);

      this.ngZone.run(() => {
        if (respuesta?.ok) {
          this.mensaje = 'Correo enviado correctamente';
        } else {
          this.mensajeError = respuesta?.mensaje || 'Error al enviar el correo';
        }

        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('ERROR FRONT RECUPERAR PASSWORD:', error);

      this.ngZone.run(() => {
        this.mensajeError = 'Error al enviar el correo';
        this.cdr.detectChanges();
      });
    }
  }
}


