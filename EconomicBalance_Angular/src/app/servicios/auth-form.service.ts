import { Injectable } from '@angular/core';
import {
  ILoginFormData,
  ILoginPayload,
  IRegistroFormData,
  IRegistroPayload,
} from '../modelos/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthFormService {
  private ultimoLogin: ILoginPayload | null = null;
  private ultimoRegistro: IRegistroPayload | null = null;

  collectLoginData(data: ILoginFormData): ILoginPayload {
    const payload: ILoginPayload = {
      email: data.email.trim(),
      password: data.password,
      remember: data.remember,
    };

    this.ultimoLogin = payload;
    return payload;
  }

  collectRegistroData(data: IRegistroFormData): IRegistroPayload {
    const payload: IRegistroPayload = {
      nombre: data.nombre.trim(),
      apellidos: data.apellidos.trim(),
      correo: data.correo.trim().toLowerCase(),
      password: data.password,
    };

    this.ultimoRegistro = payload;
    return payload;
  }

  getUltimoLogin(): ILoginPayload | null {
    return this.ultimoLogin;
  }

  getUltimoRegistro(): IRegistroPayload | null {
    return this.ultimoRegistro;
  }

  clearDatosAuth(): void {
    this.ultimoLogin = null;
    this.ultimoRegistro = null;
  }
}
