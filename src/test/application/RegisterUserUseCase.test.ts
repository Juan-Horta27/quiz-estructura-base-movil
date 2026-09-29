import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUserUseCase } from '../../application/users/RegisterUserUseCase';
import type { IUserRepository } from '../../domain/users/IUserRepository';
import { User } from '../../domain/users/User';
import { ValidationError } from '../../domain/errors/ValidationError';

/**
 * Repositorio en memoria para pruebas unitarias.
 * Demuestra el Principio de Sustitución de Liskov (LSP) y DIP.
 */
class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }
}

describe('RegisterUserUseCase', () => {
  let repository: IUserRepository;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new RegisterUserUseCase(repository);
  });

  it('debe registrar un usuario exitosamente en el repositorio', async () => {
    const result = await useCase.execute({
      username: 'carlos_perez',
      email: 'carlos@empresa.com',
      password: 'password123',
    });

    expect(result.id).toBeDefined();
    expect(result.username).toBe('carlos_perez');
    expect(result.email).toBe('carlos@empresa.com');

    const users = await repository.findAll();
    expect(users).toHaveLength(1);
  });

  it('debe lanzar ValidationError si el correo electrónico ya está registrado', async () => {
    await useCase.execute({
      username: 'usuario1',
      email: 'duplicado@correo.com',
      password: 'password123',
    });

    await expect(
      useCase.execute({
        username: 'usuario2',
        email: 'duplicado@correo.com',
        password: 'password456',
      })
    ).rejects.toThrow(ValidationError);
  });
});
