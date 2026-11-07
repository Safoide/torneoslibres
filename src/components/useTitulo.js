import { useEffect } from 'react';

// Título de la pestaña ("Explorar torneos - Torneos Libres") y descripción (la que muestran Google y los links
// compartidos) de cada página. Cada página lo llama arriba de todo, antes de cualquier return.
// titulo: el nombre de la página (sin titulo queda solo "Torneos Libres"); en las páginas con datos, el nombre
// real cuando termina de cargar (un torneo, una organización). descripcion: si no va, la general del sitio.

export const SITIO = 'Torneos Libres';
export const DESCRIPCION = 'Encontrá torneos de fútbol 5, 7, 8 y 11 en Buenos Aires e inscribí a tu equipo. Organizadores: publicá tus torneos y manejá inscripciones, fixture, resultados y pagos.';

const MAX_DESCRIPCION = 160; // lo que Google suele mostrar

const recortar = (texto) => {
    const t = String(texto).replace(/\s+/g, ' ').trim();
    return t.length <= MAX_DESCRIPCION ? t : t.slice(0, MAX_DESCRIPCION - 1).replace(/\s+\S*$/, '') + '…';
};

const useTitulo = (titulo, descripcion) => {
    useEffect(() => {
        document.title = titulo ? `${titulo} - ${SITIO}` : SITIO;

        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        meta.content = recortar(descripcion || DESCRIPCION);
    }, [titulo, descripcion]);
};

export default useTitulo;
