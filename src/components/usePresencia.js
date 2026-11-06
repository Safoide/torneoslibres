import { useEffect, useState } from 'react';

// Animaciones apagadas (Ajustes de la cuenta o preferencia del sistema)
export const sinMovimiento = () =>
    document.documentElement.dataset.movimiento === 'reducido'
    || !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Deja montado un elemento (menú, panel) mientras corre su animación de salida.
// Uso: `const { montado, cerrando } = usePresencia(abierto)`; se renderiza si `montado`
// y se le agrega la clase de salida (`saliendo`) si `cerrando`. La duración tiene que
// coincidir con la de la animación de salida en animaciones.css (--dur-salida).
const usePresencia = (abierto, ms = 140) => {
    const [montado, setMontado] = useState(abierto);

    useEffect(() => {
        if (abierto) return setMontado(true);

        const t = setTimeout(() => setMontado(false), sinMovimiento() ? 0 : ms);
        return () => clearTimeout(t);
    }, [abierto, ms]);

    return { montado: abierto || montado, cerrando: !abierto && montado };
};

export default usePresencia;
