import React, { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/container';
import { User } from '../../domain/users/User';

export const UserRegistrationScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const loadPersistedUsers = async () => {
    try {
      const persistedUsers = await container.userRepository.findAll();
      setUsers(persistedUsers);
    } catch (err) {
      console.error('Error al cargar usuarios desde SQLite:', err);
    }
  };

  useEffect(() => {
    loadPersistedUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      await container.registerUserUseCase.execute({
        username,
        email,
        password,
      });

      setFeedback({
        type: 'success',
        message: '¡Usuario registrado y persistido exitosamente en SQLite!',
      });

      // Limpiar formulario (KISS)
      setUsername('');
      setEmail('');
      setPassword('');

      await loadPersistedUsers();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al registrar usuario.';
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
          <span className="badge">Módulo 1</span>
          <h2>Registro de Usuarios</h2>
          <p className="subtitle">Persistencia transaccional en tabla SQLite <code>users</code></p>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-group">
          <div className="field">
            <label htmlFor="user-username">Nombre de usuario</label>
            <input
              id="user-username"
              type="text"
              placeholder="Ej. juanhorta"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="field">
            <label htmlFor="user-email">Correo Electrónico</label>
            <input
              id="user-email"
              type="email"
              placeholder="Ej. juan@corhuila.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="field">
            <label htmlFor="user-password">Contraseña</label>
            <input
              id="user-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Guardando en SQLite...' : 'Registrar Usuario'}
          </button>
        </form>

        <div className="records-summary">
          <h3>Usuarios persistidos en SQLite ({users.length})</h3>
          {users.length === 0 ? (
            <p className="empty-hint">Aún no hay usuarios en la base de datos.</p>
          ) : (
            <ul className="records-list">
              {users.map((u) => (
                <li key={u.id} className="record-item">
                  <strong>{u.username}</strong>
                  <span className="record-meta">{u.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
