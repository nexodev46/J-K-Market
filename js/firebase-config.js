// Importamos las herramientas básicas de Firebase desde la web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Tus credenciales (Sacadas de tu captura)
const firebaseConfig = {
  apiKey: "AIzaSyDm9y252bRmyLlduW4InB5EYgxi9AjC8Kg",
  authDomain: "jk-market.firebaseapp.com",
  projectId: "jk-market",
  storageBucket: "jk-market.firebasestorage.app",
  messagingSenderId: "633476239588",
  appId: "1:633476239588:web:fd5619e8d9765097c09cf1",
  measurementId: "G-J4G21TDDDX"
};

// Inicializamos Firebase y sus servicios
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Exportamos para que los otros archivos (main.js, upload.js) puedan usarlos
export { db, auth, storage };

console.log("🔥 Firebase conectado correctamente a J^K Market");