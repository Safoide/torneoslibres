import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PartidoItem from '../PartidoItem';
import { addMatch, deleteMatch, getPartidosByTournament } from '../../assets/endPoints/partidos';
import { getEquiposByTournament } from '../../assets/endPoints/equipos';
import moment from 'moment';

const Partidos = () => {

    const { torneo } = useParams();

    const [partidos, setPartidos] = useState([]);

    function nextSunday(){
        const dayINeed = 0;
        const today = moment().isoWeekday();
        
        if (today <= dayINeed) { 
          return moment().isoWeekday(dayINeed);
        } else {
          return moment().add(1, 'weeks').isoWeekday(dayINeed);
        }
    }

    let initialDate = nextSunday().set({hour: 9, minute: 0, second: 0});

    const matchExists = (homeId, awayId) => partidos?.some(partido => 
        (partido.home_id === homeId && partido.away_id === awayId) || (partido.home_id === awayId && partido.away_id === homeId));

    const crearPartidos = async () => {
        
        let equipos = await getEquiposByTournament(torneo);

        const initialLength = equipos.length;

        for(let i = 0; i < initialLength / 2; i++) {
            let randomTeam1 = equipos[ Math.floor(Math.random() * equipos.length) ].id;
            equipos = equipos.filter((equipo) => equipo.id !== randomTeam1);

            let randomTeam2 = equipos[ Math.floor(Math.random() * equipos.length) ].id;
            equipos = equipos.filter((equipo) => equipo.id !== randomTeam2);

            if(partidos.length)
                if(matchExists(randomTeam1, randomTeam2)) {
                    i--;
                    continue;
                }

            let partidoObj = {
                tor_id: torneo,
                home_id: randomTeam1,
                away_id: randomTeam2,
                date: initialDate.format(),
                home_goals: null,
                away_goals: null
            }

            const newMatches = await addMatch(partidoObj);

            setPartidos(newMatches);

            initialDate.add(1, 'hour')
        }
    }

    const deleteM = async (event, matchId) => {
        event.preventDefault();

        setPartidos(await deleteMatch(matchId));
    }

    useEffect(() => {
        if(partidos.length !== 0) return;

        getPartidosByTournament(torneo)
            .then((data) => {
                setPartidos(data);
            })
    })

    return (
        <div className='partidosContainer'>
            <button onClick={crearPartidos}>CREAR NUEVA FECHA</button>
            {
                partidos.length > 0 &&
                    partidos.map((partido) => (
                        <PartidoItem key={partido.id} partido={partido} deleteMatch={deleteM} />
                    ))
            }
        </div>
    )
}

export default Partidos;
