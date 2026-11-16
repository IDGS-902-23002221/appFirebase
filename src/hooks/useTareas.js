import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { baseDatos } from '../lib/firebase'

// hook que escucha y modifica las tareas del usuario
export function useTareas(uid) {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // subcoleccion del usuario: users/{uid}/tasks
  const refTareas = useMemo(
    () => (uid ? collection(baseDatos, 'users', uid, 'tasks') : null),
    [uid]
  )

  // onSnapshot mantiene la lista sincronizada sin recargar
  useEffect(() => {
    if (!refTareas) return

    // ordenadas de la mas nueva a la mas vieja
    const consulta = query(refTareas, orderBy('createdAt', 'desc'))

    const cancelarEscucha = onSnapshot(
      consulta,
      (captura) => {
        const elementos = captura.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }))
        setTareas(elementos)
        setCargando(false)
        setError('')
      },
      (fallo) => {
        // pasa cuando las reglas no dejan leer (o falta publicarlas)
        setError(fallo.message)
        setCargando(false)
      }
    )

    // corta la escucha al desmontar o cambiar de usuario
    return cancelarEscucha
  }, [refTareas])

  // crear una tarea nueva
  const crearTarea = (titulo, descripcion = '') =>
    addDoc(refTareas, {
      title: titulo.trim(),
      description: descripcion.trim(),
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

  // editar titulo y descripcion
  const actualizarTarea = (id, datos) =>
    updateDoc(doc(refTareas, id), {
      ...datos,
      updatedAt: serverTimestamp(),
    })

  // marcar como completada o pendiente
  const alternarTarea = (id, completada) =>
    updateDoc(doc(refTareas, id), {
      completed: completada,
      updatedAt: serverTimestamp(),
    })

  // borrar una tarea
  const eliminarTarea = (id) => deleteDoc(doc(refTareas, id))

  return {
    tareas,
    cargando,
    error,
    crearTarea,
    actualizarTarea,
    alternarTarea,
    eliminarTarea,
  }
}
