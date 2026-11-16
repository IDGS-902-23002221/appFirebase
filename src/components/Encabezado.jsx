import { useSesion } from '../hooks/useSesion'

function Encabezado() {
  const { usuario, cerrarSesion } = useSesion()

  return (
    <header className="header">
      <div>
        <h1>Mis tareas</h1>
        <p className="header-user">{usuario?.email}</p>
      </div>

      <button type="button" className="salir" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </header>
  )
}

export default Encabezado
