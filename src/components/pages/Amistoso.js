import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAmistoso, tomarAmistoso } from '../../assets/endPoints/amistosos.js';
import { MODALIDAD_LABEL, MIN_JUGADORES, CATEGORIA_LABEL, formatPrecio, logoSrc } from '../../assets/torneosUtils.js';
import Avatar from '../Avatar';
import PagoForm from '../PagoForm';
import CompartirAmistoso from '../CompartirAmistoso';
import { SkeletonTorneo } from '../Skeleton';
import { diaAmistoso, horaAmistoso } from './Amistosos';
import '../../assets/styles/torneo.css';
import '../../assets/styles/fechas.css';
import '../../assets/styles/amistosos.css';
import useTitulo from '../useTitulo';

// Un amistoso express: es la pagina del link que comparte el capitan. Desde aca se toma y se paga.
const Amistoso = () => {
    const { id } = useParams();
    const { user, equipo } = useAuth();
    const [a, setA] = useState(undefined); // undefined = cargando, null = no existe
    useTitulo(a && !a.error ? `Amistoso · ${a.torneo}` : 'Amistoso', a && !a.error ? `Partido amistoso de ${MODALIDAD_LABEL[a.modalidad]} en ${a.sede}, ${a.zona}. Un lugar libre del torneo ${a.torneo}, a mitad de precio.` : undefined);
    const [pagando, setPagando] = useState(false);
    const [tomado, setTomado] = useState(false); // lo acabo de tomar yo

    useEffect(() => {
        getAmistoso(id).then(d => setA(d && !d.error ? d : null));
    }, [id])

    if (a === undefined) return <SkeletonTorneo />;

    if (a === null) return (
        <div className='torneo'>
            <p>No encontramos ese amistoso.</p>
            <Link className='back-link' to='/amistosos'>← Ver amistosos express</Link>
        </div>
    );

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.direccion}, ${a.zona}, Buenos Aires`)}`;
    const empezo = Date.parse(a.date) <= Date.now();
    const esMio = !!equipo && equipo.nombre === a.anfitrion.name; // el equipo que pago y busca rival
    const faltan = user?.rol === 'capitan' && equipo ? Math.max((MIN_JUGADORES[a.modalidad] ?? 0) - equipo.jugadores.length, 0) : 0;

    // Que puede hacer quien mira la pagina
    const accion = () => {
        if (tomado) return (
            <div className='aviso aviso--ok'>
                <strong>¡Listo! El amistoso es de ustedes.</strong>
                <p>Lo vas a ver en "Tu próxima fecha". Juegan contra {a.anfitrion.name} el {diaAmistoso(a.date)} a las {horaAmistoso(a.date)} hs.</p>
                <Link className='btn btn--secundario btn--chico' to='/torneos'>Ir al inicio</Link>
            </div>
        );
        if (a.estado === 'tomado') return <div className='aviso aviso--error'><strong>Otro equipo ya tomó este amistoso.</strong><p><Link to='/amistosos'>Mirá si hay otros publicados</Link>.</p></div>;
        if (empezo) return <div className='aviso'><strong>Este amistoso ya empezó.</strong></div>;
        if (esMio) return (
            <div className='aviso aviso--ok'>
                <strong>Este es el amistoso de tu equipo.</strong>
                <p>Pasale el link a otro equipo para que lo tome:</p>
                <CompartirAmistoso id={a.id} />
            </div>
        );
        if (!user) return (
            <div className='aviso'>
                <strong>Para tomarlo necesitás una cuenta de capitán con tu equipo armado.</strong>
                <div className='compartir__acciones'>
                    <Link className='btn btn--primary btn--chico' to='/login' state={{ from: `/amistosos/${a.id}` }}>Iniciar sesión</Link>
                    <Link className='btn btn--secundario btn--chico' to='/registro?rol=capitan' state={{ from: `/amistosos/${a.id}` }}>Crear cuenta</Link>
                </div>
            </div>
        );
        if (user.rol !== 'capitan') return <div className='aviso'><strong>Solo las cuentas de capitán pueden tomar amistosos.</strong></div>;
        if (!equipo) return <div className='aviso'><strong>Primero armá tu equipo.</strong><p><Link to='/equipos/nuevo'>Crear mi equipo</Link></p></div>;
        if (faltan > 0) return (
            <div className='aviso aviso--error'>
                <strong>Para {MODALIDAD_LABEL[a.modalidad]} necesitás al menos {MIN_JUGADORES[a.modalidad]} jugadores (te faltan {faltan}).</strong>
                <p><Link to='/mi-equipo/editar'>Completar el plantel</Link></p>
            </div>
        );

        return pagando ? (
            <PagoForm
                monto={a.precio}
                textoBoton={`Tomar amistoso · ${formatPrecio(a.precio)}`}
                onCancelar={() => setPagando(false)}
                onPagar={async (body) => {
                    const data = await tomarAmistoso(a.id, body);
                    if (data && !data.error) { setA(data); setTomado(true); setPagando(false); }
                    return data;
                }}
            />
        ) : (
            <button type='button' className='btn btn--primary' onClick={() => setPagando(true)}>
                Tomar amistoso con {equipo.nombre} · {formatPrecio(a.precio)}
            </button>
        );
    };

    return (
        <div className='torneo'>
            <Link className='back-link' to='/amistosos'>← Amistosos express</Link>

            <div className='torneo__titulo'>
                <span className='badge'>{MODALIDAD_LABEL[a.modalidad]}</span>
                <span className='amistoso-tag'>⚡ Amistoso express</span>
            </div>
            <h1 className='amistoso__titulo'>{diaAmistoso(a.date)} · {horaAmistoso(a.date)} hs</h1>

            <div className='amistoso__rival'>
                <Avatar name={a.anfitrion.name} src={logoSrc(a.anfitrion.logo)} size={56} />
                <div>
                    <span className='muted'>Rival confirmado (ya pagó su parte)</span>
                    <strong>{a.anfitrion.name}</strong>
                </div>
            </div>

            <dl className='detalles'>
                <div className='detalles__fila'><dt>Sede</dt><dd>{a.sede}{a.cancha ? ` · Cancha ${a.cancha}` : ''}</dd></div>
                <div className='detalles__fila'><dt>Dirección</dt><dd>{a.direccion}, {a.zona} · <a href={mapsUrl} target='_blank' rel='noreferrer'>Ver en el mapa</a></dd></div>
                <div className='detalles__fila'><dt>Categoría</dt><dd>{CATEGORIA_LABEL[a.categoria] ?? a.categoria}</dd></div>
                <div className='detalles__fila'><dt>Organiza</dt><dd><Link to={`/organizadores/${a.organizadorId}`}>{a.organizador}</Link> · {a.torneo}</dd></div>
                <div className='detalles__fila'>
                    <dt>Precio</dt>
                    <dd><span className='amistoso-precio__antes'>{formatPrecio(a.precioOriginal)}</span> <strong>{formatPrecio(a.precio)}</strong> por equipo</dd>
                </div>
            </dl>

            <p className='muted'>Es un partido amistoso: no suma para la tabla del torneo. Se juega en el horario y la cancha que ya estaban reservados.</p>

            <div className='amistoso__accion'>{accion()}</div>
        </div>
    )
}

export default Amistoso;
