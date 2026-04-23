export interface IUsuario {
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;

  activo?: boolean;
  tokenActivacion?: string;
  tokenRecuperacion?: string;
  expiracionTokenRecuperacion?: Date;
}
