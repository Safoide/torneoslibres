import React from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eliminarOrganizador } from '../assets/endPoints/organizadores.js';
import { eliminarEquipo } from '../assets/endPoints/clubes.js';
import EntidadMenu from './EntidadMenu';
import '../assets/styles/header.css';
import CuentaMenu from './CuentaMenu.js';

const Header = () => {
    const { user, organizacion, setOrganizacion, equipo, setEquipo, logout } = useAuth();

    const eliminarOrg = async () => {
        const data = await eliminarOrganizador(organizacion.id);
        if (data && !data.error) setOrganizacion(null);
        return data;
    };

    const eliminarEquipoPropio = async () => {
        const data = await eliminarEquipo(equipo.id);
        if (data && !data.error) setEquipo(null);
        return data;
    };

    const menuCuenta = () => {
        if (user.rol === 'capitan') {
            if (equipo === undefined) return null; // cargando
            if (!equipo) return <Link to='/equipos/nuevo'>CREAR EQUIPO</Link>;

            return (
                <EntidadMenu
                    nombre={equipo.nombre} logo={equipo.logo}
                    items={[{ to: '/mi-equipo', label: 'Ver equipo' }, { to: '/mi-equipo/editar', label: 'Editar equipo' }]}
                    textoEliminar='Eliminar equipo'
                    confirmar={`¿Eliminar el equipo "${equipo.nombre}" y su plantel? No se puede deshacer.`}
                    onEliminar={eliminarEquipoPropio}
                />
            );
        }

        if (organizacion === undefined) return null; // cargando
        if (!organizacion) return <Link to='/organizaciones/nueva'>CREAR ORGANIZACIÓN</Link>;

        return (
            <EntidadMenu
                nombre={organizacion.nombre} logo={organizacion.logo}
                items={[
                    { to: `/organizadores/${organizacion.id}`, label: 'Ver perfil' },
                    { to: '/organizacion/torneo/nuevo', label: 'Crear torneo' },
                    { to: '/organizacion/editar', label: 'Editar organización' },
                ]}
                textoEliminar='Eliminar organización'
                confirmar={`¿Eliminar "${organizacion.nombre}"? Se borran también sus torneos y no se puede deshacer.`}
                onEliminar={eliminarOrg}
            />
        );
    };

    return (
        <header className='header'>
            <div className='headerContainer'>
                <Link to='/torneos' className='headerLogo'>⚽ TORNEOS LIBRES</Link>
                <nav className='navBar'>
                    <Link to='/torneos'>BUSCAR TORNEOS</Link>
                </nav>
                <div className='userInfo'>
                    {user ? (
                        <>
                            {menuCuenta()}
                            <CuentaMenu />
                        </>
                    ) : (
                        <>
                            <Link to='/registro'>REGISTRARSE</Link>
                            <Link to='/login'>INICIAR SESIÓN</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header