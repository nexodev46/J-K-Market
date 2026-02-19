import { db, auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- SECCIÓN: MENÚ DINÁMICO ---
const menuAuth = document.getElementById('menu-auth');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // SI ESTÁ LOGUEADO: Agregamos el enlace a "Mis Anuncios"
        menuAuth.innerHTML = `
            <div class="flex items-center gap-4">
                <a href="mis-productos.html" class="text-gray-500 text-xs font-bold hover:text-blue-600 transition uppercase tracking-wider">
                    Mis Anuncios
                </a>

                <a href="upload.html" class="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-md text-sm">
                    + Vender
                </a>
                
                <div class="flex flex-col items-end">
                    <span class="text-gray-600 text-xs font-medium">Hola, ${user.email.split('@')[0]}</span>
                    <button id="btn-cerrar-sesion" class="text-red-500 text-[10px] font-bold uppercase hover:underline">
                        Salir
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
            signOut(auth).then(() => window.location.reload());
        });
    } else {
        // SI NO ESTÁ LOGUEADO: Solo mostramos Entrar
        menuAuth.innerHTML = `
            <a href="login.html" class="bg-gray-100 text-gray-700 px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition text-sm border border-gray-200">
                Entrar
            </a>
        `;
    }
});

// --- SECCIÓN: CARGA DE PRODUCTOS ---
const contenedor = document.getElementById('contenedor-productos');

const obtenerProductos = () => {
    const q = query(collection(db, "productos"), orderBy("fecha", "desc"));
    onSnapshot(q, (snapshot) => {
        contenedor.innerHTML = ""; 
        if (snapshot.empty) {
            contenedor.innerHTML = "<p class='col-span-full text-center text-gray-500'>Aún no hay productos.</p>";
            return;
        }
        snapshot.forEach((doc) => {
            const producto = doc.data();
            contenedor.innerHTML += `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-40 md:h-52 bg-gray-200 overflow-hidden">
                        <img src="${producto.foto || ''}" class="w-full h-full object-cover">
                    </div>
                    <div class="p-4">
                        <p class="text-blue-600 font-bold text-lg">$${producto.precio}</p>
                        <h3 class="text-gray-700 font-medium truncate">${producto.titulo}</h3>
                        <a href="https://wa.me/${producto.whatsapp}" target="_blank" class="mt-3 block text-center bg-green-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-green-600 transition">
                            Chatear
                        </a>
                    </div>
                </div>
            `;
        });
    });
};

obtenerProductos();