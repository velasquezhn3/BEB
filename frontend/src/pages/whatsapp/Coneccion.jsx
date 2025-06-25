import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Correct import for QR code React component

/**
 * Coneccion.jsx
 * 
 * React component for WhatsApp connection page.
 * Connects to backend WebSocket server to receive QR code in real-time.
 * Renders the QR code dynamically and updates it if regenerated.
 */

const Coneccion = () => {
  const [qrCode, setQrCode] = useState(null); // State to hold QR code string

  useEffect(() => {
    // Create WebSocket connection to backend WebSocket server
    const ws = new WebSocket('ws://localhost:8081');

    // On receiving message, update QR code state
    ws.onmessage = (event) => {
      console.log('Received message from WebSocket:', event.data); // Log received message
      setQrCode(event.data);
    };

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="whatsapp-connection-page" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Bienvenido a la conexión de WhatsApp</h2>
      <p>Para conectar tu cuenta de WhatsApp, por favor escanea el código QR que aparecerá a continuación con la aplicación de WhatsApp en tu teléfono.</p>
      <p><strong>Instrucciones:</strong></p>
      <ul>
        <li>Abre WhatsApp en tu teléfono.</li>
        <li>Ve a Configuración y selecciona "Dispositivos vinculados".</li>
        <li>Selecciona "Vincular un dispositivo" y escanea el código QR que aparece en esta pantalla.</li>
        <li>Una vez escaneado, tu cuenta se conectará automáticamente.</li>
      </ul>
      <button
        onClick={async () => {
          try {
            const response = await fetch('http://localhost:3001/api/logout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
              alert('Sesión cerrada. Por favor escanee el nuevo código QR.');
              setQrCode(null); // Clear current QR code to show placeholder
            } else {
              alert('Error al cerrar sesión: ' + data.message);
            }
          } catch (error) {
            alert('Error al conectar con el servidor: ' + error.message);
          }
        }}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Cerrar sesión y generar nuevo QR
      </button>
      <div style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        height: '280px',
        width: '280px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px',
        marginBottom: '20px'
      }}>
        {qrCode ? (
          <QRCodeCanvas value={qrCode} size={256} />
        ) : (
          <span style={{ color: '#999' }}>Aquí aparecerá el código QR para escanear</span>
        )}
      </div>
      {qrCode && (
        <></>
      )}
    </div>
  );
};

export default Coneccion;
