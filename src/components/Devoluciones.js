import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { marcarDevuelta } from '../assets/endPoints/fechas.js';
import { formatPrecio } from '../assets/torneosUtils.js';
import '../assets/styles/devoluciones.css';

// Organizador: saldos a favor que quedaron al terminar un torneo y tiene que devolverle a cada equipo.
// lista: [{ id, equipo, torneo, tor_id, monto, estado }] (solo las pendientes se pueden marcar).
// conTorneo: muestra el nombre del torneo (en el panel, que junta todos). onCambio: recargar después de marcar.
const Devoluciones = ({ lista, conTorneo = false, onCambio }) => {
    const [items, setItems] = useState(lista);
    const [marcando, setMarcando] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => { setItems(lista); }, [lista]);

    const pendientes = items.filter((d) => d.estado === 'pendiente');
    const hechas = items.filter((d) => d.estado === 'devuelta');
    if (!items.length) return null;

    const marcar = async (d) => {
        if (!window.confirm(`¿Ya le devolviste ${formatPrecio(d.monto)} a ${d.equipo}? Le vamos a avisar al capitán.`)) return;
        setError('');
        setMarcando(d.id);
        const data = await marcarDevuelta(d.id);
        setMarcando(null);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');
        setItems((prev) => prev.map((x) => (x.id === d.id ? { ...x, estado: 'devuelta' } : x)));
        onCambio?.();
    };

    return (
        <section className={`devoluciones${pendientes.length ? ' devoluciones--pendientes' : ''}`}>
            <strong>{pendientes.length ? `Devoluciones pendientes (${pendientes.length})` : 'Devoluciones'}</strong>
            {pendientes.length > 0 && (
                <p className='devoluciones__texto'>
                    {conTorneo ? 'Estos torneos terminaron' : 'El torneo terminó'} y a estos equipos les quedó saldo a favor de fechas canceladas que ya habían pagado.
                    Devolveles el monto completo (nuestra comisión de esa plata te la devolvemos nosotros) y marcalo acá.
                </p>
            )}
            <ul className='devoluciones__lista'>
                {[...pendientes, ...hechas].map((d) => (
                    <li key={d.id} className='devoluciones__item'>
                        <span>
                            <strong>{d.equipo}</strong>
                            {conTorneo && <> · <Link to={`/partidos/${d.tor_id}`}>{d.torneo}</Link></>}
                        </span>
                        <span className='devoluciones__monto'>{formatPrecio(d.monto)}</span>
                        {d.estado === 'pendiente' ? (
                            <button type='button' className='btn btn--secundario btn--chico' disabled={marcando === d.id} onClick={() => marcar(d)}>
                                {marcando === d.id ? 'Guardando...' : 'Marcar devuelta'}
                            </button>
                        ) : (
                            <span className='devoluciones__hecha'>✓ Devuelta</span>
                        )}
                    </li>
                ))}
            </ul>
            {error && <p className='form__error' role='alert'>{error}</p>}
        </section>
    );
};

export default Devoluciones;
