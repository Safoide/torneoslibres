import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PartidoItem from '../PartidoItem';
import { getEquipoById } from '../../assets/endPoints/equipos';
import { deleteMatch, getPartidosByTeam } from '../../assets/endPoints/partidos';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getJugadoresByTeam } from '../../assets/endPoints/jugadores';

const Equipo = () => {

    const { teamId } = useParams();

    const navigate = useNavigate();

    const [equipo, setEquipo] = useState(undefined);
    const [jugadores, setJugadores] = useState([]);
    const [partidos, setPartidos] = useState([]);

    const deleteM = async (event, matchId) => {
        event.preventDefault();

        setPartidos(await deleteMatch(matchId));
    }

    useEffect(() => {
        getEquipoById(teamId)
            .then((data) => setEquipo(data));

        getJugadoresByTeam(teamId)
            .then((data) => setJugadores(data));

        getPartidosByTeam(teamId)
            .then((data) => setPartidos(data));
    }, [teamId])

    const handleButton = (event) => {
        event.preventDefault();

        navigate('./editar')
    }
    
    return (
        <div className='equipoContainer'>
            <div style={ {display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 30} }>
                {
                    equipo &&
                        <>
                            <div className='equipoInfo'>
                                <div className='equipoLogo'>
                                    <img src={ require(`../../assets/imgs/${equipo.logo}`) } alt={equipo.name}/>
                                    <div className='equipoEditar' onClick={handleButton}><box-icon color='#fff' type='solid' name='edit'></box-icon></div>
                                </div>
                                <h2 key={equipo.id}>{equipo.name}</h2>
                            </div>
                        </>
                }
            </div>
            <Tabs selectedTabPanelClassName='tabPanel-select' selectedTabClassName='tabButton-select' className='tabsContainer'>
                <TabList className='tabsList'>
                    <Tab className='tabButton'>Jugadores</Tab>
                    <Tab className='tabButton'>Partidos</Tab>
                </TabList>

                <TabPanel className='tabPanel'>
                    <div className='partidosContainer'>
                        <h3>JUGADORES</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th title='Jugados'>J</th>
                                    <th title='Goles'>G</th>
                                    <th title='Tarjetas amarillas'>TA</th>
                                    <th title='Tarjetas rojas'>TR</th>
                                    <th title='Jugador del partido'>MVP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    jugadores &&
                                        jugadores.map((jugador, orden) => (
                                            <tr key={jugador.id}>
                                                <th className='secondary-text'>{orden+1}</th>
                                                <th className='secondary-text'>{jugador.full_name}</th>
                                                <th className='secondary-text'>{jugador.played}</th>
                                                <th className='secondary-text'>{jugador.goals}</th>
                                                <th className='secondary-text'>{jugador.yellow_cards}</th>
                                                <th className='secondary-text'>{jugador.red_cards}</th>
                                                <th className='secondary-text'>{jugador.mvp}</th>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                    </div>
                </TabPanel>
                <TabPanel className='tabPanel'>
                    <div className='partidosContainer'>
                        <h3>PARTIDOS JUGADOS</h3>
                        {
                            partidos.length ?
                                partidos.map((partido, i) => (
                                    <PartidoItem partido={partido} deleteMatch={deleteM} />
                                ))
                            :
                                <h4>{partidos.error}</h4>
                        }
                    </div>
                </TabPanel>
            </Tabs>
            
        </div>
    )
}

export default Equipo;
