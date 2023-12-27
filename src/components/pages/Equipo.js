import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PartidoItem from '../PartidoItem';
import { getEquipoById } from '../../assets/endPoints/equipos';
import { deleteMatch, getPartidosByTeam } from '../../assets/endPoints/partidos';

const Equipo = () => {

    const { teamId } = useParams();

    const navigate = useNavigate();

    const [equipo, setEquipo] = useState(undefined);
    const [partidos, setPartidos] = useState([]);

    const deleteM = async (event, matchId) => {
        event.preventDefault();

        setPartidos(await deleteMatch(matchId));
    }

    useEffect(() => {
        getEquipoById(teamId)
            .then((data) => {
                setEquipo(data);
            });

        getPartidosByTeam(teamId)
            .then((data) => {
                setPartidos(data);
            });
    }, [teamId])

    const handleButton = (event) => {
        event.preventDefault();

        navigate('./editar')
    }
    
    return (
        <EquipoContainer>
            <div style={ {display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 30} }>
                {
                    equipo &&
                        <>
                            <EquipoNombre>
                                <img src={ require(`../../assets/imgs/${equipo.logo}`) } alt={equipo.name}/>
                                <h2 key={equipo.id}>{equipo.name}</h2>
                            </EquipoNombre>
                            <div onClick={handleButton}>EDITAR</div>
                        </>
                }
            </div>
            <div className='partidosContainer'>
                <h3>PARTIDOS JUGADOS</h3>
                {
                    partidos.map((partido, i) => (
                        <PartidoItem partido={partido} deleteMatch={deleteM} />
                    ))
                }
            </div>
        </EquipoContainer>
    )
}

const EquipoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    gap: 60px;
`;

const EquipoNombre = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 15px;
`;

export default Equipo;
