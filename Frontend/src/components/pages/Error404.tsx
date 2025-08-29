import React from 'react';

const Error404Page = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[var(--brand-primary)] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            Página no encontrada
          </h2>
          <p className="text-[var(--text-muted)] mb-8">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.history.back()}
            className="w-full btn-secondary"
          >
            Volver atrás
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full btn-primary"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404Page;