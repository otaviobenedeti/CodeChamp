const prisma = require("../data/prisma");

const salvarResposta = async (req, res) => {
    const { questionNumber, questionText, answerText } = req.body || {};

    if (
        !Number.isInteger(questionNumber) ||
        questionNumber < 1 ||
        typeof questionText !== "string" ||
        !questionText.trim() ||
        typeof answerText !== "string" ||
        !answerText.trim()
    ) {
        return res.status(400).json({ erro: "Dados da resposta inválidos." });
    }

    try {
        const resposta = await prisma.quizAnswer.create({
            data: {
                userId: req.user.id,
                questionNumber,
                questionText: questionText.trim(),
                answerText: answerText.trim()
            }
        });

        return res.status(201).json({
            id: resposta.id,
            questionNumber: resposta.questionNumber,
            answeredAt: resposta.answeredAt
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Não foi possível salvar a resposta." });
    }
};

module.exports = { salvarResposta };
