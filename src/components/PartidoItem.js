import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import 'boxicons';
import '../assets/styles/style.css';
import { getEquipoById } from '../assets/endPoints/equipos';

const PartidoItem = ({ partido, deleteMatch }) => {

    const [homeTeam, setHomeTeam] = useState({});
    const [awayTeam, setAwayTeam] = useState({});

    const parseDate = (fecha) => {
        const date = new Date(fecha);

        let DateString = `${date.toLocaleString("es-AR", {  weekday: 'short' })}, ${date.toLocaleString("es-AR", { dateStyle: 'short' })}, ${date.toLocaleTimeString("es-AR", { timeStyle: 'short' })}`;

        return DateString;
    }

    useEffect(() => {
        getEquipoById(partido.home_id)
            .then((data) => {
                setHomeTeam(data);
            })

        getEquipoById(partido.away_id)
            .then((data) => {
                setAwayTeam(data);
            })   
    }, [])

    return (
        <>
            {
                homeTeam.logo &&
                awayTeam.logo &&
                <div className='equipoPartido' key={partido.id}>
                    <h4 className='partidoFecha secondary-text'>
                        {parseDate(partido.date)}
                        <div style={{display: 'flex', gap: '10px'}}>
                            <Link className='editPartido' to={`/torneos/partidos/${partido.id}`}>
                                <box-icon color='#9AA0A6' type='solid' name='edit'></box-icon>
                            </Link>
                            <div className='editPartido' onClick={(event) => deleteMatch(event, partido.id)}>
                                <box-icon color='#9AA0A6' type='solid' name='trash'></box-icon>
                            </div>
                        </div>
                    </h4>
                    <div className='partidoContainer'>
                        <Link className='equipoDiv' to={`/equipo/${partido.home_id}`}>
                            <img src={ require(`../assets/imgs/${homeTeam.logo}`) } alt={partido.home_id} />
                            <span>{homeTeam.name}</span>
                        </Link>
                        <div className='golesContainer'>
                            <span className='secondary-text'>{partido.home_goals}</span>
                            {partido.home_goals !== null 
                                ? <span className='secondary-text'>-</span>
                                : <h4 className='secondary-text'>VS</h4>
                            }
                            <span className='secondary-text'>{partido.away_goals}</span>
                        </div>
                        <Link className='equipoDiv' to={`/equipo/${partido.away_id}`}>
                            <img src={ require(`../assets/imgs/${awayTeam.logo}`) } alt={partido.away_id} />
                            <span>{awayTeam.name}</span>
                        </Link>
                    </div>
                </div>
            }
        </>
    )
}

export default PartidoItem
