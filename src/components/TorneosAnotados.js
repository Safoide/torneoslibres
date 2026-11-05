import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getMisTorneos } from '../assets/endPoints/clubes.js';
import { MODALIDAD_LABEL, ESTADO_LABEL, formatFecha } from '../assets/torneosUtils.js';
import '../assets/styles/mis-torneos.css';

const GRUPOS = [
    { titulo: 'En curso', estados: ['en-curso'] },
    { titulo: 'Próximos a empezar', estados: ['inscripcion-abierta', 'proximamente'] },
    { titulo: 'Finalizados', estados: ['finalizado'] },
];

// Torneos donde esta anotado el equipo del capitan. El servidor ya los manda ordenados:
// en curso (terminan antes primero), proximos (empiezan antes primero) y finalizados.
const TorneosAnotados = () => {
    const [items, setItems] = useState(undefined); // undefined = cargando

    useEffect(() => {
        getMisTorneos().then(data => setItems(Array.isArray(data) ? data : []));
    }, [])

    if (items === undefined) return null;

    return (
        <section className='seccion'>
            <h2>Torneos anotados</h2>

            {items.length === 0 ? (
                <p>Todavía no te anotaste en ningún torneo. <Link to='/torneos'>Buscá uno</Link> para inscribir a tu equipo.</p>
            ) : GRUPOS.map(({ titulo, estados }) => {
                const lista = items.filter(i => estados.includes(i.torneo.estado));
                if (!lista.length) return null;

                return (
                    <div className='anotados__grupo' key={titulo}>
                        <h3>{titulo}</h3>

                        <ul className='anotados__lista'>
                            {lista.map(({ equipoId, torneo, tabla, fechasJugadas, fechasTotales }) => (
                                <li className='anotados__item' key={equipoId}>
                                    <div className='anotados__datos'>
                                        <div className='anotados__titulo'>
                                            <span className='badge'>{MODALIDAD_LABEL[torneo.modalidad]}</span>
                                            <Link to={`/torneos/${torneo.id}`}>{torneo.nombre}</Link>
                                            <span className={`estado estado--${torneo.estado}`}>{ESTADO_LABEL[torneo.estado]}</span>
                                        </div>

                                        <p className='muted'>
                                            {tabla
                                                ? <>
                                                    <strong>{tabla.posicion}.º de {tabla.equipos}</strong> · {tabla.puntos} pts · {tabla.jugados} PJ ({tabla.ganados}G {tabla.empatados}E {tabla.perdidos}P)
                                                    {torneo.estado === 'en-curso' && fechasTotales > 0 && ` · Fecha ${Math.min(fechasJugadas + 1, fechasTotales)} de ${fechasTotales}`}
                                                  </>
                                                : <>Empieza {formatFecha(torneo.fechaInicio)} · {torneo.zona}</>}
                                        </p>
                                    </div>

                                    <div className='anotados__acciones'>
                                        {tabla && <Link className='btn btn--secundario btn--chico' to={`/equipo/${equipoId}`}>Mis partidos</Link>}
                                        <Link className='btn btn--secundario btn--chico' to={`/torneos/${torneo.id}`}>{tabla ? 'Ver tabla' : 'Ver torneo'}</Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </section>
    )
}

export default TorneosAnotados
