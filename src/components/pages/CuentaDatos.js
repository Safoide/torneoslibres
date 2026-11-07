import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { editarMisDatos, cambiarPassword } from '../../assets/endPoints/auth.js';
import '../../assets/styles/formularios.css';
import { SkeletonFormulario } from '../Skeleton';
import AvisoVerificacion from '../AvisoVerificacion';
import useTitulo from '../useTitulo';

const ROL_LABEL = { capitan: 'Capitán', organizador: 'Organizador' };

const CuentaDatos = () => {
    useTitulo('Mis datos');
    const { user, setUser, guardarToken, loading, equipo, setEquipo } = useAuth();

    const [datos, setDatos] = useState({ nombre: '', email: '', password: '', whatsapp: '' });
    const [msgDatos, setMsgDatos] = useState({ tipo: '', texto: '' });
    const [guardandoDatos, setGuardandoDatos] = useState(false);

    const [clave, setClave] = useState({ actual: '', nueva: '', repetir: '' });
    const [msgClave, setMsgClave] = useState({ tipo: '', texto: '' });
    const [guardandoClave, setGuardandoClave] = useState(false);

    useEffect(() => {
        if (user) setDatos({ nombre: user.nombre, email: user.email, password: '', whatsapp: equipo?.whatsapp ?? '' });
    }, [user, equipo])

    if (loading) return <SkeletonFormulario />;
    if (!user) return <Navigate to='/login' state={{ from: '/cuenta' }} replace />;

    // El WhatsApp del capitan se guarda en su equipo, asi que solo se edita si ya lo creó
    const conWhatsapp = user.rol === 'capitan' && !!equipo;
    const cambiaEmail = datos.email.trim().toLowerCase() !== user.email;

    const onDatos = (e) => setDatos(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const onClave = (e) => setClave(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const guardarDatos = async (e) => {
        e.preventDefault();
        setMsgDatos({ tipo: '', texto: '' });
        setGuardandoDatos(true);

        const { whatsapp, ...resto } = datos;
        const data = await editarMisDatos(conWhatsapp ? datos : resto);

        setGuardandoDatos(false);
        if (!data || data.error) return setMsgDatos({ tipo: 'error', texto: data?.error || 'No pudimos conectar con el servidor' });

        if (conWhatsapp) setEquipo({ ...equipo, whatsapp: datos.whatsapp.replace(/\D/g, '') });
        setUser(data);
        setMsgDatos({ tipo: 'ok', texto: 'Datos guardados.' });
    };

    const guardarClave = async (e) => {
        e.preventDefault();
        setMsgClave({ tipo: '', texto: '' });

        if (clave.nueva !== clave.repetir) return setMsgClave({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden' });

        setGuardandoClave(true);
        // Sin contraseña (cuenta de Google) se crea sin pedir la actual
        const data = await cambiarPassword(user.tienePassword ? { actual: clave.actual, nueva: clave.nueva } : { nueva: clave.nueva });
        setGuardandoClave(false);

        if (!data || data.error) return setMsgClave({ tipo: 'error', texto: data?.error || 'No pudimos conectar con el servidor' });

        if (data.token) guardarToken(data.token); // cambiar la clave cierra las otras sesiones: seguimos con un token nuevo
        setClave({ actual: '', nueva: '', repetir: '' });
        setMsgClave({ tipo: 'ok', texto: user.tienePassword ? 'Contraseña actualizada.' : 'Contraseña creada: ahora también podés entrar con tu email y contraseña.' });
        if (!user.tienePassword) setUser({ ...user, tienePassword: true });
    };

    return (
        <div className='form-page'>
            <h1>Editar mis datos</h1>
            <p>Tipo de cuenta: <strong>{ROL_LABEL[user.rol] || user.rol}</strong></p>
            {user.conGoogle && <p className='cuenta-google'>Tu cuenta está vinculada con Google: podés entrar con el botón "Continuar con Google".</p>}

            <form className='form' onSubmit={guardarDatos}>
                <label htmlFor='nombre'>Nombre</label>
                <input id='nombre' name='nombre' required maxLength={60} value={datos.nombre} onChange={onDatos} />

                <label htmlFor='email'>Email</label>
                <input id='email' name='email' type='email' required autoComplete='email' value={datos.email} onChange={onDatos} disabled={!user.tienePassword} />
                {/* Cambiar el email pide la contraseña: una cuenta de Google sin contraseña primero tiene que crear una */}
                {!user.tienePassword && <span className='muted'>Para cambiar el email, primero creá una contraseña (más abajo).</span>}
                {/* Estado del email guardado (mientras escribe uno nuevo no aplica) */}
                {!cambiaEmail && <AvisoVerificacion enLinea />}
                {cambiaEmail && <span className='muted'>Al guardar te mandamos un link al email nuevo para verificarlo.</span>}

                {conWhatsapp && (
                    <>
                        <label htmlFor='whatsapp'>WhatsApp, con código de país</label>
                        <input id='whatsapp' name='whatsapp' type='tel' required placeholder='5491112345678' value={datos.whatsapp} onChange={onDatos} />
                        <span className='muted'>Solo lo ven los organizadores de los torneos donde te inscribas.</span>
                    </>
                )}

                {cambiaEmail && (
                    <>
                        <label htmlFor='password'>Contraseña actual (para confirmar el cambio de email)</label>
                        <input id='password' name='password' type='password' required autoComplete='current-password' value={datos.password} onChange={onDatos} />
                    </>
                )}

                {msgDatos.texto && <p className={msgDatos.tipo === 'ok' ? 'form__ok' : 'form__error'} role={msgDatos.tipo === 'ok' ? 'status' : 'alert'}>{msgDatos.texto}</p>}
                <button className='btn btn--primary' type='submit' disabled={guardandoDatos}>{guardandoDatos ? 'Guardando...' : 'Guardar cambios'}</button>
            </form>

            <h2>{user.tienePassword ? 'Cambiar contraseña' : 'Crear contraseña'}</h2>
            {!user.tienePassword && <p>Tu cuenta entra con Google. Si creás una contraseña, también vas a poder entrar con tu email.</p>}

            <form className='form' onSubmit={guardarClave}>
                {user.tienePassword && (
                    <>
                        <label htmlFor='actual'>Contraseña actual</label>
                        <input id='actual' name='actual' type='password' required autoComplete='current-password' value={clave.actual} onChange={onClave} />
                    </>
                )}

                <label htmlFor='nueva'>{user.tienePassword ? 'Contraseña nueva' : 'Contraseña'} (mínimo 8 caracteres)</label>
                <input id='nueva' name='nueva' type='password' required minLength={8} maxLength={72} autoComplete='new-password' value={clave.nueva} onChange={onClave} />

                <label htmlFor='repetir'>Repetí la contraseña nueva</label>
                <input id='repetir' name='repetir' type='password' required minLength={8} maxLength={72} autoComplete='new-password' value={clave.repetir} onChange={onClave} />

                {msgClave.texto && <p className={msgClave.tipo === 'ok' ? 'form__ok' : 'form__error'} role={msgClave.tipo === 'ok' ? 'status' : 'alert'}>{msgClave.texto}</p>}
                <button className='btn btn--primary' type='submit' disabled={guardandoClave}>{guardandoClave ? 'Guardando...' : user.tienePassword ? 'Cambiar contraseña' : 'Crear contraseña'}</button>
            </form>

            <Link to='/cuenta/ajustes'>Ajustes de la cuenta: tema, notificaciones, sesiones y eliminar cuenta →</Link>
            <Link className='back-link' to='/torneos'>← Volver al inicio</Link>
        </div>
    )
}

export default CuentaDatos;
