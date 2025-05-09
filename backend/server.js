const express = require('express');
const cors = require('cors');
const usuariosRouter = require('./routes/usuarios');
const productosRouter = require('./routes/productos');
const proveedoresRouter = require('./routes/proveedor');
const vendedoresRouter = require('./routes/vendedores');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/proveedores', proveedoresRouter);
app.use('/api/vendedores', vendedoresRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.LISENER_PORT || 3001;
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en http://localhost:${PORT}/api`);
});