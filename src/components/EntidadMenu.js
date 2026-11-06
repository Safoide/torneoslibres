import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { logoSrc } from '../assets/torneosUtils.js';
import Avatar from './Avatar';
import usePresencia from './usePresencia';
import '../assets/styles/orgmenu.css';

// Menu desplegable del header para la organizacion (organizador) o el equipo (capitan)
const EntidadMenu = ({ nombre, logo, items, textoEliminar, confirmar, onEliminar }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { montado, cerrando } = usePresencia(open);
    const ref = useRef(null);

    // Se cierra al hacer click afuera o con Escape
    useEffect(() => {
        if (!open) return;

        const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };

        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);

        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open])

    const eliminar = async () => {
        setOpen(false);

        if (!window.confirm(confirmar)) return;

        const data = await onEliminar();
        if (!data || data.error) return window.alert(data?.error || 'No pudimos conectar con el servidor');

        navigate('/torneos');
    };

    return (
        <div className='orgmenu' ref={ref}>
            <button className='orgmenu__btn' type='button' aria-expanded={open} aria-haspopup='menu' onClick={() => setOpen(o => !o)}>
                <Avatar name={nombre} src={logoSrc(logo)} size={30} />
                <span>{nombre}</span>
                <span aria-hidden='true'>▾</span>
            </button>

            {montado && (
                <div className={`orgmenu__lista menu-flotante${cerrando ? ' saliendo' : ''}`} role='menu'>
                    {items.map(it => (
                        <Link key={it.to} role='menuitem' className='orgmenu__item' to={it.to} onClick={() => setOpen(false)}>{it.label}</Link>
                    ))}
                    <button role='menuitem' className='orgmenu__item orgmenu__item--peligro' type='button' onClick={eliminar}>{textoEliminar}</button>
                </div>
            )}
        </div>
    )
}

export default EntidadMenu;