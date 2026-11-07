import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import { olvidePassword } from '../../assets/endPoints/auth.js';
import '../../assets/styles/formularios.css';
import useTitulo from '../useTitulo';

// Pedir el link para cambiar la contraseña. La API responde lo mismo exista o no la cuenta,
// así que el mensaje tampoco lo dice
const OlvidePassword = () => {
    useTitulo('Olvidé mi contraseña');
    const [params] = useSearchParams();
    const [email, setEmail] = useState(params.get('email') ?? '');
    const [enviado, setEnviado] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const pedir = async (e) => {
        e?.preventDefault();
        setError('');
        setLoading(true);
        const data = await olvidePassword(email.trim());
        setLoading(false);

        if (!data || data.error) return setError(data?.error || 'No pudimos conectar con el servidor');
        setEnviado(email.trim());
    };

    if (enviado) return (
        <div className='form-page'>
            <h1>Revisá tu email</h1>
            <div className='form'>
                <p>Si hay una cuenta con <strong className='recuperar__email'>{enviado}</strong>, te mandamos un link para elegir una contraseña nueva.</p>
                <p className='muted'>El link vale por 1 hora y se puede usar una sola vez. Si no lo ves en unos minutos, revisá la carpeta de spam.</p>
                {error && <p className='form__error' role='alert'>{error}</p>}
                <button className='btn btn--secundario' type='button' disabled={loading} onClick={() => pedir()}>
                    {loading ? 'Un momento...' : 'Mandarlo de nuevo'}
                </button>
            </div>
            <p><Link to={`/login?email=${encodeURIComponent(enviado)}`}>Volver a iniciar sesión</Link></p>
        </div>
    );

    return (
        <div className='form-page'>
            <h1>Olvidé mi contraseña</h1>
            <p>Ingresá el email de tu cuenta y te mandamos un link para elegir una nueva.</p>

            <form className='form' onSubmit={pedir}>
                <label htmlFor='email'>Email</label>
                <input id='email' type='email' required autoComplete='email' value={email} onChange={(e) => setEmail(e.target.value)} />

                {error && <p className='form__error' role='alert'>{error}</p>}

                <button className='btn btn--primary' type='submit' disabled={loading}>
                    {loading ? 'Un momento...' : 'Mandarme el link'}
                </button>
            </form>

            <p><Link to={`/login${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ''}`}>Volver a iniciar sesión</Link></p>
        </div>
    )
}

export default OlvidePassword;
