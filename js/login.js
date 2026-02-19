import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const formLogin = document.getElementById('form-login');
const btnOlvido = document.getElementById('btn-olvido');

// Lógica para Iniciar Sesión
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "index.html";
    } catch (error) {
        alert("Error: Correo o contraseña incorrectos");
    }
});

// Lógica para Recuperar Contraseña
btnOlvido.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    if (!email) return alert("Escribe tu correo primero");

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Revisa tu correo para cambiar la contraseña");
    } catch (error) {
        alert("Error: " + error.message);
    }
});