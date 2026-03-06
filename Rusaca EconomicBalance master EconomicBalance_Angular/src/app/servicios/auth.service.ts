import { Injectable } from '@angular/core';
import { LoginData, RegisterData, Usuario } from '../modelos/auth.models';

/**
 * Servicio de autenticación
 * Maneja el login y registro de usuarios
 * Preparado para conectarse al backend en el futuro
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Procesa el login del usuario
   * TODO: Conectar con el backend
   */
  login(loginData: LoginData): void {
    // Validaciones básicas
    if (!loginData.email || !loginData.password) {
      console.error('Email y contraseña son requeridos');
      return;
    }

    // Log de los datos recogidos (para desarrollo)
    console.log('📝 Datos de login recogidos:', {
      email: loginData.email,
      recordar: loginData.remember || false
    });

    // TODO: Aquí se hará la petición al backend
    // Ejemplo futuro:
    // return this.http.post('http://localhost:3000/api/auth/login', loginData);

    // Por ahora, solo guardamos la sesión localmente si marcó "recordar"
    if (loginData.remember) {
      localStorage.setItem('rememberUser', loginData.email);
      console.log('✅ Usuario guardado para recordar sesión');
    }
  }

  /**
   * Procesa el registro del usuario
   * TODO: Conectar con el backend
   */
  register(registerData: RegisterData): void {
    // Validaciones básicas
    if (!registerData.nombre || !registerData.apellidos || 
        !registerData.correo || !registerData.password) {
      console.error('Todos los campos son requeridos');
      return;
    }

    // Log de los datos recogidos (para desarrollo)
    console.log('📝 Datos de registro recogidos:', {
      nombre: registerData.nombre,
      apellidos: registerData.apellidos,
      correo: registerData.correo
    });

    // TODO: Aquí se hará la petición al backend
    // Ejemplo futuro:
    // return this.http.post('http://localhost:3000/api/auth/register', registerData);

    console.log('✅ Datos preparados para enviar al backend');
  }

  /**
   * Login con Google
   * TODO: Implementar OAuth de Google
   */
  loginWithGoogle(): void {
    console.log('🔄 Login con Google - pendiente de implementar');
    // TODO: Implementar flujo OAuth de Google
  }

  /**
   * Login con Apple
   * TODO: Implementar Sign In with Apple
   */
  loginWithApple(): void {
    console.log('🔄 Login con Apple - pendiente de implementar');
    // TODO: Implementar Sign In with Apple
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem('rememberUser');
    console.log('👋 Sesión cerrada');
  }

  /**
   * Obtiene el usuario recordado si existe
   */
  getRememberedUser(): string | null {
    return localStorage.getItem('rememberUser');
  }
}
