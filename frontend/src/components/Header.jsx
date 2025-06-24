import React from 'react';

export default function Header({ institutionName, username }) {
  return (
    <header className="flex items-center justify-between bg-primary text-white px-6 py-4 shadow-md">
      <h1 className="text-xl font-bold">{institutionName}</h1>
      <div className="flex items-center space-x-3">
        <span className="font-semibold">Usuario:</span>
        <span>{username}</span>
      </div>
    </header>
  );
}
