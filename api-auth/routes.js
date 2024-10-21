// Usa la clave privada para firmar o crear token
// Usa la clave publica para verifica y validdar el token

const express = require('express');
const { createUser, getUserByEmailAndPassword } = require('./database/querys');
const jwt = require('jsonwebtoken');
const { User } = require('./models');
const env = require('./config');
const router = express.Router();

// Ruta de registro de usuario (POST /register)
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    try {
        const newUser = await createUser(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// Ruta de inicio de sesión (POST /login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Email y contraseña son obligatorios' });
    }

    try {
        const result = await getUserByEmailAndPassword(email, password);
        if (result.code === 0 || result.code === 1) {
            return res.status(401).json({ msg: result.msg });
        }

        // Generar token JWT
        const token = jwt.sign({ id: result.user.id, role: result.user.role, name: result.user.username }, env.PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '1h' });

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ msg: 'Token no proporcionado' });
    }

    jwt.verify(token, env.PUBLIC_KEY, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: 'Token inválido' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};



// Middleware para verificar roles
const checkRole = (role) => (req, res, next) => {
    if (req.userRole !== role) {
        return res.status(403).json({ msg: 'No tienes permiso para acceder a esta ruta' });
    }
    next();
};

// Ejemplo de una ruta protegida (solo para usuarios con rol 'empresa')
router.get('/admin', verifyToken, checkRole('empresa'), async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        res.json({ user });
    } catch (error) {
        res.status(500).json({ msg: 'Error obteniendo datos del usuario' });
    }
});

module.exports = router;
