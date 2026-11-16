// inicializa firebase una sola vez y exporta lo que usa la app
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// las claves salen de .env.local (vite solo expone las que empiezan con VITE_)
const configuracionFirebase = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// se arma la app y se sacan los servicios que usaremos
const aplicacion = initializeApp(configuracionFirebase)
export const autenticacion = getAuth(aplicacion)
export const baseDatos = getFirestore(aplicacion)
export const proveedorGoogle = new GoogleAuthProvider()
