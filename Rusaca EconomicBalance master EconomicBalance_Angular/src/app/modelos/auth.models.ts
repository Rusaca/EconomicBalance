// Modelos para autenticación

export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
}

export interface Usuario {
  id?: string;
  nombre: string;
  apellidos: string;
  correo: string;
}
