/**
 * Excepción lanzada cuando los datos de una entidad de dominio no cumplen
 * con las reglas de negocio establecidas.
 * 
 * Justificación de diseño: Separar errores de validación de negocio de errores
 * de infraestructura permite al nivel superior (UI / Casos de uso) reaccionar
 * adecuadamente sin acoplarse a detalles técnicos.
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
