import { useState } from 'react'
import { useSesion } from '../hooks/useSesion'

// traduce los errores mas comunes de firebase a algo entendible
const ERRORES = {
  'auth/invalid-email': 'El correo no es válido.',
  'auth/missing-password': 'Escribe una contraseña.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/email-already-in-use': 'Ese correo ya está registrado.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'No existe una cuenta con ese correo.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google.',
  'auth/account-exists-with-different-credential':
    'Ese correo ya usa otro método de acceso.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase.',
}

function PantallaAuth() {
  const { registrar, iniciarSesion, iniciarConGoogle } = useSesion()
  const [modo, setModo] = useState('login') // 'login' o 'registro'
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const esRegistro = modo === 'registro'

  // envia el formulario segun el modo activo
  const alEnviar = async (evento) => {
    evento.preventDefault()
    setError('')
    setCargando(true)
    try {
      if (esRegistro) {
        await registrar(correo, contrasena)
      } else {
        await iniciarSesion(correo, contrasena)
      }
    } catch (fallo) {
      setError(ERRORES[fallo.code] || 'Algo salió mal. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  // login con la ventana emergente de google
  const alEntrarConGoogle = async () => {
    setError('')
    setCargando(true)
    try {
      await iniciarConGoogle()
    } catch (fallo) {
      setError(ERRORES[fallo.code] || 'No se pudo entrar con Google.')
    } finally {
      setCargando(false)
    }
  }

  // cambia entre entrar y registrarse
  const cambiarModo = () => {
    setModo(esRegistro ? 'login' : 'registro')
    setError('')
  }

  return (
    <main className="auth">
      <div className="auth-card">
        <h1>Mis tareas</h1>
        <p className="auth-sub">
          {esRegistro ? 'Crea tu cuenta' : 'Entra a tu cuenta'}
        </p>

        <form onSubmit={alEnviar} className="auth-form">
          <label>
            Correo
            <input
              type="email"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              required
              autoComplete="email"
              placeholder="tu@correo.com"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              required
              minLength={6}
              autoComplete={esRegistro ? 'new-password' : 'current-password'}
              placeholder="mínimo 6 caracteres"
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Espera...' : esRegistro ? 'Registrarme' : 'Entrar'}
          </button>
        </form>

        <div className="divisor">
          <span>o</span>
        </div>

        <button
          type="button"
          className="google"
          onClick={alEntrarConGoogle}
          disabled={cargando}
        >
          Continuar con Google
        </button>

        <p className="cambiar">
          {esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button type="button" className="link" onClick={cambiarModo}>
            {esRegistro ? 'Entra' : 'Regístrate'}
          </button>
        </p>
      </div>
    </main>
  )
}

export default PantallaAuth
