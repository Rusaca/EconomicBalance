import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  estado: 'ok' | 'error' = 'error';
  mensaje: string = '';

  constructor(
    private route: ActivatedRoute,
    private authApiService: AuthApiService
  ) {}

  async ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.estado = 'error';
      this.mensaje = 'Token inválido';
      return;
    }

    try {
  const res = await this.authApiService.activarCuenta(token);

  console.log("RESPUESTA RECIBIDA DESDE EL SERVICIO:", res);  // <-- AQUÍ

  if (res.ok) {
    this.estado = 'ok';
    this.mensaje = 'Cuenta activada correctamente';
  } else {
    this.estado = 'error';
    this.mensaje = res.mensaje;
  }


    } catch (error) {
      this.estado = 'error';
      this.mensaje = 'Error al activar la cuenta';
    }
  }

  cerrarVentana() {
    window.close();
  }
}




