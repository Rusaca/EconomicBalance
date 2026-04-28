import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface PerfilUsuarioForm {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
}

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './perfil.html',
    styleUrl: './perfil.css',
})
export class PerfilComponent implements OnInit {
    perfil: PerfilUsuarioForm = {
        id: '',
        nombre: '',
        apellidos: '',
        correo: '',
    };

    passwordActual: string = '';
    passwordNueva: string = '';
    confirmarPasswordNueva: string = '';

    mensajePerfil: string = '';
    errorPerfil: string = '';
    mensajePassword: string = '';
    errorPassword: string = '';

    constructor(private router: Router) { }

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
        };
    }

    guardarPerfil(): void {
        this.mensajePerfil = '';
        this.errorPerfil = '';

        if (!this.perfil.nombre.trim() || !this.perfil.apellidos.trim() || !this.perfil.correo.trim()) {
            this.errorPerfil = 'Completa nombre, apellidos y correo.';
            return;
        }

        if (!this.perfil.correo.includes('@')) {
            this.errorPerfil = 'Introduce un correo valido.';
            return;
        }

        const usuarioGuardado = localStorage.getItem('usuario');
        const usuarioActual = usuarioGuardado ? JSON.parse(usuarioGuardado) : {};

        const usuarioActualizado = {
            ...usuarioActual,
            id: this.perfil.id,
            nombre: this.perfil.nombre.trim(),
            apellidos: this.perfil.apellidos.trim(),
            correo: this.perfil.correo.trim(),
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        this.mensajePerfil = 'Perfil actualizado correctamente.';
    }

    cambiarPassword(): void {
        this.mensajePassword = '';
        this.errorPassword = '';

        if (!this.passwordActual || !this.passwordNueva || !this.confirmarPasswordNueva) {
            this.errorPassword = 'Completa todos los campos de la contrasena.';
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

        if (!passwordRegex.test(this.passwordNueva)) {
            this.errorPassword = 'La nueva contrasena debe tener 6 caracteres o mas, una mayuscula y un numero.';
            return;
        }

        if (this.passwordNueva !== this.confirmarPasswordNueva) {
            this.errorPassword = 'La nueva contrasena y la confirmacion no coinciden.';
            return;
        }

        if (this.passwordActual === this.passwordNueva) {
            this.errorPassword = 'La nueva contrasena debe ser diferente a la actual.';
            return;
        }

        this.passwordActual = '';
        this.passwordNueva = '';
        this.confirmarPasswordNueva = '';
        this.mensajePassword = 'Formulario listo. Luego se conecta al backend para guardar la nueva contrasena.';
    }

    volver() {
        this.router.navigate(['/dashboard']);
    }

}
