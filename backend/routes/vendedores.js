const express = require('express');
const router = express.Router();
const db = require('../connection/db');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vendedor');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los vendedores' });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM vendedor WHERE id_vendedor = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Vendedor no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el vendedor' });
    }
});

router.post('/',
    [
        body('nombre_vendedor').notEmpty().withMessage('El nombre es obligatorio'),
        body('dni').notEmpty().withMessage('El nombre de contacto es obligatorio'),
        body('dni').isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 dígitos'),
        body('celular').notEmpty().withMessage('El celular es obligatorio'),
        body('direccion').optional().isString().withMessage('La dirección debe ser una cadena de texto'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre_vendedor, dni, celular, direccion } = req.body;
        try {
            const [result] = await db.query(
                'INSERT INTO vendedor (nombre_vendedor, dni, celular, direccion) VALUES (?, ?, ?, ?)',
                [nombre_vendedor, dni, celular, direccion]
            );
            res.status(201).json({ id: result.insertId, nombre_vendedor, dni, celular, direccion: direccion ?? null });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el vendedor' });
        }
    }
);

router.patch('/:id',
    [
        body('nombre_vendedor').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        body('dni').optional().isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 dígitos'),
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
                `UPDATE vendedor SET ${clausula} WHERE id_vendedor = ?`,
                [...valores, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Vendedor no encontrado' });
            }
            res.json({ id, ...campos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el vendedor' });
        }
    }
);

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM vendedor WHERE id_vendedor = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vendedor no encontrado' });
        }
        res.json({ message: 'Vendedor eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el vendedor' });
    }
});

module.exports = router;