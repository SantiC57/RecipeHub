import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../Contexto/AuthContext'; // Ajusta la ruta si tu carpeta 'Contexto' está en otro lugar

const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isLoggedIn } = useAuth(); // Obtenemos el estado de autenticación del contexto

  if (!isLoggedIn) {
    // Si el usuario no está logueado, redirigimos a la página de login
    // `replace` asegura que la entrada actual en el historial sea reemplazada,
    // para que al hacer clic en "atrás" no regrese a la página protegida.
    // También puedes pasar el estado `{ state: { from: location } }` para
    // saber a dónde redirigir después del login, pero por ahora lo simplificamos.
    return <Navigate to={redirectTo} replace />;
  }

  // Si el usuario está logueado, renderizamos los componentes hijos (la ruta a la que se intentó acceder)
  // `children` es para cuando lo usas como <ProtectedRoute><MyComponent /></ProtectedRoute>
  // `Outlet` es para cuando lo usas como un layout route para rutas anidadas.
  // Es bueno tener ambos o solo `Outlet` si siempre vas a anidar rutas.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;