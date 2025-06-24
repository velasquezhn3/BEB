import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function Placeholder({ title }) {
  return (
    <div className="p-6 text-gray-700 text-xl">
      {title} - Próximamente…
    </div>
  );
}

export default function Dashboard({ user, onLogout }) {
  const institutionName = "Institución Educativa";

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header institutionName={institutionName} username={user.username} />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="alumno" replace />} />
            <Route path="alumno" element={<Placeholder title="Alumno" />} />
            <Route path="padre" element={<Placeholder title="Padre" />} />
            <Route path="docente" element={<Placeholder title="Docente" />} />
            <Route path="administracion" element={<Placeholder title="Administración" />} />
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
