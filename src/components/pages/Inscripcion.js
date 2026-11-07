import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTorneoById } from '../../assets/endPoints/torneos.js';
import { crearInscripcion, pagarInscripcion } from '../../assets/endPoints/inscripciones.js';
import { MODALIDAD_LABEL, MIN_JUGADORES, formatPrecio, formatFecha, textoLimiteEdad, fueraDeEdad } from '../../assets/torneosUtils.js';
import '../../assets/styles/formularios.css';
import { SkeletonFormulario } from '../Skeleton';
import PagoForm from '../PagoForm';
import useTitulo from '../useTitulo';

const Inscripcion = () => {
    const { torneo: torId } = useParams();
    const { user, loading: cargandoSesion, equipo } = useAuth();

    const [tor, setTor] = useState(null); // null = cargando, false = no existe
    useTitulo(tor?.nombre ? `Inscripción · ${tor.nombre}` : 'Inscripción');
    const [step, setStep] = useState('resumen'); // resumen | pago | ok
    const [insc, setInsc] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getTorneoById(torId).then(data => setTor(data && !data.error ? data : false));
    }, [torId])

    const continuar = async () => {
        setError('');
        setLoading(true);

        const data = await crearInscripcion({ torId });

        setLoading(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');

        setInsc(data);
        setStep('pago');
    };

    // PagoForm muestra el error si lo hay; si sale bien, pasamos a la confirmacion
    const pagar = async (body) => {
        const data = await pagarInscripcion(insc.id, body);
        if (data && !data.error) { setInsc(data); setStep('ok'); }
        return data;
    };

    if (tor === null || cargandoSesion || (user?.rol === 'capitan' && equipo === undefined)) {
        return <SkeletonFormulario />;
    }

    if (tor === false) return (
        <div className='form-page'>
            <p>No encontramos ese torneo.</p>
            <Link className='back-link' to='/torneos'>← Volver a la búsqueda</Link>
        </div>
    );

    if (!user) return <Navigate to='/login' state={{ from: `/torneos/${torId}/inscripcion` }} replace />;

    if (user.rol !== 'capitan') return (
        <div className='form-page'>
            <p>Solo las cuentas de capitán pueden inscribir equipos.</p>
            <Link className='back-link' to={`/torneos/${tor.id}`}>← Volver al torneo</Link>
        </div>
    );

    if (!equipo) return <Navigate to='/equipos/nuevo' replace />;

    const faltan = Math.max((MIN_JUGADORES[tor.modalidad] ?? 0) - equipo.jugadores.length, 0);
    const fuera = fueraDeEdad(equipo.jugadores, tor); // la API lo vuelve a controlar

    if (step === 'ok') return (
        <div className='form-page'>
            <h1>¡Inscripción confirmada! 🎉</h1>
            <div className='box'>
                <p>Tu equipo <strong>{insc.equipo.name}</strong> ya está inscripto en <strong>{tor.nombre}</strong>.</p>
                <p>Pagaste {formatPrecio(insc.pago.monto)} · Comprobante {insc.pago.id}</p>
                <p>Inicio: {formatFecha(tor.fechaInicio)} · {tor.sede}</p>
            </div>
            <Link className='btn btn--primary' to={`/torneos/${tor.id}`}>Ver el torneo</Link>
        </div>
    );

    return (
        <div className='form-page'>
            <Link className='back-link' to={`/torneos/${tor.id}`}>← Volver al torneo</Link>
            <h1>Inscribir mi equipo</h1>

            <div className='box'>
                <strong>{MODALIDAD_LABEL[tor.modalidad]} · {tor.nombre}</strong>
                <p>{formatFecha(tor.fechaInicio)} · {tor.sede}</p>
                <p className='total'>Total a pagar: {formatPrecio(tor.precioInscripcion)}</p>
            </div>

            {step === 'resumen' && (
                <div className='form'>
                    <div className='box'>
                        <strong>Tu equipo: {equipo.nombre}</strong>
                        <p>{equipo.jugadores.length} jugadores anotados</p>
                        {tor.limiteEdad && <p>Este torneo es solo para jugadores {textoLimiteEdad(tor.limiteEdad)}, cumplidos el día que empieza.</p>}
                    </div>

                    {fuera.length > 0 && (
                        <div className='form__error' role='alert'>
                            <p>
                                {fuera.length === 1
                                    ? 'Un jugador de tu equipo no cumple con el límite de edad del torneo'
                                    : `${fuera.length} jugadores de tu equipo no cumplen con el límite de edad del torneo`} ({textoLimiteEdad(tor.limiteEdad)}, cumplidos el día que empieza):
                            </p>
                            <ul>
                                {fuera.map(j => <li key={j.dni}>{j.nombre} {j.apellido} · va a tener {j.edad} años el {formatFecha(tor.fechaInicio)}</li>)}
                            </ul>
                            <Link to='/mi-equipo/editar'>Revisar el plantel</Link>
                        </div>
                    )}

                    {faltan > 0 && (
                        <p className='form__error'>
                            Para {MODALIDAD_LABEL[tor.modalidad]} necesitás al menos {MIN_JUGADORES[tor.modalidad]} jugadores (te faltan {faltan}). <Link to='/mi-equipo/editar'>Completar el plantel</Link>
                        </p>
                    )}

                    {error && <p className='form__error' role='alert'>{error}</p>}
                    <button className='btn btn--primary' type='button' onClick={continuar} disabled={loading || faltan > 0 || fuera.length > 0}>
                        {loading ? 'Guardando...' : 'Continuar al pago'}
                    </button>
                </div>
            )}

            {step === 'pago' && <PagoForm monto={insc.monto} onPagar={pagar} />}
        </div>
    )
}

export default Inscripcion;