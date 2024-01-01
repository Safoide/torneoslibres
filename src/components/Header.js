import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Header = () => {
    
    const location = useLocation();

    const [user, setUser] = useState(1);

    console.log(location);

    return (
        <header className='header'>
            <div className='headerContainer'>
                <div className='headerLogo'><img alt='' src='' /></div>
                <nav className='navBar'>

                </nav>
                <div className='userInfo'>
                    {
                        user ?
                            <>
                                <Link to={`/jugador/${user.team_id}`}>MI EQUIPO</Link>
                                <div className='userImage'>
                                    <img className='userLogo' src={user.image} alt='' />
                                </div>
                            </>
                        :
                            <>
                                <Link to={'/register'}>REGISTRARSE</Link>
                                <Link to={'/login'}>INICIAR SESION</Link>
                            </>
                    }
                </div>
            </div>
        </header>
    )
}

export default Header