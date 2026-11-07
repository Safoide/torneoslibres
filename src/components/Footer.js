import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEFENSA_CONSUMIDOR_URL } from '../assets/legal.js';
import '../assets/styles/footer.css';

// Pie de todas las páginas: ayuda, contacto y páginas legales
const Footer = () => {
    const { pathname } = useLocation();
    const { user } = useAuth();
    const enLanding = pathname === '/' && !user; // las fotos de la portada sin sesión son de Unsplash

    return (
        <footer className='footer'>
            <div className='footer__contenido'>
                <div className='footer__marca'>
                    <strong>⚽ Torneos Libres</strong>
                    <span>Torneos de fútbol 5, 7, 8 y 11 en Buenos Aires</span>
                </div>

                <nav className='footer__links' aria-label='Información'>
                    <Link to='/ayuda'>Preguntas frecuentes</Link>
                    <Link to='/contacto'>Contacto</Link>
                    <Link to='/terminos'>Términos y condiciones</Link>
                    <Link to='/privacidad'>Política de privacidad</Link>
                </nav>
            </div>

            <div className='footer__legal'>
                <span>© {new Date().getFullYear()} Torneos Libres</span>
                <a href={DEFENSA_CONSUMIDOR_URL} target='_blank' rel='noreferrer'>Defensa de las y los consumidores. Para reclamos ingresá acá</a>
                {enLanding && <span>Fotos: Unsplash</span>}
            </div>
        </footer>
    );
}

export default Footer;
