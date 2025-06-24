import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminLayout from './layouts/AdminLayout';

import Dashboard from './pages/Dashboard';
import PaymentTracker from './pages/Payments/PaymentTracker';
import DebtAlerts from './pages/Payments/DebtAlerts';
import BroadcastSender from './pages/Broadcasts/BroadcastSender';
import TemplatesManager from './pages/Broadcasts/TemplatesManager';
import RequestsList from './pages/Certificates/RequestsList';
import Generator from './pages/Certificates/Generator';
import GroupManager from './pages/Groups/GroupManager';
import UserCRUD from './pages/Groups/UserCRUD';
import ConfigEditor from './pages/Institutional/ConfigEditor';
import TicketSystem from './pages/Support/TicketSystem';
import KnowledgeBase from './pages/Support/KnowledgeBase';
import LogViewer from './pages/Audit/LogViewer';
import Coneccion from './pages/whatsapp/Coneccion';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username, password) => {
    // Validate username and password exactly
    if (username === 'Admin' && password === 'Honduras2025') {
      setUser({ username });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/*"
          element={
            user ? (
              <AdminLayout user={user}>
                <Routes>
                  <Route path="/" element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="payments/payment-tracker" element={<PaymentTracker />} />
                  <Route path="payments/debt-alerts" element={<DebtAlerts />} />
                  <Route path="broadcasts/broadcast-sender" element={<BroadcastSender />} />
                  <Route path="broadcasts/templates-manager" element={<TemplatesManager />} />
                  <Route path="certificates/requests-list" element={<RequestsList />} />
                  <Route path="certificates/generator" element={<Generator />} />
                  <Route path="groups/group-manager" element={<GroupManager />} />
                  <Route path="groups/user-crud" element={<UserCRUD />} />
                  <Route path="institutional/config-editor" element={<ConfigEditor />} />
                  <Route path="support/ticket-system" element={<TicketSystem />} />
                  <Route path="support/knowledge-base" element={<KnowledgeBase />} />
                  <Route path="audit/log-viewer" element={<LogViewer />} />
                  <Route path="whatsapp/coneccion" element={<Coneccion />} />
                  <Route path="*" element={<div>404 - Página no encontrada</div>} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
