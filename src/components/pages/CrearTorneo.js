import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFiltros, addTor } from '../../assets/endPoints/torneos.js';
import { MODALIDAD_LABEL, CATEGORIA_LABEL, ESTADO_LABEL, DIAS, LOCALIDADES, hoyAR, sumarDias, ANTICIPACION_DIAS } from '../../assets/torneosUtils.js';
import '../../assets/styles/formularios.css';
import { SkeletonFormulario } from '../Skeleton';
import ReglasPagoCampos from '../ReglasPagoCampos';
import { REGLAS_INICIALES } from '../../assets/reglasPago.js';
import LimiteEdadCampos, { LIMITE_EDAD_INICIAL, limiteEdadParaApi } from '../LimiteEdadCampos';
import CierreCampos, { CIERRE_INICIAL, cierreParaApi } from '../CierreCampos';

const Campo = ({ id, label, completo, children }) => (
    <div className={`form__campo${completo ? ' form__campo--completo' : ''}`}>
        <label htmlFor={id}>{label}</label>
        {children}
    </div>
);

const INICIAL = {
    nombre: '', modalidad: 'f5', categoria: 'mixto', estado: 'inscripcion-abierta',
    zona: '', localidad: 'CABA', sede: '', direccion: '',
    fechaInicio: '', diaJuego: 'Sábado', horario: '', formato: '',
    equiposMax: 12, precioInscripcion: '', precioFecha: 0, whatsapp: '', descripcion: '',
    reglasPago: REGLAS_INICIALES,
    limiteEdad: LIMITE_EDAD_INICIAL,
};

const CrearTorneo = () => {
    const { user, loading: cargandoSesion, organizacion } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState(INICIAL);
    const [cierre, setCierre] = useState(CIERRE_INICIAL);
    const [zonas, setZonas] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // El inicio más cercano posible: con cobro por fecha, en 4 días (3 completos para crear y pagar la fecha 1); sin cobro, mañana
    const minInicio = sumarDias(hoyAR(), Number(form.precioFecha) > 0 ? ANTICIPACION_DIAS + 1 : 1);

    useEffect(() => {
        getFiltros().then(data => data?.zonas && setZonas(data.zonas));
    }, [])

    // La zona de la organizacion como valor inicial
    useEffect(() => {
        if (organizacion?.zona) setForm(prev => prev.zona ? prev : { ...prev, zona: organizacion.zona });
    }, [organizacion])

    if (cargandoSesion || (user && organizacion === undefined)) return <SkeletonFormulario />;
    if (!user) return <Navigate to='/login' state={{ from: '/organizacion/torneo/nuevo' }} replace />;
    if (user.rol !== 'organizador') return <Navigate to='/torneos' replace />;
    if (!organizacion) return <Navigate to='/organizaciones/nueva' replace />;

    const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const enviar = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = await addTor({ ...form, limiteEdad: limiteEdadParaApi(form.limiteEdad), cierreInscripcion: cierreParaApi(cierre) });

        setLoading(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');

        navigate(`/torneos/${data.id}`);
    };

    const opciones = (obj) => Object.entries(obj).map(([k, l]) => <option key={k} value={k}>{l}</option>);

    return (
        <div className='form-page form-page--ancho'>
            <h1>Crear torneo</h1>
            <p>Se publica a nombre de <strong>{organizacion.nombre}</strong>.</p>

            <form className='form' onSubmit={enviar}>
                <div className='form__grid'>
                    <Campo id='nombre' label='Nombre del torneo' completo>
                        <input id='nombre' name='nombre' required maxLength={80} value={form.nombre} onChange={onChange} />
                    </Campo>

                    <Campo id='modalidad' label='Modalidad'>
                        <select id='modalidad' name='modalidad' value={form.modalidad} onChange={onChange}>{opciones(MODALIDAD_LABEL)}</select>
                    </Campo>

                    <Campo id='categoria' label='Categoría'>
                        <select id='categoria' name='categoria' value={form.categoria} onChange={onChange}>{opciones(CATEGORIA_LABEL)}</select>
                    </Campo>

                    <Campo id='estado' label='Estado inicial'>
                        <select id='estado' name='estado' value={form.estado} onChange={onChange}>
                            {opciones({ 'inscripcion-abierta': ESTADO_LABEL['inscripcion-abierta'], proximamente: ESTADO_LABEL.proximamente })}
                        </select>
                    </Campo>

                    <Campo id='fechaInicio' label='Fecha de inicio'>
                        <input id='fechaInicio' name='fechaInicio' type='date' required min={minInicio} value={form.fechaInicio} onChange={onChange} />
                    </Campo>

                    <Campo id='diaJuego' label='Día de juego'>
                        <select id='diaJuego' name='diaJuego' value={form.diaJuego} onChange={onChange}>
                            {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </Campo>

                    <Campo id='horario' label='Horario'>
                        <input id='horario' name='horario' required maxLength={40} placeholder='16:00 a 22:00' value={form.horario} onChange={onChange} />
                    </Campo>

                    <Campo id='zona' label='Zona'>
                        <input id='zona' name='zona' list='zonas' required maxLength={40} value={form.zona} onChange={onChange} />
                        <datalist id='zonas'>{zonas.map(z => <option key={z} value={z} />)}</datalist>
                    </Campo>

                    <Campo id='localidad' label='Localidad'>
                        <select id='localidad' name='localidad' value={form.localidad} onChange={onChange}>
                            {LOCALIDADES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </Campo>

                    <Campo id='sede' label='Sede (nombre de la cancha)'>
                        <input id='sede' name='sede' required maxLength={80} value={form.sede} onChange={onChange} />
                    </Campo>

                    <Campo id='direccion' label='Dirección'>
                        <input id='direccion' name='direccion' required maxLength={120} placeholder='Av. Las Heras 4100' value={form.direccion} onChange={onChange} />
                    </Campo>

                    <Campo id='formato' label='Formato (opcional)'>
                        <input id='formato' name='formato' maxLength={80} placeholder='Liga + playoffs' value={form.formato} onChange={onChange} />
                    </Campo>

                    <Campo id='equiposMax' label='Cupo de equipos'>
                        <input id='equiposMax' name='equiposMax' type='number' required min={2} max={64} value={form.equiposMax} onChange={onChange} />
                    </Campo>

                    <Campo id='precioInscripcion' label='Inscripción ($)'>
                        <input id='precioInscripcion' name='precioInscripcion' type='number' required min={0} step={1000} value={form.precioInscripcion} onChange={onChange} />
                    </Campo>

                    <Campo id='precioFecha' label='Precio por fecha ($)'>
                        <input id='precioFecha' name='precioFecha' type='number' min={0} step={1000} value={form.precioFecha} onChange={onChange} />
                    </Campo>

                    <Campo id='whatsapp' label='WhatsApp de contacto (opcional)'>
                        <input id='whatsapp' name='whatsapp' type='tel' placeholder='Si lo dejás vacío se usa el de tu organización' value={form.whatsapp} onChange={onChange} />
                    </Campo>

                    <Campo id='descripcion' label='Descripción (opcional)' completo>
                        <textarea id='descripcion' name='descripcion' rows={3} maxLength={500} value={form.descripcion} onChange={onChange} />
                    </Campo>

                    <div className='form__campo form__campo--completo'>
                        <LimiteEdadCampos value={form.limiteEdad} onChange={limiteEdad => setForm(prev => ({ ...prev, limiteEdad }))} />
                    </div>

                    <div className='form__campo form__campo--completo'>
                        <CierreCampos value={cierre} onChange={setCierre} fechaInicio={form.fechaInicio} precioFecha={Number(form.precioFecha) || 0} />
                    </div>

                    <div className='form__campo form__campo--completo'>
                        {Number(form.precioFecha) > 0 ? (
                            <>
                                <ReglasPagoCampos value={form.reglasPago} precioFecha={form.precioFecha} onChange={reglasPago => setForm(prev => ({ ...prev, reglasPago }))} />
                                <span className='muted'>Podés cambiar estas reglas hasta que crees la primera fecha.</span>
                            </>
                        ) : (
                            <span className='muted'>Sin precio por fecha: el torneo se paga todo con la inscripción. Las fechas no tienen cobro ni vencimiento (nadie pierde por no pagar).</span>
                        )}
                    </div>
                </div>

                {error && <p className='form__error' role='alert'>{error}</p>}
                <button className='btn btn--primary' type='submit' disabled={loading}>{loading ? 'Creando...' : 'Crear torneo'}</button>
            </form>
        </div>
    )
}

export default CrearTorneo;