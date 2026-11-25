const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { salvarResposta } = require("../controllers/quiz.controller");

const router = express.Router();

router.post("/respostas", authMiddleware, salvarResposta);

module.exports = router;
