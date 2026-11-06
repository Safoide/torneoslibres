import React, { useState } from 'react'
import { pagarMultas } from '../assets/endPoints/multas.js';
import { formatPrecio } from '../assets/torneosUtils.js';
import PagoForm from './PagoForm';
import '../assets/styles/fechas.css';

// Aviso de multas pendientes del equipo (capitan). Mientras haya deuda no puede pagar fechas,
// inscribirse en torneos ni tomar amistosos. data: { total, multas }  onPagado: recarga los datos
const MultasPendientes = ({ data, onPagado }) => {
    const [pagando, setPagando] = useState(false);
    if (!data?.total) return null;

    return (
        <div className='aviso aviso--error multas' role='alert'>
            <div className='aviso--fila'>
                <strong>Tenés multas pendientes: {formatPrecio(data.total)}</strong>
            </div>
            <ul className='multas__lista'>
                {data.multas.map(m => (
                    <li key={m.id}>
                        <span>{m.torneo} · fecha {m.fecha} · {m.equipo}</span>
                        <span>{formatPrecio(m.monto)}</span>
                    </li>
                ))}
            </ul>
            <p>Por no pagar la fecha a tiempo. Hasta saldarlas no podés pagar fechas, inscribirte en torneos ni tomar amistosos.</p>

            {pagando ? (
                <PagoForm
                    monto={data.total}
                    textoBoton={`Pagar multas · ${formatPrecio(data.total)}`}
                    onCancelar={() => setPagando(false)}
                    onPagar={async (body) => {
                        const r = await pagarMultas(body);
                        if (r && !r.error) { setPagando(false); onPagado(); }
                        return r;
                    }}
                />
            ) : (
                <button type='button' className='btn btn--primary btn--chico' onClick={() => setPagando(true)}>Pagar multas</button>
            )}
        </div>
    );
};

export default MultasPendientes;
