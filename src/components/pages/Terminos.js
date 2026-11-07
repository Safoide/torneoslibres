import React from 'react'
import { Link } from 'react-router-dom';
import Documento, { Dato, EmailContacto } from '../Documento';
import { RESPONSABLE, VIGENCIA, MODELO_COBRO_ACTIVO, DEFENSA_CONSUMIDOR_URL } from '../../assets/legal.js';

// Términos y condiciones. Los datos del responsable y el interruptor del modelo de cobro están en assets/legal.js.
// Al cambiar algo importante: actualizar VIGENCIA.terminos y avisar a los usuarios (punto "Cambios").

const Terminos = () => (
    <Documento
        titulo='Términos y condiciones'
        bajada='Las reglas para usar Torneos Libres, tanto si inscribís a tu equipo como si organizás torneos. Las escribimos lo más claro posible: leelas antes de crear tu cuenta.'
        vigencia={VIGENCIA.terminos}
        secciones={[
            {
                id: 'quienes-somos', titulo: 'Quiénes somos',
                contenido: <>
                    <p>
                        Torneos Libres (<strong>torneoslibres.com</strong>, "la plataforma") es un servicio para encontrar, publicar y administrar torneos de
                        fútbol 5, 7, 8 y 11. El responsable de la plataforma es <Dato valor={RESPONSABLE.nombre} />, CUIT <Dato valor={RESPONSABLE.cuit} />,
                        con domicilio en <Dato valor={RESPONSABLE.domicilio} /> ("nosotros").
                    </p>
                    <p>Podés escribirnos a <EmailContacto /> o desde la página de <Link to='/contacto'>contacto</Link>.</p>
                </>,
            },
            {
                id: 'aceptacion', titulo: 'Aceptación de estos términos',
                contenido: <>
                    <p>
                        Al crear una cuenta (con email o con Google) aceptás estos términos y la <Link to='/privacidad'>política de privacidad</Link>.
                        Si no estás de acuerdo, no crees una cuenta. Para mirar torneos no hace falta registrarse, pero el uso del sitio también
                        se rige por estas reglas.
                    </p>
                </>,
            },
            {
                id: 'cuentas', titulo: 'Tu cuenta',
                contenido: <>
                    <ul>
                        <li>Hay dos tipos de cuenta: <strong>capitán</strong> (arma un equipo y lo inscribe en torneos) y <strong>organizador</strong> (tiene una organización y publica torneos). Cada cuenta puede tener un solo equipo o una sola organización.</li>
                        <li>Para crear una cuenta tenés que ser <strong>mayor de 18 años</strong>. Los menores pueden jugar en un equipo, pero la cuenta del capitán la tiene que manejar un adulto, que es responsable por el equipo.</li>
                        <li>Los datos que cargás tienen que ser reales y estar actualizados.</li>
                        <li>Sos responsable de cuidar tu contraseña y de lo que se haga con tu cuenta. Si creés que alguien entró sin permiso, cambiá la contraseña o cerrá las sesiones desde los ajustes de la cuenta y avisanos.</li>
                    </ul>
                </>,
            },
            {
                id: 'rol', titulo: 'Qué hace (y qué no hace) Torneos Libres',
                contenido: <>
                    <p>
                        Torneos Libres es una herramienta que conecta a organizadores y equipos: muestra los torneos, gestiona las inscripciones,
                        el fixture, la tabla, los pagos y los avisos. <strong>No organizamos los torneos</strong>: cada torneo lo organiza y lo lleva
                        adelante su organizador, que es quien fija las condiciones y quien cobra.
                    </p>
                    <p>Por eso, el acuerdo para jugar un torneo es entre el equipo y el organizador. En particular, no somos responsables por:</p>
                    <ul>
                        <li>que el torneo se juegue como se publicó (canchas, horarios, arbitraje, premios), ni por su suspensión o cancelación;</li>
                        <li>lesiones, accidentes, daños o pérdidas en las canchas, ni por la conducta de jugadores, organizadores o terceros;</li>
                        <li>los seguros, permisos y habilitaciones, que le corresponden al organizador y al lugar donde se juega.</li>
                    </ul>
                    <p>
                        Si tenés un problema con un torneo, escribinos: vamos a ayudar a resolverlo con la información que tenemos en la plataforma.
                        Nada de esto limita los derechos que te da la ley (ver <a href='#consumidores'>Defensa del consumidor</a>).
                    </p>
                </>,
            },
            {
                id: 'organizadores', titulo: 'Si sos organizador',
                contenido: <>
                    <ul>
                        <li>Publicá información real y completa de cada torneo: precios, sede, días, horarios, formato, límite de edad y reglas de pago. Los equipos se inscriben confiando en lo que publicás.</li>
                        <li>Cumplí con lo publicado y con las reglas de pago del torneo. Una vez creada la primera fecha, esas reglas quedan fijas.</li>
                        <li>Cargá los resultados de buena fe y a tiempo. Mientras el torneo está en curso se pueden corregir; cuando lo finalizás quedan fijos.</li>
                        <li>Si cancelás una fecha que algunos equipos ya pagaron, lo pagado queda como saldo a favor de cada equipo en ese torneo. Si el torneo termina y a un equipo le queda saldo, <strong>te comprometés a devolvérselo completo</strong> y a marcarlo como devuelto en la plataforma.</li>
                        <li>Sos responsable de las canchas, el arbitraje, la seguridad, los seguros y los permisos de tus torneos, y de tus obligaciones impositivas por lo que cobrás.</li>
                        <li>Los datos personales de los equipos (por ejemplo, el DNI y la fecha de nacimiento del plantel, o el WhatsApp del capitán) los podés ver solo porque están inscriptos en tu torneo: usalos únicamente para organizarlo.</li>
                    </ul>
                </>,
            },
            {
                id: 'capitanes', titulo: 'Si sos capitán',
                contenido: <>
                    <ul>
                        <li>Cargá el plantel con datos reales. Si el torneo tiene límite de edad, todo el plantel tiene que cumplirlo (la edad se cuenta al día en que empieza el torneo).</li>
                        <li>Al cargar los datos de los jugadores declarás que ellos están de acuerdo, y en el caso de menores de edad, que lo autorizó su madre, padre o tutor.</li>
                        <li>Sos responsable de que tu equipo pague la inscripción y cada fecha en término, y de las consecuencias si no lo hace (ver <a href='#pagos'>Pagos</a>).</li>
                        <li>Las condiciones del torneo y sus reglas de pago se muestran en el detalle del torneo antes de inscribirte: revisalas antes de pagar.</li>
                    </ul>
                </>,
            },
            {
                id: 'pagos', titulo: 'Pagos, multas y saldos',
                contenido: <>
                    <ul>
                        <li>Los precios de la inscripción y de cada fecha los fija el organizador. La inscripción se confirma cuando se paga; mientras pagás, tu lugar queda reservado.</li>
                        <li>Cuando el torneo cobra por fecha, cada equipo paga su parte de la fecha <strong>hasta las 23:59 del día anterior</strong> al partido.</li>
                        <li>
                            Qué pasa si un equipo no paga a tiempo lo define el organizador en las reglas de pago del torneo. Puede ser que pierda el
                            partido 0-3 (W.O.), que reciba una multa y que su lugar se ofrezca como amistoso a otro equipo. Mientras un equipo tenga
                            una multa sin pagar, no puede pagar fechas, inscribirse en torneos ni tomar amistosos. Las multas son para el organizador.
                        </li>
                        <li>Los amistosos se publican con el precio que indica la plataforma y se confirman al pagarlos; el primer equipo que paga se queda con el lugar.</li>
                        <li>Si se cancela una fecha que ya pagaste, ese monto queda como saldo a favor de tu equipo en el torneo y se usa en las fechas siguientes. Si el torneo termina y te queda saldo, te lo devuelve el organizador.</li>
                        <li>Los pagos con tarjeta o Mercado Pago los procesa el proveedor de pagos: nosotros no guardamos los datos de tu tarjeta.</li>
                    </ul>
                </>,
            },
            MODELO_COBRO_ACTIVO ? {
                id: 'medios-de-cobro', titulo: 'Medios de cobro',
                contenido: <>
                    <p>Cada organizador elige cómo cobra (al menos uno de estos medios) y los medios aceptados se muestran en el detalle de cada torneo, antes de inscribirse:</p>
                    <ul>
                        <li><strong>Mercado Pago</strong>: el organizador vincula su cuenta y cada pago le llega directo, ya descontada la comisión de la plataforma.</li>
                        <li><strong>Transferencia</strong>: el capitán transfiere a la cuenta que indica el organizador y sube el comprobante. El pago se confirma cuando el organizador lo aprueba; si lo rechaza, el capitán puede subir otro. Si el comprobante se subió antes del vencimiento, no se aplica el W.O. automático mientras el organizador lo revisa.</li>
                        <li><strong>Efectivo</strong>: en la inscripción, la confirma el organizador cuando recibe el pago. En las fechas, se paga en la cancha: el capitán lo elige antes del vencimiento y el organizador marca después del partido si se pagó o no. Si no se pagó, se aplican las reglas de pago del torneo.</li>
                    </ul>
                    <p>
                        <strong>Responsabilidad en los pagos por transferencia y en efectivo:</strong> el capitán es el responsable de hacer el pago.
                        El organizador que acepta estos medios asume el riesgo de que un equipo no le pague: la plataforma no le repone ese dinero
                        y la comisión de ese cobro se debe igual.
                    </p>
                </>,
            } : null,
            MODELO_COBRO_ACTIVO ? {
                id: 'comisiones', titulo: 'Comisiones de la plataforma',
                contenido: <>
                    <p>Crear una cuenta, buscar torneos y publicarlos es gratis. La plataforma cobra una comisión al organizador sobre lo que se cobra en sus torneos:</p>
                    <ul>
                        <li><strong>5%</strong> de cada inscripción y de cada pago de fecha, sin importar el medio (Mercado Pago, transferencia o efectivo).</li>
                        <li><strong>10%</strong> de cada amistoso.</li>
                        <li>Las multas no tienen comisión: son 100% del organizador.</li>
                    </ul>
                    <p>
                        Lo que cobra Mercado Pago por procesar cada pago es aparte y lo fija Mercado Pago. Cuando un saldo a favor se usa para pagar
                        una fecha, la comisión no se cobra dos veces; y cuando el organizador devuelve un saldo al terminar el torneo, le devolvemos
                        nuestra comisión de ese monto.
                    </p>
                </>,
            } : {
                id: 'costo', titulo: 'Costo del servicio',
                contenido: <>
                    <p>
                        Hoy usar Torneos Libres no tiene costo: crear una cuenta, buscar torneos y publicarlos es gratis. Si más adelante empezamos
                        a cobrar comisiones u otros cargos, lo vamos a avisar por mail y en la plataforma con al menos <strong>30 días</strong> de
                        anticipación, y nunca se van a aplicar a pagos hechos antes de ese cambio.
                    </p>
                </>,
            },
            MODELO_COBRO_ACTIVO ? {
                id: 'deuda', titulo: 'Deuda del organizador',
                contenido: <>
                    <p>La comisión de lo cobrado por transferencia o en efectivo queda como un saldo que el organizador le debe a la plataforma:</p>
                    <ul>
                        <li>Es una sola deuda, que se ve en el panel del organizador con un contador de días. Se puede pagar en cualquier momento con el link de pago del panel.</li>
                        <li>Mientras haya deuda, cada cobro por Mercado Pago lleva un 5% más de comisión que el anterior (10%, 15%, 20%… hasta un máximo del 50%), y esa diferencia se descuenta de la deuda. Cuando la deuda se cancela, la comisión vuelve al 5%.</li>
                        <li>El plazo para pagarla es de <strong>10 días</strong> desde la primera deuda sin pagar; sumar nuevos montos no reinicia el plazo. Te avisamos por mail cuando quedan 5, 3, 2 y 1 días.</li>
                        <li>Si pasan los 10 días sin pagarla, no vas a poder crear torneos nuevos hasta cancelarla. Los torneos que ya tenés siguen funcionando con normalidad.</li>
                    </ul>
                </>,
            } : null,
            {
                id: 'contenido', titulo: 'Lo que publicás',
                contenido: <>
                    <p>
                        Los nombres, logos, descripciones y demás contenido que cargás siguen siendo tuyos. Al publicarlos nos permitís mostrarlos en la
                        plataforma (por ejemplo, el logo de tu equipo en la tabla de un torneo). Tenés que tener derecho a usar lo que subís.
                    </p>
                    <p>No está permitido publicar contenido ofensivo, discriminatorio, engañoso o que infrinja derechos de otros. Podemos quitarlo sin aviso.</p>
                </>,
            },
            {
                id: 'prohibido', titulo: 'Usos no permitidos',
                contenido: <>
                    <ul>
                        <li>Publicar torneos falsos o cobrar por torneos que no se van a jugar.</li>
                        <li>Hacerse pasar por otra persona, equipo u organización, o cargar datos de terceros sin su permiso.</li>
                        <li>Usar la plataforma para estafas, para cobros por fuera de lo publicado o para cualquier actividad ilegal.</li>
                        <li>Intentar entrar a cuentas ajenas, afectar el funcionamiento del sitio o copiar sus datos en forma automática.</li>
                    </ul>
                </>,
            },
            {
                id: 'baja', titulo: 'Suspensión y baja de la cuenta',
                contenido: <>
                    <p>
                        Podés eliminar tu cuenta cuando quieras desde los ajustes de la cuenta. Un equipo inscripto en un torneo que todavía no terminó
                        no se puede eliminar hasta que termine. Una organización con torneos publicados no se puede eliminar desde la plataforma: escribinos
                        y lo resolvemos.
                    </p>
                    <p>
                        Podemos suspender o dar de baja una cuenta que no cumpla estos términos, que haga un uso fraudulento o que perjudique a otros
                        usuarios. Salvo en casos graves o urgentes, te vamos a avisar antes y explicar el motivo.
                    </p>
                </>,
            },
            {
                id: 'servicio', titulo: 'Funcionamiento del servicio',
                contenido: <>
                    <p>
                        Hacemos lo posible para que la plataforma funcione bien y sin interrupciones, pero puede haber cortes, errores o tareas de
                        mantenimiento. Podemos cambiar, agregar o quitar funciones. En la medida que lo permite la ley, no respondemos por daños
                        indirectos derivados de que el servicio no esté disponible.
                    </p>
                </>,
            },
            {
                id: 'propiedad', titulo: 'Propiedad intelectual',
                contenido: <>
                    <p>
                        La marca Torneos Libres, el logo, el diseño y el software de la plataforma son nuestros y no se pueden copiar ni usar sin
                        autorización. Las fotos de la portada son de Unsplash y se usan según su licencia.
                    </p>
                </>,
            },
            {
                id: 'privacidad', titulo: 'Datos personales',
                contenido: <>
                    <p>Cómo usamos y cuidamos tus datos está explicado en la <Link to='/privacidad'>política de privacidad</Link>, que forma parte de estos términos.</p>
                </>,
            },
            {
                id: 'consumidores', titulo: 'Defensa del consumidor',
                contenido: <>
                    <p>
                        Nada de estos términos limita los derechos que te da la Ley de Defensa del Consumidor (Ley 24.240). Si tenés un reclamo,
                        escribinos primero a <EmailContacto /> para resolverlo rápido. También podés hacer tu reclamo en la{' '}
                        <a href={DEFENSA_CONSUMIDOR_URL} target='_blank' rel='noreferrer'>Ventanilla Única Federal de Defensa del Consumidor</a>.
                    </p>
                </>,
            },
            {
                id: 'cambios', titulo: 'Cambios en estos términos',
                contenido: <>
                    <p>
                        Podemos actualizar estos términos. La fecha de arriba indica desde cuándo rige esta versión. Si el cambio es importante te lo
                        avisamos por mail y en la plataforma antes de que empiece a regir; si después de eso seguís usando la plataforma, aceptás
                        la nueva versión. Si no estás de acuerdo, podés eliminar tu cuenta.
                    </p>
                </>,
            },
            {
                id: 'ley', titulo: 'Ley aplicable',
                contenido: <>
                    <p>
                        Estos términos se rigen por las leyes de la República Argentina. Si sos consumidor, son competentes los tribunales de tu
                        domicilio; en los demás casos, los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.
                    </p>
                </>,
            },
        ]}
    />
);

export default Terminos;
