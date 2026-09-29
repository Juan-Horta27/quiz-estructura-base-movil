import { User } from './User';

/**
 * Contrato de repositorio para la entidad User.
 * 
 * Principio SOLID aplicado: Principio de Inversión de Dependencias (DIP) y
 * Segregación de Interfaces (ISP). Los casos de uso dependen de este contrato
 * abstracto y no de SQLite directamente.
 */
export interface IUserRepository {
  save(user: User): Promise<void>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
}
