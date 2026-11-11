function Avatar({ nome, foto, className = '' }) {
    if (foto) {
        return <img className={className} src={foto} alt={`Foto de ${nome || 'usuário'}`} />;
    }

    return (
        <span className={`${className} avatar-placeholder`}>
            {(nome || '?').charAt(0).toUpperCase()}
        </span>
    );
}

export default Avatar;
