import React, { useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/formularios.css';

// Cuentas que crea casos-prueba.mjs en la API. Solo se muestran en desarrollo (npm start), nunca en el build.
const PASSWORD_PRUEBA = 'Prueba123';
const CUENTAS_PRUEBA = [
    { email: 'organizador.casos@torneoslibres.test', nombre: 'Organizador', detalle: 'Liga de Casos de Prueba · 10 torneos' },
    { email: 'capitan.aldia@torneoslibres.test', nombre: 'Capitán al día', detalle: 'Pendientes, pagadas, W.O. a favor, amistosos' },
    { email: 'capitan.moroso@torneoslibres.test', nombre: 'Capitán moroso', detalle: 'Multa pendiente y bloqueos' },
    { email: 'capitan.amistosos@torneoslibres.test', nombre: 'Capitán amistosos', detalle: 'Toma amistosos express' },
    { email: 'capitan.incompleto@torneoslibres.test', nombre: 'Capitán incompleto', detalle: 'Plantel de 2 jugadores' },
];

const Auth = ({ modo }) => {
    const { user, login, registro } = useAuth();
    const location = useLocation();
    const [params] = useSearchParams();
    const esRegistro = modo === 'registro';
    const porRol = user?.rol === 'capitan' ? '/equipos/nuevo' : '/organizaciones/nueva';
    const destino = location.state?.from || (esRegistro ? porRol : '/'); // '/' manda a cada uno a su inicio (el organizador, a su panel)

    // /registro?rol=capitan (o organizador) llega con el tipo de cuenta ya elegido, por ejemplo desde la landing
    const rolInicial = ['capitan', 'organizador'].includes(params.get('rol')) ? params.get('rol') : '';
    const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: rolInicial });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to={destino} replace />;

    const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const enviar = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await (esRegistro ? registro(form) : login({ email: form.email, password: form.password }));

        setLoading(false);
        if (result.error) setError(result.error);
    };

    const entrarComo = async (email) => {
        setError('');
        setLoading(true);
        const result = await login({ email, password: PASSWORD_PRUEBA });
        setLoading(false);
        if (result.error) setError(result.error);
    };

    return (
        <div className='form-page'>
            <h1>{esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>

            <form className='form' onSubmit={enviar}>
                {esRegistro && (
                    <>
                        <label>Tipo de cuenta</label>
                        <label className='opcion'>
                            <input type='radio' name='rol' value='capitan' required checked={form.rol === 'capitan'} onChange={onChange} />
                            <span><strong>Capitán</strong> · lidero un equipo y quiero inscribirlo en torneos</span>
                        </label>
                        <label className='opcion'>
                            <input type='radio' name='rol' value='organizador' checked={form.rol === 'organizador'} onChange={onChange} />
                            <span><strong>Organizador</strong> · organizo torneos y publico los míos</span>
                        </label>
                        <label htmlFor='nombre'>Tu nombre</label>
                        <input id='nombre' name='nombre' required maxLength={60} value={form.nombre} onChange={onChange} />
                    </>
                )}

                <label htmlFor='email'>Email</label>
                <input id='email' name='email' type='email' required autoComplete='email' value={form.email} onChange={onChange} />

                <label htmlFor='password'>Contraseña{esRegistro ? ' (mínimo 8 caracteres)' : ''}</label>
                <input id='password' name='password' type='password' required minLength={esRegistro ? 8 : undefined}
                    autoComplete={esRegistro ? 'new-password' : 'current-password'} value={form.password} onChange={onChange} />

                {error && <p className='form__error' role='alert'>{error}</p>}
                <button className='btn btn--primary' type='submit' disabled={loading}>
                    {loading ? 'Un momento...' : esRegistro ? 'Crear cuenta' : 'Entrar'}
                </button>
            </form>

            {/* Solo en desarrollo: entrar directo a las cuentas de casos de prueba (ver casos-prueba.mjs en la API) */}
            {!esRegistro && process.env.NODE_ENV !== 'production' && (
                <section className='acceso-rapido'>
                    <h2>Acceso rápido <span>solo desarrollo</span></h2>
                    <div className='acceso-rapido__lista'>
                        {CUENTAS_PRUEBA.map(c => (
                            <button key={c.email} type='button' className='acceso-rapido__btn' disabled={loading} onClick={() => entrarComo(c.email)}>
                                <strong>{c.nombre}</strong>
                                <span>{c.detalle}</span>
                            </button>
                        ))}
                    </div>
                    <p className='muted'>Si no funcionan, cargá los casos con <code>node casos-prueba.mjs</code> en la API (con la API apagada).</p>
                </section>
            )}

            <p>
                {esRegistro ? '¿Ya tenés cuenta? ' : '¿No tenés cuenta? '}
                <Link to={esRegistro ? '/login' : '/registro'} state={location.state}>
                    {esRegistro ? 'Iniciá sesión' : 'Registrate'}
                </Link>
            </p>
        </div>
    )
}

export default Auth;
