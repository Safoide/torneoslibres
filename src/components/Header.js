import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eliminarOrganizador } from '../assets/endPoints/organizadores.js';
import { eliminarEquipo } from '../assets/endPoints/clubes.js';
import EntidadMenu from './EntidadMenu';
import '../assets/styles/header.css';
import CuentaMenu from './CuentaMenu.js';
import logoDark from '../assets/imgs/logo/logo-dark.svg';
import logoLight from '../assets/imgs/logo/logo-light.svg';
import logoMobile from '../assets/imgs/logo/logo-mobile.svg';

// Iconos de la navegacion (SVG en linea, toman el color del texto)
const icono = (path) => (
    <svg className='navLink__icono' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>{path}</svg>
);
const ICONO_TORNEOS = icono(<><path d='M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z' /><path d='M17 6h3v2a3 3 0 0 1-3 3M7 6H4v2a3 3 0 0 0 3 3' /></>);
const ICONO_PANEL = icono(<><rect x='3' y='3' width='7' height='9' rx='1.5' /><rect x='14' y='3' width='7' height='5' rx='1.5' /><rect x='14' y='12' width='7' height='9' rx='1.5' /><rect x='3' y='16' width='7' height='5' rx='1.5' /></>);
const ICONO_AMISTOSOS = icono(<path d='M13 2 4 14h7l-1 8 9-12h-7l1-8Z' />);
const ICONO_EQUIPO = icono(<><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' /><circle cx='9' cy='7' r='4' /><path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' /></>);

const Header = () => {
    const { user, organizacion, setOrganizacion, equipo, setEquipo } = useAuth();

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
                    { to: `/organizadores/${organizacion.id}`, label: 'Mi panel' },
                    { to: '/organizacion/torneo/nuevo', label: 'Crear torneo' },
                    { to: '/organizacion/editar', label: 'Editar organización' },
                ]}
                textoEliminar='Eliminar organización'
                confirmar={`¿Eliminar "${organizacion.nombre}"? Se borran también sus torneos y no se puede deshacer.`}
                onEliminar={eliminarOrg}
            />
        );
    };

    // Link al inicio de cada rol: el panel del organizador o el equipo del capitan
    const inicio = user?.rol === 'organizador' && organizacion
        ? { to: `/organizadores/${organizacion.id}`, label: 'Mi panel', icono: ICONO_PANEL }
        : user?.rol === 'capitan' && equipo
            ? { to: '/mi-equipo', label: 'Mi equipo', icono: ICONO_EQUIPO }
            : null;

    return (
        <header className='header'>
            <div className='headerContainer'>
                {/* Se muestra uno solo segun el tema y el ancho de pantalla (ver header.css) */}
                <Link to='/' className='headerLogo' aria-label='Torneos Libres, inicio'>
                    <img src={logoDark} alt='' className='headerLogo__img headerLogo__img--dark' width='314' height='64' />
                    <img src={logoLight} alt='' className='headerLogo__img headerLogo__img--light' width='314' height='64' />
                    <img src={logoMobile} alt='' className='headerLogo__img headerLogo__img--mobile' width='64' height='64' />
                </Link>
                <nav className='navBar' aria-label='Secciones'>
                    {inicio && (
                        <NavLink to={inicio.to} className='navLink' aria-label={inicio.label}>
                            {inicio.icono}
                            <span className='navLink__texto'>{inicio.label}</span>
                        </NavLink>
                    )}
                    <NavLink to='/torneos' className='navLink' aria-label='Explorar torneos'>
                        {ICONO_TORNEOS}
                        <span className='navLink__texto'>Explorar torneos</span>
                    </NavLink>
                    <NavLink to='/amistosos' className='navLink' aria-label='Amistosos express'>
                        {ICONO_AMISTOSOS}
                        <span className='navLink__texto'>Amistosos</span>
                    </NavLink>
                </nav>
                <div className='userInfo'>
                    {user ? (
                        <>
                            {menuCuenta()}
                            <CuentaMenu />
                        </>
                    ) : (
                        <>
                            <Link to='/registro' className='headerRegistro'>REGISTRARSE</Link>
                            <Link to='/login'>INICIAR SESIÓN</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header