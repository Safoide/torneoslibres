import React, { useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleBoton, { GOOGLE_CLIENT_ID } from '../GoogleBoton';
import logoGoogle from '../../assets/imgs/google-g.svg';
import '../../assets/styles/formularios.css';

// Cuentas que crea casos-prueba.mjs en la API. Solo se muestran en desarrollo (npm start), nunca en el build.
const PASSWORD_PRUEBA = 'Prueba123';
const CUENTAS_PRUEBA = [
    { email: 'organizador.casos@torneoslibres.test', nombre: 'Organizador', detalle: 'Liga de Casos de Prueba · 12 torneos' },
    { email: 'capitan.aldia@torneoslibres.test', nombre: 'Capitán al día', detalle: 'Pendientes, pagadas, W.O. a favor, amistosos' },
    { email: 'capitan.moroso@torneoslibres.test', nombre: 'Capitán moroso', detalle: 'Multa pendiente y bloqueos' },
    { email: 'capitan.amistosos@torneoslibres.test', nombre: 'Capitán amistosos', detalle: 'Toma amistosos express' },
    { email: 'capitan.incompleto@torneoslibres.test', nombre: 'Capitán incompleto', detalle: 'Plantel de 2 jugadores' },
];

const ROLES = [
    ['capitan', 'Capitán', 'lidero un equipo y quiero inscribirlo en torneos'],
    ['organizador', 'Organizador', 'organizo torneos y publico los míos'],
];

const Auth = ({ modo }) => {
    const { user, login, registro, loginGoogle, aplicarSesion } = useAuth();
    const location = useLocation();
    const [params] = useSearchParams();
    const esRegistro = modo === 'registro';

    // /registro?rol=capitan (o organizador) llega con el tipo de cuenta ya elegido, por ejemplo desde la landing.
    // ?email= llega desde "Crear cuenta con este email" / "Iniciá sesión" con el email ya cargado
    const rolInicial = ['capitan', 'organizador'].includes(params.get('rol')) ? params.get('rol') : '';
    const [form, setForm] = useState({ nombre: '', email: params.get('email') ?? '', password: '', rol: rolInicial });
    const [error, setError] = useState(null); // { texto, sinCuenta?, yaExiste?, soloGoogle? }
    const [loading, setLoading] = useState(false);

    // Google: cuenta que no existe y falta elegir el tipo ({ credential, email, nombre }),
    // aviso antes de entrar (se vinculó y se borró la contraseña) y si la cuenta es nueva (para el destino)
    const [pendiente, setPendiente] = useState(null);
    const [aviso, setAviso] = useState(null);
    const [nueva, setNueva] = useState(null); // null = no entró con Google

    const porRol = user?.rol === 'capitan' ? '/equipos/nuevo' : '/organizaciones/nueva';
    const recienCreada = nueva ?? esRegistro;
    const destino = location.state?.from || (recienCreada ? porRol : '/'); // '/' manda a cada uno a su inicio

    if (user) return <Navigate to={destino} replace />;

    const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const enviar = async (e) => {
        e.preventDefault();
        // Ya inició sesión con Google y solo faltaba el tipo de cuenta: se crea con ese mismo token
        if (pendiente) return conGoogle(pendiente.credential, form.rol);

        setError(null);
        setLoading(true);

        const result = await (esRegistro ? registro(form) : login({ email: form.email, password: form.password }));

        setLoading(false);
        if (result.error) setError({ texto: result.error, sinCuenta: result.sinCuenta, yaExiste: result.yaExiste, soloGoogle: result.soloGoogle });
    };

    const entrarComo = async (email) => {
        setError(null);
        setLoading(true);
        const result = await login({ email, password: PASSWORD_PRUEBA });
        setLoading(false);
        if (result.error) setError({ texto: result.error });
    };

    const conGoogle = async (credential, rolElegido) => {
        setError(null);
        setLoading(true);
        // En el registro, si ya eligió el tipo de cuenta, se usa ese
        const data = await loginGoogle(credential, rolElegido || (esRegistro ? form.rol : undefined));
        setLoading(false);

        if (data.error) return setError({ texto: data.error });
        if (data.necesitaRol) return setPendiente({ credential, email: data.email, nombre: data.nombre });

        setPendiente(null);
        setNueva(!!data.nueva);
        if (data.passwordBorrada) return setAviso(data);
        aplicarSesion(data);
    };

    // Entró con Google a una cuenta vieja: se vinculó y, por seguridad, se borró su contraseña
    if (aviso) return (
        <div className='form-page'>
            <h1>Vinculamos tu cuenta con Google</h1>
            <div className='form'>
                <p>Tu cuenta <strong>{aviso.user.email}</strong> ahora entra con Google.</p>
                <p className='muted'>Como el email de la cuenta no estaba verificado, por seguridad borramos la contraseña que tenía: así nadie más que vos puede entrar. Si querés seguir entrando también con contraseña, creá una nueva en <strong>Mi cuenta → Editar mis datos</strong>.</p>
                <button className='btn btn--primary' type='button' onClick={() => aplicarSesion(aviso)}>Continuar</button>
            </div>
        </div>
    );

    const emailParam = form.email ? `email=${encodeURIComponent(form.email.trim())}` : '';
    // Inició sesión con Google pero no tiene cuenta (desde el registro sin elegir tipo, o desde el login):
    // el mismo formulario queda en modo "crear cuenta con Google": sin campos, solo el tipo de cuenta
    const creando = esRegistro || !!pendiente;
    const usarOtraCuenta = () => { setPendiente(null); setError(null); };

    return (
        <div className='form-page'>
            <h1>{creando ? 'Crear cuenta' : 'Iniciar sesión'}</h1>

            <form className='form' onSubmit={enviar}>
                {pendiente ? (
                    <div className='auth-iniciado'>
                        <img src={logoGoogle} alt='' width={20} height={20} />
                        <div>
                            <span>Iniciado como <strong>{pendiente.nombre || pendiente.email}</strong></span>
                            {pendiente.nombre && <span className='muted'>{pendiente.email}</span>}
                        </div>
                        <button type='button' className='auth-iniciado__cambiar' disabled={loading} onClick={usarOtraCuenta}>Usar otra cuenta</button>
                    </div>
                ) : GOOGLE_CLIENT_ID && (
                    // Google arriba, dentro de la misma tarjeta
                    <div className='auth-google'>
                        <GoogleBoton texto={esRegistro ? 'signup_with' : 'continue_with'} deshabilitado={loading} onCredential={(c) => conGoogle(c)} />
                        <p className='auth-separador'>o con tu email</p>
                    </div>
                )}

                {creando && (
                    <>
                        <label>{pendiente ? 'Elegí el tipo de cuenta' : 'Tipo de cuenta'}</label>
                        {ROLES.map(([rol, titulo, texto]) => (
                            <label key={rol} className='opcion'>
                                <input type='radio' name='rol' value={rol} required checked={form.rol === rol} onChange={onChange} />
                                <span><strong>{titulo}</strong> · {texto}</span>
                            </label>
                        ))}
                    </>
                )}

                {!pendiente && (
                    <>
                        {esRegistro && (
                            <>
                                <label htmlFor='nombre'>Tu nombre</label>
                                <input id='nombre' name='nombre' required maxLength={60} value={form.nombre} onChange={onChange} />
                            </>
                        )}

                        <label htmlFor='email'>Email</label>
                        <input id='email' name='email' type='email' required autoComplete='email' value={form.email} onChange={onChange} />

                        <label htmlFor='password'>Contraseña{esRegistro ? ' (mínimo 8 caracteres)' : ''}</label>
                        <input id='password' name='password' type='password' required minLength={esRegistro ? 8 : undefined}
                            autoComplete={esRegistro ? 'new-password' : 'current-password'} value={form.password} onChange={onChange} />
                    </>
                )}

                {error && (
                    <div className='form__error' role='alert'>
                        <p>{error.texto}</p>
                        {/* El email no tiene cuenta: ofrecer crearla con ese email */}
                        {error.sinCuenta && <Link className='btn btn--secundario btn--chico' to={`/registro?${emailParam}`} state={location.state}>Crear cuenta con este email</Link>}
                        {/* Ya existe una cuenta con ese email: ir al login con el email cargado */}
                        {error.yaExiste && <Link className='btn btn--secundario btn--chico' to={`/login?${emailParam}`} state={location.state}>Iniciar sesión con este email</Link>}
                    </div>
                )}

                <button className='btn btn--primary' type='submit' disabled={loading}>
                    {loading ? 'Un momento...' : creando ? 'Crear cuenta' : 'Entrar'}
                </button>
            </form>

            {/* Solo en desarrollo: entrar directo a las cuentas de casos de prueba (ver casos-prueba.mjs en la API) */}
            {!creando && process.env.NODE_ENV !== 'production' && (
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
                    <p className='muted'>Si no funcionan, cargá los casos con <code>node casos-prueba.mjs</code> en la API.</p>
                </section>
            )}

            {!pendiente && (
                <p>
                    {esRegistro ? '¿Ya tenés cuenta? ' : '¿No tenés cuenta? '}
                    <Link to={esRegistro ? `/login${emailParam ? '?' + emailParam : ''}` : `/registro${emailParam ? '?' + emailParam : ''}`} state={location.state}>
                        {esRegistro ? 'Iniciá sesión' : 'Registrate'}
                    </Link>
                </p>
            )}
        </div>
    )
}

export default Auth;
