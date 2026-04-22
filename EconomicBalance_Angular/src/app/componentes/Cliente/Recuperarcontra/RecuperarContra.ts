import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../../servicios/auth-api.service';

@Component({
  selector: 'app-recuperar-contra',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './RecuperarContra.html',
  styleUrl: './RecuperarContra.css'
})
export class RecuperarContra implements OnInit {
  token: string = '';
  nuevaPassword: string = '';
  confirmarPassword: string = '';
  mensaje: string = '';
  mensajeError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authApiService: AuthApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.mensajeError = 'Token inválido o no proporcionado';
      this.cdr.detectChanges();
    }
  }

  limpiarMensajes() {
    this.mensaje = '';
    this.mensajeError = '';
  }

  async cambiarPassword() {
    this.mensaje = '';
    this.mensajeError = '';

    if (!this.token) {
      this.mensajeError = 'Token inválido o expirado';
      return;
    }

    if (!this.nuevaPassword || !this.confirmarPassword) {
      this.mensajeError = 'Debes completar ambos campos';
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(this.nuevaPassword)) {
      this.mensajeError = 'La contraseña debe tener 6 caracteres o más, una mayúscula y un número';
      return;
    }

    if (this.nuevaPassword !== this.confirmarPassword) {
      this.mensajeError = 'Las contraseñas no coinciden';
      return;
    }

    try {
      const respuesta = await this.authApiService.restablecerPassword({
        token: this.token,
        password: this.nuevaPassword
      });

      this.ngZone.run(() => {
        if (!respuesta?.ok) {
          this.mensajeError = respuesta?.mensaje || 'No se pudo cambiar la contraseña';
          this.cdr.detectChanges();
          return;
        }

        this.mensaje = 'Contraseña cambiada correctamente';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);

        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('ERROR FRONT RESTABLECER PASSWORD:', error);

      this.ngZone.run(() => {
        this.mensajeError = 'Error conectando con el servidor';
        this.cdr.detectChanges();
      });
    }
  }
}
