const BASE_URL = "https://3.21.134.173/users/";
const CHECK_EMAIL_URL = "https://3.21.134.173/users/check-email";
const LOGIN_URL = "https://3.21.134.173/users/login";

async function handleResponse(response) {
    try {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Correo o Contraseña Incorrectos");
        return result;
    } catch (error) {
        throw new Error(error.message || "Error procesando la respuesta del servidor");
    }
}

export async function loginUser(email, password) {
    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });

        const result = await handleResponse(response);
        alert("✅ Inicio de sesión exitoso");
        return result;
    } catch (error) {
        alert(`⚠️ Error: ${error.message}`);
        console.error("❌ Error en loginUser:", error);
        return null;
    }
}

export async function checkEmailExists(email) {
    try {
        const response = await fetch(CHECK_EMAIL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
        const result = await handleResponse(response);
        return result.exists;
    } catch (error) {
        console.error("Error en checkEmailExists:", error);
        return false;
    }
}

export async function getAllUsers() {
    try {
        const response = await fetch(BASE_URL);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error en getAllUsers:", error);
        return [];
    }
}

export async function createUser(user) {
    try {
        if (await checkEmailExists(user.email)) {
            alert("⚠️ Este correo ya está registrado. Por favor, usa otro.");
            return null;
        }

        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: user.name,
                email: user.email.trim().toLowerCase(),
                password: user.password,
            }),
        });

        const result = await handleResponse(response);
        alert("✅ Usuario creado correctamente");
        return result;
    } catch (error) {
        alert(`⚠️ Error: ${error.message}`);
        console.error("❌ Error en createUser:", error);
        return null;
    }
}


export async function updateUser(userId, user) {
    try {
        const currentUser = await fetch(`${BASE_URL}${userId}`).then(handleResponse);

        if (user.email.trim().toLowerCase() !== currentUser.email && await checkEmailExists(user.email)) {
            alert("⚠️ El correo ya está en uso por otro usuario.");
            return null;
        }

        user.email = user.email.trim().toLowerCase();

        // Enviar los datos sin la contraseña
        const response = await fetch(`${BASE_URL}${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        const result = await handleResponse(response);
        alert("✅ Usuario actualizado correctamente");
        return result;
    } catch (error) {
        alert(`⚠️ Error: ${error.message}`);
        console.error("❌ Error en updateUser:", error);
        return null;
    }
}


export async function deleteUser(userId) {
    try {
        const response = await fetch(`${BASE_URL}${userId}`, { method: "DELETE" });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error en deleteUser:", error);
        return null;
    }
}