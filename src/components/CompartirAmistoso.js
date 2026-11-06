import React, { useState } from 'react'

// Link del amistoso express para pasarselo a otro equipo: copiar o mandar por WhatsApp
const CompartirAmistoso = ({ id }) => {
    const [copiado, setCopiado] = useState(false);
    const url = `${window.location.origin}/amistosos/${id}`;
    const texto = `Nos falta rival para jugar: hay un amistoso express a mitad de precio en Torneos Libres. ¿Lo toman? ${url}`;

    const copiar = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch {
            window.prompt('Copiá el link:', url); // por si el navegador no deja usar el portapapeles
        }
    };

    return (
        <div className='compartir'>
            <input className='compartir__link' readOnly value={url} onFocus={e => e.target.select()} aria-label='Link del amistoso' />
            <div className='compartir__acciones'>
                <button type='button' className='btn btn--secundario btn--chico' onClick={copiar}>{copiado ? '✓ Copiado' : 'Copiar link'}</button>
                <a className='btn btn--whatsapp btn--chico' href={`https://wa.me/?text=${encodeURIComponent(texto)}`} target='_blank' rel='noreferrer'>Compartir por WhatsApp</a>
            </div>
        </div>
    );
};

export default CompartirAmistoso;
