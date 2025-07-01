module.exports = {
  getMenuByRole: function (role, name = '') {
    if (role === 'Padre/Madre/Tutor') {
      return `👋 *Hola ${name}*, bienvenido/a al asistente escolar.\n
📘 *Menú Interactivo - Padre/Madre/Tutor*:\n
━━━━━━━━━━━━━━━━━━━
🔢 *Opciones disponibles:*\n
\n1️⃣  *📊 Consultar notas* de mi hijo/a\n2️⃣  *🕵️ Ver asistencia* de mi hijo/a\n3️⃣  *💰 Información de pagos*\n4️⃣  *👨‍👩‍👧‍👦 Gestionar alumnos*\n5️⃣  *✉️ Enviar mensaje* a profesores/tutores\n6️⃣  *🔔 Recibir avisos escolares*\n7️⃣  *📞 Actualizar datos de contacto*
━━━━━━━━━━━━━━━━━━━
📩 *Responde con el número de la opción* para continuar.`;
    }

    const menus = {
      'Alumno': `🎓 *Menú Interactivo - Alumno*:\n━━━━━━━━━━━━━━━\n1️⃣  *Ver notas* 📑\n2️⃣  *Ver horarios* 📆\n3️⃣  *Contactar tutor* 👨‍🏫\n━━━━━━━━━━━━━━━\n📩 *Responde con el número de la opción* para continuar.`,

      'Docente': `👩‍🏫 *Menú Interactivo - Docente*:\n━━━━━━━━━━━━━━━\n1️⃣  *Reportar notas* 📋\n2️⃣  *Ver horarios de clase* 🗓️\n3️⃣  *Comunicados administrativos* 📨\n━━━━━━━━━━━━━━━\n📩 *Responde con el número de la opción* para continuar.`,

      'Administración': `🛠️ *Menú Interactivo - Administración*:\n━━━━━━━━━━━━━━━\n1️⃣  *Gestión de usuarios* 👥\n2️⃣  *Reportes generales* 📈\n3️⃣  *Configuración del sistema* ⚙️\n━━━━━━━━━━━━━━━\n📩 *Responde con el número de la opción* para continuar.`
    };

    return menus[role] || '❌ *Menú no disponible para su rol.*';
  }
};
