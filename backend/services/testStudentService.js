const fs = require('fs');
const path = require('path');
const { buscarEstudiante, calcularDeuda, obtenerAlumnosEncargado } = require('./studentService');

async function test() {
  try {
    const userDataPath = path.join(__dirname, '../../storage/userData.json');
    const userDataRaw = fs.readFileSync(userDataPath, 'utf-8');
    const userData = JSON.parse(userDataRaw);

    for (const [whatsappId, userInfo] of Object.entries(userData)) {
      const idNumber = userInfo.idNumber;
      console.log(`\nProbando para usuario WhatsApp ID: ${whatsappId}, ID estudiante: ${idNumber}`);

      const estudiante = await buscarEstudiante(idNumber);
      if (!estudiante) {
        console.log(`No se encontró estudiante con ID ${idNumber}`);
        continue;
      }
      console.log('Datos del estudiante:', estudiante);

      const deuda = calcularDeuda(estudiante);
      console.log('Detalles de deuda:', deuda);

      if (userInfo.role === 'Padre/Madre/Tutor') {
        const alumnos = await obtenerAlumnosEncargado(whatsappId);
        console.log(`Alumnos a cargo de ${whatsappId}:`, alumnos);
      }
    }
  } catch (error) {
    console.error('Error durante la prueba:', error);
  }
}

test();
