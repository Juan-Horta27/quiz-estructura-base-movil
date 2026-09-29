import type { IProductRepository } from '../../../domain/products/IProductRepository';
import { Product } from '../../../domain/products/Product';
import { SQLiteConnection } from './SQLiteConnection';

/**
 * Implementación de persistencia para Product utilizando SQLite.
 */
export class SQLiteProductRepository implements IProductRepository {
  private readonly connection: SQLiteConnection;

  constructor(connection: SQLiteConnection = SQLiteConnection.getInstance()) {
    this.connection = connection;
  }

  async save(product: Product): Promise<void> {
    const db = await this.connection.getDatabase();

    db.run(
      `INSERT INTO products (id, name, price, sku, created_at)
       VALUES (?, ?, ?, ?, ?);`,
      [product.id, product.name, product.price, product.sku, product.createdAt.toISOString()]
    );

    this.connection.savePersistedState();
  }

  async findAll(): Promise<Product[]> {
    const db = await this.connection.getDatabase();
    const result = db.exec('SELECT id, name, price, sku, created_at FROM products ORDER BY created_at DESC;');

    if (result.length === 0 || !result[0].values) {
      return [];
    }

    return result[0].values.map((row) => {
      return new Product({
        id: row[0] as string,
        name: row[1] as string,
        price: Number(row[2]),
        sku: row[3] as string,
        createdAt: new Date(row[4] as string),
      });
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    const db = await this.connection.getDatabase();
    const stmt = db.prepare('SELECT id, name, price, sku, created_at FROM products WHERE sku = ? LIMIT 1;');
    stmt.bind([sku.toUpperCase().trim()]);

    if (stmt.step()) {
      const row = stmt.get();
      stmt.free();
      return new Product({
        id: row[0] as string,
        name: row[1] as string,
        price: Number(row[2]),
        sku: row[3] as string,
        createdAt: new Date(row[4] as string),
      });
    }

    stmt.free();
    return null;
  }
}
