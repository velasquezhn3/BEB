import React from 'react';

export default function Coneccion() {
  return (
    <div className="p-6 max-w-md mx-auto text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a la conexión de WhatsApp</h1>
      <p className="mb-4">
        Para conectar tu cuenta de WhatsApp, por favor escanea el código QR que aparecerá a continuación con la aplicación de WhatsApp en tu teléfono.
      </p>
      <p className="mb-6">
        Instrucciones:
        <ul className="list-disc list-inside mt-2">
          <li>Abre WhatsApp en tu teléfono.</li>
          <li>Ve a Configuración y selecciona "Dispositivos vinculados".</li>
          <li>Selecciona "Vincular un dispositivo" y escanea el código QR que aparece en esta pantalla.</li>
          <li>Una vez escaneado, tu cuenta se conectará automáticamente.</li>
        </ul>
      </p>
      <div className="border-2 border-dashed border-gray-400 rounded-lg h-64 flex items-center justify-center">
        <span className="text-gray-500">Aquí aparecerá el código QR para escanear</span>
      </div>
    </div>
  );
}
