import type { IUserRepository } from '../../../domain/users/IUserRepository';
import { User } from '../../../domain/users/User';
import { SQLiteConnection } from './SQLiteConnection';

/**
 * Implementación de persistencia para User utilizando SQLite.
 * 
 * Cumple con el Principio de Sustitución de Liskov (LSP) y
 * Segregación de Interfaces (ISP).
 */
export class SQLiteUserRepository implements IUserRepository {
  private readonly connection: SQLiteConnection;

  constructor(connection: SQLiteConnection = SQLiteConnection.getInstance()) {
    this.connection = connection;
  }

  async save(user: User): Promise<void> {
    const db = await this.connection.getDatabase();
    
    db.run(
      `INSERT INTO users (id, username, email, password, created_at)
       VALUES (?, ?, ?, ?, ?);`,
      [user.id, user.username, user.email, user.password, user.createdAt.toISOString()]
    );

    this.connection.savePersistedState();
  }

  async findAll(): Promise<User[]> {
    const db = await this.connection.getDatabase();
    const result = db.exec('SELECT id, username, email, password, created_at FROM users ORDER BY created_at DESC;');

    if (result.length === 0 || !result[0].values) {
      return [];
    }

    return result[0].values.map((row) => {
      return new User({
        id: row[0] as string,
        username: row[1] as string,
        email: row[2] as string,
        password: row[3] as string,
        createdAt: new Date(row[4] as string),
      });
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = await this.connection.getDatabase();
    const stmt = db.prepare('SELECT id, username, email, password, created_at FROM users WHERE email = ? LIMIT 1;');
    stmt.bind([email.toLowerCase().trim()]);

    if (stmt.step()) {
      const row = stmt.get();
      stmt.free();
      return new User({
        id: row[0] as string,
        username: row[1] as string,
        email: row[2] as string,
        password: row[3] as string,
        createdAt: new Date(row[4] as string),
      });
    }

    stmt.free();
    return null;
  }
}
