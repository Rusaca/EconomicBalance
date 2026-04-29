export interface ILoginFormData {
  identificador: string;
  password: string;
  remember: boolean;
}

export interface IRegistroFormData {
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  prefijoTelefono: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginPayload {
  identificador: string;
  password: string;
  remember: boolean;
}

export interface IRegistroPayload {
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  prefijoTelefono: string;
  password: string;
}

