function adminMiddleware(req, res, next) {

    if (!req.user) {
        return res.status(401).json({
            message: "Usuário não autenticado"
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Acesso permitido apenas para administradores"
        });
    }

    next();
}

module.exports = adminMiddleware;