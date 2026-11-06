import React, { useEffect, useRef, useState } from 'react';
import logoGoogle from '../assets/imgs/google-g.svg';

// Botón propio "Continuar con Google" (Google Identity Services, "token client").
// Al tocarlo se abre la ventana de Google; cuando el usuario elige su cuenta, Google llama a onCredential(token)
// con un access token que se manda a la API (POST /auth/google), que lo verifica con Google.
// El Client ID es público y sale de REACT_APP_GOOGLE_CLIENT_ID; sin él el botón no se muestra.
// Diseño: nuestro .btn con el logo G oficial (las pautas de Google permiten botones propios si se respeta el logo).
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const TEXTOS = {
    continue_with: 'Continuar con Google',
    signin_with: 'Iniciar sesión con Google',
    signup_with: 'Registrarte con Google',
};

let cargaScript = null;
const cargarGoogle = () => {
    if (window.google?.accounts?.oauth2) return Promise.resolve();
    if (!cargaScript) {
        cargaScript = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://accounts.google.com/gsi/client';
            s.async = true;
            s.onload = resolve;
            s.onerror = () => { cargaScript = null; s.remove(); reject(new Error('No cargó Google')); };
            document.head.appendChild(s);
        });
    }
    return cargaScript;
};

// texto: 'continue_with' | 'signin_with' | 'signup_with'. deshabilitado: mientras el padre procesa el ingreso
const GoogleBoton = ({ onCredential, texto = 'continue_with', deshabilitado = false }) => {
    const cliente = useRef(null);
    const callback = useRef(onCredential);
    const [estado, setEstado] = useState('cargando'); // cargando | listo | error
    const [aviso, setAviso] = useState('');
    callback.current = onCredential; // siempre el ultimo

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return;
        let vivo = true;

        cargarGoogle().then(() => {
            if (!vivo) return;
            // El cliente se crea antes del clic: requestAccessToken tiene que llamarse directo en el clic
            // (si no, el navegador bloquea la ventana emergente)
            cliente.current = window.google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: 'openid email profile',
                callback: (resp) => {
                    if (!vivo) return;
                    setEstado('listo');
                    if (resp?.access_token) callback.current(resp.access_token);
                    else setAviso('Google no nos dio acceso a tu cuenta. Probá de nuevo.');
                },
                error_callback: (err) => {
                    if (!vivo) return;
                    setEstado('listo');
                    // Cerrar la ventana no es un error para mostrar
                    if (err?.type === 'popup_failed_to_open') setAviso('Tu navegador bloqueó la ventana de Google. Permití las ventanas emergentes para este sitio y probá de nuevo.');
                },
            });
            setEstado('listo');
        }).catch(() => vivo && setEstado('error'));

        return () => { vivo = false; };
    }, []);

    if (!GOOGLE_CLIENT_ID) return null;
    if (estado === 'error') return <p className='muted'>No pudimos cargar el ingreso con Google. Revisá tu conexión o probá con tu email.</p>;

    const abrir = () => {
        if (!cliente.current) return;
        setAviso('');
        // select_account: siempre deja elegir la cuenta (útil si tiene varias o quiere cambiar)
        cliente.current.requestAccessToken({ prompt: 'select_account' });
    };

    return (
        <>
            {/* Siempre clickeable una vez cargado: si el navegador no avisa que se cerró la ventana de Google,
                el botón no queda trabado */}
            <button type='button' className='btn btn--secundario btn--google' onClick={abrir}
                disabled={deshabilitado || estado === 'cargando'}>
                <img src={logoGoogle} alt='' width={20} height={20} />
                <span>{TEXTOS[texto] ?? TEXTOS.continue_with}</span>
            </button>
            {aviso && <p className='form__error' role='alert'>{aviso}</p>}
        </>
    );
};

export default GoogleBoton;
