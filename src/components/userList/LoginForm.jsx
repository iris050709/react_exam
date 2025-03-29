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
