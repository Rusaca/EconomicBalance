export interface ILoginFormData {
  correo: string;
  password: string;
  remember: boolean;
}

export interface IRegistroFormData {
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
  confirmPassword: string;
}

// Payloads pensados para enviar al backend cuando exista endpoint.
export interface ILoginPayload {
  correo: string;
  password: string;
  remember: boolean;
}

export interface IRegistroPayload {
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
}
