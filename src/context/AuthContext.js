import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, registro as apiRegistro, loginGoogle as apiLoginGoogle, getMe } from '../assets/endPoints/auth.js';
import { getMiOrganizacion } from '../assets/endPoints/organizadores.js';
import { getMiEquipo } from '../assets/endPoints/clubes.js';
import { SESION_INVALIDA } from '../assets/fetchMethods.js';

const AuthContext = createContext(null);

const readToken = () => { try { return localStorage.getItem('token'); } catch { return null; } };
const writeToken = (token) => {
    try { token ? localStorage.setItem('token', token) : localStorage.removeItem('token'); } catch {}
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(!!readToken()); // true mientras validamos la sesion guardada
    // Organizacion (organizadores) y equipo (capitanes) de la cuenta. Se guardan junto con el id de la cuenta
    // a la que pertenecen: si todavia no llegaron los de la cuenta actual se exponen como "cargando" (undefined)
    // y nunca como "no tiene" (null). Asi una pagina no redirige a "Crear organizacion" justo despues de recargar.
    const [entidad, setEntidad] = useState({ cuenta: null, organizacion: null, equipo: null });

    const cuentaId = user?.id ?? null;
    const deEstaCuenta = entidad.cuenta === cuentaId;
    // undefined = cargando, null = no tiene
    const organizacion = !user || user.rol === 'capitan' ? null : deEstaCuenta ? entidad.organizacion : undefined;
    const equipo = !user || user.rol !== 'capitan' ? null : deEstaCuenta ? entidad.equipo : undefined;

    const setOrganizacion = (organizacion) => setEntidad(e => ({ ...e, cuenta: cuentaId, organizacion }));
    const setEquipo = (equipo) => setEntidad(e => ({ ...e, cuenta: cuentaId, equipo }));

    useEffect(() => {
        if (!user) { setEntidad({ cuenta: null, organizacion: null, equipo: null }); return; }

        const id = user.id;
        if (user.rol === 'capitan') {
            getMiEquipo().then(e => setEntidad({ cuenta: id, organizacion: null, equipo: e && !e.error ? e : null }));
        } else {
            getMiOrganizacion().then(org => setEntidad({ cuenta: id, organizacion: org && !org.error ? org : null, equipo: null }));
        }
    // Solo cuando cambia la cuenta (no al editar nombre/email), para no recargar la organizacion o el equipo
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, user?.rol])

    useEffect(() => {
        if (!readToken()) return;

        getMe().then(data => {
            if (data?.error) writeToken(null); // token vencido o invalido
            else if (data) setUser(data);
            setLoading(false);
        });
    }, [])


    // La sesion se comparte entre pestañas (el token esta en localStorage):
    // - si otra pestaña cierra sesion o entra con otra cuenta, esta se actualiza (evento `storage`)
    // - si la API rechaza la sesion (401), se cierra aca tambien en vez de seguir "logueado" sin token
    useEffect(() => {
        const alCambiarToken = (e) => {
            if (e.key !== null && e.key !== 'token') return;
            if (!e.newValue) return setUser(null);
            getMe().then(data => setUser(data && !data.error ? data : null));
        };
        const alInvalidarse = () => { writeToken(null); setUser(null); };

        window.addEventListener('storage', alCambiarToken);
        window.addEventListener(SESION_INVALIDA, alInvalidarse);
        return () => {
            window.removeEventListener('storage', alCambiarToken);
            window.removeEventListener(SESION_INVALIDA, alInvalidarse);
        };
    }, []);

    const entrar = async (request, body) => {
        const data = await request(body);

        if (!data) return { error: 'No pudimos conectar con el servidor' };
        if (data.error) return data;

        writeToken(data.token);
        setUser(data.user);
        return {};
    };

    const login = (body) => entrar(apiLogin, body);
    const registro = (body) => entrar(apiRegistro, body);

    // Google: devuelve la respuesta tal cual SIN iniciar la sesion, porque puede faltar elegir el tipo de cuenta
    // (necesitaRol) o haber un aviso que mostrar antes (passwordBorrada). Para entrar, llamar a aplicarSesion(data).
    // extra: { novedades } si está creando la cuenta (no cambia una que ya existe)
    const loginGoogle = async (credential, rol, extra = {}) => {
        const data = await apiLoginGoogle({ credential, ...(rol ? { rol } : {}), ...extra });
        return data || { error: 'No pudimos conectar con el servidor' };
    };
    const aplicarSesion = (data) => { writeToken(data.token); setUser(data.user); };
    const logout = () => { writeToken(null); setUser(null); };

    return <AuthContext.Provider value={{ user, setUser, guardarToken: writeToken, loading, organizacion, setOrganizacion, equipo, setEquipo, login, registro, loginGoogle, aplicarSesion, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
