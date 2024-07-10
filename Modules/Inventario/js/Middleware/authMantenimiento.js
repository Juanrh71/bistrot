const jwt = require('jsonwebtoken');

// Middleware para verificar y decodificar el token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extraer el token de Authorization: Bearer <token>

        jwt.verify(token, 'secret_key', (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Token inválido' });
            }
            req.usuario = decoded; // Establecer el usuario decodificado en el objeto de solicitud
            next();
        });
    } else {
        res.status(401).json({ error: 'Token de autenticación no proporcionado' });
    }
}

// Middleware para verificar los permisos de acceso para mantenimiento
function checkMantenimientoPermission(req, res, next) {
    const usuario = req.usuario;

    if (usuario && usuario.usuario === 'mantenimiento') {
        next(); // Si el usuario es del equipo de mantenimiento, permitir el acceso
    } else {
        res.status(403).send('Acceso denegado. Solo el equipo de mantenimiento puede realizar esta acción');
    }
}

module.exports = {
    verifyToken,
    checkMantenimientoPermission
};
