import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getTorneos } from '../../assets/endPoints/torneos.js';
import { getOrganizadores } from '../../assets/endPoints/organizadores.js';
import { MODALIDAD_LABEL, ESTADO_LABEL, CATEGORIA_LABEL, formatPrecio, formatFecha, cupos, diaPlural } from '../../assets/torneosUtils.js';
import heroImg from '../../assets/imgs/landing/hero.jpg';
import capitanesImg from '../../assets/imgs/landing/capitanes.jpg';
import organizadoresImg from '../../assets/imgs/landing/organizadores.jpg';
import cierreImg from '../../assets/imgs/landing/cierre.jpg';
import { SkeletonCifras, SkeletonTarjetasTorneo } from '../Skeleton';
import '../../assets/styles/buscador.css';
import '../../assets/styles/landing.css';
import useTitulo from '../useTitulo';

// Fotos: Unsplash (licencia libre). hero 1431324155629, capitanes 1560272564, organizadores 1556056504, cierre 1529900748604

const PASOS = [
    { titulo: 'Armá tu equipo', texto: 'Creá tu cuenta de capitán, subí el escudo y cargá el plantel una sola vez.' },
    { titulo: 'Elegí un torneo', texto: 'Filtrá por modalidad, zona, día y precio. Ves los cupos que quedan en el momento.' },
    { titulo: 'Inscribite online', texto: 'Pagás la inscripción desde la página y tu equipo queda adentro al toque.' },
    { titulo: 'Jugá y seguí la tabla', texto: 'Fixture, horarios, cancha y posiciones actualizados después de cada fecha.' },
];

const MODALIDADES = [
    { id: 'f5', nombre: 'Fútbol 5', detalle: 'Canchas de 5, partidos de 40 min' },
    { id: 'f7', nombre: 'Fútbol 7', detalle: 'El más jugado en ligas amateur' },
    { id: 'f8', nombre: 'Fútbol 8', detalle: 'Más espacio, mismo ritmo' },
    { id: 'f11', nombre: 'Fútbol 11', detalle: 'Cancha completa, 90 minutos' },
];

const numero = (n) => new Intl.NumberFormat('es-AR').format(n);

// Pagina de entrada para quien no inició sesión
const Landing = () => {
    useTitulo('Torneos de fútbol 5, 7, 8 y 11 en Buenos Aires');
    const [torneos, setTorneos] = useState(undefined); // undefined = cargando, null = sin conexion
    const [orgs, setOrgs] = useState(null);

    useEffect(() => {
        getTorneos({}).then(d => setTorneos(Array.isArray(d) ? d : null));
        getOrganizadores().then(d => setOrgs(Array.isArray(d) ? d : null));
    }, [])

    const abiertos = torneos?.filter(t => t.estado === 'inscripcion-abierta') ?? [];
    const stats = torneos && [
        { valor: abiertos.length, label: abiertos.length === 1 ? 'torneo con inscripción abierta' : 'torneos con inscripción abierta' },
        { valor: torneos.filter(t => t.estado === 'en-curso').length, label: 'en juego ahora' },
        { valor: torneos.reduce((s, t) => s + (t.equiposInscriptos || 0), 0), label: 'equipos inscriptos' },
        ...(orgs ? [{ valor: orgs.length, label: 'organizadores' }] : []),
    ];
    const destacados = [...abiertos].sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio)).slice(0, 3);

    return (
        <div className='landing'>
            {/* ---------- Portada ---------- */}
            <section className='landing-hero' style={{ '--foto': `url(${heroImg})` }}>
                <div className='landing-hero__contenido'>
                    <span className='landing-hero__kicker'>Fútbol 5, 7, 8 y 11 · Buenos Aires</span>
                    <h1>Tu próximo torneo arranca acá.</h1>
                    <p>Encontrá torneos amateur cerca tuyo, inscribí a tu equipo en minutos y seguí el fixture y la tabla desde el celu. Y si organizás, publicá tu torneo y manejá todo en un solo lugar.</p>

                    <div className='landing-hero__acciones'>
                        <Link className='btn btn--primary' to='/torneos'>Explorar torneos</Link>
                        <Link className='btn btn--secundario landing-btn-claro' to='/registro'>Crear cuenta gratis</Link>
                    </div>
                    <p className='landing-hero__login'>¿Ya tenés cuenta? <Link to='/login'>Iniciá sesión</Link></p>
                </div>

                {!stats && torneos === undefined && <SkeletonCifras />}
                {stats && (
                    <dl className='landing-stats'>
                        {stats.map(s => (
                            <div key={s.label}>
                                <dt>{s.label}</dt>
                                <dd>{numero(s.valor)}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </section>

            {/* ---------- Modalidades ---------- */}
            <section className='landing-seccion'>
                <div className='landing-modalidades'>
                    {MODALIDADES.map(m => (
                        <Link key={m.id} className='landing-modalidad' to='/torneos'>
                            <span className='badge'>{MODALIDAD_LABEL[m.id]}</span>
                            <strong>{m.nombre}</strong>
                            <span className='muted'>{m.detalle}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ---------- Como funciona ---------- */}
            <section className='landing-seccion'>
                <header className='landing-titulo'>
                    <span className='landing-titulo__kicker'>Cómo funciona</span>
                    <h2>De la cancha del barrio a la tabla de posiciones</h2>
                </header>

                <ol className='landing-pasos'>
                    {PASOS.map((p, i) => (
                        <li key={p.titulo}>
                            <span className='landing-pasos__num'>{i + 1}</span>
                            <strong>{p.titulo}</strong>
                            <p>{p.texto}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* ---------- Para quien ---------- */}
            <section className='landing-seccion landing-perfiles'>
                <article className='landing-perfil'>
                    <img src={capitanesImg} alt='Jugador pateando la pelota en una cancha de fútbol' loading='lazy' />
                    <div className='landing-perfil__texto'>
                        <span className='landing-titulo__kicker'>Para capitanes</span>
                        <h3>Tu equipo, siempre al día</h3>
                        <ul>
                            <li>Inscribí al equipo y pagá online, sin ir a la sede.</li>
                            <li>Mirá tu próxima fecha: rival, horario y cancha.</li>
                            <li>Seguí la tabla, los resultados y tus estadísticas.</li>
                        </ul>
                        <Link className='btn btn--primary btn--chico' to='/registro?rol=capitan'>Soy capitán</Link>
                    </div>
                </article>

                <article className='landing-perfil'>
                    <img src={organizadoresImg} alt='Vista aérea de una cancha de fútbol' loading='lazy' />
                    <div className='landing-perfil__texto'>
                        <span className='landing-titulo__kicker'>Para organizadores</span>
                        <h3>Tu torneo, sin planillas</h3>
                        <ul>
                            <li>Publicá el torneo y recibí inscripciones pagas.</li>
                            <li>Armá las fechas: el fixture se genera solo.</li>
                            <li>Panel con la plata cobrada, partidos y próximas fechas.</li>
                        </ul>
                        <Link className='btn btn--primary btn--chico' to='/registro?rol=organizador'>Soy organizador</Link>
                    </div>
                </article>
            </section>

            {/* ---------- Torneos abiertos ---------- */}
            {torneos === undefined && (
                <section className='landing-seccion'>
                    <header className='landing-titulo'>
                        <span className='landing-titulo__kicker'>Inscripción abierta</span>
                        <h2>Torneos que están por arrancar</h2>
                    </header>
                    <SkeletonTarjetasTorneo n={3} />
                </section>
            )}
            {destacados.length > 0 && (
                <section className='landing-seccion'>
                    <header className='landing-titulo landing-titulo--fila'>
                        <div>
                            <span className='landing-titulo__kicker'>Inscripción abierta</span>
                            <h2>Torneos que están por arrancar</h2>
                        </div>
                        <Link className='btn btn--secundario btn--chico' to='/torneos'>Ver todos los torneos</Link>
                    </header>

                    <div className='torneos-grid'>
                        {destacados.map(tor => (
                            <article className='card-torneo' key={tor.id}>
                                <div className='card-torneo__top'>
                                    <span className='badge'>{MODALIDAD_LABEL[tor.modalidad]}</span>
                                    <span className={`estado estado--${tor.estado}`}>{ESTADO_LABEL[tor.estado]}</span>
                                </div>
                                <h3 className='card-torneo__titulo'>
                                    <Link className='card-torneo__link' to={`/torneos/${tor.id}`}>{tor.nombre}</Link>
                                </h3>
                                <ul className='card-torneo__info'>
                                    <li>📍 {tor.zona} · {tor.sede}</li>
                                    <li>📅 {formatFecha(tor.fechaInicio)} · {diaPlural(tor.diaJuego)}</li>
                                    <li>👥 {CATEGORIA_LABEL[tor.categoria]}</li>
                                </ul>
                                <div className='card-torneo__pie'>
                                    <div>
                                        <strong className='card-torneo__precio'>{formatPrecio(tor.precioInscripcion)}</strong>
                                        <span className='muted'>inscripción</span>
                                    </div>
                                    <span className={`cupos${cupos(tor) <= 3 ? ' cupos--bajo' : ''}`}>
                                        {cupos(tor)} {cupos(tor) === 1 ? 'cupo' : 'cupos'}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* ---------- Cierre ---------- */}
            <section className='landing-cierre' style={{ '--foto': `url(${cierreImg})` }}>
                <h2>¿Listos para salir a la cancha?</h2>
                <p>Crear la cuenta es gratis. Mirar los torneos, también: no hace falta registrarse.</p>
                <div className='landing-hero__acciones'>
                    <Link className='btn btn--primary' to='/registro'>Crear cuenta</Link>
                    <Link className='btn btn--secundario landing-btn-claro' to='/torneos'>Explorar sin cuenta</Link>
                </div>
            </section>
        </div>
    )
}

export default Landing;
