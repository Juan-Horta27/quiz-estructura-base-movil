import React, { useState } from 'react';
import { UserRegistrationScreen } from './presentation/users/UserRegistrationScreen';
import { ProductRegistrationScreen } from './presentation/products/ProductRegistrationScreen';
import { PersonRegistrationScreen } from './presentation/persons/PersonRegistrationScreen';
import './App.css';

type ActiveTab = 'users' | 'products' | 'persons';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('users');

  return (
    <div className="mobile-shell">
      <header className="app-header">
        <div className="header-meta">
          <span className="institution">CORHUILA · Programación Móvil</span>
          <span className="badge-sqlite">SQLite Engine Activo</span>
        </div>
        <h1 className="app-title">Arquitectura Base</h1>
        <p className="app-description">Separación de responsabilidades: Domain · Application · Infrastructure · Presentation</p>
      </header>

      <nav className="tab-navigation" role="tablist">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👤 Usuarios
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Productos
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'persons' ? 'active' : ''}`}
          onClick={() => setActiveTab('persons')}
        >
          📇 Personas
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'users' && <UserRegistrationScreen />}
        {activeTab === 'products' && <ProductRegistrationScreen />}
        {activeTab === 'persons' && <PersonRegistrationScreen />}
      </main>

      <footer className="app-footer">
        <small>Clean Architecture & Clean Code (SOLID · KISS · DRY · YAGNI)</small>
      </footer>
    </div>
  );
};

export default App;
