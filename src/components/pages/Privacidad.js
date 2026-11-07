import React from 'react'
import { Link } from 'react-router-dom';
import Documento, { Dato, EmailContacto } from '../Documento';
import { RESPONSABLE, VIGENCIA, MODELO_COBRO_ACTIVO, AAIP_URL } from '../../assets/legal.js';

// Política de privacidad (Ley 25.326). Tiene que coincidir con lo que la app hace de verdad: si se agrega un dato
// nuevo, un proveedor o un cambio en quién ve qué, actualizar esta página y VIGENCIA.privacidad (assets/legal.js).

const Privacidad = () => (
    <Documento
        titulo='Política de privacidad'
        bajada='Qué datos guardamos, para qué los usamos, quién los ve y cómo podés pedir verlos, corregirlos o borrarlos.'
        vigencia={VIGENCIA.privacidad}
        secciones={[
            {
                id: 'responsable', titulo: 'Responsable de tus datos',
                contenido: <>
                    <p>
                        El responsable de la base de datos de Torneos Libres es <Dato valor={RESPONSABLE.nombre} />, CUIT <Dato valor={RESPONSABLE.cuit} />,
                        con domicilio en <Dato valor={RESPONSABLE.domicilio} />. Para cualquier consulta sobre tus datos escribinos a <EmailContacto /> o
                        desde la página de <Link to='/contacto'>contacto</Link>.
                    </p>
                </>,
            },
            {
                id: 'datos', titulo: 'Qué datos guardamos',
                contenido: <>
                    <ul>
                        <li><strong>Tu cuenta:</strong> nombre, email, tipo de cuenta y tu contraseña (guardada cifrada: nadie puede leerla, ni nosotros). Si entrás con Google, recibimos de Google tu nombre, tu email y un identificador de tu cuenta; no recibimos tu contraseña de Google.</li>
                        <li><strong>Si sos capitán:</strong> el nombre y el logo de tu equipo, tu WhatsApp y el plantel: nombre, apellido, DNI y fecha de nacimiento de cada jugador.</li>
                        <li><strong>Si sos organizador:</strong> los datos de tu organización (nombre, logo, descripción, Instagram y WhatsApp) y los de tus torneos.</li>
                        {MODELO_COBRO_ACTIVO && <li><strong>Medios de cobro:</strong> si el organizador acepta transferencias, el CVU o alias y el titular de la cuenta; si vincula Mercado Pago, los datos de esa vinculación (no su contraseña).</li>}
                        <li><strong>Actividad en la plataforma:</strong> inscripciones, partidos, resultados, pagos (monto, fecha y estado), multas, saldos a favor y devoluciones.{MODELO_COBRO_ACTIVO && ' Si pagás por transferencia, el comprobante que subís.'} No guardamos los datos de tu tarjeta: los pagos los procesa el proveedor de pagos.</li>
                        <li><strong>Tus preferencias:</strong> qué avisos por mail querés recibir y si aceptaste recibir novedades (y cuándo).</li>
                        <li><strong>Mensajes de contacto:</strong> lo que nos escribís desde el formulario, con tu nombre y email.</li>
                        <li><strong>Datos técnicos:</strong> la dirección IP de cada pedido, que usamos por poco tiempo para frenar abusos (por ejemplo, muchos intentos de inicio de sesión) y que puede quedar en los registros del servidor. En tu navegador guardamos tu sesión y tus preferencias de la página (como el tema claro u oscuro). No usamos cookies de publicidad ni herramientas de seguimiento de terceros.</li>
                    </ul>
                </>,
            },
            {
                id: 'para-que', titulo: 'Para qué los usamos',
                contenido: <>
                    <ul>
                        <li>Para que la plataforma funcione: tu cuenta, las inscripciones, el fixture, la tabla, los pagos y los saldos.</li>
                        <li>Para controlar las condiciones de cada torneo, como el límite de edad (por eso pedimos la fecha de nacimiento del plantel).</li>
                        <li>Para mandarte los avisos de tus torneos (fechas nuevas, pagos por vencer, resultados, etc.). Los elegís en los ajustes de tu cuenta y te podés dar de baja de cada uno desde el mismo mail. Los mails de seguridad (cambiar la contraseña, verificar el email) te llegan siempre.</li>
                        <li>Para mandarte novedades y promociones, <strong>solo si lo aceptaste</strong>. Te podés dar de baja cuando quieras.</li>
                        <li>Para cuidar la seguridad de la plataforma, prevenir fraudes y responder tus consultas.</li>
                        <li>Para cumplir obligaciones legales.</li>
                    </ul>
                    <p>No vendemos ni alquilamos tus datos a nadie.</p>
                </>,
            },
            {
                id: 'quien-los-ve', titulo: 'Quién ve tus datos',
                contenido: <>
                    <ul>
                        <li><strong>Cualquiera que entre al sitio</strong> puede ver los torneos y lo que se publica de ellos: la organización (nombre, logo, descripción y contacto), los equipos inscriptos (nombre y logo), el fixture, los resultados y la tabla.</li>
                        <li><strong>El DNI y la fecha de nacimiento del plantel, y el WhatsApp del capitán</strong>, los ven solo el capitán y los organizadores de los torneos en los que el equipo está inscripto, para poder organizarlos.{MODELO_COBRO_ACTIVO && ' Los comprobantes de transferencia los ven solo el capitán que lo subió y el organizador del torneo.'}</li>
                        <li><strong>Tu email</strong> no se muestra en la plataforma.</li>
                    </ul>
                    <p>
                        También usamos proveedores que tratan datos por nuestra cuenta y solo para prestarnos su servicio: el servidor donde
                        funciona la plataforma, <strong>Google</strong> (para entrar con tu cuenta de Google), <strong>Resend</strong> (para mandar los mails) y el
                        proveedor de pagos (<strong>Mercado Pago</strong>). Algunos de ellos pueden guardar datos fuera de Argentina; en ese caso trabajamos
                        con empresas que ofrecen un nivel de protección adecuado.
                    </p>
                    <p>Fuera de eso, solo compartimos datos si lo exige la ley o una autoridad competente.</p>
                </>,
            },
            {
                id: 'cuanto-tiempo', titulo: 'Cuánto tiempo los guardamos',
                contenido: <>
                    <ul>
                        <li>Mientras tengas tu cuenta. Si la eliminás, se borran tu cuenta y el plantel de tu equipo.</li>
                        <li>Los torneos que ya terminaron quedan como historial (el nombre del equipo, los resultados y la tabla), porque forman parte de un torneo en el que jugaron otros equipos.</li>
                        <li>Hacemos copias de seguridad diarias que se guardan hasta 14 días: un dato borrado puede quedar en ellas hasta que venzan.</li>
                        <li>Los registros de pagos los podemos conservar el tiempo que exijan las normas contables e impositivas.</li>
                    </ul>
                </>,
            },
            {
                id: 'seguridad', titulo: 'Cómo los cuidamos',
                contenido: <>
                    <p>
                        La conexión con el sitio es siempre cifrada (HTTPS), las contraseñas se guardan cifradas, los datos privados solo se le muestran
                        a quien tiene permiso y limitamos los intentos de inicio de sesión. Ningún sistema es 100% seguro: si detectamos un problema que
                        afecte tus datos, te vamos a avisar.
                    </p>
                </>,
            },
            {
                id: 'derechos', titulo: 'Tus derechos',
                contenido: <>
                    <p>
                        Podés pedir <strong>ver, corregir, actualizar o borrar</strong> tus datos. Casi todo lo podés hacer vos desde la plataforma: tus datos
                        en "Editar mis datos", el plantel en "Mi equipo", los avisos en los ajustes de la cuenta, y eliminar la cuenta también desde los ajustes.
                        Para lo demás, escribinos a <EmailContacto /> o desde la página de <Link to='/contacto'>contacto</Link> (motivo "Mis datos personales").
                    </p>
                    <p>
                        Respondemos los pedidos de acceso dentro de los 10 días corridos y los de corrección o borrado dentro de los 5 días hábiles,
                        como indica la Ley 25.326 de Protección de Datos Personales.
                    </p>
                    <p className='legal__aviso'>
                        El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos
                        no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3
                        de la Ley N° 25.326. La <a href={AAIP_URL} target='_blank' rel='noreferrer'>AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA</a>, en su
                        carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes
                        resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.
                    </p>
                </>,
            },
            {
                id: 'menores', titulo: 'Menores de edad',
                contenido: <>
                    <p>
                        Las cuentas son para mayores de 18 años. En los planteles puede haber jugadores menores de edad: sus datos los carga el capitán,
                        que declara contar con la autorización de su madre, padre o tutor. Si sos responsable de un menor y querés que borremos sus
                        datos, escribinos.
                    </p>
                </>,
            },
            {
                id: 'cambios', titulo: 'Cambios en esta política',
                contenido: <>
                    <p>
                        Si cambiamos esta política, actualizamos la fecha de arriba. Si el cambio es importante (por ejemplo, un nuevo uso de tus datos),
                        te lo avisamos por mail y en la plataforma antes de que empiece a regir.
                    </p>
                </>,
            },
        ]}
    />
);

export default Privacidad;
