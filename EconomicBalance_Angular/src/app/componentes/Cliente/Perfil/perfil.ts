import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../../servicios/auth-api.service';

interface PerfilUsuarioForm {
  id: string;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  prefijoTelefono: string;
  fotoPerfil: string;
  genero: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent implements OnInit {
  perfil: PerfilUsuarioForm = {
    id: '',
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    prefijoTelefono: '+34',
    fotoPerfil: '',
    genero: '',
  };

  mensajePerfil: string = '';
  errorPerfil: string = '';
  mostrarPrefijos: boolean = false;
  mostrarModalFoto: boolean = false;
  fotoTemporal: string | null = null;

  zoomFoto: number = 1.2;
  desplazamientoX: number = 0;
  desplazamientoY: number = 0;

  arrastrandoFoto: boolean = false;
  inicioArrastreX: number = 0;
  inicioArrastreY: number = 0;

  constructor(
    private router: Router,
    private authApiService: AuthApiService
  ) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!usuarioGuardado) {
      this.router.navigate(['/login']);
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    this.perfil = {
      id: usuario.id || '',
      nombre: usuario.nombre || '',
      apellidos: usuario.apellidos || '',
      correo: usuario.correo || '',
      telefono: usuario.telefono || '',
      prefijoTelefono: usuario.prefijoTelefono || '+34',
      fotoPerfil: usuario.fotoPerfil || '',
      genero: usuario.genero || '',
    };
  }

  async guardarPerfil(): Promise<void> {
    this.mensajePerfil = '';
    this.errorPerfil = '';

    if (
      !this.perfil.nombre.trim() ||
      !this.perfil.apellidos.trim() ||
      !this.perfil.correo.trim()
    ) {
      this.errorPerfil = 'Completa nombre, apellidos y correo.';
      return;
    }

    if (!this.perfil.correo.includes('@')) {
      this.errorPerfil = 'Introduce un correo valido.';
      return;
    }

    if (
      this.perfil.telefono &&
      !/^[0-9\s()-]{7,20}$/.test(this.perfil.telefono.trim())
    ) {
      this.errorPerfil = 'Introduce un numero de telefono valido.';
      return;
    }

    try {
      const respuesta = await this.authApiService.actualizarPerfil({
        id: this.perfil.id,
        nombre: this.perfil.nombre.trim(),
        apellidos: this.perfil.apellidos.trim(),
        correo: this.perfil.correo.trim(),
        telefono: this.perfil.telefono.trim(),
        prefijoTelefono: this.perfil.prefijoTelefono,
        fotoPerfil: this.perfil.fotoPerfil,
        genero: this.perfil.genero,
      });

      if (!respuesta?.ok) {
        this.errorPerfil = respuesta?.mensaje || 'No se pudo actualizar el perfil.';
        return;
      }

      const usuarioActualizado = respuesta?.data?.usuario;

      if (usuarioActualizado) {
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

        this.perfil = {
          id: usuarioActualizado.id || '',
          nombre: usuarioActualizado.nombre || '',
          apellidos: usuarioActualizado.apellidos || '',
          correo: usuarioActualizado.correo || '',
          telefono: usuarioActualizado.telefono || '',
          prefijoTelefono: usuarioActualizado.prefijoTelefono || '+34',
          fotoPerfil: usuarioActualizado.fotoPerfil || '',
          genero: usuarioActualizado.genero || '',
        };
      }

      this.mensajePerfil = respuesta?.mensaje || 'Perfil actualizado correctamente.';
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      this.errorPerfil = 'Error al actualizar el perfil.';
    }
  }

  seleccionarPrefijo(prefijo: string): void {
    this.perfil.prefijoTelefono = prefijo;
    this.mostrarPrefijos = false;
  }

  procesarArchivoTemporal(archivo: File): void {
    if (!archivo.type.startsWith('image/')) {
      this.errorPerfil = 'Selecciona una imagen valida.';
      return;
    }

    this.errorPerfil = '';
    this.zoomFoto = 1.2;
    this.desplazamientoX = 0;
    this.desplazamientoY = 0;

    const lector = new FileReader();
    lector.onload = () => {
      this.fotoTemporal = lector.result as string;
    };
    lector.readAsDataURL(archivo);
  }

  onSeleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;

    const archivo = input.files[0];
    this.procesarArchivoTemporal(archivo);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer?.files?.length) return;

    const archivo = event.dataTransfer.files[0];
    this.procesarArchivoTemporal(archivo);
  }

  iniciarArrastre(event: MouseEvent): void {
    if (!this.fotoTemporal) return;

    this.arrastrandoFoto = true;
    this.inicioArrastreX = event.clientX - this.desplazamientoX;
    this.inicioArrastreY = event.clientY - this.desplazamientoY;
  }

  moverArrastre(event: MouseEvent): void {
    if (!this.arrastrandoFoto) return;

    this.desplazamientoX = event.clientX - this.inicioArrastreX;
    this.desplazamientoY = event.clientY - this.inicioArrastreY;
  }

  finalizarArrastre(): void {
    this.arrastrandoFoto = false;
  }

  abrirModalFoto(): void {
    this.mostrarModalFoto = true;
    this.errorPerfil = '';
    this.mensajePerfil = '';
  }

  cerrarModalFoto(): void {
    this.mostrarModalFoto = false;
    this.fotoTemporal = null;
    this.zoomFoto = 1.2;
    this.desplazamientoX = 0;
    this.desplazamientoY = 0;
    this.arrastrandoFoto = false;

    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.perfil.fotoPerfil = usuarioGuardado.fotoPerfil || '';
  }

  dataURLtoFile(dataUrl: string, filename: string): Promise<File> {
    return fetch(dataUrl)
      .then(res => res.arrayBuffer())
      .then(buf => new File([buf], filename, { type: 'image/png' }));
  }

  async generarImagenRecortada(): Promise<string | null> {
    if (!this.fotoTemporal) return null;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const size = 400;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.clearRect(0, 0, size, size);

        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const escalaBase = Math.max(size / img.width, size / img.height);
        const escalaFinal = escalaBase * this.zoomFoto;

        const ancho = img.width * escalaFinal;
        const alto = img.height * escalaFinal;

        const x = (size - ancho) / 2 + this.desplazamientoX;
        const y = (size - alto) / 2 + this.desplazamientoY;

        ctx.drawImage(img, x, y, ancho, alto);
        ctx.restore();

        resolve(canvas.toDataURL('image/png'));
      };

      img.src = this.fotoTemporal!;
    });
  }

  async aceptarFoto(): Promise<void> {
    if (!this.fotoTemporal) {
      this.cerrarModalFoto();
      return;
    }

    try {
      const imagenRecortada = await this.generarImagenRecortada();

      if (!imagenRecortada) {
        this.errorPerfil = 'No se pudo preparar la imagen.';
        return;
      }

      const archivo = await this.dataURLtoFile(imagenRecortada, 'fotoPerfil.png');
      const respuesta = await this.authApiService.subirFoto(archivo);

      if (!respuesta?.ok) {
        this.errorPerfil = respuesta?.mensaje || 'No se pudo subir la foto.';
        return;
      }

      this.perfil.fotoPerfil = `http://localhost:3000${respuesta.data.fotoPerfil}`;

      const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
      usuarioGuardado.fotoPerfil = this.perfil.fotoPerfil;
      localStorage.setItem('usuario', JSON.stringify(usuarioGuardado));

      this.mensajePerfil = 'Foto actualizada correctamente.';
    } catch (error) {
      console.error('Error subiendo foto:', error);
      this.errorPerfil = 'Error al subir la foto.';
    }

    this.cerrarModalFoto();
  }

  async eliminarFoto(): Promise<void> {
    try {
      const respuesta = await this.authApiService.eliminarFoto(this.perfil.id);

      if (!respuesta?.ok) {
        this.errorPerfil = respuesta?.mensaje || 'No se pudo eliminar la foto.';
        return;
      }

      this.perfil.fotoPerfil = '';
      this.fotoTemporal = null;

      const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
      usuarioGuardado.fotoPerfil = '';
      localStorage.setItem('usuario', JSON.stringify(usuarioGuardado));

      this.mensajePerfil = 'Foto eliminada correctamente.';
    } catch (error) {
      console.error('Error eliminando foto:', error);
      this.errorPerfil = 'Error al eliminar la foto.';
    }
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }
}
