import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import { revisarBaja, confirmarBaja } from '../../assets/endPoints/auth.js';
import { useAuth } from '../../context/AuthContext';
import { SkeletonFormulario } from '../Skeleton';
import '../../assets/styles/formularios.css';

// Link "Dejar de recibir este aviso" de los mails: /baja?u=<cuenta>&a=<aviso>&f=<firma>. No pide iniciar sesión.
// Se confirma con un botón: algunos programas de mail y antivirus abren los links solos y no tienen que dar de baja a nadie
const BajaAviso = () => {
    const { user } = useAuth();
    const [params] = useSearchParams();
    const datos = { u: params.get('u') ?? '', a: params.get('a') ?? '', f: params.get('f') ?? '' };

    const [estado, setEstado] = useState('revisando'); // revisando | invalido | confirmar | listo
    const [info, setInfo] = useState(null); // { titulo, email, activa }
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let vigente = true;
        revisarBaja(datos).then((data) => {
            if (!vigente) return;
            if (!data || data.error) { setError(data?.error || 'No pudimos conectar con el servidor'); return setEstado('invalido'); }
            setInfo(data);
            setEstado(data.activa ? 'confirmar' : 'listo');
        });
        return () => { vigente = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datos.u, datos.a, datos.f])

    const confirmar = async () => {
        setError('');
        setLoading(true);
        const data = await confirmarBaja(datos);
        setLoading(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');
        setEstado('listo');
    };

    if (estado === 'revisando') return <SkeletonFormulario campos={1} />;

    // Desde los ajustes se puede volver a activar (o cambiar los demás avisos)
    const ajustes = user
        ? <Link to='/cuenta/ajustes#notificaciones'>Ver todas mis notificaciones</Link>
        : <Link to='/login' state={{ from: '/cuenta/ajustes#notificaciones' }}>Iniciá sesión para ver todas tus notificaciones</Link>;

    if (estado === 'invalido') return (
        <div className='form-page'>
            <h1>El link no sirve</h1>
            <div className='form'>
                <p>{error}</p>
                <p className='muted'>Podés elegir qué avisos recibir desde los ajustes de tu cuenta.</p>
            </div>
            <p>{ajustes}</p>
        </div>
    );

    if (estado === 'listo') return (
        <div className='form-page'>
            <h1>Listo</h1>
            <div className='form'>
                <p>Ya no te vamos a mandar <strong>{info.titulo}</strong> a <strong className='recuperar__email'>{info.email}</strong>.</p>
                <p className='muted'>Si cambiás de idea, lo podés volver a activar desde los ajustes de tu cuenta.</p>
            </div>
            <p>{ajustes}</p>
        </div>
    );

    return (
        <div className='form-page'>
            <h1>Dejar de recibir este aviso</h1>
            <div className='form'>
                <p>¿Querés dejar de recibir <strong>{info.titulo}</strong> en <strong className='recuperar__email'>{info.email}</strong>?</p>
                <p className='muted'>Los demás avisos y los mails de seguridad te siguen llegando.</p>
                {error && <p className='form__error' role='alert'>{error}</p>}
                <button className='btn btn--primary' type='button' disabled={loading} onClick={confirmar}>
                    {loading ? 'Un momento...' : 'Sí, dejar de recibirlo'}
                </button>
            </div>
            <p>{ajustes}</p>
        </div>
    );
}

export default BajaAviso;
