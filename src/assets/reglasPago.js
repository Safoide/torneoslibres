import { formatPrecio } from './torneosUtils.js';

// Reglas de pago de las fechas (igual que en la API, manager/torneosManager.js).
// Valores con los que arranca el formulario de un torneo nuevo.
export const REGLAS_INICIALES = { penalizacion: true, multaTipo: 'porcentaje', multaValor: 50, amistosos: true };

// Multa en pesos segun las reglas y el precio de la fecha
export const montoMulta = (r, precioFecha) => !r?.penalizacion ? 0
    : r.multaTipo === 'fijo' ? r.multaValor
    : Math.round((precioFecha ?? 0) * r.multaValor / 100);

// "una multa del 50% de la fecha ($ 16.000)" | "una multa de $ 20.000" | null (sin multa)
export const textoMulta = (r, precioFecha) => {
    if (!r?.penalizacion || !r.multaValor) return null;
    return r.multaTipo === 'fijo'
        ? `una multa de ${formatPrecio(r.multaValor)}`
        : `una multa del ${r.multaValor}% de la fecha (${formatPrecio(montoMulta(r, precioFecha))})`;
};

// Resumen para mostrar a los capitanes: que pasa si no pagan la fecha a tiempo
export const resumenReglas = (r, precioFecha) => {
    if (!r?.penalizacion) return 'No hay penalización automática: si un equipo no paga a tiempo, decide el organizador.';
    const multa = textoMulta(r, precioFecha);
    return `El equipo que no paga pierde 0-3 por W.O.${multa ? ` y recibe ${multa}` : ''}.${r.amistosos ? ' Su lugar se publica como amistoso express.' : ''}`;
};
