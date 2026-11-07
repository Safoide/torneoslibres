import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aceptarTerminos } from '../assets/endPoints/auth.js';
import { VERSION_LEGAL } from '../assets/legal.js';
import '../assets/styles/terminos.css';

// Cuentas que no aceptaron la versión vigente de los términos y la privacidad (creadas antes de que existieran,
// o cuando se publica una versión nueva: `terminosPendientes` en /auth/me). Para seguir usando la app las tienen
// que aceptar: un aviso que tapa la página, con links para leerlos y la opción de cerrar sesión.
// En /terminos y /privacidad es una barra abajo, así se pueden leer antes de aceptar.
const PAGINAS_LEGALES = ['/terminos', '/privacidad'];

const AceptarTerminos = () => {
    const { user, setUser, logout } = useAuth();
    const { pathname } = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const boton = useRef(null);

    const pendiente = !!user?.terminosPendientes;
    const leyendo = PAGINAS_LEGALES.includes(pathname);
    const modal = pendiente && !leyendo;

    // Con el aviso abierto, la página de atrás no se mueve y el foco va al botón
    useEffect(() => {
        if (!modal) return;
        boton.current?.focus();
        const antes = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = antes; };
    }, [modal])

    if (!pendiente) return null;

    const aceptar = async () => {
        setError('');
        setLoading(true);
        const data = await aceptarTerminos(VERSION_LEGAL);
        setLoading(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor. Probá de nuevo.');
        setUser(data);
    };

    const errorAviso = error && <p className='form__error' role='alert'>{error}</p>;

    if (leyendo) return (
        <div className='terminos-barra' role='region' aria-label='Aceptar los términos'>
            <p>Para seguir usando Torneos Libres, aceptá los <strong>términos y condiciones</strong> y la <strong>política de privacidad</strong>.</p>
            {errorAviso}
            <button ref={boton} type='button' className='btn btn--primary btn--chico' disabled={loading} onClick={aceptar}>
                {loading ? 'Un momento...' : 'Acepto'}
            </button>
        </div>
    );

    return (
        <div className='terminos-fondo'>
            <div className='terminos-modal' role='dialog' aria-modal='true' aria-labelledby='terminos-titulo'>
                <h2 id='terminos-titulo'>Términos y privacidad</h2>
                <p>
                    Hola {user.nombre}. Publicamos los <Link to='/terminos'>términos y condiciones</Link> y
                    la <Link to='/privacidad'>política de privacidad</Link> de Torneos Libres: explican las reglas para usar la
                    plataforma, cómo funcionan los pagos y qué hacemos con tus datos.
                </p>
                <p className='muted'>Para seguir usando tu cuenta tenés que aceptarlos. Podés leerlos antes con los links de arriba.</p>
                {errorAviso}
                <div className='terminos-modal__acciones'>
                    <button ref={boton} type='button' className='btn btn--primary' disabled={loading} onClick={aceptar}>
                        {loading ? 'Un momento...' : 'Acepto los términos y la privacidad'}
                    </button>
                    <button type='button' className='link-boton' disabled={loading} onClick={logout}>Cerrar sesión</button>
                </div>
            </div>
        </div>
    );
}

export default AceptarTerminos;
