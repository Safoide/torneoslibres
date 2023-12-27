import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/styles/style.css';
import Torneos from './components/pages/Torneos';
import Torneo from './components/pages/Torneo';
import Partidos from './components/pages/Partidos';
import Equipo from './components/pages/Equipo';
import EditarEquipo from './components/pages/EditarEquipo';
import EditarPartido from './components/pages/EditarPartido';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/torneos' element={<Torneos />} />
                <Route path='/torneos/:torneo' element={<Torneo />} />
                <Route path='/torneos/:torneo/partidos' element={<Partidos />} />
                <Route path='/torneos/partidos/:id' element={<EditarPartido />} />
                <Route path='/equipo/:teamId' element={<Equipo />} />
                <Route path='/equipo/:team/editar' element={<EditarEquipo />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
