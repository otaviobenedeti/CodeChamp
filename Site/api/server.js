require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const avaliacaocodigoRoutes = require('./src/routes/avaliacaocodigo.routes');

app.use('/avaliacaocodigo', avaliacaocodigoRoutes);


const codigosRoutes = require('./src/routes/codigos.routes');

app.use('/codigos', codigosRoutes);


const listagemdesafioRoutes = require('./src/routes/listagemdesafio.routes');

app.use('/listagemdesafio', listagemdesafioRoutes);


const desafiosRoutes = require('./src/routes/desafios.routes');

app.use('/desafios', desafiosRoutes);


const rankingRoutes = require('./src/routes/ranking.routes');

app.use('/ranking', rankingRoutes);


const perfilusuarioRoutes = require('./src/routes/perfilusuario.routes');

app.use('/perfilusuario', perfilusuarioRoutes);


const cadastroRoutes = require('./src/routes/cadastro.routes');

app.use('/cadastro', cadastroRoutes);


const loginRoutes = require('./src/routes/login.routes');

app.use('/login', loginRoutes);


const usuariosRoutes = require('./src/routes/usuarios.routes');

app.use('/usuarios', usuariosRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
