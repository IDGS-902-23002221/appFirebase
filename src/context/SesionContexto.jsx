import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { autenticacion, proveedorGoogle } from '../lib/firebase'
import { ContextoSesion } from './contextoSesion'

export function ProveedorSesion({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  // escucha la sesion: se mantiene al recargar la pagina
  useEffect(() => {
    const cancelarEscucha = onAuthStateChanged(autenticacion, (usuarioActual) => {
      setUsuario(usuarioActual)
      setCargando(false)
    })
    return cancelarEscucha
  }, [])

  // registro con correo y contrasena
  const registrar = (correo, contrasena) =>
    createUserWithEmailAndPassword(autenticacion, correo, contrasena)

  // inicio de sesion con correo
  const iniciarSesion = (correo, contrasena) =>
    signInWithEmailAndPassword(autenticacion, correo, contrasena)

  // inicio de sesion con la ventana de google
  const iniciarConGoogle = () => signInWithPopup(autenticacion, proveedorGoogle)

  // cerrar sesion
  const cerrarSesion = () => signOut(autenticacion)

  const valor = {
    usuario,
    cargando,
    registrar,
    iniciarSesion,
    iniciarConGoogle,
    cerrarSesion,
  }

  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>
}
