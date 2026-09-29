import React, { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/container';
import { Product } from '../../domain/products/Product';

export const ProductRegistrationScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [sku, setSku] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const loadPersistedProducts = async () => {
    try {
      const persistedProducts = await container.productRepository.findAll();
      setProducts(persistedProducts);
    } catch (err) {
      console.error('Error al cargar productos desde SQLite:', err);
    }
  };

  useEffect(() => {
    loadPersistedProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      await container.registerProductUseCase.execute({
        name,
        price: parseFloat(price),
        sku,
      });

      setFeedback({
        type: 'success',
        message: '¡Producto registrado y persistido exitosamente en SQLite!',
      });

      // Limpiar formulario
      setName('');
      setPrice('');
      setSku('');

      await loadPersistedProducts();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al registrar producto.';
      setFeedback({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="card">
        <div className="card-header">
          <span className="badge">Módulo 2</span>
          <h2>Registro de Productos</h2>
          <p className="subtitle">Persistencia transaccional en tabla SQLite <code>products</code></p>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-group">
          <div className="field">
            <label htmlFor="product-name">Nombre del Producto</label>
            <input
              id="product-name"
              type="text"
              placeholder="Ej. Guitarra Acústica"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="field">
            <label htmlFor="product-price">Precio Unitario (COP)</label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="any"
              placeholder="Ej. 850000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="field">
            <label htmlFor="product-sku">Código SKU / Referencia</label>
            <input
              id="product-sku"
              type="text"
              placeholder="Ej. GTR-ACU-01"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Guardando en SQLite...' : 'Registrar Producto'}
          </button>
        </form>

        <div className="records-summary">
          <h3>Productos persistidos en SQLite ({products.length})</h3>
          {products.length === 0 ? (
            <p className="empty-hint">Aún no hay productos en la base de datos.</p>
          ) : (
            <ul className="records-list">
              {products.map((p) => (
                <li key={p.id} className="record-item">
                  <strong>{p.name}</strong>
                  <span className="record-meta">
                    SKU: {p.sku} | ${p.price.toLocaleString('es-CO')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
