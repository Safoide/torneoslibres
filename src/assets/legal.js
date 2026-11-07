// Datos de las páginas legales (/terminos, /privacidad, /contacto, /ayuda). Todo lo que hay que completar o
// actualizar está acá: las páginas no repiten estos datos.
// Un valor en null se muestra como "[a completar]" resaltado, para que no quede publicado sin querer.

export const RESPONSABLE = {
    nombre: 'Romano Daniel Ibarra Fantini', // persona responsable del sitio
    cuit: '20-44871920-1',
    domicilio: 'Portela 302, Ciudad Autónoma de Buenos Aires', // domicilio legal
};

// Email público de contacto (se muestra en las páginas; lo recibe Resend). El formulario de /contacto también
// llega acá (la API lo cambia con CONTACTO_EMAIL en su .env).
export const EMAIL_CONTACTO = 'contacto@torneoslibres.com';

// Fecha desde la que rige cada texto. Cambiarla cada vez que se cambia el contenido (y avisar a los usuarios
// si el cambio es importante: ver el punto "Cambios" de cada página)
export const VIGENCIA = {
    terminos: '2026-11-07',
    privacidad: '2026-11-07',
};

// Versión de los términos + privacidad que se acepta al crear la cuenta (o en el aviso a las cuentas existentes).
// Tiene que ser igual a TERMINOS_VERSION de config.js en la API, que rechaza otra. Cambiarla en los dos lados
// solo por cambios importantes: todas las cuentas van a tener que volver a aceptarlos.
export const VERSION_LEGAL = '2026-11-07';

// Comisiones, medios de cobro (Mercado Pago, transferencia, efectivo) y deuda del organizador: el texto ya está
// escrito, pero se muestra recién cuando se activa el cobro de comisiones (ver "Modelo de negocio" en CLAUDE.md).
// Mientras sea false, los términos dicen que usar la plataforma no tiene costo.
export const MODELO_COBRO_ACTIVO = false;

// Formulario oficial de reclamos de Defensa del Consumidor (Ventanilla Única Federal)
export const DEFENSA_CONSUMIDOR_URL = 'https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario';

// Autoridad de control de la Ley 25.326 (datos personales)
export const AAIP_URL = 'https://www.argentina.gob.ar/aaip/datospersonales';
