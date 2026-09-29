import { Product } from '../../domain/products/Product';
import type { IProductRepository } from '../../domain/products/IProductRepository';
import { ValidationError } from '../../domain/errors/ValidationError';

export interface RegisterProductInputDto {
  name: string;
  price: number;
  sku: string;
}

export interface RegisterProductOutputDto {
  id: string;
  name: string;
  price: number;
  sku: string;
  createdAt: string;
}

/**
 * Caso de uso: Registrar Producto.
 * 
 * Regla de negocio:
 * No pueden existir dos productos con el mismo SKU (Stock Keeping Unit).
 */
export class RegisterProductUseCase {
  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(dto: RegisterProductInputDto): Promise<RegisterProductOutputDto> {
    const existingProduct = await this.productRepository.findBySku(dto.sku.trim().toUpperCase());
    if (existingProduct) {
      throw new ValidationError(`Ya existe un producto registrado con el SKU: ${dto.sku.toUpperCase()}`);
    }

    const newProduct = new Product({
      name: dto.name,
      price: dto.price,
      sku: dto.sku,
    });

    await this.productRepository.save(newProduct);

    return {
      id: newProduct.id,
      name: newProduct.name,
      price: newProduct.price,
      sku: newProduct.sku,
      createdAt: newProduct.createdAt.toISOString(),
    };
  }
}
