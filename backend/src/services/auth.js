const prisma = require("../data/prisma");
const {
    hashPassword,
    comparePassword
} = require("../utils/password");
const { generateToken } = require("../utils/jwt");

async function register({ name, username, email, password, avatarUrl }) {

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });

    if (existingUser) {
        throw new Error("Email ou username já cadastrado");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            username,
            email,
            password: hashedPassword,
            avatarUrl: avatarUrl || null
        }
    });

    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
    };
}

async function login({ email, password }) {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new Error("Email ou senha inválidos");
    }

    const passwordIsValid = await comparePassword(
        password,
        user.password
    );

    if (!passwordIsValid) {
        throw new Error("Email ou senha inválidos");
    }

    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl
        },
        token
    };
}

module.exports = {
    register,
    login
};  
