import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '../../../servicios/translate.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './ajustes.html',
  styleUrl: './ajustes.css',
})
export class AjustesComponent {

  // IDIOMA
  idioma: 'es' | 'en' = 'es';

  // OPCIONES ORIGINALES
  notificacionesEmail = true;
  notificacionesApp = false;
  modoOscuro = false;

  // OPCIONES NUEVAS
  recordatorios = true;
  sincronizacion = true;
  modoCompacto = false;
  autoguardado = true;
  sonidos = true;
  estadisticas = false;

  // PRIVACIDAD (si las mantienes)
  perfilPublico = true;
  verActividad = false;

  mensaje = '';

  constructor(
    private router: Router,
    public translate: TranslateService
  ) {
    // Cargar idioma guardado
    this.idioma = this.translate.lang();
  }

  guardarAjustes() {
    // Guardar idioma global
    this.translate.setLang(this.idioma);

    // Mensaje de confirmación
    this.mensaje = this.translate.t('guardar') + ' ✔';

    setTimeout(() => this.mensaje = '', 3000);
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}
