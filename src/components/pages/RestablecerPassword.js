import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { revisarLink, restablecerPassword } from '../../assets/endPoints/auth.js';
import { useAuth } from '../../context/AuthContext';
import { SkeletonFormulario } from '../Skeleton';
import '../../assets/styles/formularios.css';

// Link del mail: /restablecer#<token>. El token va después del # para que el navegador no lo mande
// a ningún servidor; apenas se lee se saca de la barra de direcciones (y del historial)
const RestablecerPassword = () => {
    const { aplicarSesion } = useAuth();
    const [token] = useState(() => window.location.hash.slice(1));

    const [estado, setEstado] = useState('revisando'); // revisando | invalido | form | listo
    const [cuenta, setCuenta] = useState(null); // { email, tienePassword }
    const [nueva, setNueva] = useState('');
    const [repetir, setRepetir] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (window.location.hash) window.history.replaceState(window.history.state, '', window.location.pathname);
        if (!token) return setEstado('invalido');

        let vigente = true;
        revisarLink(token).then((data) => {
            if (!vigente) return;
            if (!data) { setError('No pudimos conectar con el servidor'); return setEstado('invalido'); }
            if (data.error) { setError(data.error); return setEstado('invalido'); }
            setCuenta(data);
            setEstado('form');
        });
        return () => { vigente = false; };
    }, [token])

    const guardar = async (e) => {
        e.preventDefault();
        setError('');
        if (nueva !== repetir) return setError('Las contraseñas no coinciden');

        setLoading(true);
        const data = await restablecerPassword(token, nueva);
        setLoading(false);

        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');
        aplicarSesion(data);
        setEstado('listo');
    };

    if (estado === 'revisando') return <SkeletonFormulario campos={2} />;

    if (estado === 'invalido') return (
        <div className='form-page'>
            <h1>El link no sirve</h1>
            <div className='form'>
                <p>{error || 'El link no es válido o ya venció. Pedí uno nuevo.'}</p>
                <p className='muted'>Cada link vale por 1 hora y se puede usar una sola vez. Si pediste varios, usá el del último mail.</p>
                <Link className='btn btn--primary' to='/olvide'>Pedir un link nuevo</Link>
            </div>
        </div>
    );

    if (estado === 'listo') return (
        <div className='form-page'>
            <h1>Listo, ya tenés tu contraseña nueva</h1>
            <div className='form'>
                <p>Ya iniciaste sesión. Por seguridad, cerramos tu sesión en los demás dispositivos.</p>
                <Link className='btn btn--primary' to='/'>Ir al inicio</Link>
            </div>
        </div>
    );

    return (
        <div className='form-page'>
            <h1>{cuenta.tienePassword ? 'Elegí tu contraseña nueva' : 'Creá tu contraseña'}</h1>
            <p>Para la cuenta <strong className='recuperar__email'>{cuenta.email}</strong>.</p>

            <form className='form' onSubmit={guardar}>
                <label htmlFor='nueva'>Contraseña nueva (mínimo 8 caracteres)</label>
                <input id='nueva' type='password' required minLength={8} maxLength={72} autoComplete='new-password' value={nueva} onChange={(e) => setNueva(e.target.value)} />

                <label htmlFor='repetir'>Repeti la contraseña</label>
                <input id='repetir' type='password' required minLength={8} maxLength={72} autoComplete='new-password' value={repetir} onChange={(e) => setRepetir(e.target.value)} />

                {error && <p className='form__error' role='alert'>{error}</p>}

                <button className='btn btn--primary' type='submit' disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar contraseña'}
                </button>
            </form>
        </div>
    )
}

export default RestablecerPassword;
