import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';

const STORAGE_KEY = 'corhuila_sqlite_db_backup';

/**
 * Gestor de conexión y ciclo de vida de la base de datos SQLite.
 * 
 * Implementa el patrón Singleton para asegurar una única instancia
 * de la base de datos activa en memoria con persistencia en almacenamiento local.
 */
export class SQLiteConnection {
  private static instance: SQLiteConnection | null = null;
  private db: Database | null = null;
  private isInitializing: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): SQLiteConnection {
    if (!SQLiteConnection.instance) {
      SQLiteConnection.instance = new SQLiteConnection();
    }
    return SQLiteConnection.instance;
  }

  public async getDatabase(): Promise<Database> {
    if (this.db) {
      return this.db;
    }

    if (this.isInitializing) {
      await this.isInitializing;
      if (this.db) return this.db;
    }

    this.isInitializing = this.initializeDatabase();
    await this.isInitializing;
    this.isInitializing = null;

    if (!this.db) {
      throw new Error('No se pudo inicializar la base de datos SQLite.');
    }

    return this.db;
  }

  private async initializeDatabase(): Promise<void> {
    const SQL = await initSqlJs({
      locateFile: (file: string) => `/${file}`,
    });

    // Restaurar desde persistencia local si existe
    const savedData = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (savedData) {
      const binaryArray = Uint8Array.from(atob(savedData), (c) => c.charCodeAt(0));
      this.db = new SQL.Database(binaryArray);
    } else {
      this.db = new SQL.Database();
    }

    this.createTablesIfNotExist();
  }

  private createTablesIfNotExist(): void {
    if (!this.db) return;

    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS persons (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        identification_number TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    this.savePersistedState();
  }

  public savePersistedState(): void {
    if (!this.db || typeof window === 'undefined') return;

    try {
      const data = this.db.export();
      let binary = '';
      const len = data.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(data[i]);
      }
      localStorage.setItem(STORAGE_KEY, btoa(binary));
    } catch (error) {
      console.error('Error al persistir la base de datos SQLite:', error);
    }
  }
}
