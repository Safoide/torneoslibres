import React, { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cerrarTodasLasSesiones, eliminarCuenta } from '../../assets/endPoints/auth.js';
import { leerAjustes, guardarAjustes } from '../../ajustes.js';
import '../../assets/styles/formularios.css';
import '../../assets/styles/ajustes.css';
import { SkeletonFormulario } from '../Skeleton';

const TEMAS = [['oscuro', 'Oscuro'], ['claro', 'Claro'], ['auto', 'Automático']];
const TEXTOS = [['normal', 'Normal'], ['grande', 'Grande']];
const PALABRA = 'ELIMINAR';

// Grupo de opciones tipo "botones pegados"
const Segmentado = ({ nombre, valor, opciones, onChange }) => (
    <div className='segmentado' role='radiogroup'>
        {opciones.map(([v, etiqueta]) => (
            <label key={v} className={valor === v ? 'segmentado__op segmentado__op--activa' : 'segmentado__op'}>
                <input type='radio' name={nombre} value={v} checked={valor === v} onChange={() => onChange(v)} />
                {etiqueta}
            </label>
        ))}
    </div>
);

const CuentaAjustes = () => {
    const { user, loading, organizacion, equipo, logout } = useAuth();
    const navigate = useNavigate();
    const { hash } = useLocation();
    const zonaPeligro = useRef(null);

    const [ajustes, setAjustes] = useState(leerAjustes);

    const [confirmando, setConfirmando] = useState(false);
    const [password, setPassword] = useState('');
    const [palabra, setPalabra] = useState('');
    const [error, setError] = useState('');
    const [borrando, setBorrando] = useState(false);
    const [errorSesiones, setErrorSesiones] = useState('');

    // El menu "Eliminar cuenta" llega con #eliminar: abrimos la confirmacion
    useEffect(() => {
        if (hash === '#eliminar' && user) {
            setConfirmando(true);
            zonaPeligro.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [hash, user])

    if (loading) return <SkeletonFormulario />;
    if (!user) return <Navigate to='/login' state={{ from: '/cuenta/ajustes' }} replace />;

    const cambiar = (cambios) => setAjustes(guardarAjustes(cambios));

    const cerrarSesiones = async () => {
        if (!window.confirm('Se va a cerrar tu sesión en todos los dispositivos, incluido este. ¿Seguimos?')) return;

        setErrorSesiones('');
        const data = await cerrarTodasLasSesiones();
        if (!data || data.error) return setErrorSesiones(data?.error || 'No pudimos conectar con el servidor');

        logout();
        navigate('/login');
    };

    const cancelar = () => { setConfirmando(false); setPassword(''); setPalabra(''); setError(''); };

    const borrar = async (e) => {
        e.preventDefault();
        setError('');
        setBorrando(true);

        const data = await eliminarCuenta(password);

        setBorrando(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');

        logout();
        navigate('/torneos', { replace: true });
    };

    const consecuencias = user.rol === 'capitan'
        ? <>Se elimina tu equipo{equipo ? <> <strong>{equipo.nombre}</strong></> : ''} con su plantel. Si está anotado en un torneo que todavía no terminó, no vas a poder eliminarlo.</>
        : <>Se elimina tu organización{organizacion ? <> <strong>{organizacion.nombre}</strong></> : ''} y sus torneos. Si alguno tiene equipos inscriptos, no vas a poder eliminarla.</>;

    return (
        <div className='form-page'>
            <Link className='back-link' to='/cuenta'>← Editar mis datos</Link>
            <h1>Ajustes de la cuenta</h1>

            <section className='ajustes__card'>
                <h2>Apariencia</h2>
                <p className='muted'>Se guarda en este navegador.</p>

                <div className='ajustes__fila'>
                    <div><strong>Tema</strong><span className='muted'>Automático sigue el modo de tu dispositivo.</span></div>
                    <Segmentado nombre='tema' valor={ajustes.tema} opciones={TEMAS} onChange={(tema) => cambiar({ tema })} />
                </div>

                <div className='ajustes__fila'>
                    <div><strong>Tamaño del texto</strong><span className='muted'>Agranda las letras de toda la app.</span></div>
                    <Segmentado nombre='texto' valor={ajustes.texto} opciones={TEXTOS} onChange={(texto) => cambiar({ texto })} />
                </div>

                <label className='ajustes__fila ajustes__fila--click'>
                    <div><strong>Reducir animaciones</strong><span className='muted'>Quita transiciones y movimientos.</span></div>
                    <input className='interruptor' type='checkbox' role='switch' checked={ajustes.movimiento === 'reducido'}
                        onChange={(e) => cambiar({ movimiento: e.target.checked ? 'reducido' : 'normal' })} />
                </label>
            </section>

            <section className='ajustes__card'>
                <h2>Seguridad</h2>

                <div className='ajustes__fila'>
                    <div>
                        <strong>Cerrar sesión en todos los dispositivos</strong>
                        <span className='muted'>Útil si iniciaste sesión en una computadora ajena.</span>
                    </div>
                    <button type='button' className='btn btn--secundario btn--chico' onClick={cerrarSesiones}>Cerrar sesiones</button>
                </div>

                {errorSesiones && <p className='form__error' role='alert'>{errorSesiones}</p>}
                <p className='muted'>Cambiar tu contraseña también cierra las sesiones de los otros dispositivos. <Link to='/cuenta'>Cambiarla</Link></p>
            </section>

            <section className='ajustes__card ajustes__card--peligro' ref={zonaPeligro} id='eliminar'>
                <h2>Eliminar cuenta</h2>
                <p className='muted'>Esta acción no se puede deshacer.</p>

                {!confirmando ? (
                    <button type='button' className='btn btn--peligro btn--chico' onClick={() => setConfirmando(true)}>Eliminar mi cuenta</button>
                ) : (
                    <form className='ajustes__confirmar' onSubmit={borrar}>
                        <p>{consecuencias}</p>

                        <label htmlFor='password'>Tu contraseña</label>
                        <input id='password' type='password' required autoComplete='current-password' value={password} onChange={(e) => setPassword(e.target.value)} />

                        <label htmlFor='palabra'>Para confirmar, escribí <strong>{PALABRA}</strong></label>
                        <input id='palabra' autoComplete='off' value={palabra} onChange={(e) => setPalabra(e.target.value)} />

                        {error && <p className='form__error' role='alert'>{error}</p>}

                        <div className='ajustes__acciones'>
                            <button type='button' className='btn btn--secundario btn--chico' onClick={cancelar}>Cancelar</button>
                            <button type='submit' className='btn btn--peligro btn--chico' disabled={borrando || palabra !== PALABRA || !password}>
                                {borrando ? 'Eliminando...' : 'Eliminar definitivamente'}
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </div>
    )
}

export default CuentaAjustes;
