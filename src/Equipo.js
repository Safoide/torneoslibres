import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMisFechas } from '../assets/endPoints/fechas.js';
import { MODALIDAD_LABEL, formatPrecio, formatFecha, logoSrc } from '../assets/torneosUtils.js';
import Avatar from './Avatar';
import '../assets/styles/fechas.css';

const hora = (iso) => new Date(iso).toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires',
});

// "Tu proxima fecha": solo para capitanes. Una tarjeta por cada torneo en curso donde esta su equipo.
const ProximaFecha = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (user?.rol !== 'capitan') return setItems([]);

        getMisFechas().then(data => setItems(Array.isArray(data) ? data : []));
    }, [user])

    if (!items.length) return null;

    return (
        <section className='proxima'>
            <h2>{items.length === 1 ? 'Tu próxima fecha' : 'Tus próximas fechas'}</h2>

            <div className='proxima__lista'>
                {items.map(({ torneo, fecha, partido, equipo }) => {
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${torneo.direccion}, ${torneo.zona}, Buenos Aires`)}`;

                    return (
                        <article className='proxima__card' key={fecha.id}>
                            <div className='proxima__top'>
                                <span className='badge'>{MODALIDAD_LABEL[torneo.modalidad]}</span>
                                <Link to={`/torneos/${torneo.id}`}>{torneo.nombre}</Link>
                                {fecha.estado === 'en-juego' && <span className='fecha__estado fecha__estado--en-juego'>En juego</span>}
                            </div>

                            <p className='proxima__cuando'>
                                <strong>Fecha {fecha.numero}</strong> · {formatFecha(fecha.dia)}
                            </p>
                            <p className='muted'>{fecha.inicio} a {fecha.fin}</p>

                            {partido ? (
                                <div className='proxima__partido'>
                                    <Avatar name={partido.rival.name} src={logoSrc(partido.rival.logo)} size={40} />
                                    <div>
                                        <strong>{equipo.name} vs {partido.rival.name}</strong>
                                        <span className='muted'>{hora(partido.date)} hs{partido.cancha ? ` · Cancha ${partido.cancha}` : ''}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className='proxima__libre'>Te toca libre en esta fecha.</p>
                            )}

                            <p className='muted'>📍 {torneo.sede} · {torneo.direccion} · <a href={mapsUrl} target='_blank' rel='noreferrer'>Ver en el mapa</a></p>

                            <div className='proxima__pie'>
                                <div>
                                    <strong>{formatPrecio(fecha.precio)}</strong>
                                    <span className='muted'>por equipo</span>
                                </div>
                                <Link className='btn btn--secundario btn--chico' to={`/partidos/${torneo.id}`}>Ver fixture</Link>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    )
}

export default ProximaFecha
