const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const { 
    cadastrar, 
    buscarMeuPerfil,
    atualizarMinhaFoto,
    listar, 
    buscar, 
    atualizar, 
    excluir } = require("../controllers/user.controller");

router.post("/cadastrar", authMiddleware, adminMiddleware, cadastrar);
router.get("/me", authMiddleware, buscarMeuPerfil);
router.put("/me/avatar", authMiddleware, atualizarMinhaFoto);
router.get("/listar", authMiddleware, listar);
router.get("/buscar/:id", authMiddleware, buscar);
router.put("/atualizar/:id", authMiddleware, adminMiddleware, atualizar);
router.delete("/excluir/:id", authMiddleware, adminMiddleware, excluir);


module.exports = router;
