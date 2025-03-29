

# Proyecto de React: Sistema de Gestión de Usuarios

Este proyecto es una aplicación de React para la gestión de usuarios, donde los usuarios pueden registrarse, iniciar sesión, editar su información y eliminar su cuenta. Utiliza un diseño de formularios para crear y editar usuarios y realizar la paginación para la lista de usuarios.

## Estructura del Proyecto

```
/src
|-- /components
|   |-- LoginForm.jsx
|   |-- UserCreateForm.jsx
|   |-- UserEditForm.jsx
|   |-- UsersList.jsx
|
|-- /hooks
|   |-- useUsers.js
|
|-- /services
|   |-- UserService.js
|
|-- App.js
|-- index.js
|-- /styles
|   |-- LoginForm.css
|   |-- UserCreateForm.css
|   |-- UserEditForm.css
|   |-- style.css
|
/public
|-- index.html
```

## Pasos para el Proyecto

### 1. Instalación de Dependencias

Primero, debes asegurarte de que tienes `Node.js` y `npm` instalados en tu computadora. Si no los tienes, puedes descargarlos desde el [sitio oficial de Node.js](https://nodejs.org/).

Luego, abre una terminal y navega a la carpeta de tu proyecto y ejecuta los siguientes comandos para instalar las dependencias necesarias:

```bash
npx create-react-app gestion-usuarios
cd gestion-usuarios
npm install react-icons
```

Con esto, tendrás un proyecto básico de React creado y las dependencias necesarias para trabajar con los íconos (en este caso, `react-icons`) instaladas.

### 2. Crear los Componentes

Crea las carpetas necesarias y los archivos de componentes. La estructura del proyecto en `src` se divide en tres carpetas principales: `components`, `hooks`, y `services`.

#### 2.1. Componente `LoginForm.js`

Este componente muestra el formulario de inicio de sesión y gestiona la validación y el envío de la información para el login.

**LoginForm.js**:

```jsx
import React, { useState } from "react";
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = ({ onLogin, onShowRegister }) => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!correo || !password) {
            setError("Por favor, ingresa todos los campos.");
            return;
        }

        try {
            const success = await onLogin({ correo, password });
            console.log("Resultado de onLogin:", success);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Ocurrió un error. Intenta nuevamente.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Iniciar Sesión</h2>
                {error && <p className="error-message">{error}</p>}
                <form className="user-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FaUser className="icon" />
                        <input
                            className="input-field"
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                            placeholder="Correo Electrónico"
                        />
                    </div>
                    <div className="input-group">
                        <FaLock className="icon" />
                        <input
                            className="input-field"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Contraseña"
                        />
                    </div>
                    <div className="form-buttons">
                        <button className="submit-button" type="submit">Iniciar Sesión</button>
                    </div>
                </form>
                <div className="register-link-container">
                    <p>¿No tienes cuenta? <button onClick={onShowRegister} className="register-link">Regístrate</button></p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
```

#### 2.2. Otros Componentes

Sigue el mismo patrón para los demás componentes como `UserCreateForm`, `UserEditForm`, `UsersList`. La estructura de cada uno de estos componentes es similar, y gestionan formularios para crear o editar usuarios, y una lista paginada de usuarios.

#### 2.3. Hook `useUsers.js`

El hook `useUsers.js` gestiona la lógica de obtener, agregar, editar y eliminar usuarios. Este hook utiliza funciones de servicio que interactúan con el backend de tu aplicación (por ejemplo, usando `fetch` o `axios`).

```jsx
import { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser, checkEmailExists, loginUser } from '../services/UserService';

export default function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            const validUsers = data.filter(user => user.id && user.name);
            setUsers(validUsers);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const addUser = async (user) => {
        try {
            const newUser = await createUser(user);
            setUsers((prevUsers) => [...prevUsers, newUser]);
        } catch (error) {
            console.error("Error al agregar usuario:", error);
        }
    };

    const editUser = async (userId, userData) => {
        await updateUser(userId, userData);
        fetchUsers();
    };

    const deleteUserDetails = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    const login = async (email, password) => {
        try {
            const result = await loginUser(email, password);
            if (result) {
                console.log("Inicio de sesión exitoso:", result);
                return result;
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    return { users, loading, addUser, editUser, deleteUserDetails, checkEmailExists, login };
}
```

#### 2.4. Servicios `UserService.js`

En esta capa, gestionas todas las interacciones con tu backend, realizando las peticiones HTTP para obtener, crear, actualizar y eliminar usuarios.

```js
const BASE_URL = "https://3.21.134.173/users/";

export const getAllUsers = async () => {
    const response = await fetch(BASE_URL);
    return response.json();
};

export const createUser = async (user) => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};

export const updateUser = async (id, userData) => {
    const response = await fetch(`${BASE_URL}${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};

export const deleteUser = async (id) => {
    const response = await fetch(`${BASE_URL}${id}`, {
        method: "DELETE",
    });
    return response.json();
};

export const checkEmailExists = async (email) => {
    const response = await fetch(`${BASE_URL}check-email`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};
```

### 3. Integración en `App.js`

Ahora que tienes todos los componentes, puedes integrarlos en `App.js`. Aquí es donde manejarás la lógica de mostrar los formularios y las vistas.

```jsx
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import UserCreateForm from './components/UserCreateForm';
import UsersList from './components/UsersList';
import useUsers from './hooks/useUsers';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const { users, addUser, editUser, deleteUserDetails, login } = useUsers();

  const handleLogin = async ({ correo, password }) => {
    const result = await login(correo, password);
    if (result) {
      // Lógica después de iniciar sesión correctamente
    }
  };

  return (
    <div className="App">
      {showLogin && !showRegister ? (
        <LoginForm onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />
      ) : (
        <UserCreateForm
          onCreate={addUser}
          checkEmailExists={async (email) => await checkEmailExists(email)}
        />
      )}
      <UsersList
        users={users}
        onEdit={(user) => console.log('Editar usuario', user)}
        onDelete={deleteUserDetails}
      />
    </div>
  );
}

export default App;
```

### 4. Estilos y CSS

No olvides crear los archivos de CSS como `LoginForm.css`, `UserCreateForm.css`, etc., para dar estilo a tu aplicación.

---

### 5. Ejecutar el Proyecto

Una vez que hayas completado todos los pasos anteriores, ejecuta el proyecto en tu entorno local con:

```bash
npm start
```

Tu aplicación debería estar corriendo en `http://localhost:3000`.

---

## Conclusión

Con estos pasos, has creado una aplicación básica de gestión de usuarios en React que incluye inicio de sesión, creación y edición de usuarios, y paginación para la lista de usuarios. La arquitectura está organizada y facilita la expansión del proyecto en el futuro.