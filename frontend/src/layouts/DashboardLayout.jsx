import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-white rounded shadow p-4 min-h-full">
      {children}
    </div>
  );
}
