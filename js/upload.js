import { db, auth } from './firebase-config.js'; // <-- Agregamos 'auth' aquí
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const formulario = document.getElementById('form-subida');

// Función para achicar la foto y que no pese demasiado
const comprimirImagen = (archivo) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(archivo);
        reader.onload = (evento) => {
            const img = new Image();
            img.src = evento.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 500; 
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Calidad 0.5 para asegurar que Firebase lo acepte
                resolve(canvas.toDataURL('image/jpeg', 0.5));
            };
        };
    });
};

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Iniciando publicación...");

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const archivo = document.getElementById('input-foto').files[0];

    if (!archivo) return alert("Por favor, selecciona una foto");

    try {
        // 1. Comprimimos la imagen
        const fotoComprimida = await comprimirImagen(archivo);
        
        // 2. Obtenemos el usuario que está logueado ahora mismo
        const usuarioActual = auth.currentUser;

        // 3. Subimos todo a Firestore
       const whatsapp = document.getElementById('whatsapp').value; // Capturamos el número

await addDoc(collection(db, "productos"), {
    titulo: nombre,
    precio: Number(precio),
    foto: fotoComprimida,
    whatsapp: whatsapp, // <--- Guardamos el número en la base de datos
    vendedorEmail: auth.currentUser.email,
    vendedorId: auth.currentUser.uid,
    fecha: new Date()
});

        alert("¡Producto publicado con éxito! 🚀");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Error al publicar:", error);
        alert("Hubo un error al subir el producto: " + error.message);
    }
});