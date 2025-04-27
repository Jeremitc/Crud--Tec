const express = require('express');
const router = express.Router();
const db = require('../connection/db');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM productos');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM productos WHERE id_producto = ?', [id]);
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
        body('nombre_producto').notEmpty().withMessage('El nombre es obligatorio'),
        body('precio').isFloat().withMessage('El precio debe ser un número'),
        body('stock').isInt().withMessage('El stock debe ser un número entero'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre_producto, precio, stock } = req.body;
        try {
            const [result] = await db.query(
                'INSERT INTO productos (nombre_producto, precio, stock) VALUES (?, ?, ?)',
                [nombre_producto, precio, stock]
            );
            res.status(201).json({ id: result.insertId, nombre_producto, precio, stock });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    }
);

router.patch('/:id',
    [
        body('nombre_producto').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        body('precio').optional().isFloat().withMessage('El precio debe ser un número'),
        body('stock').optional().isInt().withMessage('El stock debe ser un número entero'),
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

        const clausuala = claves.map((clave) => `${clave} = ?`).join(', ');
        const valores = claves.map((clave) => campos[clave]);
        
        try {
            const [result] = await db.query(
                `UPDATE productos SET ${clausuala} WHERE id_producto = ?`,
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
        const [result] = await db.query('DELETE FROM productos WHERE id_producto = ?', [id]);
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