import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderAutenticado } from '../../Portal/HeaderAutenticado/HeaderAutenticado';
import { SoporteApiService } from '../../../servicios/soporte-api.service';
import { RouterModule } from '@angular/router';
import { TranslateService } from '../../../servicios/translate.service';
interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderAutenticado,
    RouterModule
  ],
  templateUrl: './ayuda.html',
  styleUrl: './ayuda.css'
})
export class AyudaComponent {
  formulario = {
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  };

  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      pregunta: 'Que informacion debo incluir en mi consulta?',
      respuesta: 'Describe el problema con el mayor detalle posible para que el equipo pueda ayudarte mas rapido.'
    },
    {
      pregunta: 'Recibire un identificador de solicitud?',
      respuesta: 'Si, al enviar el formulario se generara un token de soporte para que puedas identificar tu consulta.'
    },
    {
      pregunta: 'Cuanto tarda en responder soporte?',
      respuesta: 'El tiempo de respuesta puede variar, pero tu solicitud se enviara directamente al correo de soporte.'
    }
  ];

  enviandoSoporte = false;
  mensajeSoporte = '';
  tokenGenerado = '';
  mostrarConfirmacion = false;

  constructor(
    private soporteApi: SoporteApiService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService
  ) { }

  async enviarSoporte(): Promise<void> {
    if (this.enviandoSoporte) {
      return;
    }

    this.enviandoSoporte = true;
    this.mensajeSoporte = '';
    this.tokenGenerado = '';
    this.mostrarConfirmacion = false;
    this.cdr.detectChanges();

    try {
      const response = await this.soporteApi.enviarSolicitud(this.formulario);

      if (!response.ok) {
        throw new Error(response.mensaje || 'No se pudo enviar la solicitud');
      }

      this.mensajeSoporte = response.mensaje || 'Tu solicitud se ha enviado correctamente.';
      this.tokenGenerado = response.data?.token ?? '';
      this.mostrarConfirmacion = true;

      this.formulario = {
        nombre: '',
        correo: '',
        asunto: '',
        mensaje: ''
      };

      this.cdr.detectChanges();

      setTimeout(() => {
        this.mostrarConfirmacion = false;
        this.cdr.detectChanges();
      }, 2500);
    } catch (error) {
      console.error('Error al enviar la solicitud de soporte:', error);
      this.mensajeSoporte = 'Hubo un error al enviar la solicitud. Intentalo de nuevo.';
      this.cdr.detectChanges();
    } finally {
      this.enviandoSoporte = false;
      this.cdr.detectChanges();
    }
  }
}
