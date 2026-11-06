import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFiltros } from '../../assets/endPoints/torneos.js';
import { crearOrganizador } from '../../assets/endPoints/organizadores.js';
import '../../assets/styles/formularios.css';
import { SkeletonFormulario } from '../Skeleton';

const CrearOrganizacion = () => {
    const { user, loading: cargandoSesion } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ nombre: '', zona: '', descripcion: '', instagram: '', whatsapp: '' });
    const [zonas, setZonas] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getFiltros().then(data => data?.zonas && setZonas(data.zonas));
    }, [])

    if (cargandoSesion) return <SkeletonFormulario />;
    if (!user) return <Navigate to='/login' state={{ from: '/organizaciones/nueva' }} replace />;

    const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const enviar = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = await crearOrganizador(form);

        setLoading(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');

        navigate(`/organizadores/${data.id}`);
    };

    return (
        <div className='form-page'>
            <h1>Crear organización</h1>
            <p>Vas a poder publicar y administrar los torneos de tu organización.</p>

            <form className='form' onSubmit={enviar}>
                <label htmlFor='nombre'>Nombre de la organización</label>
                <input id='nombre' name='nombre' required minLength={3} maxLength={60} value={form.nombre} onChange={onChange} />

                <label htmlFor='zona'>Zona principal</label>
                <input id='zona' name='zona' list='zonas' required maxLength={40} placeholder='Ej: Palermo' value={form.zona} onChange={onChange} />
                <datalist id='zonas'>{zonas.map(z => <option key={z} value={z} />)}</datalist>

                <label htmlFor='descripcion'>Descripción (opcional)</label>
                <textarea id='descripcion' name='descripcion' rows={3} maxLength={300} value={form.descripcion} onChange={onChange} />

                <label htmlFor='instagram'>Instagram (opcional, solo el usuario)</label>
                <input id='instagram' name='instagram' placeholder='ligaparquenorte' maxLength={31} value={form.instagram} onChange={onChange} />

                <label htmlFor='whatsapp'>WhatsApp (opcional, con código de país)</label>
                <input id='whatsapp' name='whatsapp' type='tel' placeholder='5491112345678' value={form.whatsapp} onChange={onChange} />

                {error && <p className='form__error' role='alert'>{error}</p>}
                <button className='btn btn--primary' type='submit' disabled={loading}>{loading ? 'Creando...' : 'Crear organización'}</button>
            </form>
        </div>
    )
}

export default CrearOrganizacion;
