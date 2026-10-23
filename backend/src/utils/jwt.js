const jwt = require("jsonwebtoken");

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET não está configurado no arquivo .env");
    }

    return secret;
}

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        getJwtSecret(),
        {
            expiresIn: "1d"
        }
    );
}

function verifyToken(token) {
    return jwt.verify(token, getJwtSecret());
}

module.exports = {
    generateToken,
    verifyToken
};
