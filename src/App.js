import React, { useState, useEffect } from "react";
import useUsers from "./hooks/useUsers";
import UsersList from "./components/userList/UsersList"; 
import UserCreateForm from "./components/userList/UserCreateForm"; 
import UserEditForm from "./components/userList/UserEdit"; 
import LoginForm from "./components/userList/LoginForm";
import "./App.css";

const App = () => {
    const { users, loading: loadingUsers, addUser, editUser, deleteUserDetails, checkEmailExists, login } = useUsers();
    const [editingUser, setEditingUser] = useState(null); 
    const [loggedIn, setLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const savedSession = localStorage.getItem("loggedIn");
        if (savedSession) {
            setLoggedIn(true); 
        }
    }, []);

    const handleLogin = (userCredentials) => {
        login(userCredentials.correo, userCredentials.password)
            .then((result) => {
                if (result) {
                    setLoggedIn(true);
                    localStorage.setItem("loggedIn", true); 
                } else {
                    setLoggedIn(false);
                }
            })
            .catch((error) => {
                console.error("Error logging in", error);
                setLoggedIn(false);
            });
    };

    const handleLogout = () => {
        setLoggedIn(false);
        localStorage.removeItem("loggedIn"); 
    };

    const redirectToDocs = () => {
        window.location.href = "https://3.21.134.173/api/docs";
    };

    return (
        <div className="container">
            {!loggedIn ? (
                <div className="section">
                    {!showRegister ? (
                        <>
                            <LoginForm onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />
                        </>
                    ) : (
                        <>
                            <h1>Registro</h1>
                            <UserCreateForm onCreate={addUser} checkEmailExists={checkEmailExists} />
                            <button onClick={() => setShowRegister(false)} className="back-to-login">Volver al Login</button>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className="section">
                        <h1>Lista de Usuarios</h1>
                        {loadingUsers ? <p className="loading-text">Cargando usuarios...</p> : <UsersList 
                            users={users} 
                            onEdit={(user) => setEditingUser(user)} 
                            onDelete={deleteUserDetails} 
                        />}
                    </div>

                    <div className="section">
                        <h1>Gestión de Usuarios</h1>
                        {editingUser ? (
                            <UserEditForm 
                                user={editingUser} 
                                onUpdate={editUser} 
                                onCancel={() => setEditingUser(null)} 
                            />                
                        ) : (<UserCreateForm onCreate={addUser} checkEmailExists={checkEmailExists}/> 
                        )}
                    </div>

                    <center><div className="section">
                        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
                    </div></center>

                    <center>
                        <button onClick={redirectToDocs} className="docs-button">Ver Documentación de la API</button>
                    </center>
                </>
            )}
        </div>
    );
};

export default App;
