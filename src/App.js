import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './assets/styles/style.css';
import './assets/styles/theme.css';
import './assets/styles/comun.css';
import { AuthProvider } from './context/AuthContext';
import Torneos from './components/pages/Torneos';
import Inicio from './components/pages/Inicio';
import Amistosos from './components/pages/Amistosos';
import Amistoso from './components/pages/Amistoso';
import Torneo from './components/pages/Torneo';
import Inscripcion from './components/pages/Inscripcion';
import Organizador from './components/pages/Organizador';
import Auth from './components/pages/Auth';
import OlvidePassword from './components/pages/OlvidePassword';
import RestablecerPassword from './components/pages/RestablecerPassword';
import BajaAviso from './components/pages/BajaAviso';
import VerificarEmail from './components/pages/VerificarEmail';
import AvisoVerificacion from './components/AvisoVerificacion';
import OrganizacionForm from './components/pages/OrganizacionForm';
import CrearTorneo from './components/pages/CrearTorneo';
import Partidos from './components/pages/Partidos';
import Equipo from './components/pages/Equipo';
import EquipoForm from './components/pages/EquipoForm';
import MiEquipo from './components/pages/MiEquipo';
import CuentaDatos from './components/pages/CuentaDatos';
import CuentaAjustes from './components/pages/CuentaAjustes';
import Terminos from './components/pages/Terminos';
import Privacidad from './components/pages/Privacidad';
import Contacto from './components/pages/Contacto';
import Ayuda from './components/pages/Ayuda';
import Header from './components/Header';
import Footer from './components/Footer';
import AceptarTerminos from './components/AceptarTerminos';
import 'boxicons';

// Cada cambio de pantalla vuelve a montar el contenedor y corre la animación de entrada (.pagina en animaciones.css)
const Pagina = ({ children }) => {
    const { pathname } = useLocation();
    return <div className='pagina' key={pathname}>{children}</div>;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <AvisoVerificacion />
                <Pagina>
                    <Routes>
                        <Route path='/' element={<Inicio />} />
                        <Route path='/torneos' element={<Torneos />} />
                        <Route path='/amistosos' element={<Amistosos />} />
                        <Route path='/amistosos/:id' element={<Amistoso />} />
                        <Route path='/torneos/:torneo' element={<Torneo />} />
                        <Route path='/torneos/:torneo/inscripcion' element={<Inscripcion />} />
                        <Route path='/organizadores/:orgId' element={<Organizador />} />
                        <Route path='/organizaciones/nueva' element={<OrganizacionForm modo='crear' />} />
                        <Route path='/organizacion/editar' element={<OrganizacionForm modo='editar' />} />
                        <Route path='/organizacion/torneo/nuevo' element={<CrearTorneo />} />
                        <Route path='/login' element={<Auth key='login' modo='login' />} />
                        <Route path='/registro' element={<Auth key='registro' modo='registro' />} />
                        <Route path='/olvide' element={<OlvidePassword />} />
                        <Route path='/restablecer' element={<RestablecerPassword />} />
                        <Route path='/baja' element={<BajaAviso />} />
                        <Route path='/verificar' element={<VerificarEmail />} />
                        <Route path='/partidos/:torneo' element={<Partidos />} />
                        <Route path='/equipo/:teamId' element={<Equipo />} />
                        <Route path='/equipos/nuevo' element={<EquipoForm modo='crear' />} />
                        <Route path='/cuenta' element={<CuentaDatos />} />
                        <Route path='/cuenta/ajustes' element={<CuentaAjustes />} />
                        <Route path='/mi-equipo' element={<MiEquipo />} />
                        <Route path='/mi-equipo/editar' element={<EquipoForm modo='editar' />} />
                        <Route path='/terminos' element={<Terminos />} />
                        <Route path='/privacidad' element={<Privacidad />} />
                        <Route path='/contacto' element={<Contacto />} />
                        <Route path='/ayuda' element={<Ayuda />} />
                    </Routes>
                </Pagina>
                <Footer />
                {/* Al final: en /terminos y /privacidad es una barra pegada abajo (sticky); en el resto tapa la página */}
                <AceptarTerminos />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
