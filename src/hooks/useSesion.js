import { useContext } from 'react'
import { ContextoSesion } from '../context/contextoSesion'

// atajo para consumir el contexto sin repetir el import
export function useSesion() {
  const contexto = useContext(ContextoSesion)
  if (!contexto) throw new Error('useSesion debe usarse dentro de ProveedorSesion')
  return contexto
}
