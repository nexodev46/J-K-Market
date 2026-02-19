import { db, auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- REFERENCIAS AL DOM ---
const menuAuth = document.getElementById('menu-auth');
const contenedor = document.getElementById('contenedor-productos');
const buscador = document.getElementById('buscador');
const contenedorSalirSidebar = document.getElementById('contenedor-salir-sidebar');
const btnCerrarSesionSidebar = document.getElementById('btn-cerrar-sesion-sidebar');

let productosData = []; 

// --- 1. GESTIÓN DE USUARIO (MENÚ DINÁMICO) ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Estado: Usuario Autenticado en el Header
        menuAuth.innerHTML = `
            <div class="flex items-center gap-2 md:gap-3">
                <a href="mis-productos.html" 
                   class="bg-[#3B7A57] text-white px-3 md:px-5 py-2 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-[#2D5A41] transition-all shadow-lg active:scale-95 text-center">
                   Mis Anuncios
                </a>

                <a href="upload.html" 
                   class="bg-[#3B7A57] text-white px-3 md:px-5 py-2 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-[#2D5A41] transition-all shadow-lg active:scale-95 text-center">
                   + Vender
                </a>

                <a href="perfil.html" class="ml-1 group flex-shrink-0">
                    <div class="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#3B7A57] overflow-hidden group-hover:border-white transition-colors">
                        <img src="${user.photoURL || 'https://via.placeholder.com/100'}" class="w-full h-full object-cover">
                    </div>
                </a>
            </div>
        `;

        // Mostrar y activar botón de cerrar sesión en el Sidebar
        if (contenedorSalirSidebar) contenedorSalirSidebar.classList.remove('hidden');
        if (btnCerrarSesionSidebar) {
            btnCerrarSesionSidebar.onclick = () => {
                signOut(auth).then(() => window.location.reload());
            };
        }

    } else {
        // Estado: Visitante
        menuAuth.innerHTML = `
            <a href="login.html" class="bg-white text-[#2D3436] px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#3B7A57] hover:text-white transition-all shadow-md">
                Entrar
            </a>
        `;
        // Ocultar botón de cerrar sesión si no hay usuario
        if (contenedorSalirSidebar) contenedorSalirSidebar.classList.add('hidden');
    }
});

// --- 2. CARGA DE PRODUCTOS DESDE FIRESTORE ---
const obtenerProductos = () => {
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
        contenedor.innerHTML = ""; 
        productosData = [];

        if (snapshot.empty) {
            contenedor.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <p class="text-gray-500 font-bold italic">No hay productos disponibles por ahora.</p>
                </div>`;
            return;
        }

        snapshot.forEach((doc) => {
            const p = { id: doc.id, ...doc.data() };
            productosData.push(p);
            renderizarTarjeta(p); 
        });
    });
};

// --- 3. FUNCIÓN PARA DIBUJAR LA TARJETA ---
const renderizarTarjeta = (p) => {
    contenedor.innerHTML += `
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl transition-all duration-500 group animate-fadeIn overflow-hidden">
            <div class="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <img src="${p.foto || 'https://via.placeholder.com/400'}" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                <div class="absolute top-4 left-4 bg-[#3B7A57] text-white text-[8px] px-3 py-1.5 rounded-full font-black uppercase tracking-[0.2em] shadow-lg">
                    Nuevo
                </div>
            </div>

            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-gray-900 font-black text-sm mb-1 truncate uppercase tracking-tighter">${p.titulo}</h3>
                <p class="text-[#3B7A57] font-black text-2xl mb-4 tracking-tighter">$${p.precio}</p>
                
                <div class="flex items-center gap-1 mb-6">
                    <span class="text-yellow-400 text-[10px]">★★★★★</span>
                    <span class="text-gray-400 text-[10px] ml-1 font-bold">4.8</span>
                </div>

                <a href="https://wa.me/${p.whatsapp}?text=Hola, me interesa tu producto: ${p.titulo}" target="_blank" 
                   class="mt-auto w-full flex items-center justify-center gap-3 bg-[#3B7A57] text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#2D5A41] transition-all active:scale-95 shadow-xl shadow-green-900/10">
                   <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.484 5.229 3.484 8.409c0 6.555-5.332 11.887-11.888 11.887-2.007 0-3.974-.506-5.717-1.464l-6.17 1.619z"/></svg>
                   Chatear
                </a>
            </div>
        </div>
    `;
};

// --- 4. FILTRO DE BÚSQUEDA ---
buscador.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    contenedor.innerHTML = "";
    
    const filtrados = productosData.filter(p => 
        p.titulo.toLowerCase().includes(termino)
    );

    if (filtrados.length === 0) {
        contenedor.innerHTML = `<div class="col-span-full text-center py-20 text-gray-400 italic">No hay resultados para "${termino}"</div>`;
    } else {
        filtrados.forEach(p => renderizarTarjeta(p));
    }
});

obtenerProductos();