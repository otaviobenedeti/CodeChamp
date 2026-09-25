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
    excluir } = require("../controllers/user.controller");

router.post("/cadastrar", authMiddleware, adminMiddleware, cadastrar);
router.get("/listar", authMiddleware, listar);
router.get("/buscar/:id", authMiddleware, buscar);
router.put("/atualizar/:id", authMiddleware, adminMiddleware, atualizar);
router.delete("/excluir/:id", authMiddleware, adminMiddleware, excluir);
=======
const {
    cadastrar,
    login,
    listar,
    buscar,
    atualizar,
    excluir
} = require("../controllers/user.controller");


router.post("/cadastrar", cadastrar);

router.post("/login", login);

router.get("/listar", listar);

router.get("/buscar/:id", buscar);

router.put("/atualizar/:id", atualizar);

router.delete("/excluir/:id", excluir);
>>>>>>> 4c1e9a9475e3f365fa9321720676129c59bd3f3c


module.exports = router;