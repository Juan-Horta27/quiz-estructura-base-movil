import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterProductUseCase } from '../../application/products/RegisterProductUseCase';
import type { IProductRepository } from '../../domain/products/IProductRepository';
import { Product } from '../../domain/products/Product';
import { ValidationError } from '../../domain/errors/ValidationError';

class InMemoryProductRepository implements IProductRepository {
  private products: Product[] = [];

  async save(product: Product): Promise<void> {
    this.products.push(product);
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.products.find((p) => p.sku.toUpperCase() === sku.toUpperCase()) ?? null;
  }
}

describe('RegisterProductUseCase', () => {
  let repository: IProductRepository;
  let useCase: RegisterProductUseCase;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    useCase = new RegisterProductUseCase(repository);
  });

  it('debe registrar un producto exitosamente', async () => {
    const result = await useCase.execute({
      name: 'Guitarra Acústica',
      price: 850000,
      sku: 'GTR-ACU-01',
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe('Guitarra Acústica');
    expect(result.price).toBe(850000);
    expect(result.sku).toBe('GTR-ACU-01');

    const products = await repository.findAll();
    expect(products).toHaveLength(1);
  });

  it('debe lanzar ValidationError si el SKU está duplicado', async () => {
    await useCase.execute({
      name: 'Producto A',
      price: 10000,
      sku: 'SKU-001',
    });

    await expect(
      useCase.execute({
        name: 'Producto B',
        price: 20000,
        sku: 'SKU-001',
      })
    ).rejects.toThrow(ValidationError);
  });
});
