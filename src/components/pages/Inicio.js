import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Torneos from './Torneos';

// Pagina principal ("/"): el organizador con organizacion va directo a su panel; el resto ve el buscador
const Inicio = () => {
    const { user, loading, organizacion } = useAuth();

    if (loading || (user?.rol === 'organizador' && organizacion === undefined)) return <div className='org-top'><p>Cargando...</p></div>;
    if (user?.rol === 'organizador' && organizacion) return <Navigate to={`/organizadores/${organizacion.id}`} replace />;

    return <Torneos />;
};

export default Inicio;
