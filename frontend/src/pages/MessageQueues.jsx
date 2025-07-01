import React, { useEffect, useState, useRef } from 'react';
import { FaClock, FaPlay, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const statusConfig = {
  waiting: { label: 'En espera', color: 'bg-yellow-300', icon: <FaClock size={24} /> },
  active: { label: 'Activo', color: 'bg-blue-300', icon: <FaPlay size={24} /> },
  completed: { label: 'Completado', color: 'bg-green-300', icon: <FaCheckCircle size={24} /> },
  failed: { label: 'Fallido', color: 'bg-red-300', icon: <FaTimesCircle size={24} /> },
  delayed: { label: 'Retrasado', color: 'bg-purple-300', icon: <FaHourglassHalf size={24} /> },
};

export default function MessageQueues() {
  const [queueStats, setQueueStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);

  const fetchQueueStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/message-queues');
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas de colas');
      }
      const data = await response.json();
      setQueueStats(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueStats();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchQueueStats, 10000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

  if (loading) return <div>Cargando estadísticas de colas...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Colas de Mensajes</h1>

      {/* Auto-refresh toggle and last update */}
      <div className="flex items-center mb-4 space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={() => setAutoRefresh(!autoRefresh)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Auto-refresh cada 10 segundos</span>
        </label>
        {lastUpdate && (
          <span className="text-gray-600 text-sm">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Cards summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(statusConfig).map(([key, { label, color, icon }]) => (
          <div key={key} className={`flex items-center space-x-4 p-4 rounded shadow ${color}`}>
            <div>{icon}</div>
            <div>
              <div className="text-lg font-semibold">{queueStats[key]}</div>
              <div className="text-sm">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <tr key={key}>
              <td className="py-2 px-4 border-b">{label}</td>
              <td className="py-2 px-4 border-b">{queueStats[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
