import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeaderAutenticado } from '../../Portal/HeaderAutenticado/HeaderAutenticado';
import { SoporteApiService } from '../../../servicios/soporte-api.service';

interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderAutenticado],
  templateUrl: './ayuda.html',
  styleUrl: './ayuda.css'
})
export class AyudaComponent implements OnInit {
  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      pregunta: 'Como puedo crear una plantilla nueva?',
      respuesta: 'Desde la seccion de plantillas puedes crear una nueva y personalizarla segun tus necesidades.'
    },
    {
      pregunta: 'Que hago si no puedo iniciar sesion?',
      respuesta: 'Comprueba tus credenciales o utiliza la recuperacion de contrasena si lo necesitas.'
    },
    {
      pregunta: 'Como contacto con soporte?',
      respuesta: 'Rellena el formulario de esta pagina y la consulta se enviara al correo de soporte de Economic Balance.'
    }
  ];

  formulario = {
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  };

  enviandoSoporte = false;
  mensajeSoporte = '';
  tokenGenerado = '';
  mostrarConfirmacion = false;

  constructor(
    private soporteApi: SoporteApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tipo = params['tipo'];

      if (tipo === 'sobre-nosotros') {
        this.formulario.asunto = 'Consulta sobre nosotros';
      } else if (tipo === 'servicios') {
        this.formulario.asunto = 'Consulta sobre servicios';
      } else if (tipo === 'contacto') {
        this.formulario.asunto = 'Consulta de contacto';
      } else if (tipo === 'soporte') {
        this.formulario.asunto = 'Solicitud de soporte';
      } else if (tipo === 'plantillas') {
        this.formulario.asunto = 'Ayuda con plantillas';
      } else if (tipo === 'calendario') {
        this.formulario.asunto = 'Asistencia con calendario';
      } else if (tipo === 'acceso') {
        this.formulario.asunto = 'Problemas de acceso';
      } else if (tipo === 'general') {
        this.formulario.asunto = 'Consulta general';
      }
    });
  }

 async enviarSoporte(): Promise<void> {
  if (this.enviandoSoporte) return;

  this.enviandoSoporte = true;
  this.mensajeSoporte = '';
  this.tokenGenerado = '';

  try {
    const res = await this.soporteApi.enviarSolicitud(this.formulario);

    this.mensajeSoporte = res.mensaje;

    if (res.ok) {
      this.tokenGenerado = res.data?.token || '';

      this.mostrarConfirmacion = true;

      setTimeout(() => {
        this.mostrarConfirmacion = false;
      }, 4000);

      this.formulario = {
        nombre: '',
        correo: '',
        asunto: '',
        mensaje: ''
      };
    }
  } catch (error) {
    console.error('Error enviando soporte:', error);
    this.mensajeSoporte = 'Hubo un error al enviar la solicitud.';
  } finally {
    this.enviandoSoporte = false;
  }
}
}
