import React from 'react'
import BuscadorTorneos from '../BuscadorTorneos';
import useTitulo from '../useTitulo';

// Explorar torneos (/torneos). También es el inicio de los capitanes y de quien todavía no armó su organización
const Torneos = () => {
    useTitulo('Explorar torneos', 'Buscá torneos de fútbol 5, 7, 8 y 11 en Buenos Aires por zona, día, modalidad y precio, y anotá a tu equipo.');
    return <BuscadorTorneos />;
};

export default Torneos;
