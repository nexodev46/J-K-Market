import { db, auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, query, where, onSnapshot, doc, deleteDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const lista = document.getElementById('mis-productos-lista');
const userHeader = document.getElementById('user-header');
const contador = document.getElementById('contador-productos');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Mostrar info del usuario en el header
        userHeader.innerHTML = `
            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">${user.email}</span>
            <button id="btn-salir" class="bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition">Salir</button>
        `;
        document.getElementById('btn-salir').onclick = () => signOut(auth);

        // Consulta de productos del usuario
        const q = query(collection(db, "productos"), where("vendedorId", "==", user.uid));

        onSnapshot(q, (snapshot) => {
            lista.innerHTML = "";
            contador.innerText = `(${snapshot.size} en total)`;

            snapshot.forEach((res) => {
                const p = res.data();
                const id = res.id;

                lista.innerHTML += `
                    <div class="bg-white rounded-[2.5rem] p-4 flex flex-col shadow-xl group">
                        <div class="relative h-48 rounded-[2rem] overflow-hidden mb-4">
                            <img src="${p.foto}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        </div>
                        <div class="px-2 pb-2">
                            <h4 class="text-gray-900 font-black text-sm uppercase tracking-tighter mb-1 truncate">${p.titulo}</h4>
                            <p class="text-[#3B7A57] font-black text-2xl mb-4">$${p.precio}</p>
                            
                            <div class="flex gap-2">
                                <button onclick="prepararEdicion('${id}')" class="flex-1 bg-blue-50 text-blue-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition">Editar</button>
                                <button onclick="eliminarProducto('${id}')" class="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition">Eliminar</button>
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

// Funciones Globales para los botones
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
    if (confirm("¿Estás seguro de eliminar este anuncio?")) {
        await deleteDoc(doc(db, "productos", id));
    }
};

document.getElementById('form-editar').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const update = {
        titulo: document.getElementById('edit-titulo').value,
        precio: Number(document.getElementById('edit-precio').value),
        whatsapp: document.getElementById('edit-whatsapp').value
    };
    await updateDoc(doc(db, "productos", id), update);
    cerrarModal();
};