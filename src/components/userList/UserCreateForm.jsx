import React, { useState } from "react";
import './LoginForm.css';

const UserCreateForm = ({ onCreate, checkEmailExists }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (!validatePassword(password)) {
            setError("La contraseña debe tener al menos 10 caracteres, una mayúscula, una minúscula, un número y un símbolo.");
            return;
        }

        // Verificar si el correo ya existe
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            setError("⚠️ Este correo ya está registrado. Por favor, usa otro.");
            return;
        }

        const newUser = {
            name,
            email,
            password,
        };

        onCreate(newUser);

        // Limpiar campos
        setName('');
        setEmail('');
        setPassword('');
        setError('');
    };

    const handleCancel = () => {
        setName('');
        setEmail('');
        setPassword('');
        setError('');
    };

    return (
        <div className="form-container">
            <h2>Crear Nuevo Usuario</h2>
            {error && <p className="error-message">{error}</p>}
            <form className="user-form" onSubmit={handleSubmit}>
                <label>Nombre:</label>
                <input
                    className="input-field"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nombre"
                />
                <label>Email:</label>
                <input
                    className="input-field"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Correo"
                />
                <label>Password:</label>
                <input
                    className="input-field"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Contraseña"
                />
                <div className="form-buttons">
                    <button className="submit-button" type="submit">Crear Usuario</button>
                    <button className="cancel-button" type="button" onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default UserCreateForm;
