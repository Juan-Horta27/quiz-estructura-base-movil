import { describe, it, expect } from 'vitest';
import { Person } from '../../domain/persons/Person';
import { ValidationError } from '../../domain/errors/ValidationError';

describe('Person Domain Entity', () => {
  it('debe crear una persona válida con nombre completo formateado', () => {
    const person = new Person({
      firstName: 'Juan José',
      lastName: 'Horta Vanegas',
      identificationNumber: '1075250000',
      phone: '3151234567',
    });

    expect(person.id).toBeDefined();
    expect(person.fullName).toBe('Juan José Horta Vanegas');
    expect(person.identificationNumber).toBe('1075250000');
  });

  it('debe lanzar ValidationError si el nombre tiene menos de 2 caracteres', () => {
    expect(() => {
      new Person({
        firstName: 'J',
        lastName: 'Horta',
        identificationNumber: '1075250000',
        phone: '3151234567',
      });
    }).toThrow(ValidationError);
  });

  it('debe lanzar ValidationError si el teléfono no es válido', () => {
    expect(() => {
      new Person({
        firstName: 'Juan',
        lastName: 'Horta',
        identificationNumber: '1075250000',
        phone: '123',
      });
    }).toThrow(ValidationError);
  });
});
