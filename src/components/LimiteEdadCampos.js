import React from 'react'
import { textoLimiteEdad } from '../assets/torneosUtils.js';

export const LIMITE_EDAD_INICIAL = { activo: false, min: '', max: '' };

// Lo que se manda a la API: null si no hay limite, o { min, max } (vacio = sin tope de ese lado)
export const limiteEdadParaApi = (v) => !v.activo ? null : {
    min: v.min === '' ? null : Number(v.min),
    max: v.max === '' ? null : Number(v.max),
};

// Campos de "Límite de edad" al crear un torneo.
// value: { activo, min, max }  onChange: (nuevoValor) => void
const LimiteEdadCampos = ({ value: v, onChange, disabled }) => {
    const set = (cambios) => onChange({ ...v, ...cambios });
    const resumen = textoLimiteEdad(limiteEdadParaApi(v));

    return (
        <fieldset className='reglas' disabled={disabled}>
            <legend>Límite de edad</legend>

            <label className='opcion'>
                <input type='checkbox' checked={v.activo} onChange={e => set({ activo: e.target.checked })} />
                <span><strong>Limitar la edad de los jugadores</strong> · solo se pueden inscribir equipos en los que todo el plantel cumpla el límite.</span>
            </label>

            {v.activo && (
                <div className='reglas__multa'>
                    <div className='reglas__fila reglas__fila--doble'>
                        <div className='form__campo'>
                            <label htmlFor='edadMin'>Edad mínima</label>
                            <input id='edadMin' type='number' min={10} max={80} placeholder='Sin mínimo' value={v.min} onChange={e => set({ min: e.target.value })} />
                        </div>
                        <div className='form__campo'>
                            <label htmlFor='edadMax'>Edad máxima</label>
                            <input id='edadMax' type='number' min={10} max={80} placeholder='Sin máximo' value={v.max} onChange={e => set({ max: e.target.value })} />
                        </div>
                    </div>
                    <span className='muted'>
                        {resumen ? `Pueden jugar ${resumen}.` : 'Completá la edad mínima (ej. +35), la máxima (ej. hasta 20) o las dos.'}
                        {' '}No se puede cambiar una vez que haya equipos inscriptos.
                    </span>
                </div>
            )}
        </fieldset>
    );
};

export default LimiteEdadCampos;
