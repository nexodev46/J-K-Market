import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const formRegistro = document.getElementById('form-registro');

if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;

        try {
            // Esta función de Firebase crea el usuario automáticamente
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            alert("¡Cuenta creada con éxito! Bienvenido " + user.email);
            window.location.href = "index.html"; // Nos lleva al inicio
        } catch (error) {
            console.error("Error al registrar:", error.code);
            // Mensajes amigables para errores comunes
            if (error.code === 'auth/email-already-in-use') alert("Este correo ya está registrado.");
            else if (error.code === 'auth/weak-password') alert("La contraseña debe tener al menos 6 caracteres.");
            else alert("Error: " + error.message);
        }
    });
}