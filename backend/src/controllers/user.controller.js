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
// PERFIL DO USUÁRIO AUTENTICADO
// ==============================
const buscarMeuPerfil = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                avatarUrl: true
            }
        });

        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro ao buscar perfil." });
    }
};

const atualizarMinhaFoto = async (req, res) => {
    try {
        const { avatarUrl } = req.body || {};
        const imagemValida = typeof avatarUrl === "string" &&
            /^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(avatarUrl);

        if (avatarUrl !== null && !imagemValida) {
            return res.status(400).json({ erro: "Envie uma imagem válida ou null para remover." });
        }

        if (imagemValida) {
            const conteudoBase64 = avatarUrl.substring(avatarUrl.indexOf(",") + 1);
            const tamanhoBytes = Buffer.from(conteudoBase64, "base64").length;
            if (tamanhoBytes > 5 * 1024 * 1024) {
                return res.status(400).json({ erro: "A imagem deve ter no máximo 5 MB." });
            }
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { avatarUrl },
            select: { id: true, avatarUrl: true }
        });

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro ao salvar a foto de perfil." });
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
    buscarMeuPerfil,
    atualizarMinhaFoto,
    listar,
    buscar,
    atualizar,
    excluir
};
