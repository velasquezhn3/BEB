import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaDollarSign, FaBullhorn, FaFileAlt, FaUsers, FaCogs, FaLifeRing, FaClipboardList } from 'react-icons/fa';
/* */
const menuItems = [
  { name: 'Dashboard', path: 'dashboard', icon: <FaTachometerAlt /> },
  { name: 'Whatsapp', path: 'whatsapp/Coneccion', icon: <FaDollarSign /> },
  { name: 'Seguimiento de Pagos', path: 'payments/payment-tracker', icon: <FaDollarSign /> },
 /* { name: 'Alertas de Deudas', path: 'payments/debt-alerts', icon: <FaDollarSign /> },
  { name: 'Mensajes Masivos', path: 'broadcasts/broadcast-sender', icon: <FaBullhorn /> },
  { name: 'Plantillas', path: 'broadcasts/templates-manager', icon: <FaFileAlt /> },
  { name: 'Solicitudes de Certificados', path: 'certificates/requests-list', icon: <FaClipboardList /> },
  { name: 'Generador de Certificados', path: 'certificates/generator', icon: <FaFileAlt /> },
  { name: 'Gestión de Grupos', path: 'groups/group-manager', icon: <FaUsers /> },
  { name: 'CRUD de Usuarios', path: 'groups/user-crud', icon: <FaUsers /> },
  { name: 'Configuración Institucional', path: 'institutional/config-editor', icon: <FaCogs /> },
  { name: 'Sistema de Tickets', path: 'support/ticket-system', icon: <FaLifeRing /> },
  { name: 'Base de Conocimiento', path: 'support/knowledge-base', icon: <FaLifeRing /> },
  { name: 'Visor de Auditoría', path: 'audit/log-viewer', icon: <FaClipboardList /> },*/
];

export default function Sidebar() {
  return (
    <nav className="bg-primary text-white w-64 min-h-screen flex flex-col overflow-auto">
      <ul className="flex flex-col mt-6 space-y-2">
        {menuItems.map(({ name, path, icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 hover:bg-secondary transition ${
                  isActive ? 'bg-secondary font-semibold' : ''
                }`
              }
            >
              <span className="text-lg mr-3">{icon}</span>
              <span>{name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
