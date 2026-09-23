const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        const data = req.body;

        const item = await prisma.lesson.create({
            data
        });

        res.status(201).json(item);

    } catch (error) {
        console.error("Erro ao cadastrar aula:", error);

        res.status(500).json({
            erro: "Erro ao cadastrar aula"
        });
    }
};


const listar = async (req, res) => {
    try {

        const lista = await prisma.lesson.findMany({
            orderBy: {
                order: "asc"
            }
        });

        res.status(200).json(lista);

    } catch (error) {

        console.error("Erro ao listar aulas:", error);

        res.status(500).json({
            erro: "Erro ao listar aulas"
        });
    }
};


const buscar = async (req, res) => {
    try {

        const { id } = req.params;

        const item = await prisma.lesson.findUnique({
            where: {
                id: id
            }
        });

        if (!item) {
            return res.status(404).json({
                erro: "Aula não encontrada"
            });
        }

        res.status(200).json(item);

    } catch (error) {

        console.error("Erro ao buscar aula:", error);

        res.status(500).json({
            erro: "Erro ao buscar aula"
        });
    }
};


const atualizar = async (req, res) => {
    try {

        const { id } = req.params;
        const dados = req.body;

        const item = await prisma.lesson.update({
            where: {
                id: id
            },
            data: dados
        });

        res.status(200).json(item);

    } catch (error) {

        console.error("Erro ao atualizar aula:", error);

        res.status(500).json({
            erro: "Erro ao atualizar aula"
        });
    }
};


const excluir = async (req, res) => {
    try {

        const { id } = req.params;

        console.log("Tentando excluir aula:", id);

        const aula = await prisma.lesson.findUnique({
            where: {
                id: id
            }
        });

        if (!aula) {
            return res.status(404).json({
                erro: "Aula não encontrada"
            });
        }

        await prisma.lesson.delete({
            where: {
                id: id
            }
        });

        console.log("Aula excluída:", id);

        res.status(200).json({
            mensagem: "Aula excluída com sucesso"
        });

    } catch (error) {

        console.error("Erro ao excluir aula:", error);

        res.status(500).json({
            erro: "Erro ao excluir aula",
            detalhe: error.message
        });
    }
};


module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};