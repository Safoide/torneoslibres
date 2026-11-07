import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enviarContacto } from '../../assets/endPoints/contacto.js';
import { EmailContacto, useIrAlInicio } from '../Documento';
import '../../assets/styles/formularios.css';
import '../../assets/styles/legal.css';
import useTitulo from '../useTitulo';

// Los mismos ids que MOTIVOS en la API (routes/contacto.route.js), que los valida
const MOTIVOS = [
    ['consulta', 'Consulta general'],
    ['pagos', 'Pagos, multas o devoluciones'],
    ['torneo', 'Problema con un torneo u organizador'],
    ['organizar', 'Quiero publicar mis torneos'],
    ['datos', 'Mis datos personales (acceso, corrección o baja)'],
    ['error', 'Algo no funciona en la página'],
    ['otro', 'Otro'],
];

const MAX_MENSAJE = 3000;

const Contacto = () => {
    useTitulo('Contacto', '¿Tenés una consulta, un problema con un torneo o una idea? Escribinos y te respondemos por mail.');
    useIrAlInicio();
    const { user } = useAuth();
    // sitioWeb: campo trampa para robots (oculto; una persona no lo completa)
    const [form, setForm] = useState({ nombre: '', email: '', motivo: '', mensaje: '', sitioWeb: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);

    // Con la sesión iniciada, nombre y email vienen cargados (se pueden cambiar)
    useEffect(() => {
        if (user) setForm((f) => ({ ...f, nombre: f.nombre || user.nombre || '', email: f.email || user.email || '' }));
    }, [user])

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const enviar = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const data = await enviarContacto(form);
        setLoading(false);
        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor. Probá de nuevo en un rato.');
        setEnviado(true);
    };

    if (enviado) return (
        <div className='form-page'>
            <h1>¡Mensaje enviado!</h1>
            <div className='form'>
                <p>Gracias por escribirnos. Te vamos a responder a <strong className='recuperar__email'>{form.email}</strong>.</p>
                <p className='muted'>Si no ves la respuesta, revisá la carpeta de spam.</p>
            </div>
            <p><Link to='/'>Volver al inicio</Link></p>
        </div>
    );

    return (
        <div className='form-page'>
            <h1>Contacto</h1>
            <p>
                ¿Tenés una consulta, un problema con un torneo o una idea? Escribinos y te respondemos por mail.
                Antes, fijate si la respuesta está en las <Link to='/ayuda'>preguntas frecuentes</Link>.
            </p>

            <form className='form' onSubmit={enviar}>
                <label htmlFor='nombre'>Tu nombre</label>
                <input id='nombre' name='nombre' required maxLength={80} autoComplete='name' value={form.nombre} onChange={onChange} />

                <label htmlFor='email'>Tu email (ahí te respondemos)</label>
                <input id='email' name='email' type='email' required maxLength={120} autoComplete='email' value={form.email} onChange={onChange} />

                <label htmlFor='motivo'>Motivo</label>
                <select id='motivo' name='motivo' required value={form.motivo} onChange={onChange}>
                    <option value='' disabled>Elegí una opción</option>
                    {MOTIVOS.map(([id, texto]) => <option key={id} value={id}>{texto}</option>)}
                </select>

                <label htmlFor='mensaje'>Mensaje</label>
                <textarea id='mensaje' name='mensaje' required minLength={10} maxLength={MAX_MENSAJE} rows={7} value={form.mensaje} onChange={onChange}
                    placeholder='Si es sobre un torneo, contanos cuál y qué pasó.' />
                <span className='muted contacto__contador'>{form.mensaje.length}/{MAX_MENSAJE}</span>

                {/* Trampa para robots: oculta para las personas y para los lectores de pantalla */}
                <div className='contacto__trampa' aria-hidden='true'>
                    <label htmlFor='sitioWeb'>No completar</label>
                    <input id='sitioWeb' name='sitioWeb' tabIndex={-1} autoComplete='off' value={form.sitioWeb} onChange={onChange} />
                </div>

                {error && <p className='form__error' role='alert'>{error}</p>}

                <button className='btn btn--primary' type='submit' disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                </button>
                <p className='muted'>Usamos tus datos solo para responderte (ver la <Link to='/privacidad'>política de privacidad</Link>).</p>
            </form>

            <p>También podés escribirnos directo a <EmailContacto />.</p>
        </div>
    );
}

export default Contacto;
