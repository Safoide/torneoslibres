import React, { useEffect, useRef, useState } from 'react'
import { getNotificaciones, guardarNotificaciones } from '../assets/endPoints/auth.js';
import { Sk } from './Skeleton';

// Sección "Notificaciones por email" de los ajustes de la cuenta. Los avisos y sus textos los manda la API
// (dependen del tipo de cuenta). Cada cambio se guarda en el momento; si falla, vuelve a como estaba.
const NotificacionesAjustes = ({ email }) => {
    const [prefs, setPrefs] = useState(null); // { avisos: [{ id, titulo, texto, activa }], novedades: {...} }
    const [error, setError] = useState('');
    const guardadas = useRef(null); // lo último confirmado por la API (para deshacer si falla)

    useEffect(() => {
        getNotificaciones().then((data) => {
            if (!data || data.error) return setError(data?.error || 'No pudimos cargar tus notificaciones');
            guardadas.current = data;
            setPrefs(data);
        });
    }, [])

    // Manda todos los avisos juntos: si se tocan dos seguidos, el último pedido tiene el estado completo
    const cambiar = async (id, activa) => {
        setError('');
        const nuevas = id === 'novedades'
            ? { ...prefs, novedades: { ...prefs.novedades, activa } }
            : { ...prefs, avisos: prefs.avisos.map((a) => (a.id === id ? { ...a, activa } : a)) };
        setPrefs(nuevas);

        const data = await guardarNotificaciones({
            avisos: Object.fromEntries(nuevas.avisos.map((a) => [a.id, a.activa])),
            novedades: nuevas.novedades.activa,
        });
        if (!data || data.error) {
            setError(data?.error || 'No pudimos guardar el cambio. Probá de nuevo.');
            return setPrefs(guardadas.current);
        }
        guardadas.current = data;
    };

    // Función (no componente) para que el interruptor no se vuelva a montar y no pierda el foco
    const fila = (item) => (
        <label key={item.id} className='ajustes__fila ajustes__fila--click'>
            <div><strong>{item.titulo}</strong><span className='muted'>{item.texto}</span></div>
            <input className='interruptor' type='checkbox' role='switch' checked={item.activa}
                onChange={(e) => cambiar(item.id, e.target.checked)} />
        </label>
    );

    return (
        <section className='ajustes__card' id='notificaciones'>
            <h2>Notificaciones por email</h2>
            <p className='muted'>Te llegan a <strong>{email}</strong>. Los mails de seguridad, como el de recuperar la contraseña, te llegan siempre.</p>

            {!prefs && !error && [1, 2, 3].map((i) => (
                <div className='ajustes__fila' key={i}>
                    <div><Sk w={160} h={14} /><Sk w='80%' h={12} /></div>
                    <Sk w={42} h={24} r={999} />
                </div>
            ))}

            {prefs && (
                <>
                    {prefs.avisos.map(fila)}
                    <h3 className='ajustes__subtitulo'>Novedades</h3>
                    {fila(prefs.novedades)}
                </>
            )}

            {error && <p className='form__error' role='alert'>{error}</p>}
        </section>
    )
}

export default NotificacionesAjustes;
