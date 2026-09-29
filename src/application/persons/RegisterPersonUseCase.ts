import { Person } from '../../domain/persons/Person';
import type { IPersonRepository } from '../../domain/persons/IPersonRepository';
import { ValidationError } from '../../domain/errors/ValidationError';

export interface RegisterPersonInputDto {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  phone: string;
}

export interface RegisterPersonOutputDto {
  id: string;
  fullName: string;
  identificationNumber: string;
  phone: string;
  createdAt: string;
}

/**
 * Caso de uso: Registrar Persona.
 * 
 * Regla de negocio:
 * No pueden existir dos personas registradas con el mismo número de identificación.
 */
export class RegisterPersonUseCase {
  private readonly personRepository: IPersonRepository;

  constructor(personRepository: IPersonRepository) {
    this.personRepository = personRepository;
  }

  async execute(dto: RegisterPersonInputDto): Promise<RegisterPersonOutputDto> {
    const existingPerson = await this.personRepository.findByIdentification(dto.identificationNumber.trim());
    if (existingPerson) {
      throw new ValidationError(`Ya existe una persona registrada con la identificación: ${dto.identificationNumber}`);
    }

    const newPerson = new Person({
      firstName: dto.firstName,
      lastName: dto.lastName,
      identificationNumber: dto.identificationNumber,
      phone: dto.phone,
    });

    await this.personRepository.save(newPerson);

    return {
      id: newPerson.id,
      fullName: newPerson.fullName,
      identificationNumber: newPerson.identificationNumber,
      phone: newPerson.phone,
      createdAt: newPerson.createdAt.toISOString(),
    };
  }
}
