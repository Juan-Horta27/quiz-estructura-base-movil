import { ValidationError } from '../errors/ValidationError';

export interface UserProps {
  id?: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
}

/**
 * Entidad de dominio que representa a un Usuario del sistema.
 * 
 * Cumple con el principio de Inmutabilidad y Encapsulación:
 * Los atributos se validan en el constructor para asegurar que un objeto
 * inválido nunca exista en el sistema.
 */
export class User {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly createdAt: Date;

  constructor(props: UserProps) {
    this.validate(props);
    this.id = props.id ?? crypto.randomUUID();
    this.username = props.username.trim();
    this.email = props.email.trim().toLowerCase();
    this.password = props.password;
    this.createdAt = props.createdAt ?? new Date();
  }

  private validate(props: UserProps): void {
    if (!props.username || props.username.trim().length < 3) {
      throw new ValidationError('El nombre de usuario debe contener al menos 3 caracteres.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!props.email || !emailRegex.test(props.email.trim())) {
      throw new ValidationError('El correo electrónico no tiene un formato válido.');
    }

    if (!props.password || props.password.length < 6) {
      throw new ValidationError('La contraseña debe tener una longitud mínima de 6 caracteres.');
    }
  }
}
