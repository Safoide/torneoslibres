import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getAmistosos } from '../../assets/endPoints/amistosos.js';
import { MODALIDAD_LABEL, CATEGORIA_LABEL, formatPrecio, logoSrc } from '../../assets/torneosUtils.js';
import Avatar from '../Avatar';
import { SkeletonTarjetasTorneo } from '../Skeleton';
import '../../assets/styles/buscador.css';
import '../../assets/styles/amistosos.css';

const TZ = 'America/Argentina/Buenos_Aires';
// "lunes, 9 de noviembre" -> "Lunes, 9 de noviembre"
export const diaAmistoso = (iso) => { const s = new Date(iso).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ }); return s[0].toUpperCase() + s.slice(1); };
export const horaAmistoso = (iso) => new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });

// Tarjeta de un amistoso (listado)
export const TarjetaAmistoso = ({ a }) => (
    <article className='card-torneo amistoso-card'>
        <div className='card-torneo__top'>
            <span className='badge'>{MODALIDAD_LABEL[a.modalidad]}</span>
            <span className='amistoso-tag'>⚡ Amistoso express</span>
        </div>

        <h2 className='card-torneo__titulo'>
            <Link className='card-torneo__link' to={`/amistosos/${a.id}`}>
                <span className='amistoso-card__cuando'>{diaAmistoso(a.date)} · {horaAmistoso(a.date)} hs</span>
            </Link>
        </h2>

        <div className='amistoso-card__rival'>
            <Avatar name={a.anfitrion.name} src={logoSrc(a.anfitrion.logo)} size={32} />
            <span>Rival: <strong>{a.anfitrion.name}</strong></span>
        </div>

        <ul className='card-torneo__info'>
            <li>📍 {a.zona} · {a.sede}{a.cancha ? ` · Cancha ${a.cancha}` : ''}</li>
            <li>👥 {CATEGORIA_LABEL[a.categoria] ?? a.categoria}</li>
        </ul>

        <div className='card-torneo__pie'>
            <div>
                <span className='amistoso-precio__antes'>{formatPrecio(a.precioOriginal)}</span>
                <strong className='card-torneo__precio'>{formatPrecio(a.precio)}</strong>
                <span className='muted'>por equipo</span>
            </div>
            <span className='cupos'>50% off</span>
        </div>
    </article>
);

// Seccion "Amistosos express": lugares que quedaron libres porque un equipo no pago su fecha
const Amistosos = () => {
    const [lista, setLista] = useState(undefined); // undefined = cargando, null = error

    useEffect(() => {
        getAmistosos().then(d => setLista(Array.isArray(d) ? d : null));
    }, [])

    return (
        <div className='buscador'>
            <div className='buscador__hero amistosos-hero'>
                <span className='amistoso-tag'>⚡ Amistosos express</span>
                <h1>Jugá hoy, a mitad de precio</h1>
                <p>Cuando un equipo no paga su fecha, su lugar queda libre y se publica acá: misma cancha, mismo horario y un rival que ya está confirmado. El primero que lo toma, juega.</p>
            </div>

            {lista === undefined && <SkeletonTarjetasTorneo n={3} />}

            {lista === null && <p className='buscador__mensaje'>No pudimos cargar los amistosos. Probá de nuevo en un rato.</p>}

            {lista?.length === 0 && (
                <div className='amistosos-vacio'>
                    <strong>No hay amistosos publicados en este momento.</strong>
                    <p>Aparecen cuando un equipo no paga su fecha antes de las 23:59 del día anterior al partido. Volvé a mirar más tarde o <Link to='/torneos'>buscá un torneo</Link> para tu equipo.</p>
                </div>
            )}

            {lista?.length > 0 && (
                <div className='torneos-grid'>
                    {lista.map(a => <TarjetaAmistoso a={a} key={a.id} />)}
                </div>
            )}
        </div>
    )
}

export default Amistosos;
