import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getTorneos } from '../../assets/endPoints/torneos.js';


const Torneos = () => {

    const [torneos, setTorneos] = useState([]);

    useEffect(() => {
        if (torneos.length !== 0) return;

        getTorneos()
            .then(data => setTorneos(data));
    }, [torneos.length])

    return (
        <div>
            <h1>GAMBETA SIMPLE</h1>

            <TorneosContainer>
                {
                    torneos.map((torneo) => (
                        <TorneoLink to={`/torneos/${torneo.id}`} key={torneo.id}>
                            <ImgContainer>
                                <img alt={torneo.id} src={ require('../../' + torneo.logo) } />
                            </ImgContainer>
                            <h2>{torneo.name}</h2>
                        </TorneoLink>
                    ))
                }
            </TorneosContainer>
        </div>
    )
}

const TorneosContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 80px;
    margin: 50px 0;
`;

const TorneoLink = styled(Link)`
    display: flex;
    width: 400px;
    flex-direction: column;
    justify-content: center;
    text-decoration: none;
    color: #000;
    gap: 20px;
    border: 1px solid rgba(0, 0, 0, 0.6);
    padding: 0 0 20px;
    border-radius: 7px;
    overflow: hidden;
    transition: all .3s ease 0s;

    &:hover {
        background-color: rgba(220, 220, 220, 1);
    }
`;

const ImgContainer = styled.div`
    height: 220px;
    overflow: hidden;

    img {
        width: 100%;
    }
`;

export default Torneos;
