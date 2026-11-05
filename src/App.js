import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/styles/style.css';
import './assets/styles/theme.css';
import './assets/styles/comun.css';
import { AuthProvider } from './context/AuthContext';
import Torneos from './components/pages/Torneos';
import Inicio from './components/pages/Inicio';
import Torneo from './components/pages/Torneo';
import Inscripcion from './components/pages/Inscripcion';
import Organizador from './components/pages/Organizador';
import Auth from './components/pages/Auth';
import OrganizacionForm from './components/pages/OrganizacionForm';
import CrearTorneo from './components/pages/CrearTorneo';
import Partidos from './components/pages/Partidos';
import Equipo from './components/pages/Equipo';
import EquipoForm from './components/pages/EquipoForm';
import MiEquipo from './components/pages/MiEquipo';
import CuentaDatos from './components/pages/CuentaDatos';
import CuentaAjustes from './components/pages/CuentaAjustes';
import Header from './components/Header';
import 'boxicons';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path='/' element={<Inicio />} />
                    <Route path='/torneos' element={<Torneos />} />
                    <Route path='/torneos/:torneo' element={<Torneo />} />
                    <Route path='/torneos/:torneo/inscripcion' element={<Inscripcion />} />
                    <Route path='/organizadores/:orgId' element={<Organizador />} />
                    <Route path='/organizaciones/nueva' element={<OrganizacionForm modo='crear' />} />
                    <Route path='/organizacion/editar' element={<OrganizacionForm modo='editar' />} />
                    <Route path='/organizacion/torneo/nuevo' element={<CrearTorneo />} />
                    <Route path='/login' element={<Auth modo='login' />} />
                    <Route path='/registro' element={<Auth modo='registro' />} />
                    <Route path='/partidos/:torneo' element={<Partidos />} />
                    <Route path='/equipo/:teamId' element={<Equipo />} />
                    <Route path='/equipos/nuevo' element={<EquipoForm modo='crear' />} />
                    <Route path='/cuenta' element={<CuentaDatos />} />
                    <Route path='/cuenta/ajustes' element={<CuentaAjustes />} />
                    <Route path='/mi-equipo' element={<MiEquipo />} />
                    <Route path='/mi-equipo/editar' element={<EquipoForm modo='editar' />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
