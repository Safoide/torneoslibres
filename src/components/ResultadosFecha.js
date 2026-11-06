import React, { useState } from 'react';
import { cargarResultados } from '../assets/endPoints/fechas.js';
import Avatar from './Avatar';
import { logoSrc } from '../assets/torneosUtils.js';

const aTexto = (n) => (n === null || n === undefined ? '' : String(n));

// Formulario para que el organizador cargue (o corrija) los resultados de una fecha terminada.
// Los partidos con W.O. ya tienen su resultado y no se tocan.
const ResultadosFecha = ({ fecha, partidos, equipos, onGuardado, onCancelar }) => {
    const [goles, setGoles] = useState(() => Object.fromEntries(partidos.map(p => [p.id, { home: aTexto(p.home_goals), away: aTexto(p.away_goals) }])));
    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);

    const cambiar = (id, lado, valor) => {
        if (!/^\d{0,2}$/.test(valor)) return; // solo numeros de 0 a 99
        setGoles(prev => ({ ...prev, [id]: { ...prev[id], [lado]: valor } }));
    };

    const enviar = async (e) => {
        e.preventDefault();
        setError('');

        const editables = partidos.filter(p => !p.wo);
        const incompleto = editables.find(p => (goles[p.id].home === '') !== (goles[p.id].away === ''));
        if (incompleto) return setError(`Completá los goles de los dos equipos en ${equipos[incompleto.home_id]?.name} vs ${equipos[incompleto.away_id]?.name}`);

        // Solo se mandan los que cambiaron
        const resultados = editables
            .filter(p => goles[p.id].home !== '' && (goles[p.id].home !== aTexto(p.home_goals) || goles[p.id].away !== aTexto(p.away_goals)))
            .map(p => ({ id: p.id, home_goals: Number(goles[p.id].home), away_goals: Number(goles[p.id].away) }));

        if (!resultados.length) return onCancelar();

        setGuardando(true);
        const data = await cargarResultados(fecha.id, resultados);
        setGuardando(false);

        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');
        onGuardado();
    };

    const lado = (eq) => (
        <span className='resultado__equipo'>
            <Avatar name={eq?.name ?? '?'} src={logoSrc(eq?.logo)} size={32} />
            <span>{eq?.name ?? '—'}</span>
        </span>
    );

    return (
        <form className='resultados-form' onSubmit={enviar}>
            <p className='muted'>Cargá los goles de cada partido. Podés dejar alguno sin completar y terminarlo después; la tabla de posiciones se actualiza al guardar. Mientras el torneo siga en curso podés corregir los resultados.</p>

            <ul className='resultados-form__lista'>
                {partidos.map(p => {
                    const home = equipos[p.home_id], away = equipos[p.away_id];
                    return (
                        <li key={p.id} className='resultado'>
                            {lado(home)}
                            {p.wo
                                ? <span className='resultado__wo'>
                                    <span className='wo-tag'>{p.wo === 'doble' ? 'W.O. doble' : 'W.O.'}</span>
                                    {p.wo !== 'doble' && <span className='muted'>{p.home_goals} - {p.away_goals}</span>}
                                </span>
                                : <span className='resultado__goles'>
                                    <input type='text' inputMode='numeric' aria-label={`Goles de ${home?.name}`} value={goles[p.id].home} onChange={(e) => cambiar(p.id, 'home', e.target.value)} />
                                    <span className='muted'>-</span>
                                    <input type='text' inputMode='numeric' aria-label={`Goles de ${away?.name}`} value={goles[p.id].away} onChange={(e) => cambiar(p.id, 'away', e.target.value)} />
                                </span>}
                            {lado(away)}
                        </li>
                    );
                })}
            </ul>

            {error && <p className='form__error' role='alert'>{error}</p>}

            <div className='fecha-form__acciones'>
                <button type='button' className='btn btn--secundario btn--chico' onClick={onCancelar}>Cancelar</button>
                <button type='submit' className='btn btn--primary btn--chico' disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar resultados'}</button>
            </div>
        </form>
    );
};

export default ResultadosFecha;
