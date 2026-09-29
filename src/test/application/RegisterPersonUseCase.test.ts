import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterPersonUseCase } from '../../application/persons/RegisterPersonUseCase';
import type { IPersonRepository } from '../../domain/persons/IPersonRepository';
import { Person } from '../../domain/persons/Person';
import { ValidationError } from '../../domain/errors/ValidationError';

class InMemoryPersonRepository implements IPersonRepository {
  private persons: Person[] = [];

  async save(person: Person): Promise<void> {
    this.persons.push(person);
  }

  async findAll(): Promise<Person[]> {
    return [...this.persons];
  }

  async findByIdentification(identificationNumber: string): Promise<Person | null> {
    return this.persons.find((p) => p.identificationNumber === identificationNumber) ?? null;
  }
}

describe('RegisterPersonUseCase', () => {
  let repository: IPersonRepository;
  let useCase: RegisterPersonUseCase;

  beforeEach(() => {
    repository = new InMemoryPersonRepository();
    useCase = new RegisterPersonUseCase(repository);
  });

  it('debe registrar una persona exitosamente', async () => {
    const result = await useCase.execute({
      firstName: 'Juan José',
      lastName: 'Horta Vanegas',
      identificationNumber: '1075250000',
      phone: '3151234567',
    });

    expect(result.id).toBeDefined();
    expect(result.fullName).toBe('Juan José Horta Vanegas');
    expect(result.identificationNumber).toBe('1075250000');

    const persons = await repository.findAll();
    expect(persons).toHaveLength(1);
  });

  it('debe lanzar ValidationError si el número de identificación está duplicado', async () => {
    await useCase.execute({
      firstName: 'Persona A',
      lastName: 'Gómez',
      identificationNumber: '1075250000',
      phone: '3151234567',
    });

    await expect(
      useCase.execute({
        firstName: 'Persona B',
        lastName: 'Pérez',
        identificationNumber: '1075250000',
        phone: '3109876543',
      })
    ).rejects.toThrow(ValidationError);
  });
});
