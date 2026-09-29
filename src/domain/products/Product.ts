import { ValidationError } from '../errors/ValidationError';

export interface ProductProps {
  id?: string;
  name: string;
  price: number;
  sku: string;
  createdAt?: Date;
}

/**
 * Entidad de dominio que representa a un Producto.
 * 
 * Regla de negocio:
 * - El nombre no puede estar en blanco.
 * - El precio no puede ser negativo (precio >= 0).
 * - El SKU debe ser un código no vacío identificador de inventario.
 */
export class Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly sku: string;
  readonly createdAt: Date;

  constructor(props: ProductProps) {
    this.validate(props);
    this.id = props.id ?? crypto.randomUUID();
    this.name = props.name.trim();
    this.price = Number(props.price);
    this.sku = props.sku.trim().toUpperCase();
    this.createdAt = props.createdAt ?? new Date();
  }

  private validate(props: ProductProps): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new ValidationError('El nombre del producto no puede estar vacío.');
    }

    if (props.price === undefined || props.price === null || Number.isNaN(Number(props.price)) || Number(props.price) < 0) {
      throw new ValidationError(`El precio no puede ser negativo ni inválido (recibido: ${props.price}).`);
    }

    if (!props.sku || props.sku.trim().length === 0) {
      throw new ValidationError('El código SKU del producto no puede estar vacío.');
    }
  }
}
