import { db, auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const inputFoto = document.getElementById('foto');
const imgPreview = document.getElementById('img-preview');
const previewContainer = document.getElementById('preview-container');
const form = document.getElementById('form-publicar');
const btnPublicar = document.getElementById('btn-publicar');

// --- 1. PREVISUALIZACIÓN DE IMAGEN ---
inputFoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imgPreview.src = event.target.result;
            imgPreview.classList.remove('hidden');
            previewContainer.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// --- 2. ENVIAR A FIREBASE ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Cambiar botón a estado de carga
    btnPublicar.disabled = true;
    btnPublicar.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Subiendo...`;

    const user = auth.currentUser;
    if (!user) {
        alert("Debes iniciar sesión para vender.");
        return;
    }

    const producto = {
        titulo: document.getElementById('titulo').value,
        precio: Number(document.getElementById('precio').value),
        whatsapp: document.getElementById('whatsapp').value,
        foto: imgPreview.src, // Base64 para rapidez (luego podrías usar Storage)
        vendedorId: user.uid,
        vendedorEmail: user.email,
        fecha: serverTimestamp()
    };

    try {
        await addDoc(collection(db, "productos"), producto);
        alert("¡Producto publicado con éxito!");
        window.location.href = "index.html";
    } catch (error) {
        alert("Error al subir: " + error.message);
        btnPublicar.disabled = false;
        btnPublicar.innerText = "Publicar Producto";
    }
});