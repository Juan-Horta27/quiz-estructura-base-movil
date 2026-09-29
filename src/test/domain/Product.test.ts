import { describe, it, expect } from 'vitest';
import { Product } from '../../domain/products/Product';
import { ValidationError } from '../../domain/errors/ValidationError';

describe('Product Domain Entity', () => {
  it('debe crear un producto válido correctamente', () => {
    const product = new Product({
      name: 'Guitarra Eléctrica',
      price: 1200000,
      sku: 'GTR-001',
    });

    expect(product.id).toBeDefined();
    expect(product.name).toBe('Guitarra Eléctrica');
    expect(product.price).toBe(1200000);
    expect(product.sku).toBe('GTR-001');
  });

  it('debe permitir productos con precio 0 (regla de negocio vista en el curso)', () => {
    const product = new Product({
      name: 'Partitura Libre',
      price: 0,
      sku: 'FREE-001',
    });

    expect(product.price).toBe(0);
  });

  it('debe lanzar ValidationError si el precio es negativo', () => {
    expect(() => {
      new Product({
        name: 'Baquetas',
        price: -5000,
        sku: 'BAQ-002',
      });
    }).toThrow(ValidationError);
  });

  it('debe lanzar ValidationError si el nombre está vacío', () => {
    expect(() => {
      new Product({
        name: '   ',
        price: 50000,
        sku: 'BAQ-002',
      });
    }).toThrow(ValidationError);
  });
});
