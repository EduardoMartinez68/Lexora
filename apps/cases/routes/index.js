const express = require('express');
const router = express.Router();

// Middleware para verificar permisos puede ir aquí

router.get('/', (req, res) => {
  res.send('Bienvenido a la app de ventas');
});

module.exports = router;
