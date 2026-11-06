import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMisFechas, pagarFecha } from '../assets/endPoints/fechas.js';
import { getMisAmistosos } from '../assets/endPoints/amistosos.js';
import { MODALIDAD_LABEL, formatPrecio, formatFecha, logoSrc } from '../assets/torneosUtils.js';
import Avatar from './Avatar';
import PagoForm from './PagoForm';
import CompartirAmistoso from './CompartirAmistoso';
import MultasPendientes from './MultasPendientes';
import { getMisMultas } from '../assets/endPoints/multas.js';
import { textoMulta } from '../assets/reglasPago.js';
import '../assets/styles/fechas.css';

const TZ = 'America/Argentina/Buenos_Aires';

const hora = (iso) => new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });
const diaCorto = (iso) => new Date(iso).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: TZ });

// "2 d 4 h", "5 h 12 min", "12 min"
const faltan = (ms) => {
    const min = Math.max(Math.floor(ms / 60000), 0);
    const d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60), m = min % 60;
    return d ? `${d} d ${h} h` : h ? `${h} h ${m} min` : `${m} min`;
};

const mapsUrl = (t) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${t.direccion}, ${t.zona}, Buenos Aires`)}`;

// Estado del pago de la fecha (o el resultado del vencimiento si ya paso)
const EstadoPago = ({ item, ahora, onPagado, conDeuda }) => {
    const { fecha, partido, pago, amistoso, multa, rivalPago, reglas } = item;
    const [pagando, setPagando] = useState(false);

    // Texto de la multa que recibiste (si el torneo tiene multa)
    const tuMulta = multa ? <p>Además se te aplicó una multa de <strong>{formatPrecio(multa.monto)}</strong>{multa.estado === 'pagada' ? ' (ya pagada).' : ': pagala para seguir usando la app con tu equipo.'}</p> : null;

    if (partido?.wo === 'a-favor') return (
        <div className='aviso aviso--ok'>
            <strong>Tu rival no pagó su parte: ganaste 3-0 por W.O.</strong>
            {amistoso?.estado === 'tomado' ? (
                <p>Se completó el amistoso express: juegan igual contra <strong>{amistoso.rival.name}</strong> en el mismo horario y cancha. No suma para la tabla.</p>
            ) : amistoso ? (
                <>
                    <p>Para que puedan jugar igual, publicamos un <strong>amistoso express</strong> a mitad de precio en el mismo horario y cancha. Pasale el link a otro equipo:</p>
                    <CompartirAmistoso id={amistoso.id} />
                    <p className='muted'>Si nadie lo toma, pueden usar la cancha igual en ese horario para jugar entre ustedes.</p>
                </>
            ) : (
                <p className='muted'>Pueden usar la cancha igual en ese horario para jugar entre ustedes.</p>
            )}
        </div>
    );

    if (partido?.wo === 'en-contra') return (
        <div className='aviso aviso--error'>
            <strong>No pagaste a tiempo: perdiste 0-3 por W.O.</strong>
            <p>El plazo era hasta las 23:59 del día anterior.{reglas?.amistosos ? ' Tu lugar se publicó como amistoso para el otro equipo.' : ''}</p>
            {tuMulta}
        </div>
    );

    if (partido?.wo === 'doble') return (
        <div className='aviso aviso--error'>
            <strong>Ninguno de los dos equipos pagó: el partido se da por perdido para ambos.</strong>
            {tuMulta}
        </div>
    );

    if (!pago) return null; // te toca libre o es una fecha sin cobro online

    // Torneo sin penalizacion: el pago vencido no tiene consecuencia automatica
    if (pago.estado === 'vencido') return (
        <div className='aviso aviso--error'>
            <strong>No pagaste a tiempo.</strong>
            <p>Este torneo no tiene penalización automática: el organizador va a decidir qué pasa con el partido. Hablá con él.</p>
        </div>
    );

    if (pago.estado === 'pagado') return (
        <>
            {/* Pagaron los dos: el partido esta confirmado */}
            {rivalPago === 'pagado' ? (
                <div className='aviso aviso--ok'>
                    <div className='aviso--fila'>
                        <strong>✓ Partido confirmado</strong>
                        <span className='muted'>Pagaste {formatPrecio(pago.monto)}</span>
                    </div>
                    <p>Los dos equipos pagaron su parte. ¡Nos vemos en la cancha!</p>
                </div>
            ) : (
                <div className='aviso aviso--ok aviso--fila'>
                    <strong>✓ Pagaste tu parte</strong>
                    <span className='muted'>{formatPrecio(pago.monto)}</span>
                </div>
            )}
            {rivalPago === 'pendiente' && (
                <p className='aviso__nota'>Falta que pague {partido.rival.name}: tiene tiempo hasta las 23:59 del {diaCorto(pago.vence)}.</p>
            )}
            {rivalPago === 'vencido' && (
                <div className='aviso aviso--pendiente'>
                    <strong>Tu rival no pagó a tiempo.</strong>
                    <p>Este torneo no tiene penalización automática: el organizador va a definir qué pasa con el partido.</p>
                </div>
            )}
        </>
    );

    if (pago.estado !== 'pendiente') return null;

    const resta = Date.parse(pago.vence) - ahora;
    const urgente = resta < 24 * 3600e3;

    return (
        <div className={`aviso ${urgente ? 'aviso--urgente' : 'aviso--pendiente'}`}>
            <div className='aviso--fila'>
                <strong>Pagá tu parte: {formatPrecio(pago.monto)}</strong>
                <span className='aviso__reloj' title={`Vence el ${diaCorto(pago.vence)} a las 23:59`}>⏱ {resta > 0 ? `faltan ${faltan(resta)}` : 'venció'}</span>
            </div>
            <p>
                Tenés tiempo hasta las 23:59 del {diaCorto(pago.vence)}.{' '}
                {reglas?.penalizacion === false
                    ? 'Si no pagás a tiempo, el organizador decide qué pasa con el partido.'
                    : `Si no pagás, perdés 0-3 por W.O.${textoMulta(reglas, fecha.precio) ? ` y recibís ${textoMulta(reglas, fecha.precio)}` : ''}.`}
            </p>
            {rivalPago === 'pagado' && <p className='aviso__nota'>✓ Tu rival ({partido.rival.name}) ya pagó: solo faltás vos para confirmar el partido.</p>}

            {conDeuda ? (
                <p className='muted'>Primero pagá tus multas pendientes (arriba) para poder pagar esta fecha.</p>
            ) : pagando ? (
                <PagoForm
                    monto={pago.monto}
                    onCancelar={() => setPagando(false)}
                    onPagar={async (body) => {
                        const data = await pagarFecha(fecha.id, body);
                        if (data && !data.error) { setPagando(false); onPagado(); }
                        return data;
                    }}
                />
            ) : (
                resta > 0 && <button type='button' className='btn btn--primary btn--chico' onClick={() => setPagando(true)}>Pagar mi parte</button>
            )}
        </div>
    );
};

// "Tu proxima fecha": solo para capitanes. Una tarjeta por cada torneo en curso donde esta su equipo,
// y otra por cada amistoso express que tomo.
const ProximaFecha = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [amistosos, setAmistosos] = useState([]);
    const [multas, setMultas] = useState(null); // { total, multas }
    const [ahora, setAhora] = useState(Date.now());

    const cargar = useCallback(() => {
        if (user?.rol !== 'capitan') { setItems([]); setAmistosos([]); setMultas(null); return; }

        getMisFechas().then(data => setItems(Array.isArray(data) ? data : []));
        getMisAmistosos().then(data => setAmistosos(Array.isArray(data) ? data : []));
        getMisMultas().then(data => setMultas(data && !data.error ? data : null));
    }, [user])

    useEffect(() => { cargar(); }, [cargar])

    // La cuenta regresiva se actualiza cada 30 segundos
    useEffect(() => {
        const t = setInterval(() => setAhora(Date.now()), 30000);
        return () => clearInterval(t);
    }, [])

    const total = items.length + amistosos.length;
    const conDeuda = multas?.total > 0;
    if (!total && !conDeuda) return null;

    return (
        <section className='proxima'>
            <MultasPendientes data={multas} onPagado={cargar} />

            {total > 0 && <h2>{total === 1 ? 'Tu próxima fecha' : 'Tus próximas fechas'}</h2>}

            <div className='proxima__lista'>
                {items.map((item) => {
                    const { torneo, fecha, partido, equipo } = item;

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

                            <EstadoPago item={item} ahora={ahora} onPagado={cargar} conDeuda={conDeuda} />

                            <p className='muted'>📍 {torneo.sede} · {torneo.direccion} · <a href={mapsUrl(torneo)} target='_blank' rel='noreferrer'>Ver en el mapa</a></p>

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

                {amistosos.map(a => (
                    <article className='proxima__card proxima__card--amistoso' key={a.id}>
                        <div className='proxima__top'>
                            <span className='badge'>{MODALIDAD_LABEL[a.modalidad]}</span>
                            <span>Amistoso express</span>
                        </div>

                        <p className='proxima__cuando'><strong>{diaCorto(a.date)}</strong> · {hora(a.date)} hs</p>

                        <div className='proxima__partido'>
                            <Avatar name={a.anfitrion.name} src={logoSrc(a.anfitrion.logo)} size={40} />
                            <div>
                                <strong>{a.rival?.name ?? 'Tu equipo'} vs {a.anfitrion.name}</strong>
                                <span className='muted'>{a.cancha ? `Cancha ${a.cancha} · ` : ''}No suma para ninguna tabla</span>
                            </div>
                        </div>

                        <div className='aviso aviso--ok aviso--fila'>
                            <strong>✓ Pagado</strong>
                            <span className='muted'>{formatPrecio(a.precio)}</span>
                        </div>

                        <p className='muted'>📍 {a.sede} · {a.direccion} · <a href={mapsUrl(a)} target='_blank' rel='noreferrer'>Ver en el mapa</a></p>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default ProximaFecha
