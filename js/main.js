import { db, auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- REFERENCIAS AL DOM ---
const menuAuth = document.getElementById('menu-auth');
const contenedor = document.getElementById('contenedor-productos');
const buscador = document.getElementById('buscador');

let productosData = []; // Guardaremos los productos aquí para el buscador

// --- 1. GESTIÓN DE USUARIO (MENÚ DINÁMICO) ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Estado: Logueado
        menuAuth.innerHTML = `
            <div class="flex items-center gap-4">
                <a href="mis-productos.html" class="hidden md:block text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-widest transition">
                    Mis Anuncios
                </a>
                <a href="upload.html" class="bg-[#3B7A57] text-white px-5 py-2 rounded-md font-bold hover:bg-[#2D5A41] transition shadow-lg text-xs uppercase tracking-tighter">
                    + Vender
                </a>
                <div class="flex flex-col items-end border-l border-gray-700 pl-4">
                    <span class="text-white text-[10px] font-bold leading-none uppercase tracking-tighter">
                        ${user.email.split('@')[0]}
                    </span>
                    <button id="btn-cerrar-sesion" class="text-red-400 text-[9px] font-black uppercase mt-1 hover:text-red-500 transition">
                        SALIR
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
            signOut(auth).then(() => window.location.reload());
        });
    } else {
        // Estado: Visitante
        menuAuth.innerHTML = `
            <a href="login.html" class="bg-white text-[#2D3436] px-6 py-2 rounded-md font-black text-xs uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">
                Entrar
            </a>
        `;
    }
});

// --- 2. CARGA DE PRODUCTOS DESDE FIRESTORE ---
const obtenerProductos = () => {
    // 1. INICIO: Mostramos el estado de carga con diseño Premium
    contenedor.innerHTML = `
        <div class="col-span-full py-20 flex flex-col items-center justify-center">
            <div class="w-12 h-12 border-4 border-[#3B7A57] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse-slow">
                Cargando productos...
            </p>
        </div>
    `;

    const q = query(collection(db, "productos"), orderBy("fecha", "desc"));
    
    onSnapshot(q, (snapshot) => {
        // 2. RECIBIMOS DATOS: Limpiamos el Spinner
        contenedor.innerHTML = ""; 
        productosData = [];

        if (snapshot.empty) {
            contenedor.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">No hay productos aún.</p>`;
            return;
        }

        // 3. RENDERIZADO: Cada tarjeta entra con la animación suave
        snapshot.forEach((doc) => {
            const p = { id: doc.id, ...doc.data() };
            productosData.push(p);
            
            // Importante: La clase 'animate-fadeIn' hace que no sea brusco
            renderizarTarjeta(p); 
        });
    });
};

// --- 3. FUNCIÓN PARA DIBUJAR LA TARJETA (REUSABLE) ---
const renderizarTarjeta = (p) => {
    contenedor.innerHTML += `
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl transition-all duration-500 group">
            <div class="relative aspect-square overflow-hidden bg-gray-50">
                <img src="${p.foto || 'https://via.placeholder.com/400'}" 
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                <div class="absolute top-2 left-2 bg-[#3B7A57] text-white text-[9px] px-2 py-1 rounded font-black uppercase tracking-widest">
                    Nuevo
                </div>
                <button class="absolute top-2 right-2 text-gray-300 hover:text-red-500 bg-white/80 p-1.5 rounded-full backdrop-blur-sm transition">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
            </div>

            <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-gray-900 font-bold text-sm mb-1 truncate uppercase tracking-tighter">${p.titulo}</h3>
                <p class="text-[#3B7A57] font-black text-xl mb-2 tracking-tighter">$${p.precio}</p>
                
                <div class="flex items-center gap-0.5 mb-4">
                    <span class="text-yellow-400 text-[10px]">★★★★★</span>
                    <span class="text-gray-400 text-[9px] ml-1 font-bold">4.8</span>
                </div>

                <a href="https://wa.me/${p.whatsapp}?text=Hola, me interesa tu producto: ${p.titulo}" target="_blank" 
                   class="mt-auto w-full flex items-center justify-center gap-2 bg-[#3B7A57] text-white py-2.5 rounded text-[10px] font-black uppercase tracking-widest hover:bg-[#2D5A41] transition-all active:scale-95 shadow-lg shadow-green-50">
                   <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.484 5.229 3.484 8.409c0 6.555-5.332 11.887-11.888 11.887-2.007 0-3.974-.506-5.717-1.464l-6.17 1.619z"/></svg>
                   Chatear
                </a>
            </div>
        </div>
    `;
};

// --- 4. FILTRO DE BÚSQUEDA EN TIEMPO REAL ---
buscador.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    contenedor.innerHTML = "";
    
    const filtrados = productosData.filter(p => 
        p.titulo.toLowerCase().includes(termino)
    );

    if (filtrados.length === 0) {
        contenedor.innerHTML = `<p class="col-span-full text-center text-gray-400 py-10 italic">No se encontraron resultados para "${termino}"</p>`;
    } else {
        filtrados.forEach(p => renderizarTarjeta(p));
    }
});

// Inicializar carga
obtenerProductos();