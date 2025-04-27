const express = require('express');
const router = express.Router();
const db = require('../connection/db');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
});

router.post('/',
    [
        body('nombre_usuario').notEmpty().withMessage('El nombre es obligatorio'),
        body('password').notEmpty().withMessage('La contraseña es obligatoria'),
        body('correo').isEmail().withMessage('El correo debe ser válido'),
        body('correo').notEmpty().withMessage('El correo es obligatorio'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre_usuario, password, correo } = req.body;
        try {
            const [result] = await db.query(
                'INSERT INTO usuarios (nombre_usuario, password, correo) VALUES (?, ?, ?)',
                [nombre_usuario, password, correo]
            );
            res.status(201).json({ id: result.insertId, nombre_usuario, password, correo });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    }
);

router.patch('/:id',
    [
        body('nombre_usuario').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        body('password').optional(),
        body('correo').optional().isEmail().withMessage('El correo debe ser válido'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        const campos = req.body;
        const claves = Object.keys(campos);
        if (claves.length === 0) {
            return res.status(400).json({ error: 'No se han proporcionado campos para actualizar' });
        }

        const clausula = claves.map(clave => `${clave} = ?`).join(', ');
        const valores = claves.map(clave => campos[clave]);
        try {
            const [result] = await db.query(
                `UPDATE usuarios SET ${clausula} WHERE id_usuario = ?`,
                [...valores, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({ id, ...campos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
    }
);

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

module.exports = router;