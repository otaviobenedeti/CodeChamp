const prisma = require("../data/prisma");
const bcrypt = require("bcryptjs");


// ==============================
// CADASTRAR
// ==============================
const cadastrar = async (req, res) => {

    try {

        const {
            name,
            username,
            email,
            password
        } = req.body;

        if (
            !name ||
            !username ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                erro: "Preencha todos os campos obrigatórios."
            });
        }

        const usuarioExistente =
            await prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        { username }
                    ]
                }
            });

        if (usuarioExistente) {

            if (usuarioExistente.email === email) {
                return res.status(400).json({
                    erro: "Este email já está cadastrado."
                });
            }

            if (
                usuarioExistente.username ===
                username
            ) {
                return res.status(400).json({
                    erro: "Este nome de usuário já está cadastrado."
                });
            }
        }

        const senhaHash =
            await bcrypt.hash(password, 10);

        const item =
            await prisma.user.create({
                data: {
                    name,
                    username,
                    email,
                    password: senhaHash
                }
            });

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            user: {
                id: item.id,
                name: item.name,
                username: item.username,
                email: item.email,
                role: item.role
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao cadastrar usuário."
        });
    }
};


// ==============================
// LOGIN
// ==============================
const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                erro: "Email e senha são obrigatórios."
            });
        }

        const user =
            await prisma.user.findUnique({
                where: {
                    email
                }
            });

        if (!user) {

            return res.status(401).json({
                erro: "Email ou senha incorretos."
            });
        }

        const senhaCorreta =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!senhaCorreta) {

            return res.status(401).json({
                erro: "Email ou senha incorretos."
            });
        }

        return res.status(200).json({

            mensagem: "Login realizado com sucesso!",

            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl
            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao realizar login."
        });
    }
};


// ==============================
// LISTAR
// ==============================
const listar = async (req, res) => {

    try {

        const lista =
            await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    role: true,
                    avatarUrl: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

        return res.status(200).json(lista);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao listar usuários."
        });
    }
};


// ==============================
// BUSCAR
// ==============================
const buscar = async (req, res) => {

    try {

        const { id } = req.params;

        const item =
            await prisma.user.findUnique({
                where: {
                    id
                }
            });

        if (!item) {

            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        return res.status(200).json(item);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao buscar usuário."
        });
    }
};


// ==============================
// ATUALIZAR
// ==============================
const atualizar = async (req, res) => {

    try {

        const { id } = req.params;
        const dados = req.body;

        const item =
            await prisma.user.update({
                where: {
                    id
                },
                data: dados
            });

        return res.status(200).json(item);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao atualizar usuário."
        });
    }
};


// ==============================
// EXCLUIR
// ==============================
const excluir = async (req, res) => {

    try {

        const { id } = req.params;

        const item =
            await prisma.user.delete({
                where: {
                    id
                }
            });

        return res.status(200).json(item);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao excluir usuário."
        });
    }
};


module.exports = {
    cadastrar,
    login,
    listar,
    buscar,
    atualizar,
    excluir
};