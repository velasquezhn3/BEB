module.exports = {
  getMenuByRole: function(role) {
    const menus = {
      'Alumno': '1. Ver notas\n2. Ver horarios\n3. Contactar tutor',
      'Padre/Madre/Tutor': '1. Ver reportes de alumno\n2. Contactar docente\n3. Información de pagos\n4. Gestionar alumnos',
      'Docente': '1. Reportar notas\n2. Ver horarios de clase\n3. Comunicados administrativos',
      'Administración': '1. Gestión de usuarios\n2. Reportes generales\n3. Configuración del sistema'
    };
    return menus[role] || 'Menú no disponible para su rol.';
  }
};
