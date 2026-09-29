import { ValidationError } from '../errors/ValidationError';

export interface PersonProps {
  id?: string;
  firstName: string;
  lastName: string;
  identificationNumber: string;
  phone: string;
  createdAt?: Date;
}

/**
 * Entidad de dominio que representa a una Persona.
 * 
 * Regla de negocio:
 * - Nombres y apellidos obligatorios con longitud mínima.
 * - Número de identificación obligatorio.
 * - Teléfono de contacto con formato válido numérico.
 */
export class Person {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly identificationNumber: string;
  readonly phone: string;
  readonly createdAt: Date;

  constructor(props: PersonProps) {
    this.validate(props);
    this.id = props.id ?? crypto.randomUUID();
    this.firstName = props.firstName.trim();
    this.lastName = props.lastName.trim();
    this.identificationNumber = props.identificationNumber.trim();
    this.phone = props.phone.trim();
    this.createdAt = props.createdAt ?? new Date();
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  private validate(props: PersonProps): void {
    if (!props.firstName || props.firstName.trim().length < 2) {
      throw new ValidationError('El nombre debe contener al menos 2 caracteres.');
    }

    if (!props.lastName || props.lastName.trim().length < 2) {
      throw new ValidationError('El apellido debe contener al menos 2 caracteres.');
    }

    if (!props.identificationNumber || props.identificationNumber.trim().length < 4) {
      throw new ValidationError('El número de identificación debe contener al menos 4 caracteres.');
    }

    const phoneRegex = /^[0-9+\-\s]{7,15}$/;
    if (!props.phone || !phoneRegex.test(props.phone.trim())) {
      throw new ValidationError('El número de teléfono debe contener entre 7 y 15 dígitos válidos.');
    }
  }
}
