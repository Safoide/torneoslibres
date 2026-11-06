import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { crearEquipo, editarEquipo, subirLogo } from '../../assets/endPoints/clubes.js';
import { logoSrc, hoyISO, edadEn } from '../../assets/torneosUtils.js';
import Avatar from '../Avatar';
import '../../assets/styles/formularios.css';
import '../../assets/styles/equipo-propio.css';
import { SkeletonFormulario } from '../Skeleton';

const MAX_JUGADORES = 30;
const MIN_NACIMIENTO = `${new Date().getFullYear() - 80}-01-01`; // la API acepta de 10 a 80 años
const JUGADOR_VACIO = { nombre: '', apellido: '', dni: '', nacimiento: '' };

const EquipoForm = ({ modo }) => {
    const esEditar = modo === 'editar';
    const { user, loading: cargandoSesion, equipo, setEquipo } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ nombre: '', logo: '', whatsapp: '' });
    const [jugadores, setJugadores] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [subiendo, setSubiendo] = useState(false);

    // Al editar, precargamos los datos actuales
    useEffect(() => {
        if (esEditar && equipo) {
            setForm({ nombre: equipo.nombre, logo: equipo.logo ?? '', whatsapp: equipo.whatsapp });
            setJugadores(equipo.jugadores.map(j => ({ ...j })));
        }
    }, [esEditar, equipo])

    if (cargandoSesion || (user?.rol === 'capitan' && equipo === undefined)) return <SkeletonFormulario />;
    if (!user) return <Navigate to='/login' state={{ from: esEditar ? '/mi-equipo/editar' : '/equipos/nuevo' }} replace />;
    if (user.rol !== 'capitan') return <Navigate to='/torneos' replace />;
    if (!esEditar && equipo) return <Navigate to='/mi-equipo' replace />; // un solo equipo por cuenta
    if (esEditar && !equipo) return <Navigate to='/equipos/nuevo' replace />;

    const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const setJugador = (i, campo, valor) =>
        setJugadores(prev => prev.map((j, idx) => idx === i ? { ...j, [campo]: valor } : j));
    const agregar = () => setJugadores(prev => prev.length < MAX_JUGADORES ? [...prev, { ...JUGADOR_VACIO }] : prev);
    const quitar = (i) => setJugadores(prev => prev.filter((_, idx) => idx !== i));

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

        const payload = { ...form, jugadores };
        const data = await (esEditar ? editarEquipo(equipo.id, payload) : crearEquipo(payload));

        setLoading(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');

        setEquipo(data);
        navigate('/mi-equipo');
    };

    return (
        <div className='form-page form-page--ancho'>
            <h1>{esEditar ? 'Editar equipo' : 'Crear equipo'}</h1>
            {!esEditar && <p>Armá tu equipo una sola vez y después inscribilo en los torneos que quieras. Se puede tener un equipo por cuenta.</p>}

            <form className='form' onSubmit={enviar}>
                <label htmlFor='nombre'>Nombre del equipo</label>
                <input id='nombre' name='nombre' required minLength={3} maxLength={40} value={form.nombre} onChange={onChange} />

                <label htmlFor='logo'>Logo (PNG, JPG o WEBP, hasta 2 MB)</label>
                <div className='logo-upload'>
                    <Avatar name={form.nombre} src={logoSrc(form.logo)} size={72} />
                    <input id='logo' type='file' accept='image/png,image/jpeg,image/webp' onChange={onLogo} disabled={subiendo} />
                    {subiendo && <span className='muted'>Subiendo...</span>}
                </div>

                <label htmlFor='whatsapp'>Tu WhatsApp (capitán), con código de país</label>
                <input id='whatsapp' name='whatsapp' type='tel' required placeholder='5491112345678' value={form.whatsapp} onChange={onChange} />
                <span className='muted'>Solo lo ven los organizadores de los torneos donde te inscribas.</span>

                <label>Plantel ({jugadores.length}/{MAX_JUGADORES})</label>
                {jugadores.length > 0 && <span className='muted'>Nombre, apellido, DNI y fecha de nacimiento. La edad se calcula sola (sirve para los torneos con límite de edad).</span>}
                <div className='jugadores'>
                    {jugadores.map((j, i) => (
                        <div className='jugador-fila' key={i}>
                            <input aria-label={`Nombre del jugador ${i + 1}`} placeholder='Nombre' required maxLength={40} value={j.nombre} onChange={e => setJugador(i, 'nombre', e.target.value)} />
                            <input aria-label={`Apellido del jugador ${i + 1}`} placeholder='Apellido' required maxLength={40} value={j.apellido} onChange={e => setJugador(i, 'apellido', e.target.value)} />
                            <input aria-label={`DNI del jugador ${i + 1}`} placeholder='DNI' required inputMode='numeric' maxLength={8} value={j.dni} onChange={e => setJugador(i, 'dni', e.target.value)} />
                            <input aria-label={`Fecha de nacimiento del jugador ${i + 1}`} title='Fecha de nacimiento' type='date' required min={MIN_NACIMIENTO} max={hoyISO()} value={j.nacimiento ?? ''} onChange={e => setJugador(i, 'nacimiento', e.target.value)} />
                            <span className='jugador-fila__edad muted' aria-live='polite'>{j.nacimiento ? `${edadEn(j.nacimiento)} años` : ''}</span>
                            <button type='button' className='btn-quitar' aria-label={`Quitar al jugador ${i + 1}`} onClick={() => quitar(i)}>✕</button>
                        </div>
                    ))}
                </div>
                <button type='button' className='btn btn--secundario' onClick={agregar} disabled={jugadores.length >= MAX_JUGADORES}>+ Agregar jugador</button>

                {error && <p className='form__error' role='alert'>{error}</p>}
                <button className='btn btn--primary' type='submit' disabled={loading || subiendo}>
                    {loading ? 'Guardando...' : esEditar ? 'Guardar cambios' : 'Crear equipo'}
                </button>
            </form>
        </div>
    )
}

export default EquipoForm;