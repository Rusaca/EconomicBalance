import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderAutenticado } from '../../Portal/HeaderAutenticado/HeaderAutenticado';
import { ChatApiService } from '../../../servicios/chat-api.service';

interface SoporteAccion {
  titulo: string;
  descripcion: string;
  icono: string;
  tipo: string;
}

interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderAutenticado],
  templateUrl: './soporte.html',
  styleUrl: './soporte.css'
})
export class SoporteComponent {
  accionesRapidas: SoporteAccion[] = [
    {
      titulo: 'Ayuda con plantillas',
      descripcion: 'Resuelve dudas sobre creacion, edicion y uso de tus plantillas financieras.',
      icono: '📄',
      tipo: 'plantillas'
    },
    {
      titulo: 'Asistencia con calendario',
      descripcion: 'Consulta como organizar pagos, ingresos y recordatorios importantes.',
      icono: '📅',
      tipo: 'calendario'
    },
    {
      titulo: 'Problemas de acceso',
      descripcion: 'Recupera acceso a tu cuenta o revisa incidencias de autenticacion.',
      icono: '🔐',
      tipo: 'acceso'
    },
    {
      titulo: 'Contactar con soporte',
      descripcion: 'Si necesitas ayuda mas personalizada, podras escalar tu consulta facilmente.',
      icono: '💬',
      tipo: 'general'
    }
  ];

  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      pregunta: 'Como creo una nueva plantilla?',
      respuesta: 'Puedes crearla desde la seccion de Plantillas pulsando en "Nueva plantilla" y configurando la estructura que necesites.'
    },
    {
      pregunta: 'Como anado eventos al calendario?',
      respuesta: 'Desde el calendario podras registrar movimientos, recordatorios y fechas clave para tener una vision mensual mas clara.'
    },
    {
      pregunta: 'Que hago si no puedo iniciar sesion?',
      respuesta: 'Revisa tus credenciales y, si el problema continua, utiliza la seccion de soporte para recuperar el acceso.'
    },
    {
      pregunta: 'Puedo recibir ayuda personalizada?',
      respuesta: 'Si. Esta pagina esta preparada para incorporar un asistente virtual y tambien opciones de contacto directo.'
    }
  ];

  messages: ChatMessage[] = [
    {
      text: 'Hola, soy el asistente de EconomicBalance. ¿En que puedo ayudarte?',
      sender: 'bot'
    }
  ];

  userMessage = '';
  loading = false;

  constructor(
    private chatApi: ChatApiService,
    private router: Router
  ) {}

  async sendMessage(): Promise<void> {
    const message = this.userMessage.trim();

    if (!message) return;

    this.messages.push({ text: message, sender: 'user' });
    this.userMessage = '';
    this.loading = true;

    try {
      const response = await this.chatApi.enviarMensaje(message);
      this.messages.push({ text: response.reply, sender: 'bot' });
    } catch (error) {
      console.error('Error enviando mensaje al chatbot:', error);
      this.messages.push({
        text: 'Hubo un error al contactar con el chatbot.',
        sender: 'bot'
      });
    } finally {
      this.loading = false;
    }
  }

  irAAyuda(tipo: string): void {
    this.router.navigate(['/ayuda'], {
      queryParams: { tipo }
    });
  }
}
