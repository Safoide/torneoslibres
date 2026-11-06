import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFiltros } from '../../assets/endPoints/torneos.js';
import { crearOrganizador, editarOrganizador } from '../../assets/endPoints/organizadores.js';
import { subirLogo } from '../../assets/endPoints/clubes.js';
import { logoSrc } from '../../assets/torneosUtils.js';
import Avatar from '../Avatar';
import '../../assets/styles/formularios.css';
import '../../assets/styles/equipo-propio.css';
import { SkeletonFormulario } from '../Skeleton';

const VACIO = { nombre: '', zona: '', descripcion: '', instagram: '', whatsapp: '', logo: '' };

const OrganizacionForm = ({ modo }) => {
    const esEditar = modo === 'editar';
    const { user, loading: cargandoSesion, organizacion, setOrganizacion } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState(VACIO);
    const [zonas, setZonas] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [subiendo, setSubiendo] = useState(false);

    useEffect(() => {
        getFiltros().then(data => data?.zonas && setZonas(data.zonas));
    }, [])

    // Al editar, precargamos los datos actuales
    useEffect(() => {
        if (esEditar && organizacion) {
            setForm({
                nombre: organizacion.nombre, zona: organizacion.zona, descripcion: organizacion.descripcion ?? '',
                instagram: organizacion.instagram ?? '', whatsapp: organizacion.whatsapp ?? '', logo: organizacion.logo ?? '',
            });
        }
    }, [esEditar, organizacion])

    if (cargandoSesion || (user && organizacion === undefined)) return <SkeletonFormulario />;
    if (!user) return <Navigate to='/login' state={{ from: esEditar ? '/organizacion/editar' : '/organizaciones/nueva' }} replace />;
    if (user.rol !== 'organizador') return <Navigate to='/torneos' replace />;
    if (!esEditar && organizacion) return <Navigate to={`/organizadores/${organizacion.id}`} replace />; // una sola por cuenta
    if (esEditar && !organizacion) return <Navigate to='/organizaciones/nueva' replace />;

    const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const onLogo = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        setError('');
        setSubiendo(true);
        const data = await subirLogo(archivo);
        setSubiendo(false);

        if (!data || data.error) return setError(data?.error || 'No pudimos subir la imagen');

        setForm(prev => ({ ...prev, logo: data.url }));
    };

    const enviar = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = await (esEditar ? editarOrganizador(organizacion.id, form) : crearOrganizador(form));

        setLoading(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');

        setOrganizacion(data);
        navigate(`/organizadores/${data.id}`);
    };

    return (
        <div className='form-page'>
            <h1>{esEditar ? 'Editar organización' : 'Crear organización'}</h1>
            {!esEditar && <p>Vas a poder publicar y administrar los torneos de tu organización. Se puede tener una sola por cuenta.</p>}

            <form className='form' onSubmit={enviar}>
                <label htmlFor='logo'>Foto de perfil (PNG, JPG o WEBP, hasta 2 MB)</label>
                <div className='logo-upload'>
                    <Avatar name={form.nombre} src={form.logo ? logoSrc(form.logo) : null} size={72} />
                    <input id='logo' type='file' accept='image/png,image/jpeg,image/webp' onChange={onLogo} disabled={subiendo} />
                    {subiendo && <span className='muted'>Subiendo...</span>}
                </div>

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
                <button className='btn btn--primary' type='submit' disabled={loading || subiendo}>
                    {loading ? 'Guardando...' : esEditar ? 'Guardar cambios' : 'Crear organización'}
                </button>
            </form>
        </div>
    )
}

export default OrganizacionForm;