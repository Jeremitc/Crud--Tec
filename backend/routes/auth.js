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

            if (rows.length === 0) return res.status(401).json({ ingresa: false, error: 'Usuario, correo o contraseña incorrectos' });

            const userFound = rows[0];

            res.json({ ingresa: true, usuario: rows[0] });
            
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error al autenticar usuario' });
        }
    }
);

module.exports = router;