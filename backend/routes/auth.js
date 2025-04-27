const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../connection/db');

router.post('/',
  [
    body('usuario').notEmpty().withMessage('El nombre de usuario o correo es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { usuario, password } = req.body;

    try {
      const [rows] = await db.query(
        'SELECT * FROM usuario WHERE (nombre_usuario = ? OR correo = ?) AND password = ?',
        [usuario, usuario, password]
      );

      if (rows.length === 0) {
        return res.status(401).json({ ingresa: false, error: 'Usuario, correo o contraseña incorrectos' });
      }

      const userFound = rows[0];
      res.json({ ingresa: true, usuario: userFound });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al autenticar usuario' });
    }
  }
);

router.post('/register',
  [
    body('nombre_usuario').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    body('correo').isEmail().withMessage('El correo debe ser válido').notEmpty().withMessage('El correo es obligatorio'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre_usuario, password, correo } = req.body;
    try {
      // Check if user or email already exists
      const [existing] = await db.query(
        'SELECT * FROM usuario WHERE nombre_usuario = ? OR correo = ?',
        [nombre_usuario, correo]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'El nombre de usuario o correo ya está registrado' });
      }

      const [result] = await db.query(
        'INSERT INTO usuario (nombre_usuario, password, correo) VALUES (?, ?, ?)',
        [nombre_usuario, password, correo]
      );
      const newUser = { id_usuario: result.insertId, nombre_usuario, correo };
      res.status(201).json({ ingresa: true, usuario: newUser });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }
);

module.exports = router;