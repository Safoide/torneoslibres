import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PartidoItem from '../PartidoItem';
import { getEquipoById } from '../../assets/endPoints/equipos';
import { getPartidosByTeam } from '../../assets/endPoints/partidos';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getJugadoresByTeam } from '../../assets/endPoints/jugadores';
import { logoSrc } from '../../assets/torneosUtils.js';
import { Cargando, Sk } from '../Skeleton';

const Equipo = () => {

    const { teamId } = useParams();

    const [equipo, setEquipo] = useState(undefined);
    const [jugadores, setJugadores] = useState([]);
    const [partidos, setPartidos] = useState([]);

    useEffect(() => {
        getEquipoById(teamId)
            .then((data) => setEquipo(data));

        // Sin jugadores o sin partidos la API devuelve { error } en vez de una lista: se toma como lista vacia
        getJugadoresByTeam(teamId)
            .then((data) => setJugadores(Array.isArray(data) ? data : []));

        getPartidosByTeam(teamId)
            .then((data) => setPartidos(Array.isArray(data) ? data : []));
    }, [teamId])

    if (equipo === undefined) return (
        <Cargando texto='Cargando equipo…' className='equipoContainer'>
            <div className='sk-col' style={{ alignItems: 'center', gap: 16 }}>
                <Sk circle h={150} />
                <Sk w={220} h={26} />
            </div>
            <div className='sk-col sk-gap' style={{ width: '100%' }}>
                {[0, 1, 2, 3, 4].map(i => <Sk key={i} h={38} r={8} />)}
            </div>
        </Cargando>
    );

    return (
        <div className='equipoContainer'>
            <div style={ {display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 30} }>
                {
                    equipo &&
                        <>
                            <div className='equipoInfo'>
                                <div className='equipoLogo'>
                                    {logoSrc(equipo.logo) && <img src={logoSrc(equipo.logo)} alt={equipo.name}/>}
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
                                {jugadores.length === 0 && (
                                    <tr><td colSpan={7} className='secondary-text'>Todavía no hay estadísticas de jugadores de este equipo.</td></tr>
                                )}
                                {
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
                                    <PartidoItem key={partido.id} partido={partido} />
                                ))
                            :
                                <h4>Este equipo todavía no tiene partidos.</h4>
                        }
                    </div>
                </TabPanel>
            </Tabs>
            
        </div>
    )
}

export default Equipo;
