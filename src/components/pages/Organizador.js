import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getOrganizadorById } from '../../assets/endPoints/organizadores.js';
import Avatar from '../Avatar';
import BuscadorTorneos from '../BuscadorTorneos';
import '../../assets/styles/organizador.css';
import { useAuth } from '../../context/AuthContext';
import { logoSrc } from '../../assets/torneosUtils.js';

const Organizador = () => {
    const { orgId } = useParams();
    const [org, setOrg] = useState(null); // null = cargando, false = no existe

    const { organizacion } = useAuth();

    useEffect(() => {
        setOrg(null);
        getOrganizadorById(orgId).then(data => setOrg(data && !data.error ? data : false));
    }, [orgId])

    if (org === null) return <div className='org-top'><p>Cargando...</p></div>;

    if (org === false) return (
        <div className='org-top'>
            <p>No encontramos a ese organizador.</p>
            <Link className='back-link' to='/torneos'>← Volver a la búsqueda</Link>
        </div>
    );

    return (
        <>
            <div className='org-top'>
                <Link className='back-link' to='/torneos'>← Volver a la búsqueda</Link>

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
                        {organizacion?.id === org.id && (
                            <div className='org-links'>
                                <Link className='btn btn--primary btn--chico' to='/organizacion/torneo/nuevo'>+ Crear torneo</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BuscadorTorneos organizadorId={org.id} />
        </>
    )
}

export default Organizador;
