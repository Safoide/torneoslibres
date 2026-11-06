import React from 'react'
// Los skeletons reutilizan las clases de layout de cada pantalla (tarjetas, cabeceras, secciones)
import '../assets/styles/buscador.css';
import '../assets/styles/organizador.css';
import '../assets/styles/torneo.css';
import '../assets/styles/dashboard.css';
import '../assets/styles/fechas.css';
import '../assets/styles/formularios.css';
import '../assets/styles/skeleton.css';

// Placeholders con la forma de cada pantalla mientras llegan los datos de la API. Se muestran al instante.

// Bloque gris basico. w y h aceptan cualquier medida CSS
export const Sk = ({ w = '100%', h = 14, r, circle, className = '' }) => (
    <span
        className={`sk${circle ? ' sk--circulo' : ''}${className ? ` ${className}` : ''}`}
        style={{ width: circle ? h : w, height: h, ...(r !== undefined && { borderRadius: r }) }}
        aria-hidden='true'
    />
);

// Envoltorio accesible: los lectores de pantalla anuncian "Cargando..." una sola vez
export const Cargando = ({ children, texto = 'Cargando…', className = '' }) => (
    <div className={`sk-grupo ${className}`} role='status' aria-live='polite'>
        <span className='sk-oculto'>{texto}</span>
        {children}
    </div>
);

const repetir = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));

// ---------- Tarjetas de torneo (buscador, landing) ----------
export const SkeletonTarjetasTorneo = ({ n = 6 }) => (
    <Cargando texto='Cargando torneos…' className='torneos-grid'>
        {repetir(n, i => (
            <div className='card-torneo sk-card' key={i}>
                <div className='card-torneo__top'><Sk w={34} h={22} r={8} /><Sk w={90} h={12} /></div>
                <Sk w='75%' h={20} />
                <div className='sk-col'><Sk w='85%' h={12} /><Sk w='65%' h={12} /><Sk w='40%' h={12} /></div>
                <div className='card-torneo__pie'>
                    <div className='sk-col'><Sk w={100} h={24} /><Sk w={70} h={10} /></div>
                    <Sk w={64} h={24} r={999} />
                </div>
            </div>
        ))}
    </Cargando>
);

// ---------- Cabecera de perfil (organizador, mi equipo) ----------
export const SkeletonPerfil = () => (
    <div className='org-top'>
        <Cargando texto='Cargando perfil…'>
            <div className='org-head'>
                <Sk circle h={96} />
                <div className='sk-col sk-flex'>
                    <Sk w='45%' h={30} />
                    <Sk w='25%' h={14} />
                    <Sk w='60%' h={14} />
                    <div className='sk-fila'><Sk w={92} h={30} r={999} /><Sk w={92} h={30} r={999} /></div>
                </div>
            </div>
        </Cargando>
    </div>
);

// ---------- Resumen del organizador ----------
export const SkeletonDashboard = () => (
    <Cargando texto='Cargando el resumen…' className='dash'>
        <div className='dash-stats'>
            {repetir(6, i => (
                <div className='dash-stat' key={i}><Sk w='40%' h={11} /><Sk w='60%' h={30} /><Sk w='80%' h={11} /></div>
            ))}
        </div>
        <div className='dash-fila'>
            <div className='seccion'>
                <Sk w={160} h={18} />
                <div className='sk-barras'>
                    {[30, 55, 90, 45, 75, 40].map((h, i) => <Sk key={i} w='100%' h={`${h}%`} r='4px 4px 0 0' />)}
                </div>
            </div>
            <div className='seccion sk-col sk-gap'>
                <Sk w={140} h={18} />
                {repetir(3, i => <div className='sk-fila' key={i}><Sk w={96} h={36} /><Sk w='60%' h={36} /></div>)}
            </div>
        </div>
    </Cargando>
);

// ---------- Detalle de un torneo ----------
export const SkeletonTorneo = () => (
    <Cargando texto='Cargando torneo…' className='torneo'>
        <Sk w={150} h={14} />
        <div className='sk-fila'><Sk w={38} h={24} r={8} /><Sk w='55%' h={34} /></div>
        <Sk w='40%' h={14} />
        <div className='sk-col'><Sk w='95%' h={14} /><Sk w='70%' h={14} /></div>
        <div className='detalles'>
            {repetir(6, i => <div className='detalles__fila' key={i}><Sk w={110} h={14} /><Sk w='50%' h={14} /></div>)}
        </div>
        <div className='seccion sk-col sk-gap'>
            <Sk w={180} h={18} />
            {repetir(5, i => <div className='sk-fila' key={i}><Sk circle h={32} /><Sk w='45%' h={14} /></div>)}
        </div>
    </Cargando>
);

// ---------- Fixture de un torneo ----------
export const SkeletonFixture = () => (
    <Cargando texto='Cargando fixture…' className='fixture'>
        <Sk w={130} h={14} />
        <div className='sk-col'><Sk w={140} h={34} /><Sk w={200} h={12} /></div>
        {repetir(2, f => (
            <div className='seccion sk-col sk-gap' key={f}>
                <div className='sk-fila sk-entre'><Sk w={160} h={18} /><Sk w={90} h={22} r={999} /></div>
                {repetir(3, i => (
                    <div className='sk-partido' key={i}>
                        <div className='sk-fila'><Sk circle h={32} /><Sk w='60%' h={14} /></div>
                        <Sk w={56} h={22} />
                        <div className='sk-fila sk-derecha'><Sk w='60%' h={14} /><Sk circle h={32} /></div>
                    </div>
                ))}
            </div>
        ))}
    </Cargando>
);

// ---------- Lista simple (torneos anotados, etc.) ----------
export const SkeletonLista = ({ n = 3, texto }) => (
    <Cargando texto={texto} className='sk-col sk-gap'>
        {repetir(n, i => (
            <div className='sk-item' key={i}>
                <div className='sk-col sk-flex'>
                    <div className='sk-fila'><Sk w={34} h={22} r={8} /><Sk w='45%' h={16} /></div>
                    <Sk w='65%' h={12} />
                </div>
                <Sk w={96} h={34} r={10} />
            </div>
        ))}
    </Cargando>
);

// ---------- Formularios que esperan la sesion ----------
export const SkeletonFormulario = ({ campos = 4 }) => (
    <Cargando className='form-page'>
        <Sk w='50%' h={32} />
        <div className='form sk-col sk-gap'>
            {repetir(campos, i => <div className='sk-col' key={i}><Sk w={120} h={12} /><Sk h={42} r={10} /></div>)}
            <Sk w={160} h={44} r={12} />
        </div>
    </Cargando>
);

// ---------- Cifras de la landing ----------
export const SkeletonCifras = ({ n = 4 }) => (
    <Cargando texto='Cargando cifras…' className='landing-stats'>
        {/* .landing-stats div usa column-reverse: el ultimo hijo queda arriba (el numero, como en las cifras reales) */}
        {repetir(n, i => <div key={i}><Sk w='75%' h={12} /><Sk w={70} h={30} /></div>)}
    </Cargando>
);
