import { useState } from 'react'

function FormularioTarea({ alCrear }) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [enviando, setEnviando] = useState(false)

  // crea la tarea y limpia el formulario
  const alEnviar = async (evento) => {
    evento.preventDefault()
    if (!titulo.trim()) return

    setEnviando(true)
    try {
      await alCrear(titulo, descripcion)
      setTitulo('')
      setDescripcion('')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="task-form" onSubmit={alEnviar}>
      <input
        type="text"
        value={titulo}
        onChange={(evento) => setTitulo(evento.target.value)}
        placeholder="¿Qué tienes que hacer?"
        maxLength={120}
        required
      />

      <textarea
        value={descripcion}
        onChange={(evento) => setDescripcion(evento.target.value)}
        placeholder="Descripción (opcional)"
        maxLength={500}
        rows={2}
      />

      <button type="submit" disabled={enviando || !titulo.trim()}>
        {enviando ? 'Agregando...' : 'Agregar tarea'}
      </button>
    </form>
  )
}

export default FormularioTarea
