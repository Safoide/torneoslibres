import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import OrgDashboard from '../OrgDashboard';
import { getOrganizadorById, getMiDashboard } from '../../assets/endPoints/organizadores.js';
import Avatar from '../Avatar';
import BuscadorTorneos from '../BuscadorTorneos';
import '../../assets/styles/organizador.css';
import { useAuth } from '../../context/AuthContext';
import { logoSrc } from '../../assets/torneosUtils.js';

// Pestañas que ve el organizador en su propio perfil. La primera es la que se abre por defecto
const TABS = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'torneos', label: 'Torneos publicados' },
];

const Organizador = () => {
    const { orgId } = useParams();
    const [org, setOrg] = useState(null); // null = cargando, false = no existe
    const [dashboard, setDashboard] = useState(undefined); // undefined = cargando, null = error

    const { organizacion } = useAuth();
    const [params, setParams] = useSearchParams();

    // La pestaña va en la URL (?tab=torneos) para que sobreviva a recargar y al boton de volver
    const tab = Math.max(TABS.findIndex(t => t.id === params.get('tab')), 0);
    const elegirTab = (i) => setParams(i === 0 ? {} : { tab: TABS[i].id }, { replace: true });

    useEffect(() => {
        setOrg(null);
        getOrganizadorById(orgId).then(data => setOrg(data && !data.error ? data : false));
    }, [orgId])

    const esMia = !!organizacion && organizacion.id === orgId;

    // Los numeros del panel se piden una vez y los usan las dos pestañas
    useEffect(() => {
        setDashboard(undefined);
        if (esMia) getMiDashboard().then(d => setDashboard(d && !d.error ? d : null));
    }, [esMia])

    if (org === null) return <div className='org-top'><p>Cargando...</p></div>;

    if (org === false) return (
        <div className='org-top'>
            <p>No encontramos a ese organizador.</p>
            <Link className='back-link' to='/torneos'>← Volver a la búsqueda</Link>
        </div>
    );

    // Lo ganado por torneo, para mostrarlo en las tarjetas de "Torneos publicados"
    const ganancias = dashboard ? Object.fromEntries(dashboard.torneos.map(t => [t.id, t])) : null;

    return (
        <>
            <div className='org-top'>
                {!esMia && <Link className='back-link' to='/torneos'>← Volver a la búsqueda</Link>}

                <div className='org-head'>
                    <Avatar name={org.nombre} src={org.logo ? logoSrc(org.logo) : null} size={96} />
                    <div className='org-info'>
                        <h1>{org.nombre}</h1>
                        <p>{org.zona} · {org.torneos} {org.torneos === 1 ? 'torneo' : 'torneos'}</p>
                        {org.descripcion && <p>{org.descripcion}</p>}
                        <div className='org-links'>
                            {org.instagram && <a href={`https://instagram.com/${org.instagram}`} target='_blank' rel='noreferrer'>Instagram</a>}
                            {org.whatsapp && <a href={`https://wa.me/${org.whatsapp}`} target='_blank' rel='noreferrer'>WhatsApp</a>}
                        </div>
                        {esMia && (
                            <div className='org-links'>
                                <Link className='btn btn--primary btn--chico' to='/organizacion/torneo/nuevo'>+ Crear torneo</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {esMia ? (
                <Tabs
                    className='tabsContainer org-tabs' selectedTabClassName='tabButton-select' selectedTabPanelClassName='tabPanel-select'
                    selectedIndex={tab} onSelect={elegirTab}
                >
                    <TabList className='tabsList'>
                        {TABS.map(t => <Tab className='tabButton' key={t.id}>{t.label}</Tab>)}
                    </TabList>

                    <TabPanel className='tabPanel'>
                        <OrgDashboard data={dashboard} />
                    </TabPanel>
                    <TabPanel className='tabPanel org-tabs__buscador'>
                        <BuscadorTorneos organizadorId={org.id} ganancias={ganancias} />
                    </TabPanel>
                </Tabs>
            ) : (
                <BuscadorTorneos organizadorId={org.id} />
            )}
        </>
    )
}

export default Organizador;
