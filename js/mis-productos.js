import { db, auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, query, where, onSnapshot, doc, deleteDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const lista = document.getElementById('mis-productos-lista');
const modal = document.getElementById('modal-editar');
const formEditar = document.getElementById('form-editar');

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('user-email').innerText = user.email;
        document.getElementById('user-avatar').innerText = user.email.charAt(0).toUpperCase();

        const q = query(collection(db, "productos"), where("vendedorId", "==", user.uid));

        onSnapshot(q, (snapshot) => {
            lista.innerHTML = "";
            snapshot.forEach((res) => {
                const p = res.data();
                const id = res.id;

                lista.innerHTML += `
                    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                        <img src="${p.foto}" class="w-full h-40 object-cover">
                        <div class="p-4 flex-grow">
                            <h4 class="font-bold text-gray-700 truncate">${p.titulo}</h4>
                            <p class="text-blue-600 font-bold">$${p.precio}</p>
                            <div class="flex gap-2 mt-4">
                                <button onclick="prepararEdicion('${id}')" class="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg text-xs font-bold hover:bg-blue-200 transition">Editar</button>
                                <button onclick="eliminarProducto('${id}')" class="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-200 transition">Eliminar</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        });
    } else {
        window.location.href = "login.html";
    }
});

// 1. Cargar datos en el modal
window.prepararEdicion = async (id) => {
    const docRef = doc(db, "productos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const p = docSnap.data();
        document.getElementById('edit-id').value = id;
        document.getElementById('edit-titulo').value = p.titulo;
        document.getElementById('edit-precio').value = p.precio;
        document.getElementById('edit-whatsapp').value = p.whatsapp || "";
        modal.classList.remove('hidden'); // Mostramos el modal
    }
};

// 2. Cerrar modal
window.cerrarModal = () => {
    modal.classList.add('hidden');
};

// 3. Guardar cambios en Firebase
formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    
    const nuevosDatos = {
        titulo: document.getElementById('edit-titulo').value,
        precio: Number(document.getElementById('edit-precio').value),
        whatsapp: document.getElementById('edit-whatsapp').value
    };

    try {
        await updateDoc(doc(db, "productos", id), nuevosDatos);
        alert("¡Producto actualizado!");
        cerrarModal();
    } catch (error) {
        alert("Error al actualizar: " + error.message);
    }
});

// Función eliminar (ya la tenías)
window.eliminarProducto = async (id) => {
    if (confirm("¿Borrar este producto?")) {
        await deleteDoc(doc(db, "productos", id));
    }
};