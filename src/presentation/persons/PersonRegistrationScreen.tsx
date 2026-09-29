import React, { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/container';
import { Person } from '../../domain/persons/Person';

export const PersonRegistrationScreen: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [persons, setPersons] = useState<Person[]>([]);

  const loadPersistedPersons = async () => {
    try {
      const persistedPersons = await container.personRepository.findAll();
      setPersons(persistedPersons);
    } catch (err) {
      console.error('Error al cargar personas desde SQLite:', err);
    }
  };

  useEffect(() => {
    loadPersistedPersons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      await container.registerPersonUseCase.execute({
        firstName,
        lastName,
        identificationNumber,
        phone,
      });

      setFeedback({
        type: 'success',
        message: '¡Persona registrada y persistida exitosamente en SQLite!',
      });

      // Limpiar formulario
      setFirstName('');
      setLastName('');
      setIdentificationNumber('');
      setPhone('');

      await loadPersistedPersons();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al registrar persona.';
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
          <span className="badge">Módulo 3</span>
          <h2>Registro de Personas</h2>
          <p className="subtitle">Persistencia transaccional en tabla SQLite <code>persons</code></p>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-group">
          <div className="field">
            <label htmlFor="person-firstname">Nombres</label>
            <input
              id="person-firstname"
              type="text"
              placeholder="Ej. Juan José"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="field">
            <label htmlFor="person-lastname">Apellidos</label>
            <input
              id="person-lastname"
              type="text"
              placeholder="Ej. Horta Vanegas"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="field">
            <label htmlFor="person-idnumber">Número de Identificación (C.C. / T.I.)</label>
            <input
              id="person-idnumber"
              type="text"
              placeholder="Ej. 1075250000"
              value={identificationNumber}
              onChange={(e) => setIdentificationNumber(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="field">
            <label htmlFor="person-phone">Teléfono de Contacto</label>
            <input
              id="person-phone"
              type="tel"
              placeholder="Ej. 3151234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Guardando en SQLite...' : 'Registrar Persona'}
          </button>
        </form>

        <div className="records-summary">
          <h3>Personas persistidas en SQLite ({persons.length})</h3>
          {persons.length === 0 ? (
            <p className="empty-hint">Aún no hay personas en la base de datos.</p>
          ) : (
            <ul className="records-list">
              {persons.map((p) => (
                <li key={p.id} className="record-item">
                  <strong>{p.fullName}</strong>
                  <span className="record-meta">
                    C.C. {p.identificationNumber} | Tel: {p.phone}
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
