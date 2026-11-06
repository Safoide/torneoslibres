import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Torneos from './Torneos';
import Landing from './Landing';
import { SkeletonPerfil } from '../Skeleton';

// Pagina principal ("/"): sin sesion, la landing; el organizador con organizacion, su panel; el resto, el buscador
const Inicio = () => {
    const { user, loading, organizacion } = useAuth();

    if (loading || (user?.rol === 'organizador' && organizacion === undefined)) return <SkeletonPerfil />;
    if (!user) return <Landing />;
    if (user?.rol === 'organizador' && organizacion) return <Navigate to={`/organizadores/${organizacion.id}`} replace />;

    return <Torneos />;
};

export default Inicio;
