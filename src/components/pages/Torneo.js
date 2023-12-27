import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getEquiposByTournament } from '../../assets/endPoints/equipos';

const Torneo = () => {

    const { torneo } = useParams();

    const [equipos, setEquipos] = useState([]);

    useEffect(() => {
        if (equipos.length !== 0) return;

        getEquiposByTournament(torneo)
            .then(data => {
                setEquipos(data.sort((a, b) => b.points - a.points || b.goal_difference - a.goal_difference));
            });
    })

    return (
        <PageContainer>
            <table>
                <thead>
                    <tr>
                        <th>Posicion</th>
                        <th>Nombre</th>
                        <th title='Jugados'>J</th>
                        <th title='Ganados'>G</th>
                        <th title='Empatados'>E</th>
                        <th title='Perdidos'>P</th>
                        <th title='Goles a favor'>GF</th>
                        <th title='Goles en contra'>GC</th>
                        <th title='Diferencia de goles'>DF</th>
                        <th title='Puntos'>PTS</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        equipos.map((equipo, orden) => (
                            <tr key={equipo.id}>
                                <th className='secondary-text'>{orden+1}</th>
                                <th><Link to={`/equipo/${equipo.id}`}>{equipo.name}</Link></th>
                                <th className='secondary-text'>{equipo.played}</th>
                                <th className='secondary-text'>{equipo.wins}</th>
                                <th className='secondary-text'>{equipo.draws}</th>
                                <th className='secondary-text'>{equipo.losses}</th>
                                <th className='secondary-text'>{equipo.goals_for}</th>
                                <th className='secondary-text'>{equipo.goals_against}</th>
                                <th className='secondary-text'>{equipo.goal_difference}</th>
                                <th className='secondary-text'>{equipo.points}</th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <PartidosBtn to={'./partidos'}>VER PARTIDOS A JUGAR</PartidosBtn>
            <PartidosBtn to={'/'}>ELEGIR OTRO TORNEO</PartidosBtn>
        </PageContainer>
    )
}

const PageContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
`;

const PartidosBtn = styled(Link)`
    display: inline-block;
    margin: 40px auto 0;
    color: rgba(255, 255, 255, .7);
    text-decoration: none;
    font-weight: 700;
    background-color: rgba(0, 0, 0, .4);
    border-radius: 7px;
    padding: 20px;
    transition: all .3s ease 0s;

    &:hover {
        background-color: #000000;
        color: #fff;
    }
`;

export default Torneo
