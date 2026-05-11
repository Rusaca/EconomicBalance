export interface IMetaAhorro {
  id?: string;
  userId: string;
  titulo: string;
  objetivo: number;
  actual: number;
  fechaLimite: string;
  createdAt?: Date;
  updatedAt?: Date;
}
