const express = require('express');
const router = express.Router();

// Middleware para verificar permisos puede ir aquí
router.get('/', (req, res) => {
  res.render('cases')
  /*
  res.render('home', {
    layout: 'main', // usa tu layout si es necesario
    title: 'Ventas'
  });
  */
});

module.exports = router;
