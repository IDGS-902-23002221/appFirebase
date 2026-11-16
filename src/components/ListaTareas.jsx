import ElementoTarea from './ElementoTarea'

function ListaTareas({ tareas, cargando, alAlternar, alActualizar, alEliminar }) {
  if (cargando) {
    return <p className="estado">Cargando tareas...</p>
  }

  if (!tareas.length) {
    return (
      <p className="estado">
        No tienes tareas todavía. Crea la primera arriba.
      </p>
    )
  }

  return (
    <ul className="task-list">
      {tareas.map((tarea) => (
        <ElementoTarea
          key={tarea.id}
          tarea={tarea}
          alAlternar={alAlternar}
          alActualizar={alActualizar}
          alEliminar={alEliminar}
        />
      ))}
    </ul>
  )
}

export default ListaTareas
