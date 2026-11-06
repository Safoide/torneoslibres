import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getTorneos, getFiltros } from '../assets/endPoints/torneos.js';
import { getOrganizadores } from '../assets/endPoints/organizadores.js';
import {
    MODALIDAD_LABEL, ESTADO_LABEL, CATEGORIA_LABEL,
    formatPrecio, formatMonto, formatFecha, cupos, diaPlural,
    logoSrc, etiquetaLimiteEdad,
} from '../assets/torneosUtils.js';
import Avatar from './Avatar';
import ProximaFecha from './ProximaFecha';
import { SkeletonTarjetasTorneo } from './Skeleton';
import '../assets/styles/buscador.css';

const EMPTY_FILTERS = {
    q: '', modalidad: [], zona: '', categoria: '', estado: '', precioMax: '', desde: '', orden: 'fecha',
};

// Si recibe organizadorId, solo muestra los torneos de ese organizador (mismos filtros).
// ganancias ({ [torId]: { ingresos, inscripciones, fechas } }) solo llega cuando el organizador mira su propio perfil
const BuscadorTorneos = ({ organizadorId, ganancias }) => {

    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [opciones, setOpciones] = useState({ zonas: [], categorias: [], estados: [] });
    const [orgs, setOrgs] = useState({});
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cargado, setCargado] = useState(false); // ya llego la primera respuesta
    const [error, setError] = useState(false);

    useEffect(() => {
        getFiltros().then(data => data && setOpciones(data));
        getOrganizadores().then(list => Array.isArray(list) && setOrgs(Object.fromEntries(list.map(o => [o.id, o]))));
    }, [])

    // Busca cada vez que cambian los filtros (con un pequeño delay para no pedir en cada tecla)
    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        const timer = setTimeout(() => {
            getTorneos({ ...filters, organizadorId }).then(data => {
                if (cancelled) return;
                setError(!Array.isArray(data));
                setTorneos(Array.isArray(data) ? data : []);
                setLoading(false);
                setCargado(true);
            });
        }, 250);

        return () => { cancelled = true; clearTimeout(timer); };
    }, [filters, organizadorId])

    const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

    const toggleModalidad = (mod) => setFilters(prev => ({
        ...prev,
        modalidad: prev.modalidad.includes(mod) ? prev.modalidad.filter(m => m !== mod) : [...prev.modalidad, mod],
    }));

    const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

    return (
        <div className='buscador'>
            {!organizadorId && <ProximaFecha />}

            {!organizadorId && (
                <div className='buscador__hero'>
                    <h1>Encontrá tu próximo torneo</h1>
                    <p>Torneos de fútbol 5, 7, 8 y 11 en Buenos Aires</p>
                </div>
            )}

            <section className='filtros'>
                <input
                    className='filtros__busqueda'
                    type='search'
                    placeholder='Buscar por nombre, organizador o cancha...'
                    value={filters.q}
                    onChange={e => setFilter('q', e.target.value)}
                />

                <div className='chips'>
                    {Object.entries(MODALIDAD_LABEL).map(([key, label]) => (
                        <button
                            type='button'
                            key={key}
                            className={`chip${filters.modalidad.includes(key) ? ' chip--activo' : ''}`}
                            aria-pressed={filters.modalidad.includes(key)}
                            onClick={() => toggleModalidad(key)}
                        >{label}</button>
                    ))}
                </div>

                <div className='filtros__selects'>
                    <div className='campo'>
                        <label htmlFor='zona'>Zona</label>
                        <select id='zona' value={filters.zona} onChange={e => setFilter('zona', e.target.value)}>
                            <option value=''>Todas</option>
                            {opciones.zonas.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                    </div>

                    <div className='campo'>
                        <label htmlFor='categoria'>Categoría</label>
                        <select id='categoria' value={filters.categoria} onChange={e => setFilter('categoria', e.target.value)}>
                            <option value=''>Todas</option>
                            {opciones.categorias.map(c => <option key={c} value={c}>{CATEGORIA_LABEL[c] || c}</option>)}
                        </select>
                    </div>

                    <div className='campo'>
                        <label htmlFor='estado'>Estado</label>
                        <select id='estado' value={filters.estado} onChange={e => setFilter('estado', e.target.value)}>
                            <option value=''>Todos</option>
                            {opciones.estados.map(s => <option key={s} value={s}>{ESTADO_LABEL[s] || s}</option>)}
                        </select>
                    </div>

                    <div className='campo'>
                        <label htmlFor='precioMax'>Inscripción hasta ($)</label>
                        <input
                            id='precioMax' type='number' min='0' step='5000' placeholder='Sin límite'
                            value={filters.precioMax} onChange={e => setFilter('precioMax', e.target.value)}
                        />
                    </div>

                    <div className='campo'>
                        <label htmlFor='desde'>Desde</label>
                        <input id='desde' type='date' value={filters.desde} onChange={e => setFilter('desde', e.target.value)} />
                    </div>

                    <div className='campo'>
                        <label htmlFor='orden'>Ordenar por</label>
                        <select id='orden' value={filters.orden} onChange={e => setFilter('orden', e.target.value)}>
                            <option value='fecha'>Fecha de inicio</option>
                            <option value='precio'>Menor precio</option>
                            <option value='nombre'>Nombre</option>
                        </select>
                    </div>
                </div>

                <div className='filtros__barra'>
                    <span aria-live='polite'>
                        {loading ? 'Buscando...' : `${torneos.length} ${torneos.length === 1 ? 'torneo' : 'torneos'}`}
                    </span>
                    {hasFilters && <button type='button' className='link-btn' onClick={() => setFilters(EMPTY_FILTERS)}>Limpiar filtros</button>}
                </div>
            </section>

            {error && <p className='buscador__mensaje'>No pudimos cargar los torneos. Revisá que la API esté corriendo.</p>}

            {!error && !loading && torneos.length === 0 && (
                <p className='buscador__mensaje'>No hay torneos con esos filtros. Probá ampliando la búsqueda.</p>
            )}

            {/* Primera carga: skeletons. Al cambiar filtros se dejan los resultados anteriores atenuados para que no parpadee */}
            {!cargado && !error && <SkeletonTarjetasTorneo />}

            <div className={`torneos-grid${loading && cargado ? ' torneos-grid--actualizando' : ''}`} aria-busy={loading}>
                {torneos.map(tor => (
                    <article className='card-torneo' key={tor.id}>
                        <div className='card-torneo__top'>
                            <span className='badge'>{MODALIDAD_LABEL[tor.modalidad]}</span>
                            <span className={`estado estado--${tor.estado}`}>{ESTADO_LABEL[tor.estado]}</span>
                        </div>

                        <h2 className='card-torneo__titulo'>
                            <Link className='card-torneo__link' to={`/torneos/${tor.id}`}>{tor.nombre}</Link>
                        </h2>

                        {!organizadorId && (
                            <Link className='card-torneo__org' to={`/organizadores/${tor.organizadorId}`}>
                                <Avatar name={tor.organizador} src={orgs[tor.organizadorId]?.logo ? logoSrc(orgs[tor.organizadorId].logo) : null} size={24} />
                                {tor.organizador}
                            </Link>
                        )}

                        <ul className='card-torneo__info'>
                            <li>📍 {tor.zona}{tor.localidad !== 'CABA' ? ` (${tor.localidad})` : ''} · {tor.sede}</li>
                            <li>📅 {formatFecha(tor.fechaInicio)} · {diaPlural(tor.diaJuego)}</li>
                            <li>👥 {CATEGORIA_LABEL[tor.categoria]}{tor.limiteEdad ? ` · ${etiquetaLimiteEdad(tor.limiteEdad)}` : ''}</li>
                        </ul>

                        <div className='card-torneo__pie'>
                            <div>
                                <strong className='card-torneo__precio'>{formatPrecio(tor.precioInscripcion)}</strong>
                                <span className='muted'>inscripción</span>
                            </div>
                            {tor.estado === 'inscripcion-abierta' && (
                                <span className={`cupos${cupos(tor) <= 3 ? ' cupos--bajo' : ''}`}>
                                    {cupos(tor)} {cupos(tor) === 1 ? 'cupo' : 'cupos'}
                                </span>
                            )}
                        </div>

                        {ganancias?.[tor.id] && (
                            <div className='card-torneo__ganado'>
                                <div>
                                    <span className='muted'>Ganado</span>
                                    <strong>{formatMonto(ganancias[tor.id].ingresos)}</strong>
                                </div>
                                <span className='muted'>
                                    {formatMonto(ganancias[tor.id].inscripciones)} inscripciones
                                    {ganancias[tor.id].fechas > 0 && <> · {formatMonto(ganancias[tor.id].fechas)} fechas</>}
                                </span>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </div>
    )
}

export default BuscadorTorneos;
