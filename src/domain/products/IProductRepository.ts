import { Product } from './Product';

/**
 * Contrato de repositorio para la entidad Product.
 */
export interface IProductRepository {
  save(product: Product): Promise<void>;
  findAll(): Promise<Product[]>;
  findBySku(sku: string): Promise<Product | null>;
}
