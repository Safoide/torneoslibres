// Preferencias de apariencia, guardadas en este navegador (no en la cuenta).
const CLAVE = 'ajustes';
const VALORES = { tema: ['oscuro', 'claro', 'auto'], texto: ['normal', 'grande'], movimiento: ['normal', 'reducido'] };
const POR_DEFECTO = { tema: 'oscuro', texto: 'normal', movimiento: 'normal' };

export const leerAjustes = () => {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE) || '{}');

        // Solo se aceptan valores conocidos
        return Object.fromEntries(Object.entries(POR_DEFECTO).map(([k, def]) => [k, VALORES[k].includes(guardado[k]) ? guardado[k] : def]));
    } catch {
        return { ...POR_DEFECTO };
    }
};

const sistemaEsClaro = () => !!window.matchMedia?.('(prefers-color-scheme: light)').matches;

let finCambioTema;

export const aplicarAjustes = (ajustes = leerAjustes()) => {
    const el = document.documentElement;
    const tema = ajustes.tema === 'claro' || (ajustes.tema === 'auto' && sistemaEsClaro()) ? 'light' : 'dark';

    // Al cambiar de tema (no al cargar la página) los colores pasan de uno a otro en vez de saltar
    if (el.dataset.theme && el.dataset.theme !== tema) {
        el.classList.add('cambiando-tema');
        clearTimeout(finCambioTema);
        finCambioTema = setTimeout(() => el.classList.remove('cambiando-tema'), 450);
    }

    el.dataset.theme = tema;
    el.dataset.texto = ajustes.texto;
    el.dataset.movimiento = ajustes.movimiento;
};

export const guardarAjustes = (cambios) => {
    const ajustes = { ...leerAjustes(), ...cambios };

    try { localStorage.setItem(CLAVE, JSON.stringify(ajustes)); } catch {}
    aplicarAjustes(ajustes);

    return ajustes;
};

// En modo automatico, seguimos al sistema si cambia mientras la app esta abierta
window.matchMedia?.('(prefers-color-scheme: light)').addEventListener?.('change', () => {
    if (leerAjustes().tema === 'auto') aplicarAjustes();
});
