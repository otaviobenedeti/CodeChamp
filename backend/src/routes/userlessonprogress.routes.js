const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const { 
    cadastrar, 
    listar, 
    buscar, 
    atualizar, 
    excluir } = require("../controllers/userlessonprogress.controller");

router.post("/cadastrar", authMiddleware, adminMiddleware, cadastrar);
router.get("/listar", authMiddleware, listar);
router.get("/buscar/:id", authMiddleware, buscar);
router.put("/atualizar/:id", authMiddleware, adminMiddleware, atualizar);
router.delete("/excluir/:id", authMiddleware, adminMiddleware, excluir);

module.exports = router;
