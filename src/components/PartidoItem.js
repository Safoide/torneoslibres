import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getEquipoById } from '../assets/endPoints/equipos';
import { logoSrc } from '../assets/torneosUtils.js';
import Avatar from './Avatar';

const TZ = 'America/Argentina/Buenos_Aires';

const parseDate = (fecha) => {
    const date = new Date(fecha);
    const dia = date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: TZ });
    const hora = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });

    return `${dia} · ${hora}`;
};

// Un partido. Si se le pasa `equipos` ({ [id]: equipo }) los usa; si no, los pide al servidor.
const PartidoItem = ({ partido, equipos, mostrarDia = true }) => {
    const [pedidos, setPedidos] = useState({});

    useEffect(() => {
        if (equipos) return;

        Promise.all([getEquipoById(partido.home_id), getEquipoById(partido.away_id)])
            .then(([home, away]) => setPedidos({ [partido.home_id]: home, [partido.away_id]: away }));
    }, [partido, equipos])

    const home = (equipos ?? pedidos)[partido.home_id];
    const away = (equipos ?? pedidos)[partido.away_id];
    if (!home || !away) return null;

    const jugado = partido.home_goals !== null && partido.away_goals !== null;

    const lado = (eq) => (
        <Link className='equipoDiv' to={`/equipo/${eq.id}`}>
            <Avatar name={eq.name} src={logoSrc(eq.logo)} size={56} />
            <span>{eq.name}</span>
        </Link>
    );

    return (
        <div className='equipoPartido'>
            <h4 className='partidoFecha secondary-text'>
                <span>{mostrarDia ? parseDate(partido.date) : parseDate(partido.date).split(' · ')[1]}</span>
                {partido.cancha && <span>Cancha {partido.cancha}</span>}
            </h4>
            <div className='partidoContainer'>
                {lado(home)}
                <div className='golesContainer'>
                    {jugado
                        ? <><span>{partido.home_goals}</span><span className='secondary-text'>-</span><span>{partido.away_goals}</span></>
                        : <h4 className='secondary-text'>VS</h4>}
                </div>
                {lado(away)}
            </div>
        </div>
    )
}

export default PartidoItem
