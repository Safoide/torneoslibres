import React from 'react'
import { Link } from 'react-router-dom';
import { formatMonto as plata, formatFecha } from '../assets/torneosUtils.js';
import '../assets/styles/torneo.css';
import '../assets/styles/dashboard.css';

const numero = (n) => new Intl.NumberFormat('es-AR').format(n);

// "2026-11" -> "nov"
const mesCorto = (ym) => {
    const [y, m] = ym.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
};
const mesLargo = (ym) => {
    const [y, m] = ym.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
};

const Stat = ({ label, valor, detalle, destacado }) => (
    <div className={`dash-stat${destacado ? ' dash-stat--destacado' : ''}`}>
        <span className='dash-stat__label'>{label}</span>
        <strong className='dash-stat__valor'>{valor}</strong>
        {detalle && <span className='dash-stat__detalle'>{detalle}</span>}
    </div>
);

// Ingresos de los ultimos meses: una sola serie, barras con tooltip al pasar el mouse (o con el teclado)
const IngresosPorMes = ({ datos }) => {
    const max = Math.max(...datos.map(d => d.monto), 1);
    const total = datos.reduce((s, d) => s + d.monto, 0);

    return (
        <section className='seccion dash-grafico'>
            <div className='dash-grafico__head'>
                <h2>Ingresos por mes</h2>
                <span className='muted'>Últimos {datos.length} meses · {plata(total)}</span>
            </div>

            <div className='dash-barras' role='list'>
                {datos.map(({ mes, monto }) => (
                    <div className='dash-barras__col' key={mes} role='listitem' tabIndex={0} aria-label={`${mesLargo(mes)}: ${plata(monto)}`}>
                        <span className='dash-barras__tip'>{mesLargo(mes)}<strong>{plata(monto)}</strong></span>
                        <div className='dash-barras__pista'>
                            <div className='dash-barras__barra' style={{ height: monto ? `max(${(monto / max) * 100}%, 4px)` : 0 }} />
                        </div>
                        <span className='dash-barras__mes'>{mesCorto(mes)}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Pestaña "Resumen" del panel del organizador. Los datos los pide la pagina (undefined = cargando, null = error)
const OrgDashboard = ({ data }) => {
    if (data === undefined) return <p className='muted dash-cargando'>Cargando el resumen...</p>;
    if (data === null) return <p className='dash-cargando'>No pudimos cargar el resumen. Probá de nuevo en un rato.</p>;

    const { totales, dinero, porMes, proximasFechas, torneos } = data;

    if (!torneos.length) return (
        <section className='seccion'>
            <h2>Todavía no publicaste torneos</h2>
            <p>Cuando crees tu primer torneo vas a ver acá los equipos inscriptos, los partidos jugados y la plata de cada uno.</p>
            <div className='org-links'>
                <Link className='btn btn--primary btn--chico' to='/organizacion/torneo/nuevo'>+ Crear torneo</Link>
            </div>
        </section>
    );

    const activos = totales.porEstado['en-curso'] + totales.porEstado['inscripcion-abierta'] + totales.porEstado.proximamente;
    const falta = dinero.porCobrar + dinero.restante;

    return (
        <div className='dash'>
            {totales.resultadosPendientes > 0 && (
                <div className='dash-aviso' role='status'>
                    <strong>⚠ {totales.resultadosPendientes} {totales.resultadosPendientes === 1 ? 'partido jugado no tiene' : 'partidos jugados no tienen'} resultado cargado.</strong>
                    <span>Cargalos desde el fixture de cada torneo para que la tabla esté al día.</span>
                </div>
            )}

            <div className='dash-stats'>
                <Stat destacado label='Cobrado' valor={plata(dinero.cobrado)}
                    detalle={`${plata(dinero.inscripciones)} en inscripciones · ${plata(dinero.fechas)} en fechas`} />
                <Stat label='Falta cobrar' valor={plata(falta)}
                    detalle={falta ? 'Fechas programadas y las que faltan del fixture (estimado)' : 'No hay fechas pendientes'} />
                <Stat label='Torneos' valor={numero(totales.torneos)}
                    detalle={`${activos} ${activos === 1 ? 'activo' : 'activos'} · ${totales.porEstado.finalizado} ${totales.porEstado.finalizado === 1 ? 'finalizado' : 'finalizados'}`} />
                <Stat label='Equipos' valor={numero(totales.equipos)}
                    detalle={totales.cupos ? `${totales.cupos} ${totales.cupos === 1 ? 'cupo libre' : 'cupos libres'} con inscripción abierta` : 'Sin cupos abiertos'} />
                <Stat label='Partidos jugados' valor={numero(totales.partidosJugados)}
                    detalle={`${totales.fechasJugadas} ${totales.fechasJugadas === 1 ? 'fecha jugada' : 'fechas jugadas'} · ${totales.partidosProgramados} por jugar`} />
                <Stat label='Goles' valor={numero(totales.goles)}
                    detalle={totales.partidosJugados ? `${totales.promedioGoles.toLocaleString('es-AR')} por partido` : 'Todavía no hay partidos jugados'} />
            </div>

            <div className='dash-fila'>
                <IngresosPorMes datos={porMes} />

                <section className='seccion dash-proximas'>
                    <h2>Próximas fechas</h2>
                    {proximasFechas.length === 0 ? (
                        <p>No tenés fechas programadas. Creá la próxima desde el fixture de un torneo en curso.</p>
                    ) : (
                        <ul className='dash-lista'>
                            {proximasFechas.map(({ torneo, fecha, partidos }) => (
                                <li key={fecha.id}>
                                    <div className='dash-lista__dia'>
                                        <strong>{formatFecha(fecha.dia)}</strong>
                                        <span className='muted'>{fecha.inicio} a {fecha.fin}</span>
                                    </div>
                                    <div className='dash-lista__info'>
                                        <Link to={`/partidos/${torneo.id}`}>{torneo.nombre}</Link>
                                        <span className='muted'>
                                            Fecha {fecha.numero} · {partidos} {partidos === 1 ? 'partido' : 'partidos'} · {fecha.canchas} {fecha.canchas === 1 ? 'cancha' : 'canchas'}
                                            {fecha.estado === 'en-juego' && ' · En juego'}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <p className='muted'>Los montos salen de los precios de cada torneo: inscripción por equipo y precio de la fecha por cada equipo que juega (al que le toca libre no se le cobra).</p>
        </div>
    )
}

export default OrgDashboard
