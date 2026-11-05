import React from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoSrc } from '../../assets/torneosUtils.js';
import Avatar from '../Avatar';
import '../../assets/styles/organizador.css';
import '../../assets/styles/torneo.css';

const MiEquipo = () => {
    const { user, loading, equipo } = useAuth();

    if (loading || (user?.rol === 'capitan' && equipo === undefined)) return <div className='org-top'><p>Cargando...</p></div>;
    if (!user) return <Navigate to='/login' state={{ from: '/mi-equipo' }} replace />;
    if (user.rol !== 'capitan') return <Navigate to='/torneos' replace />;
    if (!equipo) return <Navigate to='/equipos/nuevo' replace />;

    const cant = equipo.jugadores.length;

    return (
        <div className='org-top'>
            <div className='org-head'>
                <Avatar name={equipo.nombre} src={logoSrc(equipo.logo)} size={96} />
                <div className='org-info'>
                    <h1>{equipo.nombre}</h1>
                    <p>{cant} {cant === 1 ? 'jugador' : 'jugadores'} · WhatsApp del capitán: {equipo.whatsapp}</p>
                    <div className='org-links'>
                        <Link className='btn btn--primary btn--chico' to='/mi-equipo/editar'>Editar equipo</Link>
                        <Link className='btn btn--secundario btn--chico' to='/torneos'>Buscar torneos</Link>
                    </div>
                </div>
            </div>

            <section className='seccion'>
                <h2>Plantel</h2>
                <p>Estos datos solo los ves vos y los organizadores de los torneos donde te inscribas.</p>

                {cant === 0 ? (
                    <p>Todavía no anotaste jugadores. <Link to='/mi-equipo/editar'>Agregalos acá</Link>: para inscribirte necesitás un mínimo según la modalidad (F5: 5, F7: 7, F8: 8, F11: 11).</p>
                ) : (
                    <div className='tabla-wrap'>
                        <table>
                            <thead>
                                <tr><th className='izq'>Nombre</th><th className='izq'>Apellido</th><th>DNI</th><th>Edad</th></tr>
                            </thead>
                            <tbody>
                                {equipo.jugadores.map(j => (
                                    <tr key={j.dni}>
                                        <td className='izq'>{j.nombre}</td><td className='izq'>{j.apellido}</td><td>{j.dni}</td><td>{j.edad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    )
}

export default MiEquipo;