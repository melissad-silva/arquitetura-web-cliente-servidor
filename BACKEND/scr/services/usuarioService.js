const obterTodosUsuarios = async () => {
    const mockUsuarios = [
        {
            id: 1,
            nome: 'Melissa Dias',
            email: 'melissa@email.com',
        },
        {
            id: 2,
            nome: 'Gabriel Freitas',
            email: 'gabriel@email.com',
        }
    ]

    return mockUsuarios;
};

module.exports = {
    obterTodosUsuarios,
};