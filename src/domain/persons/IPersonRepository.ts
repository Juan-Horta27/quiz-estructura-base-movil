import { Person } from './Person';

/**
 * Contrato de repositorio para la entidad Person.
 */
export interface IPersonRepository {
  save(person: Person): Promise<void>;
  findAll(): Promise<Person[]>;
  findByIdentification(identificationNumber: string): Promise<Person | null>;
}
