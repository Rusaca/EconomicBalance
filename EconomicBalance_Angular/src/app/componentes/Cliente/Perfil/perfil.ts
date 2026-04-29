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

  async onSeleccionarFoto(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (!input.files || !input.files.length) {
      return;
    }

    const archivo = input.files[0];

    if (!archivo.type.startsWith('image/')) {
      this.errorPerfil = 'Selecciona una imagen valida.';
      return;
    }

    try {
      const respuesta = await this.authApiService.subirFoto(archivo);

      if (!respuesta?.ok) {
        this.errorPerfil = respuesta?.mensaje || 'No se pudo subir la foto.';
        return;
      }

      this.perfil.fotoPerfil = `http://localhost:3000${respuesta.data.fotoPerfil}`;
    } catch (error) {
      console.error('Error subiendo foto:', error);
      this.errorPerfil = 'Error al subir la foto.';
    }
  }

  eliminarFoto(): void {
    this.perfil.fotoPerfil = '';
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }
}

