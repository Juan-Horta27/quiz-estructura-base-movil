import type { IPersonRepository } from '../../../domain/persons/IPersonRepository';
import { Person } from '../../../domain/persons/Person';
import { SQLiteConnection } from './SQLiteConnection';

/**
 * Implementación de persistencia para Person utilizando SQLite.
 */
export class SQLitePersonRepository implements IPersonRepository {
  private readonly connection: SQLiteConnection;

  constructor(connection: SQLiteConnection = SQLiteConnection.getInstance()) {
    this.connection = connection;
  }

  async save(person: Person): Promise<void> {
    const db = await this.connection.getDatabase();

    db.run(
      `INSERT INTO persons (id, first_name, last_name, identification_number, phone, created_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        person.id,
        person.firstName,
        person.lastName,
        person.identificationNumber,
        person.phone,
        person.createdAt.toISOString(),
      ]
    );

    this.connection.savePersistedState();
  }

  async findAll(): Promise<Person[]> {
    const db = await this.connection.getDatabase();
    const result = db.exec(
      'SELECT id, first_name, last_name, identification_number, phone, created_at FROM persons ORDER BY created_at DESC;'
    );

    if (result.length === 0 || !result[0].values) {
      return [];
    }

    return result[0].values.map((row) => {
      return new Person({
        id: row[0] as string,
        firstName: row[1] as string,
        lastName: row[2] as string,
        identificationNumber: row[3] as string,
        phone: row[4] as string,
        createdAt: new Date(row[5] as string),
      });
    });
  }

  async findByIdentification(identificationNumber: string): Promise<Person | null> {
    const db = await this.connection.getDatabase();
    const stmt = db.prepare(
      'SELECT id, first_name, last_name, identification_number, phone, created_at FROM persons WHERE identification_number = ? LIMIT 1;'
    );
    stmt.bind([identificationNumber.trim()]);

    if (stmt.step()) {
      const row = stmt.get();
      stmt.free();
      return new Person({
        id: row[0] as string,
        firstName: row[1] as string,
        lastName: row[2] as string,
        identificationNumber: row[3] as string,
        phone: row[4] as string,
        createdAt: new Date(row[5] as string),
      });
    }

    stmt.free();
    return null;
  }
}
