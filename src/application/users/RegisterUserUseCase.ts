import { User } from '../../domain/users/User';
import type { IUserRepository } from '../../domain/users/IUserRepository';
import { ValidationError } from '../../domain/errors/ValidationError';

export interface RegisterUserInputDto {
  username: string;
  email: string;
  password: string;
}

export interface RegisterUserOutputDto {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

/**
 * Caso de uso: Registrar Usuario.
 * 
 * Principios Clean Code aplicados:
 * - SRP: Su única razón de cambio es la regla de negocio para dar de alta usuarios.
 * - DIP: Depende de la interfaz IUserRepository, nunca de la base de datos concreta.
 * - Funciones pequeñas y de propósito único.
 */
export class RegisterUserUseCase {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(dto: RegisterUserInputDto): Promise<RegisterUserOutputDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email.trim());
    if (existingUser) {
      throw new ValidationError(`Ya existe un usuario registrado con el correo: ${dto.email}`);
    }

    const newUser = new User({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });

    await this.userRepository.save(newUser);

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt.toISOString(),
    };
  }
}
