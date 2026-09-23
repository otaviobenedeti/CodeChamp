const express = require("express");

const router = express.Router();

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


module.exports = router;