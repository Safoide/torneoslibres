import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enviarVerificacion } from '../assets/endPoints/auth.js';
import '../assets/styles/verificacion.css';

const OCULTO = 'ocultarVerificacion'; // sessionStorage: el email para el que se cerró la barra (si cambia, vuelve a salir)

// Email sin verificar. Por defecto, una barra arriba de todas las páginas (se puede cerrar hasta la próxima sesión);
// enLinea: el estado del email en "Editar mis datos" (verificado, o sin verificar con el botón para reenviar).
const AvisoVerificacion = ({ enLinea = false }) => {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const [estado, setEstado] = useState(''); // '' | enviando | enviado | <mensaje de error>
    const [oculto, setOculto] = useState(() => {
        try { return sessionStorage.getItem(OCULTO); } catch { return null; }
    });

    if (!user) return null;

    const reenviar = async () => {
        setEstado('enviando');
        const data = await enviarVerificacion();
        if (!data || data.error) return setEstado(data?.error || 'No pudimos conectar con el servidor');
        setEstado('enviado');
    };

    const boton = (
        <button type='button' className='link-boton' disabled={estado === 'enviando'} onClick={reenviar}>
            {estado === 'enviando' ? 'Enviando...' : estado === 'enviado' ? 'Mandarlo de nuevo' : 'Reenviar el mail'}
        </button>
    );
    const resultado = estado === 'enviado'
        ? <span className='verificacion__ok'>Listo: te mandamos el link a {user.email}. Revisá también el spam.</span>
        : estado && estado !== 'enviando' ? <span className='verificacion__error' role='alert'>{estado}</span> : null;

    if (enLinea) {
        if (user.emailVerificado) return <span className='verificacion__ok'>✓ Email verificado</span>;
        return (
            <span className='verificacion__linea'>
                <span className='muted'>Email sin verificar.</span> {boton} {resultado}
            </span>
        );
    }

    if (user.emailVerificado || oculto === user.email || pathname === '/verificar') return null;

    const cerrar = () => {
        try { sessionStorage.setItem(OCULTO, user.email); } catch { /* sin storage: se cierra solo en esta página */ }
        setOculto(user.email);
    };

    return (
        <div className='verificacion' role='status'>
            <p>
                <strong>Confirmá tu email.</strong> Te mandamos un link a <strong>{user.email}</strong> para verificarlo. {boton}
            </p>
            {resultado && <p>{resultado}</p>}
            <button type='button' className='verificacion__cerrar' aria-label='Cerrar aviso' onClick={cerrar}>×</button>
        </div>
    );
};

export default AvisoVerificacion;
