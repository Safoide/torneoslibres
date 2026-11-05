import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getTorneoById } from '../../assets/endPoints/torneos.js';
import { getEquiposByTournament } from '../../assets/endPoints/equipos';
import {
    MODALIDAD_LABEL, ESTADO_LABEL, CATEGORIA_LABEL,
    formatPrecio, formatFecha, cupos, whatsappLink, diaPlural, logoSrc
} from '../../assets/torneosUtils.js';
import Avatar from '../Avatar';
import '../../assets/styles/torneo.css';
import { useAuth } from '../../context/AuthContext';


// Los logos de equipos son archivos en src/assets/imgs. Si no existe, devuelve null (se muestra la inicial)

const Torneo = () => {

    const { torneo: torId } = useParams();
    const { user } = useAuth();

    const [tor, setTor] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [status, setStatus] = useState('loading'); // loading | ok | notfound | error

    useEffect(() => {
        setStatus('loading');

        getTorneoById(torId).then(data => {
            if (!data) return setStatus('error');
            if (data.error) return setStatus('notfound');
            setTor(data);
            setStatus('ok');
        });
    }, [torId])

    useEffect(() => {
        getEquiposByTournament(torId)
            .then(data => setEquipos(Array.isArray(data) ? data : []));
    }, [torId])

    if (status === 'loading') return <div className='torneo'><p>Cargando...</p></div>;

    if (status !== 'ok') return (
        <div className='torneo'>
            <p>{status === 'notfound' ? 'No encontramos ese torneo.' : 'No pudimos cargar el torneo. Revisá que la API esté corriendo.'}</p>
            <Link className='back-link' to='/torneos'>← Volver a la búsqueda</Link>
        </div>
    );

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${tor.direccion}, ${tor.zona}, Buenos Aires`)}`;
    const abierto = tor.estado === 'inscripcion-abierta';
    const empezado = tor.estado === 'en-curso' || tor.estado === 'finalizado';
    const tabla = [...equipos].sort((a, b) =>
        b.points - a.points || b.goal_difference - a.goal_difference || b.goals_for - a.goals_for);

    return (
        <div className='torneo'>
            <Link className='back-link' to='/torneos'>← Volver a la búsqueda</Link>

            <div className='torneo__titulo'>
                <span className='badge'>{MODALIDAD_LABEL[tor.modalidad]}</span>
                <h1>{tor.nombre}</h1>
            </div>

            <p className='torneo__organizador'>
                Organiza <Link to={`/organizadores/${tor.organizadorId}`}>{tor.organizador}</Link> · <span className={`estado estado--${tor.estado}`}>{ESTADO_LABEL[tor.estado]}</span>
            </p>

            <p>{tor.descripcion}</p>

            <dl className='detalles'>
                <div className='detalles__fila'><dt>Inicio</dt><dd>{formatFecha(tor.fechaInicio)}</dd></div>
                <div className='detalles__fila'><dt>Días y horario</dt><dd>{diaPlural(tor.diaJuego)} · {tor.horario}</dd></div>
                <div className='detalles__fila'><dt>Formato</dt><dd>{tor.formato}</dd></div>
                <div className='detalles__fila'><dt>Categoría</dt><dd>{CATEGORIA_LABEL[tor.categoria]}</dd></div>
                <div className='detalles__fila'><dt>Sede</dt><dd>{tor.sede}</dd></div>
                <div className='detalles__fila'>
                    <dt>Dirección</dt>
                    <dd>{tor.direccion}, {tor.zona}{tor.localidad !== 'CABA' ? ` (${tor.localidad})` : ''} · <a href={mapsUrl} target='_blank' rel='noreferrer'>Ver en el mapa</a></dd>
                </div>
                <div className='detalles__fila'><dt>Inscripción</dt><dd>{formatPrecio(tor.precioInscripcion)}</dd></div>
                <div className='detalles__fila'><dt>Por fecha</dt><dd>{formatPrecio(tor.precioFecha)}</dd></div>
                <div className='detalles__fila'>
                    <dt>Equipos</dt>
                    <dd>{tor.equiposInscriptos} de {tor.equiposMax}{abierto ? ` · ${cupos(tor)} cupos disponibles` : ''}</dd>
                </div>
            </dl>

            <section className='seccion'>
                <h2>{empezado ? 'Tabla de posiciones' : 'Equipos inscriptos'}</h2>

                {tabla.length === 0 && <p>Todavía no hay equipos inscriptos.</p>}

                {tabla.length > 0 && !empezado && (
                    <ul className='equipos-lista'>
                        {tabla.map(eq => (
                            <li key={eq.id}>
                                <Avatar name={eq.name} src={logoSrc(eq.logo)} />
                                <Link to={`/equipo/${eq.id}`}>{eq.name}</Link>
                            </li>
                        ))}
                    </ul>
                )}

                {tabla.length > 0 && empezado && (
                    <div className='tabla-wrap'>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th><th className='izq'>Equipo</th>
                                    <th title='Jugados'>J</th><th title='Ganados'>G</th><th title='Empatados'>E</th>
                                    <th title='Perdidos'>P</th><th title='Goles a favor'>GF</th>
                                    <th title='Goles en contra'>GC</th><th title='Diferencia'>DG</th><th title='Puntos'>PTS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tabla.map((eq, i) => (
                                    <tr key={eq.id}>
                                        <td>{i + 1}</td>
                                        <td className='izq'>
                                            <div className='equipo-celda'>
                                                <Avatar name={eq.name} src={logoSrc(eq.logo)} />
                                                <Link to={`/equipo/${eq.id}`}>{eq.name}</Link>
                                            </div>
                                        </td>
                                        <td>{eq.played}</td><td>{eq.wins}</td><td>{eq.draws}</td><td>{eq.losses}</td>
                                        <td>{eq.goals_for}</td><td>{eq.goals_against}</td><td>{eq.goal_difference}</td>
                                        <td><strong>{eq.points}</strong></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {abierto && cupos(tor) > 0 && (!user || user.rol === 'capitan') && (
                <Link className='btn btn--primary' to={`/torneos/${tor.id}/inscripcion`}>
                    Inscribir mi equipo · {formatPrecio(tor.precioInscripcion)}
                </Link>
            )}

            {empezado && (
                <Link className='btn btn--secundario' to={`/partidos/${tor.id}`}>
                    Ver fixture y fechas
                </Link>
            )}

            {tor.whatsapp && (
                <a className='btn btn--whatsapp' href={whatsappLink(tor)} target='_blank' rel='noreferrer'>
                    Consultar al organizador por WhatsApp
                </a>
            )}
        </div>
    )
}

export default Torneo
