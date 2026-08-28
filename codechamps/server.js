require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const achievementRoutes = require('./src/routes/achievement.routes');

app.use('/achievement', achievementRoutes);


const lessonRoutes = require('./src/routes/lesson.routes');

app.use('/lesson', lessonRoutes);


const tagRoutes = require('./src/routes/tag.routes');

app.use('/tag', tagRoutes);


const questionRoutes = require('./src/routes/question.routes');

app.use('/question', questionRoutes);


const userRoutes = require('./src/routes/user.routes');

app.use('/user', userRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
