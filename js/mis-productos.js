import { db, auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, query, where, onSnapshot, doc, deleteDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const lista = document.getElementById('mis-productos-lista');
const userHeader = document.getElementById('user-header');
const contador = document.getElementById('contador-productos');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // --- LIMPIEZA TOTAL DEL HEADER ---
        // Al dejarlo vacío, quitamos tanto el botón "SALIR" como el correo.
        if (userHeader) {
            userHeader.innerHTML = "";
        }

        // Consulta de productos del usuario
        const q = query(collection(db, "productos"), where("vendedorId", "==", user.uid));

        onSnapshot(q, (snapshot) => {
            lista.innerHTML = "";
            
            // Actualizar contador con estilo
            if (contador) {
                contador.innerText = `(${snapshot.size} en total)`;
            }

            if (snapshot.empty) {
                lista.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10 font-bold italic">No tienes anuncios publicados todavía.</p>`;
                return;
            }

            snapshot.forEach((res) => {
                const p = res.data();
                const id = res.id;

                // Renderizamos la tarjeta manteniendo tu estructura premium
                lista.innerHTML += `
                    <div class="bg-white rounded-[2.5rem] p-4 flex flex-col shadow-xl group animate-card">
                        <div class="relative h-48 rounded-[2rem] overflow-hidden mb-4">
                            <img src="${p.foto || 'https://via.placeholder.com/400'}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        </div>
                        <div class="px-2 pb-2">
                            <h4 class="text-gray-900 font-black text-sm uppercase tracking-tighter mb-1 truncate">${p.titulo}</h4>
                            <p class="text-[#3B7A57] font-black text-2xl mb-4">$${p.precio}</p>
                            
                            <div class="flex gap-2">
                                <button onclick="prepararEdicion('${id}')" class="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95">
                                    Editar
                                </button>
                                <button onclick="eliminarProducto('${id}')" class="flex-1 bg-red-50 text-red-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        });
    } else {
        // Si no hay usuario, redirigir al login
        window.location.href = "login.html";
    }
});

// --- FUNCIONES GLOBALES ---

window.prepararEdicion = async (id) => {
    const docSnap = await getDoc(doc(db, "productos", id));
    if (docSnap.exists()) {
        const p = docSnap.data();
        document.getElementById('edit-id').value = id;
        document.getElementById('edit-titulo').value = p.titulo;
        document.getElementById('edit-precio').value = p.precio;
        document.getElementById('edit-whatsapp').value = p.whatsapp;
        document.getElementById('modal-editar').classList.remove('hidden');
    }
};

window.cerrarModal = () => document.getElementById('modal-editar').classList.add('hidden');

window.eliminarProducto = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este anuncio? Esta acción no se puede deshacer.")) {
        try {
            await deleteDoc(doc(db, "productos", id));
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar el producto.");
        }
    }
};

// Manejo del formulario de edición
document.getElementById('form-editar').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const update = {
        titulo: document.getElementById('edit-titulo').value,
        precio: Number(document.getElementById('edit-precio').value),
        whatsapp: document.getElementById('edit-whatsapp').value
    };

    try {
        await updateDoc(doc(db, "productos", id), update);
        cerrarModal();
    } catch (error) {
        console.error("Error al actualizar:", error);
        alert("Error al guardar los cambios.");
    }
};





