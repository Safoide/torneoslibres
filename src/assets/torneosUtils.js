export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const MIN_JUGADORES = { f5: 5, f7: 7, f8: 8, f11: 11 };

export const MODALIDAD_LABEL = { f5: 'F5', f7: 'F7', f8: 'F8', f11: 'F11' };

export const ESTADO_LABEL = {
    'inscripcion-abierta': 'Inscripción abierta',
    'proximamente': 'Próximamente',
    'en-curso': 'En curso',
    'finalizado': 'Finalizado',
};

export const CATEGORIA_LABEL = { masculino: 'Masculino', femenino: 'Femenino', mixto: 'Mixto' };

export const formatPrecio = (n) =>
    n === 0 ? 'Gratis' : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

// Para plata cobrada o ganada: 0 es "$ 0", no "Gratis"
export const formatMonto = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n || 0);

// "2026-11-14" ->"sáb 14 nov 2026". Se arma con la fecha local para evitar desfases de zona horaria.
export const formatFecha = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);

    return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
};

export const logoSrc = (logo) => {
    if (!logo) return null;
    if (logo.startsWith('/uploads/')) return API_URL + logo;

    try { return require(`./imgs/${logo}`); } catch { return null; }
};

export const cupos = (tor) => Math.max(tor.equiposMax - tor.equiposInscriptos, 0);

export const whatsappLink = (tor) =>
    `https://wa.me/${tor.whatsapp}?text=${encodeURIComponent(`Hola! Vi el torneo "${tor.nombre}" en Torneos Libres y quiero más info.`)}`;

// "Sábado" -> "Sábados", pero "Miércoles" se queda igual
export const diaPlural = (dia = '') => (dia.endsWith('s') ? dia : dia + 's');

export const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const LOCALIDADES = ['CABA', 'GBA Norte', 'GBA Sur', 'GBA Oeste'];

// Limite de edad del torneo: null = libre, o { min, max } (uno de los dos puede ser null). Igual que en la API.
export const textoLimiteEdad = (l) => !l ? ''
    : l.min != null && l.max != null ? `de ${l.min} a ${l.max} años`
    : l.min != null ? `desde ${l.min} años`
    : `hasta ${l.max} años`;

// Etiqueta corta para las tarjetas: "+35", "Hasta 20", "18 a 25"
export const etiquetaLimiteEdad = (l) => !l ? ''
    : l.min != null && l.max != null ? `${l.min} a ${l.max} años`
    : l.min != null ? `+${l.min} años`
    : `Hasta ${l.max} años`;

export const hoyISO = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD en hora local

// Años cumplidos a una fecha (YYYY-MM-DD). Igual que edadEn de la API.
export const edadEn = (nacimiento, fecha = hoyISO()) => {
    if (!nacimiento) return null;
    return Number(fecha.slice(0, 4)) - Number(nacimiento.slice(0, 4)) - (fecha.slice(5) < nacimiento.slice(5) ? 1 : 0);
};

// Jugadores que no entran en el limite, con la edad que van a tener al inicio del torneo
export const fueraDeEdad = (jugadores = [], tor) => {
    const l = tor?.limiteEdad;
    if (!l) return [];

    return jugadores
        .map(j => ({ ...j, edad: edadEn(j.nacimiento, tor.fechaInicio) }))
        .filter(j => (l.min != null && j.edad < l.min) || (l.max != null && j.edad > l.max));
};
