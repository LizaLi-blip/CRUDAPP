const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://andreayocupicio13:<X2H3xQyT1L0hjw0u>@clusteralys.1st28.mongodb.net/?retryWrites=true&w=majority&appName=ClusterALYS', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

// Define el esquema y modelo de Mongoose
const itemSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const Item = mongoose.model('Item', itemSchema);

// Configurar la carpeta pública para servir archivos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Rutas CRUD

// Obtener todos los datos
app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

// Crear un nuevo ítem
app.post('/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
});

// Eliminar un ítem por ID
app.delete('/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ítem eliminado' });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
