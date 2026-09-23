require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const userquestionprogressRoutes = require('./src/routes/userquestionprogress.routes');

app.use('/userquestionprogress', userquestionprogressRoutes);


const questiontagRoutes = require('./src/routes/questiontag.routes');

app.use('/questiontag', questiontagRoutes);


const tagRoutes = require('./src/routes/tag.routes');

app.use('/tag', tagRoutes);


const questionoptionRoutes = require('./src/routes/questionoption.routes');

app.use('/questionoption', questionoptionRoutes);


const multiplechoicequestionRoutes = require('./src/routes/multiplechoicequestion.routes');

app.use('/multiplechoicequestion', multiplechoicequestionRoutes);


const codewritingquestionRoutes = require('./src/routes/codewritingquestion.routes');

app.use('/codewritingquestion', codewritingquestionRoutes);


const bugfindingquestionRoutes = require('./src/routes/bugfindingquestion.routes');

app.use('/bugfindingquestion', bugfindingquestionRoutes);


const questionRoutes = require('./src/routes/question.routes');

app.use('/question', questionRoutes);


const userlessonprogressRoutes = require('./src/routes/userlessonprogress.routes');

app.use('/userlessonprogress', userlessonprogressRoutes);


const lessonRoutes = require('./src/routes/lesson.routes');

app.use('/lesson', lessonRoutes);


const userpreferencesRoutes = require('./src/routes/userpreferences.routes');

app.use('/userpreferences', userpreferencesRoutes);


const userRoutes = require('./src/routes/user.routes');

app.use('/user', userRoutes);


const userquestionprogressRoutes = require('./src/routes/userquestionprogress.routes');

app.use('/userquestionprogress', userquestionprogressRoutes);


const questiontagRoutes = require('./src/routes/questiontag.routes');

app.use('/questiontag', questiontagRoutes);


const tagRoutes = require('./src/routes/tag.routes');

app.use('/tag', tagRoutes);


const questionoptionRoutes = require('./src/routes/questionoption.routes');

app.use('/questionoption', questionoptionRoutes);


const multiplechoicequestionRoutes = require('./src/routes/multiplechoicequestion.routes');

app.use('/multiplechoicequestion', multiplechoicequestionRoutes);


const codewritingquestionRoutes = require('./src/routes/codewritingquestion.routes');

app.use('/codewritingquestion', codewritingquestionRoutes);


const bugfindingquestionRoutes = require('./src/routes/bugfindingquestion.routes');

app.use('/bugfindingquestion', bugfindingquestionRoutes);


const questionRoutes = require('./src/routes/question.routes');

app.use('/question', questionRoutes);


const userlessonprogressRoutes = require('./src/routes/userlessonprogress.routes');

app.use('/userlessonprogress', userlessonprogressRoutes);


const lessonRoutes = require('./src/routes/lesson.routes');

app.use('/lesson', lessonRoutes);


const userpreferencesRoutes = require('./src/routes/userpreferences.routes');

app.use('/userpreferences', userpreferencesRoutes);


const userRoutes = require('./src/routes/user.routes');

app.use('/user', userRoutes);


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
