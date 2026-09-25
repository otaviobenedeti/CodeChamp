require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const userquestionprogressRoutes = require("./src/routes/userquestionprogress.routes");

const questiontagRoutes = require("./src/routes/questiontag.routes");

const tagRoutes = require("./src/routes/tag.routes");

const questionoptionRoutes = require("./src/routes/questionoption.routes");

const multiplechoicequestionRoutes = require("./src/routes/multiplechoicequestion.routes");

const codewritingquestionRoutes = require("./src/routes/codewritingquestion.routes");

const bugfindingquestionRoutes = require("./src/routes/bugfindingquestion.routes");

const questionRoutes = require("./src/routes/question.routes");

const userlessonprogressRoutes = require("./src/routes/userlessonprogress.routes");

const lessonRoutes = require("./src/routes/lesson.routes");

const userpreferencesRoutes = require("./src/routes/userpreferences.routes");

const userRoutes = require("./src/routes/user.routes");

app.use("/userquestionprogress", userquestionprogressRoutes);

app.use("/questiontag", questiontagRoutes);

app.use("/tag", tagRoutes);

app.use("/questionoption", questionoptionRoutes);

app.use("/multiplechoicequestion", multiplechoicequestionRoutes);

app.use("/codewritingquestion", codewritingquestionRoutes);

app.use("/bugfindingquestion", bugfindingquestionRoutes);

app.use("/question", questionRoutes);

app.use("/userlessonprogress", userlessonprogressRoutes);

app.use("/lesson", lessonRoutes);

app.use("/userpreferences", userpreferencesRoutes);

const authRoutes = require("./routes/auth.routes");

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});