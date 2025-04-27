const express = require('express');
const router = express.Router();
const db = require('../connection/db');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM proveedor');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM proveedor WHERE id_proveedor = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el proveedor' });
    }
});

router.post('/',
    [
        body('nombre_proveedor').notEmpty().withMessage('El nombre es obligatorio'),
        body('nombre_contacto').notEmpty().withMessage('El nombre de contacto es obligatorio'),
        body('celular').notEmpty().withMessage('El celular es obligatorio'),
        body('direccion').optional().isString().withMessage('La dirección debe ser una cadena de texto'),
    ],
     async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre_proveedor, nombre_contacto, celular, direccion } = req.body;
        try {
            const [result] = await db.query(
                'INSERT INTO proveedor (nombre_proveedor, nombre_contacto, celular, direccion) VALUES (?, ?, ?, ?)',
                [nombre_proveedor, nombre_contacto, celular, direccion]
            );
            res.status(201).json({ id: result.insertId, nombre_proveedor, nombre_contacto, celular, direccion: direccion ?? null });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el proveedor' });
        }
     }
);

router.patch('/:id',
    [
        body('nombre_proveedor').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        body('nombre_contacto').optional().isString().withMessage('El nombre de contacto debe ser una cadena de texto'),
        body('celular').optional(),
        body('direccion').optional().isString().withMessage('La dirección debe ser una cadena de texto'),
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

        const clausula = claves.map((clave) => `${clave} = ?`).join(', ');
        const valores = claves.map((clave) => campos[clave]);

        try {
            const [result] = await db.query(
                `UPDATE proveedor SET ${clausula} WHERE id_proveedor = ?`,
                [...valores, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }
            res.json({ id, ...campos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el proveedor' });
        }
    }
);

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM proveedor WHERE id_proveedor = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.json({ message: 'Proveedor eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el proveedor' });
    }
});

module.exports = router;