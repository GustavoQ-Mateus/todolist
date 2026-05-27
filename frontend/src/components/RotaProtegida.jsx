import { Navigate } from 'react-router-dom'

export default function RotaProtegida({ children }) {
  const token = localStorage.getItem('access')
  if (!token) return <Navigate to="/login" replace />
  return children
}
