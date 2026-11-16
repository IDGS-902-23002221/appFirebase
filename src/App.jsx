import { useSesion } from './hooks/useSesion'
import { useTareas } from './hooks/useTareas'
import PantallaAuth from './components/PantallaAuth'
import Encabezado from './components/Encabezado'
import FormularioTarea from './components/FormularioTarea'
import ListaTareas from './components/ListaTareas'

// pantalla principal: solo se monta cuando ya hay sesion
function PanelTareas({ usuario }) {
  const {
    tareas,
    cargando,
    error,
    crearTarea,
    actualizarTarea,
    alternarTarea,
    eliminarTarea,
  } = useTareas(usuario.uid)

  return (
    <div className="app">
      <Encabezado />

      <main className="contenido">
        <FormularioTarea alCrear={crearTarea} />

        {error && (
          <p className="error">No se pudieron cargar las tareas: {error}</p>
        )}

        <ListaTareas
          tareas={tareas}
          cargando={cargando}
          alAlternar={alternarTarea}
          alActualizar={actualizarTarea}
          alEliminar={eliminarTarea}
        />
      </main>
    </div>
  )
}

function App() {
  const { usuario, cargando } = useSesion()

  // mientras firebase revisa si hay sesion guardada
  if (cargando) return <p className="pantalla-cargando">Cargando...</p>

  // sin sesion solo se ve el login
  if (!usuario) return <PantallaAuth />

  return <PanelTareas usuario={usuario} />
}

export default App
