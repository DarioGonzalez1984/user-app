<template>
    <div class="container">
      <div class="form-container">
        <form @submit.prevent="submitForm" class="form">
          <!-- Campo oculto para almacenar el ID del usuario -->
          <input type="hidden" id="userId" v-model="userData.id">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" v-model="userData.nombre" required>
          </div>
          <div class="form-group">
            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" v-model="userData.apellido" required>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="userData.email" required>
          </div>
          <div class="form-group">
            <label for="telefono">Teléfono:</label>
            <input type="tel" id="telefono" v-model="userData.telefono">
          </div>
          <button type="submit" class="btn-submit">Guardar</button>
        </form>
      </div>
      <div class="table-container">
        <table class="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td>{{ user.nombre }}</td>
              <td>{{ user.apellido }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.telefono }}</td>
              <td>
                <button @click="editarUsuario(user.id)" class="btn-edit">Editar</button>
                <button @click="eliminarUsuario(user.id)" class="btn-delete">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userData: {
          id: '',
          nombre: '',
          apellido: '',
          email: '',
          telefono: ''
        },
        users: [] // Aquí se almacenarán los usuarios obtenidos de la API
      };
    },
    methods: {
      async submitForm() {
        try {
            let url = 'https://user-app-1.vercel.app//api/usuarios';
    let method = 'POST'; // Por defecto, crea un nuevo usuario

    // Si hay un ID en el formulario, se trata de una edición
    if (this.userData.id) {
      url += `/${this.userData.id}`;
      method = 'PUT'; // Cambia el método a PUT para actualizar el usuario
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
            body: JSON.stringify(this.userData)
          });
          
          if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
          }
          
          // Limpiar los campos del formulario después de enviar los datos
          this.userData = {
            id: '',
            nombre: '',
            apellido: '',
            email: '',
            telefono: ''
          };
          
          // Actualizar la lista de usuarios después de agregar uno nuevo
          this.obtenerUsuarios();
          
          // Mostrar un mensaje de éxito o redirigir a otra página si es necesario
          console.log('Datos enviados correctamente');
        } catch (error) {
          console.error('Error al enviar los datos del formulario:', error);
        }
      },
      async obtenerUsuarios() {
        try {
          const response = await fetch('https://user-app-1.vercel.app//api/usuarios');
          if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
          }
          this.users = await response.json();
        } catch (error) {
          console.error('Error al obtener los usuarios:', error);
        }
      },
      async editarUsuario(id) {
        console.log('Editar usuario con ID:', id);
        // Asigna los datos del usuario al formulario para editar
        const usuario = this.users.find(user => user.id === id);
        this.userData = { ...usuario };
      },
      async eliminarUsuario(id) {
        try {
          // Lógica para eliminar un usuario por su ID
          console.log('Eliminar usuario con ID:', id);
          await fetch(`https://user-app-1.vercel.app//api/usuarios/${id}`, {
            method: 'DELETE'
          });
          // Actualiza la lista de usuarios después de eliminar uno
          this.obtenerUsuarios();
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
        }
      },
        
    },
    mounted() {
      this.obtenerUsuarios();
    }
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    align-items: flex-start;
  }
  
  .form-container, .table-container {
    flex: 1;
    padding: 20px;
    border-radius: 10px;
  }
  
  .form-container {
    background-color: #f2f2f2;
    margin-right: 20px;
  }
  
  .table-container {
    background-color: #f9f9f9;
  }
  
  .form {
    width: 100%;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: calc(100% - 16px);
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  button {
    width: calc(100% - 16px);
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  .btn-edit, .btn-delete {
    margin-right: 5px;
  }
  
  .user-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .user-table th, .user-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .user-table th {
    background-color: #f2f2f2;
  }
  </style>
  