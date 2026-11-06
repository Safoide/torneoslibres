import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cambiarEstado, editTor } from '../assets/endPoints/torneos.js';
import { getFechasByTorneo } from '../assets/endPoints/fechas.js';
import { getPartidosByTournament } from '../assets/endPoints/partidos.js';
import { ESTADO_LABEL, ESTADOS_PREVIOS, formatFecha, hoyAR, sumarDias, cobraPorFecha, ANTICIPACION_DIAS } from '../assets/torneosUtils.js';
import CierreCampos, { cierreDesdeTorneo, cierreParaApi } from './CierreCampos';
import '../assets/styles/formularios.css';

const MIN_EQUIPOS = 2; // igual que en la API (services/estadosService.js)

// Panel del organizador dueño en el detalle del torneo: en qué estado está, qué sigue y los cambios manuales.
// Los automáticos (cierre de inscripción e inicio) los hace la API; acá se explican.
const EstadoTorneo = ({ tor, onCambio }) => {
    const [fechas, setFechas] = useState(null); // null = cargando
    const [sinResultado, setSinResultado] = useState(0);
    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState({ fechaInicio: tor.fechaInicio, cierre: cierreDesdeTorneo(tor) });

    const cargar = useCallback(async () => {
        const fe = await getFechasByTorneo(tor.id);
        setFechas(Array.isArray(fe) ? fe : []);
        if (tor.estado === 'en-curso') {
            const pa = await getPartidosByTournament(tor.id);
            setSinResultado(Array.isArray(pa) ? pa.filter(p => !p.wo && (p.home_goals === null || p.away_goals === null)).length : 0);
        }
    }, [tor.id, tor.estado]);

    useEffect(() => { cargar(); }, [cargar]);

    if (fechas === null) return null;

    const hoy = hoyAR();
    const inicio = formatFecha(tor.fechaInicio);
    const cierre = formatFecha(tor.cierreInscripcion);
    const hayFechas = fechas.length > 0;
    const pendiente = fechas.find(f => f.estado !== 'jugada');
    const pocos = tor.equiposInscriptos < MIN_EQUIPOS;
    const puedeCambiarFechas = ESTADOS_PREVIOS.includes(tor.estado) && !hayFechas;
    const primerDiaFecha = (() => {
        const porAnticipacion = cobraPorFecha(tor) ? sumarDias(hoy, ANTICIPACION_DIAS) : hoy;
        return porAnticipacion > tor.fechaInicio ? porAnticipacion : tor.fechaInicio;
    })();

    const cambiar = async (estado, confirmar) => {
        if (confirmar && !window.confirm(confirmar)) return;
        setError('');
        setGuardando(true);
        const data = await cambiarEstado(tor.id, estado);
        setGuardando(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');
        onCambio(data);
    };

    const guardarFechas = async (e) => {
        e.preventDefault();
        setError('');
        setGuardando(true);
        const data = await editTor(tor.id, { fechaInicio: form.fechaInicio, cierreInscripcion: cierreParaApi(form.cierre) });
        setGuardando(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');
        setEditando(false);
        onCambio(data);
    };

    const finalizar = () => cambiar('finalizado', sinResultado
        ? `Faltan cargar ${sinResultado === 1 ? '1 resultado' : `${sinResultado} resultados`}. Si finalizás el torneo ya no vas a poder cargarlos ni corregir los que están. ¿Finalizar igual?`
        : 'Al finalizar el torneo los resultados y la tabla quedan fijos y no se pueden corregir. ¿Finalizar?');

    // Qué está pasando y qué sigue, según el estado
    let texto = null;
    let acciones = null;

    switch (tor.estado) {
        case 'proximamente':
            texto = <>La inscripción todavía no abrió. Cuando la abras, los equipos se van a poder inscribir hasta el <strong>{cierre}</strong>. El torneo empieza el <strong>{inicio}</strong>.</>;
            acciones = <button type='button' className='btn btn--primary btn--chico' disabled={guardando} onClick={() => cambiar('inscripcion-abierta')}>Abrir inscripción</button>;
            break;

        case 'inscripcion-abierta':
            texto = <>Los equipos se pueden inscribir hasta el <strong>{cierre}</strong> a las 23:59; ahí la inscripción se cierra sola. El torneo empieza el <strong>{inicio}</strong>.</>;
            acciones = (
                <>
                    <button type='button' className='btn btn--secundario btn--chico' disabled={guardando}
                        onClick={() => cambiar('inscripcion-cerrada', `¿Cerrar la inscripción ahora? Ya no se va a poder inscribir nadie más y vas a poder armar las fechas con los ${tor.equiposInscriptos} equipos inscriptos. Podés reabrirla mientras no crees ninguna fecha.`)}>
                        Cerrar inscripción ahora
                    </button>
                    {tor.equiposInscriptos === 0 && (
                        <button type='button' className='btn btn--secundario btn--chico' disabled={guardando} onClick={() => cambiar('proximamente')}>Volver a "próximamente"</button>
                    )}
                </>
            );
            break;

        case 'inscripcion-cerrada':
            texto = hayFechas
                ? <>La inscripción cerró y ya armaste {fechas.length === 1 ? 'la fecha 1' : `${fechas.length} fechas`}. El torneo empieza solo el <strong>{inicio}</strong>.</>
                : pocos
                    ? <>La inscripción cerró con <strong>{tor.equiposInscriptos} {tor.equiposInscriptos === 1 ? 'equipo' : 'equipos'}</strong>: hacen falta al menos {MIN_EQUIPOS} para armar el fixture{hoy >= tor.fechaInicio ? ', por eso el torneo no pudo empezar' : ''}. Reabrí la inscripción o cambiá las fechas del torneo.</>
                    : <>La inscripción cerró con {tor.equiposInscriptos} equipos. <strong>Creá la fecha 1</strong> (desde el {formatFecha(primerDiaFecha)}) para que se juegue cuando empieza el torneo, el <strong>{inicio}</strong>. Ese día el torneo arranca solo.</>;
            acciones = (
                <>
                    {!pocos && <Link className={`btn btn--chico ${hayFechas ? 'btn--secundario' : 'btn--primary'}`} to={`/partidos/${tor.id}`}>{hayFechas ? 'Ver fixture' : 'Crear la fecha 1'}</Link>}
                    {!hayFechas && hoy <= tor.cierreInscripcion && (
                        <button type='button' className='btn btn--secundario btn--chico' disabled={guardando} onClick={() => cambiar('inscripcion-abierta')}>Reabrir inscripción</button>
                    )}
                </>
            );
            break;

        case 'en-curso':
            texto = pendiente
                ? <>En curso desde el {inicio}. Cuando se jueguen todas las fechas vas a poder finalizarlo (la fecha {pendiente.numero} todavía no terminó).</>
                : <>En curso desde el {inicio}. Cuando termine, finalizalo: la tabla y los resultados quedan fijos.{sinResultado > 0 && <> Faltan cargar <strong>{sinResultado} {sinResultado === 1 ? 'resultado' : 'resultados'}</strong>.</>}</>;
            acciones = <button type='button' className='btn btn--secundario btn--chico' disabled={guardando || !!pendiente} onClick={finalizar}>Finalizar torneo</button>;
            break;

        case 'finalizado':
            texto = <>El torneo terminó: la tabla y los resultados quedaron fijos.</>;
            break;

        default:
    }

    return (
        <section className='estado-torneo'>
            <div className='estado-torneo__top'>
                <h2>Estado del torneo</h2>
                <span className={`estado estado--${tor.estado}`}>{ESTADO_LABEL[tor.estado]}</span>
            </div>

            <p>{texto}</p>

            {(acciones || puedeCambiarFechas) && !editando && (
                <div className='estado-torneo__acciones'>
                    {acciones}
                    {puedeCambiarFechas && (
                        <button type='button' className='btn btn--secundario btn--chico' disabled={guardando}
                            onClick={() => { setForm({ fechaInicio: tor.fechaInicio, cierre: cierreDesdeTorneo(tor) }); setError(''); setEditando(true); }}>
                            Cambiar fechas
                        </button>
                    )}
                </div>
            )}

            {editando && (
                <form className='form estado-torneo__form' onSubmit={guardarFechas}>
                    <label htmlFor='editar-inicio'>Fecha de inicio</label>
                    <input id='editar-inicio' type='date' required min={sumarDias(hoy, 1)} value={form.fechaInicio}
                        onChange={(e) => setForm(prev => ({ ...prev, fechaInicio: e.target.value }))} />

                    <CierreCampos value={form.cierre} onChange={(c) => setForm(prev => ({ ...prev, cierre: c }))}
                        fechaInicio={form.fechaInicio} precioFecha={tor.precioFecha} />

                    {error && <p className='form__error' role='alert'>{error}</p>}
                    <div className='estado-torneo__acciones'>
                        <button type='button' className='btn btn--secundario btn--chico' onClick={() => setEditando(false)}>Cancelar</button>
                        <button type='submit' className='btn btn--primary btn--chico' disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar fechas'}</button>
                    </div>
                </form>
            )}

            {error && !editando && <p className='form__error' role='alert'>{error}</p>}
        </section>
    );
};

export default EstadoTorneo;
