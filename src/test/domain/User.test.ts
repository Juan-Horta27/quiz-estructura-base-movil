import { describe, it, expect } from 'vitest';
import { User } from '../../domain/users/User';
import { ValidationError } from '../../domain/errors/ValidationError';

describe('User Domain Entity', () => {
  it('debe crear un usuario válido con identificador generado', () => {
    const user = new User({
      username: 'juanhorta',
      email: 'juan.horta@corhuila.edu.co',
      password: 'passwordSeguro123',
    });

    expect(user.id).toBeDefined();
    expect(user.username).toBe('juanhorta');
    expect(user.email).toBe('juan.horta@corhuila.edu.co');
  });

  it('debe lanzar ValidationError si el nombre de usuario tiene menos de 3 caracteres', () => {
    expect(() => {
      new User({
        username: 'ab',
        email: 'test@correo.com',
        password: 'password123',
      });
    }).toThrow(ValidationError);
  });

  it('debe lanzar ValidationError si el correo electrónico no tiene formato válido', () => {
    expect(() => {
      new User({
        username: 'juanhorta',
        email: 'correo-invalido',
        password: 'password123',
      });
    }).toThrow(ValidationError);
  });

  it('debe lanzar ValidationError si la contraseña tiene menos de 6 caracteres', () => {
    expect(() => {
      new User({
        username: 'juanhorta',
        email: 'test@correo.com',
        password: '123',
      });
    }).toThrow(ValidationError);
  });
});
