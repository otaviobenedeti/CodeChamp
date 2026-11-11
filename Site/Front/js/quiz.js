const questions = [
    {
        question: "Qual linguagem é usada para estruturar uma página web?",
        answers: [
            { id: 1, text: "CSS", correct:false},
            { id: 2, text: "HTML", correct:true},
            { id: 3, text: "JavaScript", correct:false},
            { id: 4, text: "SQL", correct:false},
        ],
    },
    {
    question: "Qual linguagem é responsável pela estilização de uma página web?",
    answers: [
        { id: 1, text: "HTML", correct: false },
        { id: 2, text: "CSS", correct: true },
        { id: 3, text: "JavaScript", correct: false },
        { id: 4, text: "Python", correct: false },
    ],
},

{
    question: "Qual linguagem é usada para adicionar interatividade a uma página web?",
    answers: [
        { id: 1, text: "HTML", correct: false },
        { id: 2, text: "CSS", correct: false },
        { id: 3, text: "JavaScript", correct: true },
        { id: 4, text: "SQL", correct: false },
    ],
},

{
    question: "Qual propriedade CSS altera a cor do texto?",
    answers: [
        { id: 1, text: "background-color", correct: false },
        { id: 2, text: "font-color", correct: false },
        { id: 3, text: "text-color", correct: false },
        { id: 4, text: "color", correct: true },
    ],
},

{
    question: "Qual propriedade CSS altera o tamanho do texto?",
    answers: [
        { id: 1, text: "font-size", correct: true },
        { id: 2, text: "text-size", correct: false },
        { id: 3, text: "font-height", correct: false },
        { id: 4, text: "size-font", correct: false },
    ],
},

{
    question: "Qual comando JavaScript mostra uma mensagem no console?",
    answers: [
        { id: 1, text: "print()", correct: false },
        { id: 2, text: "console.log()", correct: true },
        { id: 3, text: "show()", correct: false },
        { id: 4, text: "message()", correct: false },
    ],
},

{
    question: "Qual propriedade CSS cria espaço interno dentro de um elemento?",
    answers: [
        { id: 1, text: "margin", correct: false },
        { id: 2, text: "padding", correct: true },
        { id: 3, text: "border", correct: false },
        { id: 4, text: "spacing", correct: false },
    ],
},

{
    question: "Qual propriedade CSS é usada para ativar o Flexbox?",
    answers: [
        { id: 1, text: "display: flex", correct: true },
        { id: 2, text: "position: flex", correct: false },
        { id: 3, text: "layout: flex", correct: false },
        { id: 4, text: "flex: display", correct: false },
    ],
},

{
    question: "Qual símbolo representa uma classe no CSS?",
    answers: [
        { id: 1, text: "#", correct: false },
        { id: 2, text: ".", correct: true },
        { id: 3, text: "@", correct: false },
        { id: 4, text: "*", correct: false },
    ],
},

{
    question: "Qual símbolo representa um ID no CSS?",
    answers: [
        { id: 1, text: ".", correct: false },
        { id: 2, text: "#", correct: true },
        { id: 3, text: "@", correct: false },
        { id: 4, text: "$", correct: false },
    ],
},

{
    question: "Qual método JavaScript seleciona um elemento pelo seu ID?",
    answers: [
        { id: 1, text: "document.getElementById()", correct: true },
        { id: 2, text: "document.selectId()", correct: false },
        { id: 3, text: "document.getId()", correct: false },
        { id: 4, text: "getElement()", correct: false },
    ],
},

{
    question: "O que significa responsividade em um site?",
    answers: [
        { id: 1, text: "Ter muitas animações", correct: false },
        { id: 2, text: "Funcionar somente em computadores", correct: false },
        { id: 3, text: "Adaptar-se a diferentes tamanhos de tela", correct: true },
        { id: 4, text: "Usar somente JavaScript", correct: false },
    ],
},

{
    question: "Qual propriedade CSS arredonda os cantos de um elemento?",
    answers: [
        { id: 1, text: "corner-radius", correct: false },
        { id: 2, text: "border-radius", correct: true },
        { id: 3, text: "radius-border", correct: false },
        { id: 4, text: "round-corner", correct: false },
    ],
},
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Próxima";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);

    button.dataset.id = answer.id;

    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  answers = questions[currentQuestionIndex].answers;
  const correctAnswer = answers.filter((answer) => answer.correct == true)[0];
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.id == correctAnswer.id;
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function showScore() {
  resetState();
  questionElement.innerHTML = `Você acertou ${score} de ${questions.length}! Parabéns`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

startQuiz();
