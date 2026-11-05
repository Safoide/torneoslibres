import React, { useState } from 'react'
import '../assets/styles/avatar.css';

// Muestra el logo y, si no hay o falla la carga, la inicial del nombre
const Avatar = ({ name = '', src, size = 32 }) => {
    const [failed, setFailed] = useState(false);
    const style = { width: size, height: size, fontSize: size * 0.45 };

    if (!src || failed) return <span className='avatar avatar--fallback' style={style}>{name.charAt(0).toUpperCase()}</span>;

    return <img className='avatar' style={style} src={src} alt={name} onError={() => setFailed(true)} />;
};

export default Avatar;
