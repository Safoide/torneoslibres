import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { EMAIL_CONTACTO } from '../assets/legal.js';
import '../assets/styles/legal.css';

// Diseño de las páginas de texto largo (términos, privacidad, preguntas frecuentes):
// título, fecha de vigencia, índice con links a cada sección y las secciones.
// secciones: [{ id, titulo, contenido }] (las que vienen en null/false se saltean)

// Al entrar va arriba de todo (o a la sección del link: /terminos#pagos), no donde estaba la página anterior
export const useIrAlInicio = () => {
    const { hash } = useLocation();
    useEffect(() => {
        const destino = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
        if (destino) destino.scrollIntoView({ block: 'start' });
        else window.scrollTo(0, 0);
    }, [hash]);
};

const formatVigencia = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

// Un dato que todavía no se cargó en assets/legal.js se ve resaltado, para que no se publique sin querer
export const Dato = ({ valor, children }) => valor
    ? <>{children ?? valor}</>
    : <mark className='legal__falta'>[a completar]</mark>;

export const EmailContacto = () => (
    <Dato valor={EMAIL_CONTACTO}><a href={`mailto:${EMAIL_CONTACTO}`}>{EMAIL_CONTACTO}</a></Dato>
);

const Documento = ({ titulo, bajada, vigencia, secciones }) => {
    useIrAlInicio();
    const lista = secciones.filter(Boolean);

    return (
        <article className='legal'>
            <header className='legal__encabezado'>
                <h1>{titulo}</h1>
                {bajada && <p className='legal__bajada'>{bajada}</p>}
                {vigencia && <p className='muted'>Vigente desde el {formatVigencia(vigencia)}</p>}
            </header>

            <nav className='legal__indice' aria-label='Contenido'>
                <h2>Contenido</h2>
                <ol>
                    {lista.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.titulo}</a></li>)}
                </ol>
            </nav>

            {lista.map((s, i) => (
                <section key={s.id} id={s.id} className='legal__seccion'>
                    <h2><span className='legal__numero'>{i + 1}.</span> {s.titulo}</h2>
                    {s.contenido}
                </section>
            ))}
        </article>
    );
}

export default Documento;
