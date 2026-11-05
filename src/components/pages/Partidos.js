import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PartidoItem from '../PartidoItem';
import { getTorneoById } from '../../assets/endPoints/torneos.js';
import { getEquiposByTournament } from '../../assets/endPoints/equipos';
import { getPartidosByTournament } from '../../assets/endPoints/partidos';
import { getFechasByTorneo, crearFecha, cancelarFecha } from '../../assets/endPoints/fechas.js';
import { formatPrecio, formatFecha } from '../../assets/torneosUtils.js';
import '../../assets/styles/fechas.css';

const ESTADO_FECHA = { programada: 'Programada', 'en-juego': 'En juego', jugada: 'Jugada' };
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const iso = (d) => d.toISOString().slice(0, 10);
const hoy = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());

// Proximo dia (despues de la ultima fecha y desde hoy) que cae en el dia de juego del torneo
const diaSugerido = (tor, fechas) => {
    const base = fechas.length ? fechas[0].dia : null; // fechas viene ordenada de la mas nueva a la mas vieja
    const desde = new Date(`${base && base >= hoy() ? base : hoy()}T12:00:00Z`);
    if (base && base >= hoy()) desde.setUTCDate(desde.getUTCDate() + 1);

    for (let i = 0; i < 7; i++) {
        if (DIAS[desde.getUTCDay()] === tor.diaJuego) break;
        desde.setUTCDate(desde.getUTCDate() + 1);
    }

    return iso(desde);
};

const Partidos = () => {
    const { torneo } = useParams();
    const { user, organizacion } = useAuth();

    const [tor, setTor] = useState(null);
    const [equipos, setEquipos] = useState({});
    const [partidos, setPartidos] = useState([]);
    const [fechas, setFechas] = useState([]);
    const [estado, setEstado] = useState('loading'); // loading | ok | error

    const [abierto, setAbierto] = useState(false);
    const [form, setForm] = useState({ dia: '', inicio: '', fin: '', canchas: 2 });
    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);

    const cargar = useCallback(async () => {
        const [t, eq, pa, fe] = await Promise.all([
            getTorneoById(torneo), getEquiposByTournament(torneo), getPartidosByTournament(torneo), getFechasByTorneo(torneo),
        ]);

        if (!t || t.error) return setEstado('error');

        setTor(t);
        setEquipos(Array.isArray(eq) ? Object.fromEntries(eq.map(e => [e.id, e])) : {});
        setPartidos(Array.isArray(pa) ? pa : []);
        setFechas(Array.isArray(fe) ? fe : []);
        setEstado('ok');
    }, [torneo]);

    useEffect(() => { cargar(); }, [cargar])

    if (estado === 'loading') return <div className='fixture'><p>Cargando...</p></div>;
    if (estado === 'error') return <div className='fixture'><p>No encontramos ese torneo.</p><Link className='back-link' to='/torneos'>← Volver a la búsqueda</Link></div>;

    const esDueño = user?.rol === 'organizador' && organizacion?.id === tor.organizadorId;
    const puedeCrear = esDueño && tor.estado === 'en-curso';

    const abrirForm = () => {
        // Horario de juego del torneo ("16:00 a 22:00") como valor inicial
        const horas = tor.horario.match(/(\d\d:\d\d)\D+(\d\d:\d\d)/);
        setForm({ dia: diaSugerido(tor, fechas), inicio: horas?.[1] ?? '', fin: horas?.[2] ?? '', canchas: 2 });
        setError('');
        setAbierto(true);
    };

    const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const enviar = async (e) => {
        e.preventDefault();
        setError('');
        setGuardando(true);

        const data = await crearFecha({ torId: tor.id, ...form, canchas: Number(form.canchas) });

        setGuardando(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');

        setAbierto(false);
        cargar();
    };

    const cancelar = async (f) => {
        if (!window.confirm(`¿Cancelar la fecha ${f.numero}? Se borran sus partidos.`)) return;

        const data = await cancelarFecha(f.id);
        if (!data || data.error) return window.alert(data?.error || 'No pudimos conectar con el servidor');

        cargar();
    };

    return (
        <div className='fixture'>
            <Link className='back-link' to={`/torneos/${tor.id}`}>← Volver al torneo</Link>

            <div className='fixture__head'>
                <div>
                    <h1>Fixture</h1>
                    <p className='muted'>{tor.nombre}</p>
                </div>
                {puedeCrear && !abierto && <button type='button' className='btn btn--primary btn--chico' onClick={abrirForm}>+ Crear nueva fecha</button>}
            </div>

            {abierto && (
                <form className='fecha-form' onSubmit={enviar}>
                    <h2>Nueva fecha {fechas.length + 1}</h2>

                    <div className='fecha-form__grid'>
                        <div className='campo'>
                            <label htmlFor='dia'>Día</label>
                            <input id='dia' name='dia' type='date' required min={hoy()} value={form.dia} onChange={onChange} />
                        </div>
                        <div className='campo'>
                            <label htmlFor='inicio'>Inicio</label>
                            <input id='inicio' name='inicio' type='time' required value={form.inicio} onChange={onChange} />
                        </div>
                        <div className='campo'>
                            <label htmlFor='fin'>Finalización</label>
                            <input id='fin' name='fin' type='time' required value={form.fin} onChange={onChange} />
                        </div>
                        <div className='campo'>
                            <label htmlFor='canchas'>Canchas</label>
                            <input id='canchas' name='canchas' type='number' min={1} max={8} required value={form.canchas} onChange={onChange} />
                        </div>
                    </div>

                    <p className='muted'>Los partidos se arman solos y se reparten en ese horario. Los capitanes de los equipos ven la fecha apenas la creás, con el precio de {formatPrecio(tor.precioFecha)} por equipo.</p>

                    {error && <p className='form__error' role='alert'>{error}</p>}

                    <div className='fecha-form__acciones'>
                        <button type='button' className='btn btn--secundario btn--chico' onClick={() => setAbierto(false)}>Cancelar</button>
                        <button type='submit' className='btn btn--primary btn--chico' disabled={guardando}>{guardando ? 'Creando...' : 'Crear fecha'}</button>
                    </div>
                </form>
            )}

            {fechas.length === 0 && <p className='buscador__mensaje'>Todavía no hay fechas programadas en este torneo.</p>}

            {fechas.map((f, i) => {
                const deLaFecha = partidos
                    .filter(p => p.fecha === f.numero)
                    .sort((a, b) => a.date.localeCompare(b.date) || (a.cancha ?? 0) - (b.cancha ?? 0));
                const juegan = new Set(deLaFecha.flatMap(p => [p.home_id, p.away_id]));
                const libres = Object.values(equipos).filter(e => !juegan.has(e.id));

                return (
                    <section className='fecha' key={f.id}>
                        <div className='fecha__top'>
                            <div>
                                <h2>Fecha {f.numero}</h2>
                                <p className='muted'>{formatFecha(f.dia)} · {f.inicio} a {f.fin} · {formatPrecio(f.precio)} por equipo</p>
                            </div>
                            <div className='fecha__acciones'>
                                <span className={`fecha__estado fecha__estado--${f.estado}`}>{ESTADO_FECHA[f.estado]}</span>
                                {esDueño && i === 0 && f.estado === 'programada' && (
                                    <button type='button' className='btn btn--secundario btn--chico' onClick={() => cancelar(f)}>Cancelar fecha</button>
                                )}
                            </div>
                        </div>

                        <div className='fecha__partidos'>
                            {deLaFecha.map(p => <PartidoItem key={p.id} partido={p} equipos={equipos} mostrarDia={false} />)}
                        </div>

                        {libres.length > 0 && <p className='muted'>Libre: {libres.map(e => e.name).join(', ')}</p>}
                    </section>
                );
            })}
        </div>
    )
}

export default Partidos;
