import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editMatch, getPartidoById } from '../../assets/endPoints/partidos';

const EditarPartido = () => {
    const [partido, setPartido] = useState({});
    const { torneo, id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getPartidoById(id)
            .then((data) => {
                setPartido(data);
            });
    }, [torneo, id]);

    const handleInputChange = (e) => {
        setPartido({
            ...partido,
            [e.target.name]: e.target.value,
        });
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            await editMatch(id, partido);

            navigate(`/torneos/${torneo}/partidos`);
        } catch (error) {
            console.error("Error al editar el partido:", error);
        }
    };

    return (
        <div>
            {partido ? (
                <form>
                    <div className='equipoPartido'>
                        <input type="datetime-local" className='partidoFecha secondary-text' value={partido.date} />
                        <div className='partidoContainer'>
                            <div className='equipoDiv'>
                                <input className='secondary-text' type="text" value={partido.home_id} name='home_id' onChange={handleInputChange}/>
                            </div>
                            <input style={{width: '50px', color: 'black'}} type="text" value={partido.home_goals} name='home_goals' onChange={handleInputChange}/>
                            <input style={{width: '50px', color: 'black'}} type="text" value={partido.away_goals} name='away_goals' onChange={handleInputChange}/>
                            <div className='equipoDiv'>
                                <input className='secondary-text' type="text" value={partido.away_id} name='away_id' onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                    <button onClick={handleEdit}>
                        Guardar Cambios
                    </button>
                </form>
            ) : (
                <div className="text-center">
                    <h1>Cargando...</h1>
                </div>
            )}
        </div>
    );
}

export default EditarPartido