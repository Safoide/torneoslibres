import React from 'react'
import { Link } from 'react-router-dom';
import { useIrAlInicio } from '../Documento';
import { MODELO_COBRO_ACTIVO } from '../../assets/legal.js';
import '../../assets/styles/legal.css';
import useTitulo from '../useTitulo';

// Preguntas frecuentes (/ayuda). Tienen que coincidir con cómo funciona la app: si cambia una regla
// (vencimientos, W.O., inscripción), actualizar la respuesta acá también.

const GRUPOS = [
    {
        id: 'general', titulo: 'General',
        preguntas: [
            ['¿Qué es Torneos Libres?', <>Una plataforma para encontrar torneos de fútbol 5, 7, 8 y 11 en Buenos Aires e inscribir a tu equipo, y para que los organizadores publiquen y administren sus torneos: inscripciones, fixture, resultados, tabla y pagos.</>],
            ['¿Tengo que crear una cuenta para ver los torneos?', <>No. Podés <Link to='/torneos'>explorar los torneos</Link> sin cuenta. Para inscribir a tu equipo o publicar un torneo, sí.</>],
            ['¿Cuánto cuesta?', MODELO_COBRO_ACTIVO
                ? <>Crear la cuenta y buscar torneos es gratis. Los equipos pagan lo que fija cada organizador. Los organizadores pagan una comisión sobre lo que cobran en sus torneos (ver los <Link to='/terminos#comisiones'>términos y condiciones</Link>).</>
                : <>Usar la plataforma es gratis. Los equipos pagan la inscripción y las fechas que fija cada organizador.</>],
            ['¿Torneos Libres organiza los torneos?', <>No: cada torneo lo organiza su organizador, que fija las condiciones, las canchas y los precios. Nosotros damos la herramienta. Si tenés un problema con un torneo, <Link to='/contacto'>escribinos</Link>.</>],
        ],
    },
    {
        id: 'capitanes', titulo: 'Para capitanes',
        preguntas: [
            ['¿Cómo inscribo a mi equipo?', <>Creá una cuenta de capitán y armá tu equipo con el plantel. Después elegí un torneo con la inscripción abierta, tocá "Inscribir mi equipo" y pagá la inscripción. Mientras pagás, tu lugar queda reservado.</>],
            ['¿Por qué me piden el DNI y la fecha de nacimiento de los jugadores?', <>Para que el organizador sepa quiénes juegan y para controlar el límite de edad del torneo, si tiene. Esos datos no son públicos: solo los ven vos y los organizadores de los torneos donde está inscripto tu equipo.</>],
            ['¿Cómo funciona el límite de edad?', <>Si el torneo tiene límite, todo el plantel lo tiene que cumplir para inscribirse. Cuenta la edad que tiene cada jugador el día que empieza el torneo.</>],
            ['¿Hasta cuándo me puedo inscribir?', <>Hasta el cierre de inscripción que figura en el detalle del torneo (hasta las 23:59 de ese día) o hasta que se llenen los cupos.</>],
            ['¿Dónde veo cuándo juego?', <>En la portada, en "Tu próxima fecha", apenas el organizador crea la fecha. También te avisamos por mail.</>],
        ],
    },
    {
        id: 'pagos', titulo: 'Pagos, multas y amistosos',
        preguntas: [
            ['¿Cuándo tengo que pagar cada fecha?', <>Si el torneo cobra por fecha, cada equipo paga su parte hasta las 23:59 del día anterior al partido. El día que vence te mandamos un recordatorio.</>],
            ['¿Qué pasa si no pago a tiempo?', <>Depende de las reglas de pago del torneo, que se ven en su detalle antes de inscribirte. Puede ser que pierdas el partido 0-3 (W.O.), que recibas una multa y que tu lugar se ofrezca como amistoso a otro equipo.</>],
            ['Tengo una multa: ¿qué hago?', <>Pagala desde la portada. Mientras tengas una multa pendiente no podés pagar fechas, inscribirte en torneos ni tomar amistosos.</>],
            ['¿Qué es un amistoso?', <>Cuando un equipo no paga su fecha, su lugar se puede ofrecer a otros equipos a mitad de precio. Los ves en <Link to='/amistosos'>Amistosos</Link>: el primero que lo paga se queda con el partido.</>],
            ['El organizador canceló una fecha que ya pagué, ¿pierdo la plata?', <>No. Lo que pagaste queda como saldo a favor de tu equipo en ese torneo y se usa en las fechas siguientes. Si el torneo termina y te queda saldo, te lo devuelve el organizador.</>],
            ...(MODELO_COBRO_ACTIVO ? [
                ['¿Puedo pagar en efectivo o por transferencia?', <>Depende del organizador: los medios que acepta se ven en el detalle del torneo. Por transferencia subís el comprobante y el organizador lo aprueba. En efectivo, las fechas se pagan en la cancha y el organizador marca después si se pagó. En los dos casos, el responsable de hacer el pago es el capitán.</>],
            ] : []),
        ],
    },
    {
        id: 'organizadores', titulo: 'Para organizadores',
        preguntas: [
            ['¿Cómo publico un torneo?', <>Creá una cuenta de organizador, cargá tu organización y desde tu panel creá el torneo: modalidad, sede, días, precios, cupos, límite de edad y reglas de pago.</>],
            ['¿Qué son las reglas de pago?', <>Definen qué pasa cuando un equipo no paga su fecha a tiempo: si pierde por W.O., si recibe una multa (y de cuánto) y si su lugar se ofrece como amistoso. Las podés cambiar hasta crear la primera fecha.</>],
            ['¿Cuándo puedo crear las fechas?', <>Desde que cierra la inscripción. Si el torneo cobra por fecha, cada fecha se crea con al menos 3 días de anticipación, para que los equipos tengan tiempo de pagar. Al crearla se arman solos los partidos.</>],
            ['¿Cómo cargo los resultados?', <>Desde el fixture del torneo, con "Cargar resultados" en cada fecha ya jugada. Mientras el torneo esté en curso los podés corregir; cuando lo finalizás quedan fijos.</>],
            ['¿Puedo cancelar una fecha?', <>Sí, la última, antes de que empiece. Lo que ya pagaron los equipos les queda como saldo a favor; si el torneo termina con saldo, lo tenés que devolver y marcarlo como devuelto en tu panel.</>],
        ],
    },
    {
        id: 'cuenta', titulo: 'Tu cuenta',
        preguntas: [
            ['Me olvidé la contraseña', <>Entrá a <Link to='/olvide'>¿Olvidaste tu contraseña?</Link> y te mandamos un link por mail para elegir una nueva.</>],
            ['¿Puedo entrar con Google?', <>Sí. Si ya tenías una cuenta con el mismo email, se vinculan.</>],
            ['¿Cómo elijo qué mails me llegan?', <>En los ajustes de tu cuenta, en "Notificaciones". También te podés dar de baja de cada aviso desde el link al pie del mail.</>],
            ['¿Cómo elimino mi cuenta?', <>Desde los ajustes de tu cuenta. Si tu equipo está en un torneo que no terminó, vas a poder eliminarla cuando termine. Qué pasa con tus datos lo explicamos en la <Link to='/privacidad#cuanto-tiempo'>política de privacidad</Link>.</>],
        ],
    },
];

const Ayuda = () => {
    useTitulo('Preguntas frecuentes', 'Cómo inscribir a tu equipo, cómo se pagan las fechas, qué pasa si no pagás a tiempo y cómo publicar un torneo en Torneos Libres.');
    useIrAlInicio();

    return (
        <article className='legal'>
            <header className='legal__encabezado'>
                <h1>Preguntas frecuentes</h1>
                <p className='legal__bajada'>Lo que más nos preguntan sobre cómo funcionan los torneos, los pagos y las cuentas.</p>
            </header>

            <nav className='legal__indice legal__indice--chips' aria-label='Temas'>
                {GRUPOS.map((g) => <a key={g.id} href={`#${g.id}`}>{g.titulo}</a>)}
            </nav>

            {GRUPOS.map((g) => (
                <section key={g.id} id={g.id} className='legal__seccion'>
                    <h2>{g.titulo}</h2>
                    <div className='faq'>
                        {g.preguntas.map(([pregunta, respuesta]) => (
                            <details key={pregunta} className='faq__item'>
                                <summary>{pregunta}</summary>
                                <p>{respuesta}</p>
                            </details>
                        ))}
                    </div>
                </section>
            ))}

            <div className='box legal__cierre'>
                <strong>¿No encontraste lo que buscabas?</strong>
                <p>Escribinos y te respondemos por mail.</p>
                <Link className='btn btn--primary btn--chico' to='/contacto'>Ir a contacto</Link>
            </div>
        </article>
    );
}

export default Ayuda;
