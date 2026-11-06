import React, { useState } from 'react'
import { formatPrecio } from '../assets/torneosUtils.js';
import '../assets/styles/formularios.css';

export const METODOS = { tarjeta: 'Tarjeta de crédito / débito', mercadopago: 'Mercado Pago' };

// Formulario de pago (simulado) que se usa en la inscripcion, al pagar una fecha y al tomar un amistoso.
// onPagar({ metodo, simular }) devuelve la respuesta del servidor; si trae error se muestra aca.
const PagoForm = ({ monto, onPagar, onCancelar, textoBoton }) => {
    const [metodo, setMetodo] = useState('tarjeta');
    const [simularRechazo, setSimularRechazo] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const pagar = async () => {
        setError('');
        setLoading(true);

        const data = await onPagar({ metodo, simular: simularRechazo ? 'rechazado' : undefined });

        setLoading(false);
        if (!data || data.error) setError(data?.error || 'No pudimos conectar con el servidor');
    };

    return (
        <div className='form pago-form'>
            <label>Método de pago</label>
            {Object.entries(METODOS).map(([key, label]) => (
                <label className='opcion' key={key}>
                    <input type='radio' name='metodo' checked={metodo === key} onChange={() => setMetodo(key)} />
                    {label}
                </label>
            ))}

            <p className='form__nota'>Pago de prueba: no se cobra dinero real ni se piden datos de tarjeta.</p>

            {process.env.NODE_ENV !== 'production' && (
                <label className='opcion'>
                    <input type='checkbox' checked={simularRechazo} onChange={e => setSimularRechazo(e.target.checked)} />
                    Modo prueba: simular pago rechazado
                </label>
            )}

            {error && <p className='form__error' role='alert'>{error}</p>}

            <div className='pago-form__acciones'>
                {onCancelar && <button className='btn btn--secundario' type='button' onClick={onCancelar} disabled={loading}>Cancelar</button>}
                <button className='btn btn--primary' type='button' onClick={pagar} disabled={loading}>
                    {loading ? 'Procesando pago...' : (textoBoton ?? `Pagar ${formatPrecio(monto)}`)}
                </button>
            </div>
        </div>
    );
};

export default PagoForm;
