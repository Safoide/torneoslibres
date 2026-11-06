import React from 'react';
import { cierreMaximo, cobraPorFecha, formatFecha, hoyAR, ANTICIPACION_DIAS } from '../assets/torneosUtils.js';

// Cierre de inscripción del torneo (crear torneo y "Cambiar fechas").
// value = { modo: 'auto' | 'otra', fecha: 'YYYY-MM-DD' }
//  - auto: el último día permitido (con cobro por fecha, 4 días antes del inicio; sin cobro, el día anterior).
//    Se guarda como null en la API y se mueve solo si cambia el inicio.
//  - otra: un día anterior a ese, que elige el organizador.
export const CIERRE_INICIAL = { modo: 'auto', fecha: '' };

export const cierreParaApi = (v) => (v.modo === 'otra' && v.fecha ? v.fecha : null);

// Desde lo que devuelve la API (tor.cierreInscripcion, tor.cierreAutomatico)
export const cierreDesdeTorneo = (tor) => tor.cierreAutomatico ? CIERRE_INICIAL : { modo: 'otra', fecha: tor.cierreInscripcion };

const CierreCampos = ({ value, onChange, fechaInicio, precioFecha }) => {
    const cobra = cobraPorFecha({ precioFecha });
    const max = fechaInicio ? cierreMaximo(fechaInicio, precioFecha) : '';
    const hoy = hoyAR();
    const cambiar = (cambios) => onChange({ ...value, ...cambios });

    return (
        <div className='cierre-campos'>
            <label>Cierre de inscripción</label>

            <label className='opcion'>
                <input type='radio' name='cierreModo' checked={value.modo === 'auto'} onChange={() => cambiar({ modo: 'auto' })} />
                <span>
                    <strong>{cobra ? `${ANTICIPACION_DIAS} días antes del inicio` : 'El día anterior al inicio'}</strong>
                    {max ? ` · hasta el ${formatFecha(max)} a las 23:59` : ' · elegí primero la fecha de inicio'}
                </span>
            </label>

            <label className='opcion'>
                <input type='radio' name='cierreModo' checked={value.modo === 'otra'} onChange={() => cambiar({ modo: 'otra', fecha: value.fecha || max })} />
                <span><strong>Antes</strong> · elegí el último día para inscribirse</span>
            </label>

            {value.modo === 'otra' && (
                <input type='date' aria-label='Último día de inscripción' required min={hoy} max={max || undefined}
                    value={value.fecha} onChange={(e) => cambiar({ fecha: e.target.value })} />
            )}

            <span className='muted'>
                {cobra
                    ? `Como cobrás por fecha, la inscripción cierra como tarde ${ANTICIPACION_DIAS} días completos antes de empezar: así podés crear la fecha 1 y los equipos tienen tiempo de pagarla.`
                    : 'Sin cobro por fecha, la inscripción puede quedar abierta hasta el día anterior al inicio.'}
                {' '}Cuando cierra se arma el fixture con los equipos inscriptos, y el torneo empieza solo el día de inicio.
            </span>
        </div>
    );
};

export default CierreCampos;
