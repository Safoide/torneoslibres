import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, registro as apiRegistro, getMe } from '../assets/endPoints/auth.js';
import { getMiOrganizacion } from '../assets/endPoints/organizadores.js';
import { getMiEquipo } from '../assets/endPoints/clubes.js';

const AuthContext = createContext(null);

const readToken = () => { try { return localStorage.getItem('token'); } catch { return null; } };
const writeToken = (token) => {
    try { token ? localStorage.setItem('token', token) : localStorage.removeItem('token'); } catch {}
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(!!readToken()); // true mientras validamos la sesion guardada
    const [organizacion, setOrganizacion] = useState(null); // organizadores. undefined = cargando, null = no tiene
    const [equipo, setEquipo] = useState(null); // capitanes. undefined = cargando, null = no tiene

    useEffect(() => {
        if (!user) { setOrganizacion(null); setEquipo(null); return; }

        if (user.rol === 'capitan') {
            setOrganizacion(null);
            setEquipo(undefined);
            getMiEquipo().then(e => setEquipo(e && !e.error ? e : null));
        } else {
            setEquipo(null);
            setOrganizacion(undefined);
            getMiOrganizacion().then(org => setOrganizacion(org && !org.error ? org : null));
        }
    }, [user])

    useEffect(() => {
        if (!readToken()) return;

        getMe().then(data => {
            if (data?.error) writeToken(null); // token vencido o invalido
            else if (data) setUser(data);
            setLoading(false);
        });
    }, [])


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
    const logout = () => { writeToken(null); setUser(null); };

    return <AuthContext.Provider value={{ user, loading, organizacion, setOrganizacion, equipo, setEquipo, login, registro, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
