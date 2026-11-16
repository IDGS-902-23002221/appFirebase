import { useState } from 'react'

function ElementoTarea({ tarea, alAlternar, alActualizar, alEliminar }) {
  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState(tarea.title)
  const [descripcion, setDescripcion] = useState(tarea.description ?? '')

  // guarda los cambios de la edicion
  const alGuardar = async (evento) => {
    evento.preventDefault()
    if (!titulo.trim()) return

    await alActualizar(tarea.id, {
      title: titulo.trim(),
      description: descripcion.trim(),
    })
    setEditando(false)
  }

  // descarta los cambios y vuelve al modo normal
  const alCancelar = () => {
    setTitulo(tarea.title)
    setDescripcion(tarea.description ?? '')
    setEditando(false)
  }

  // pide confirmacion antes de borrar
  const alBorrar = () => {
    if (window.confirm('¿Eliminar esta tarea?')) {
      alEliminar(tarea.id)
    }
  }

  return (
    <li className={`task ${tarea.completed ? 'completada' : ''}`}>
      <input
        type="checkbox"
        checked={tarea.completed}
        onChange={(evento) => alAlternar(tarea.id, evento.target.checked)}
        aria-label="Marcar como completada"
      />

      {editando ? (
        <form className="task-edit" onSubmit={alGuardar}>
          <input
            type="text"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            maxLength={120}
            required
            autoFocus
          />

          <textarea
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            maxLength={500}
            rows={2}
          />

          <div className="acciones">
            <button type="submit">Guardar</button>
            <button type="button" className="secundario" onClick={alCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="task-info">
          <p className="task-title">{tarea.title}</p>
          {tarea.description && <p className="task-desc">{tarea.description}</p>}
        </div>
      )}

      {!editando && (
        <div className="acciones">
          <button
            type="button"
            className="secundario"
            onClick={() => setEditando(true)}
          >
            Editar
          </button>
          <button type="button" className="peligro" onClick={alBorrar}>
            Eliminar
          </button>
        </div>
      )}
    </li>
  )
}

export default ElementoTarea
