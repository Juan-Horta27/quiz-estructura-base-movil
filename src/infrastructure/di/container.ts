import { SQLiteUserRepository } from '../database/sqlite/SQLiteUserRepository';
import { SQLiteProductRepository } from '../database/sqlite/SQLiteProductRepository';
import { SQLitePersonRepository } from '../database/sqlite/SQLitePersonRepository';
import { RegisterUserUseCase } from '../../application/users/RegisterUserUseCase';
import { RegisterProductUseCase } from '../../application/products/RegisterProductUseCase';
import { RegisterPersonUseCase } from '../../application/persons/RegisterPersonUseCase';

/**
 * Contenedor de Inversión de Control / Fábrica de Dependencias.
 * 
 * Principio SOLID aplicado: Principio de Inversión de Dependencias (DIP).
 * Centraliza la creación e inyección de dependencias para que la capa
 * de presentación no esté acoplada a la creación concreta de repositorios.
 */
class DependencyContainer {
  private static instance: DependencyContainer;

  readonly userRepository: SQLiteUserRepository;
  readonly productRepository: SQLiteProductRepository;
  readonly personRepository: SQLitePersonRepository;

  readonly registerUserUseCase: RegisterUserUseCase;
  readonly registerProductUseCase: RegisterProductUseCase;
  readonly registerPersonUseCase: RegisterPersonUseCase;

  private constructor() {
    this.userRepository = new SQLiteUserRepository();
    this.productRepository = new SQLiteProductRepository();
    this.personRepository = new SQLitePersonRepository();

    this.registerUserUseCase = new RegisterUserUseCase(this.userRepository);
    this.registerProductUseCase = new RegisterProductUseCase(this.productRepository);
    this.registerPersonUseCase = new RegisterPersonUseCase(this.personRepository);
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }
}

export const container = DependencyContainer.getInstance();
