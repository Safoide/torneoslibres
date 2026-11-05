import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTorneoById } from '../../assets/endPoints/torneos.js';
import { crearInscripcion, pagarInscripcion } from '../../assets/endPoints/inscripciones.js';
import { MODALIDAD_LABEL, MIN_JUGADORES, formatPrecio, formatFecha } from '../../assets/torneosUtils.js';
import '../../assets/styles/formularios.css';

const METODOS = { tarjeta: 'Tarjeta de crédito / débito', mercadopago: 'Mercado Pago' };

const Inscripcion = () => {
    const { torneo: torId } = useParams();
    const { user, loading: cargandoSesion, equipo } = useAuth();

    const [tor, setTor] = useState(null); // null = cargando, false = no existe
    const [step, setStep] = useState('resumen'); // resumen | pago | ok
    const [metodo, setMetodo] = useState('tarjeta');
    const [simularRechazo, setSimularRechazo] = useState(false);
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

    const pagar = async () => {
        setError('');
        setLoading(true);

        const data = await pagarInscripcion(insc.id, { metodo, simular: simularRechazo ? 'rechazado' : undefined });

        setLoading(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');

        setInsc(data);
        setStep('ok');
    };

    if (tor === null || cargandoSesion || (user?.rol === 'capitan' && equipo === undefined)) {
        return <div className='form-page'><p>Cargando...</p></div>;
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
                    </div>

                    {faltan > 0 && (
                        <p className='form__error'>
                            Para {MODALIDAD_LABEL[tor.modalidad]} necesitás al menos {MIN_JUGADORES[tor.modalidad]} jugadores (te faltan {faltan}). <Link to='/mi-equipo/editar'>Completar el plantel</Link>
                        </p>
                    )}

                    {error && <p className='form__error' role='alert'>{error}</p>}
                    <button className='btn btn--primary' type='button' onClick={continuar} disabled={loading || faltan > 0}>
                        {loading ? 'Guardando...' : 'Continuar al pago'}
                    </button>
                </div>
            )}

            {step === 'pago' && (
                <div className='form'>
                    <label>Método de pago</label>
                    {Object.entries(METODOS).map(([key, label]) => (
                        <label className='opcion' key={key}>
                            <input type='radio' name='metodo' checked={metodo === key} onChange={() => setMetodo(key)} />
                            {label}
                        </label>
                    ))}

                    <p className='form__nota'>Pago de prueba: no se cobra dinero real ni se piden datos de tarjeta.</p>

                    {process.env.NODE_ENV !== 'production' && (
                        <label className='opcion'>
                            <input type='checkbox' checked={simularRechazo} onChange={e => setSimularRechazo(e.target.checked)} />
                            Modo prueba: simular pago rechazado
                        </label>
                    )}

                    {error && <p className='form__error' role='alert'>{error}</p>}
                    <button className='btn btn--primary' type='button' onClick={pagar} disabled={loading}>
                        {loading ? 'Procesando pago...' : `Pagar ${formatPrecio(insc.monto)}`}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Inscripcion;