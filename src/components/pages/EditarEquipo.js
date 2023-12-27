import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editTeam, getEquipoById } from '../../assets/endPoints/equipos';

const EditarEquipo = () => {
    const [equipo, setequipo] = useState({});
    const { team } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getEquipoById(team)
            .then((data) => {
                setequipo(data);
            });
    }, [team]);

    const handleInputChange = (e) => {
        setequipo({
            ...equipo,
            [e.target.name]: e.target.value,
        });
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            await editTeam(team, equipo);

            navigate(`/equipo/${equipo.tag}`);
        } catch (error) {
            console.error("Error al editar el equipo:", error);
        }
    };

    return (
        <div>
            {equipo ? (
                <form>
                    { Object.keys(equipo).map((el) => (
                            <div>
                                <label>{el}</label>
                                <input
                                    type={typeof equipo[el]}
                                    name={el}
                                    value={equipo[el]}
                                    onInput={handleInputChange}
                                    style={{ color: 'black' }}
                                    disabled={el === 'id' ? true : false}
                                />
                            </div>
                        ))}
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

export default EditarEquipo