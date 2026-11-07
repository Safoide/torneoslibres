import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePresencia from './usePresencia';
import '../assets/styles/cuenta.css';

const ROL_LABEL = { capitan: 'Capitán', organizador: 'Organizador' };

const CuentaMenu = () => {
    const { user, logout } = useAuth();
    const [abierto, setAbierto] = useState(false);
    const { montado, cerrando } = usePresencia(abierto);
    const ref = useRef(null);
    const navigate = useNavigate();

    // Cierra al hacer click afuera o con Escape
    useEffect(() => {
        if (!abierto) return;
        const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false); };
        const onKey = (e) => { if (e.key === 'Escape') setAbierto(false); };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [abierto])

    const ir = (ruta) => { setAbierto(false); navigate(ruta); };

    const salir = () => { setAbierto(false); logout(); navigate('/torneos'); };

    return (
        <div className='cuenta' ref={ref}>
            <button
                type='button' className='cuenta__btn'
                aria-haspopup='menu' aria-expanded={abierto}
                onClick={() => setAbierto(a => !a)}
            >
                <span className='cuenta__inicial'>{user.nombre?.[0]?.toUpperCase() || '?'}</span>
                <span className='cuenta__texto'>Mi cuenta</span>
                <span aria-hidden='true' className='cuenta__flecha'>▾</span>
            </button>

            {montado && (
                <div className={`cuenta__panel menu-flotante${cerrando ? ' saliendo' : ''}`} role='menu'>
                    <div className='cuenta__quien'>
                        <strong>{user.nombre}</strong>
                        {user.email && <span>{user.email}</span>}
                        {user.rol && <em>{ROL_LABEL[user.rol] || user.rol}</em>}
                    </div>

                    <button role='menuitem' className='cuenta__item' onClick={() => ir('/cuenta')}>Editar mis datos</button>
                    <button role='menuitem' className='cuenta__item' onClick={() => ir('/cuenta/ajustes')}>Ajustes de la cuenta</button>
                    <button role='menuitem' className='cuenta__item' onClick={() => ir('/cuenta/ajustes#notificaciones')}>Notificaciones</button>
                    <button role='menuitem' className='cuenta__item cuenta__item--peligro' onClick={salir}>Cerrar sesión</button>
                </div>
            )}
        </div>
    )
}

export default CuentaMenu