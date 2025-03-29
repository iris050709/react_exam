import React, { useState } from "react";
import './UserEditForm.css';

const UserEditForm = ({ user, onUpdate, onCancel }) => {
    const [updatedUser, setUpdatedUser] = useState({
        ...user,
    });

    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Verificar si todos los campos son obligatorios
        if (!updatedUser.name || !updatedUser.email) {
            alert("Todos los campos son obligatorios");
            return;
        }

        // Enviar los datos al backend (sin contraseña)
        if (onUpdate) {
            onUpdate(updatedUser.id, { ...updatedUser });
            onCancel();
        } else {
            console.error("onUpdate no está definido");
        }
    };

    return (
        <div className="form-container">
            <h2>Editar Usuario</h2>
            <form className="user-form" onSubmit={handleSubmit}>
                <label>Nombre:</label>
                <input
                    className="input-field"
                    name="name"
                    value={updatedUser.name}
                    onChange={handleChange}
                    required
                />
                <label>Email:</label>
                <input
                    className="input-field"
                    type="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleChange}
                    required
                />
                <div className="form-buttons">
                    <button className="submit-button" type="submit">Actualizar Usuario</button>
                    <button className="cancel-button" type="button" onClick={onCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default UserEditForm;
