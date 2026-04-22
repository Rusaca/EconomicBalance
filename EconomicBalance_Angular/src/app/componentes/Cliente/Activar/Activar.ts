import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../../servicios/auth-api.service';

@Component({
  selector: 'app-activar',
  standalone: true,
  templateUrl: './Activar.html',
  styleUrls: ['./Activar.css'],
  imports: [CommonModule]
})
export class Activar implements OnInit {
  estado: 'loading' | 'ok' | 'error' = 'loading';
  mensaje: string = 'Activando cuenta...';

  constructor(
    private route: ActivatedRoute,
    private authApiService: AuthApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.estado = 'error';
      this.mensaje = 'Token inválido';
      this.cdr.detectChanges();
      return;
    }

    try {
      const res = await this.authApiService.activarCuenta(token);
      console.log('RESPUESTA RECIBIDA DESDE EL SERVICIO:', res);

      this.ngZone.run(() => {
        if (res?.ok) {
          this.estado = 'ok';
          this.mensaje = res?.mensaje || 'Cuenta activada correctamente';
        } else {
          this.estado = 'error';
          this.mensaje = res?.mensaje || 'No se pudo activar la cuenta';
        }

        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('Error al activar la cuenta:', error);

      this.ngZone.run(() => {
        this.estado = 'error';
        this.mensaje = 'Error al activar la cuenta';
        this.cdr.detectChanges();
      });
    }
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  cerrarVentana(): void {
    window.close();
  }
}
