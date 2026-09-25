const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const { 
    cadastrar, 
    listar, 
    buscar, 
    atualizar, 
    excluir } = require("../controllers/lesson.controller");
=======
const {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
} = require("../controllers/lesson.controller");
>>>>>>> 4c1e9a9475e3f365fa9321720676129c59bd3f3c

router.post("/cadastrar", authMiddleware, adminMiddleware, cadastrar);
router.get("/listar", authMiddleware, listar);
router.get("/buscar/:id", authMiddleware, buscar);
router.put("/atualizar/:id", authMiddleware, adminMiddleware, atualizar);
router.delete("/excluir/:id", authMiddleware, adminMiddleware, excluir);

module.exports = router;