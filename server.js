const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node-api'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

app.post('/api/usuarios', (req, res) => {
    const { nombre, apellido, email, telefono } = req.body;
  
    // Verificar que se reciban todos los campos requeridos
    if (!nombre || !apellido || !email) {
      return res.status(400).json({ error: 'Nombre, apellido y email son campos requeridos' });
    }
  
    // Insertar el nuevo usuario en la base de datos
    const query = 'INSERT INTO usuarios (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)';
    connection.query(query, [nombre, apellido, email, telefono], (error, results) => {
      if (error) {
        console.error('Error al agregar usuario:', error);
        return res.status(500).json({ error: 'Error al agregar usuario' });
      }
      return res.status(201).json({ message: 'Usuario agregado correctamente' });
    });
  });
  
  app.get('/api/usuarios', (req, res) => {
    // Obtener todos los usuarios de la base de datos
    const query = 'SELECT * FROM usuarios';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({ error: 'Error al obtener usuarios' });
      }
      return res.json(results);
    });
  });
  
  app.get('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
  
    // Obtener los datos del usuario por su ID
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error al obtener usuario por ID:', error);
        return res.status(500).json({ error: 'Error al obtener usuario por ID' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      return res.json(results[0]);
    });
  });
  
  app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, telefono } = req.body;
  
    // Actualizar los datos del usuario por su ID
    const query = 'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id = ?';
    connection.query(query, [nombre, apellido, email, telefono, id], (error, results) => {
      if (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ error: 'Error al actualizar usuario' });
      }
      return res.json({ message: 'Usuario actualizado correctamente' });
    });
  });
  
  app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
  
    // Eliminar un usuario por su ID
    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({ error: 'Error al eliminar usuario' });
      }
      return res.json({ message: 'Usuario eliminado correctamente' });
    });
  });

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
