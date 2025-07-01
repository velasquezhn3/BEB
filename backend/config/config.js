module.exports = {
  messageQueue: {
    baseDelayMs: 2000, // Base delay in milliseconds before sending a message
    randomizeDelay: true, // Enable randomization of delay
    maxRetries: 5,
    initialBackoffMs: 1000,
  },
  columnas: {
    MESES: {
      ENERO: 'Enero',
      FEBRERO: 'Febrero',
      MARZO: 'Marzo',
      ABRIL: 'Abril',
      MAYO: 'Mayo',
      JUNIO: 'Junio',
      JULIO: 'Julio',
      AGOSTO: 'Agosto',
      SEPTIEMBRE: 'Septiembre',
      OCTUBRE: 'Octubre',
      NOVIEMBRE: 'Noviembre',
      DICIEMBRE: 'Diciembre'
    }
  }
};
