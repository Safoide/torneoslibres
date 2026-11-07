import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { verificarEmail } from '../../assets/endPoints/auth.js';
import { useAuth } from '../../context/AuthContext';
import AvisoVerificacion from '../AvisoVerificacion';
import { SkeletonFormulario } from '../Skeleton';
import '../../assets/styles/formularios.css';
import useTitulo from '../useTitulo';

// Link del mail: /verificar#<token>. Funciona con o sin la sesión iniciada; el token se saca de la barra de direcciones
const VerificarEmail = () => {
    useTitulo('Verificar email');
    const { user, refrescarUsuario } = useAuth();
    const [token] = useState(() => window.location.hash.slice(1));
    const [estado, setEstado] = useState('verificando'); // verificando | ok | error
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (window.location.hash) window.history.replaceState(window.history.state, '', window.location.pathname);
        if (!token) { setError('El link no es válido o ya venció. Pedí uno nuevo desde tu cuenta.'); return setEstado('error'); }

        let vigente = true;
        verificarEmail(token).then((data) => {
            if (!vigente) return;
            if (!data || data.error) { setError(data?.error || 'No pudimos conectar con el servidor'); return setEstado('error'); }
            setEmail(data.email);
            setEstado('ok');
            refrescarUsuario(); // si tiene la sesión iniciada, se va el aviso de "confirmá tu email"
        });
        return () => { vigente = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    if (estado === 'verificando') return <SkeletonFormulario campos={1} />;

    if (estado === 'ok') return (
        <div className='form-page'>
            <h1>¡Listo, confirmaste tu email!</h1>
            <div className='form'>
                <p><strong className='recuperar__email'>{email}</strong> quedó verificado. Ahí te van a llegar los avisos de tus torneos.</p>
                <Link className='btn btn--primary' to={user ? '/' : '/login'}>{user ? 'Ir al inicio' : 'Iniciar sesión'}</Link>
            </div>
        </div>
    );

    return (
        <div className='form-page'>
            <h1>El link no sirve</h1>
            <div className='form'>
                <p>{error}</p>
                <p className='muted'>Cada link vale por 48 horas y se puede usar una sola vez. Si pediste varios, usá el del último mail.</p>
                {user && !user.emailVerificado
                    ? <AvisoVerificacion enLinea />
                    : !user && <Link className='btn btn--primary' to='/login' state={{ from: '/cuenta' }}>Iniciá sesión para pedir uno nuevo</Link>}
            </div>
        </div>
    );
}

export default VerificarEmail;
