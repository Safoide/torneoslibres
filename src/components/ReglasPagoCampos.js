import React from 'react'
import { montoMulta } from '../assets/reglasPago.js';
import { formatPrecio } from '../assets/torneosUtils.js';

// Campos de "Reglas de pago" (crear torneo y editar antes de que empiece).
// value: { penalizacion, multaTipo, multaValor, amistosos }  onChange: (nuevasReglas) => void
const ReglasPagoCampos = ({ value: r, onChange, precioFecha, disabled }) => {
    const set = (cambios) => onChange({ ...r, ...cambios });
    const ejemplo = montoMulta(r, Number(precioFecha) || 0);

    return (
        <fieldset className='reglas' disabled={disabled}>
            <legend>Si un equipo no paga la fecha a tiempo</legend>
            <p className='muted'>Los capitanes pagan su parte de cada fecha hasta las 23:59 del día anterior al partido.</p>

            <label className='opcion'>
                <input type='checkbox' checked={r.penalizacion} onChange={e => set({ penalizacion: e.target.checked, ...(!e.target.checked && { amistosos: false }) })} />
                <span><strong>Aplicar penalización</strong> · el equipo pierde 0-3 por W.O. y puede recibir una multa. Si la desactivás, no pasa nada automático y decidís vos.</span>
            </label>

            {r.penalizacion && (
                <div className='reglas__multa'>
                    <label htmlFor='multaTipo'>Multa</label>
                    <div className='reglas__fila'>
                        <select id='multaTipo' value={r.multaTipo} onChange={e => set({ multaTipo: e.target.value, multaValor: e.target.value === 'fijo' ? Math.max(montoMulta(r, Number(precioFecha) || 0), 0) : 50 })}>
                            <option value='porcentaje'>% del precio de la fecha</option>
                            <option value='fijo'>Monto fijo ($)</option>
                        </select>
                        <input
                            type='number' min={0} max={r.multaTipo === 'fijo' ? 10000000 : 100} step={r.multaTipo === 'fijo' ? 1000 : 5}
                            aria-label={r.multaTipo === 'fijo' ? 'Monto de la multa en pesos' : 'Porcentaje de la multa'}
                            value={r.multaValor} onChange={e => set({ multaValor: e.target.value === '' ? '' : Number(e.target.value) })}
                        />
                    </div>
                    <span className='muted'>
                        {!r.multaValor ? 'Sin multa: solo pierde el partido por W.O.'
                            : r.multaTipo === 'porcentaje' && Number(precioFecha) > 0 ? `Con el precio actual de la fecha son ${formatPrecio(ejemplo)}.`
                            : 'La multa queda como deuda del equipo: hasta pagarla no puede pagar fechas ni inscribirse en otros torneos.'}
                    </span>
                </div>
            )}

            <label className={`opcion${!r.penalizacion ? ' opcion--apagada' : ''}`}>
                <input type='checkbox' checked={r.penalizacion && r.amistosos} disabled={!r.penalizacion} onChange={e => set({ amistosos: e.target.checked })} />
                <span><strong>Buscar amistoso express</strong> · el lugar del equipo que no pagó se publica a mitad de precio para que el rival pueda jugar igual.{!r.penalizacion && ' Requiere la penalización.'}</span>
            </label>
        </fieldset>
    );
};

export default ReglasPagoCampos;
