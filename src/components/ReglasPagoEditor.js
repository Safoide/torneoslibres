import React, { useState } from 'react'
import { editTor } from '../assets/endPoints/torneos.js';
import ReglasPagoCampos from './ReglasPagoCampos';
import '../assets/styles/formularios.css';

// Edicion de las reglas de pago por el organizador dueño, mientras el torneo no empezo
const ReglasPagoEditor = ({ tor, onGuardado }) => {
    const [reglas, setReglas] = useState(tor.reglasPago);
    const [estado, setEstado] = useState(''); // '' | guardando | ok
    const [error, setError] = useState('');

    const cambiado = JSON.stringify(reglas) !== JSON.stringify(tor.reglasPago);

    const guardar = async () => {
        setError('');
        setEstado('guardando');

        const data = await editTor(tor.id, { reglasPago: { ...reglas, multaValor: Number(reglas.multaValor) || 0 } });

        if (!data || data.error) { setEstado(''); return setError(data?.error || 'No pudimos conectar con el servidor'); }

        setEstado('ok');
        onGuardado({ ...tor, reglasPago: data.reglasPago });
    };

    return (
        <section className='seccion form reglas-editor'>
            <h2>Reglas de pago</h2>
            <ReglasPagoCampos value={reglas} precioFecha={tor.precioFecha} onChange={(r) => { setReglas(r); setEstado(''); }} />
            <p className='muted'>Podés cambiarlas hasta que el torneo pase a "En curso". Después quedan fijas.</p>

            {error && <p className='form__error' role='alert'>{error}</p>}
            <div className='reglas-editor__acciones'>
                <button type='button' className='btn btn--primary btn--chico' disabled={!cambiado || estado === 'guardando'} onClick={guardar}>
                    {estado === 'guardando' ? 'Guardando...' : 'Guardar reglas'}
                </button>
                {estado === 'ok' && !cambiado && <span className='reglas-editor__ok'>✓ Guardadas</span>}
            </div>
        </section>
    );
};

export default ReglasPagoEditor;
