var state = {
  questions: [
    {
      text: "Who has the most wins as a head coach in the NFL?",
      choices: ["George Halas", "Don Shula", "Bill Belichick", "Jimmy Johnson"],
      correctChoiceIndex: 1
    },
    {
      text: "What pick in the 2000 NFL Draft was Tom Brady selected",
      choices: ["10", "199", "250", "undrafted"],
      correctChoiceIndex: 1
    },
    {
      text: "Which NFL quarterback has thrown the most interceptions?",
      choices: ["Peyton Manning", "John Elway", "Brett Favre", "Vinny Testaverde"],
      correctChoiceIndex: 2,
    },
    {
      text: "Who holds the record for most rushing yards in a single game?",
      choices: ["O.J. Simpson", "Barry Sanders", "Walter Peyton", "Adrian Peterson"],
      correctChoiceIndex: 3,
    },
    {
      text: "What number does quarterback Carson Wentz wear",
      choices: ["1", "7", "12", "11"],
      correctChoiceIndex: 3,
    },
    {
      text: "Which NFL team features a helmet decal only on one side of the helmet?",
      choices: ["Pittsburgh Steelers", "Philadelphia Eagles", "New England Patriots", "Houston Texans"],
      correctChoiceIndex: 0,
    },
    {
      text: "What year did the Miami Dolphins have their famed undefeted season?",
      choices: ["1960", "1965", "1972", "1975"],
      correctChoiceIndex: 2,
    },
    {
      text: "Which NFL team has won the most Super Bowls?",
      choices: ["New England Patriots", "San Francisco 49ers", "Dallas Cowboys", "Pittsburgh Steelers"],
      correctChoiceIndex: 3,
    },
    {
      text: "What Quarterback has thrown the most touchdowns in league history?",
      choices: ["Tom Brady", "Peyton Manning", "Drew Brees", "Brett Favre"],
      correctChoiceIndex: 1,      
    },
    {
      text: "What player of any position has the most touchdowns in league histoy?",
      choices: ["Emmitt Smith", "Randy Moss", "Jerry Rice", "Jim Brown"],
      correctChoiceIndex: 2,
    },
  ],

  praises: [
    "That answer was correct! Please continue!",
  ],

  admonishments: [
    "That answer was incorrect....sorry! Please continue!"
  ],
  score: 0,
  currentQuestionIndex: 0,
  route: 'start',
  lastAnswerCorrect: false,
  feedbackRandom: 0
};

function setRoute(state, route) {
  state.route = route;
};

function resetGame(state) {
  state.score = 0;
  state.currentQuestionIndex = 0;
  setRoute(state, 'start');
};

function answerQuestion(state, answer) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;
  if (state.lastAnswerCorrect) {
    state.score++;
  }
  selectFeedback(state);
  setRoute(state, 'answer-feedback');
};

function selectFeedback(state) {
  state.feedbackRandom = Math.random();
};

function advance(state) {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex === state.questions.length) {
    setRoute(state, 'final-feedback');
  }
  else {
    setRoute(state, 'question');
  }
};

//took me some time to figure out the render function and the for loop
function renderApp(state, elements) {
  Object.keys(elements).forEach(function(route) {
    elements[route].hide();
  });
  elements[state.route].show();
  if (state.route === 'start') {
      renderStartPage(state, elements[state.route]);
  }
  else if (state.route === 'question') {
      renderQuestionPage(state, elements[state.route]);
  }
  else if (state.route === 'answer-feedback') {
    renderAnswerFeedbackPage(state, elements[state.route]);
  }
  else if (state.route === 'final-feedback') {
    renderFinalFeedbackPage(state, elements[state.route]);
  }
};

function renderFinalFeedbackPage(state, element) {
  renderFinalFeedbackText(state, element.find('.results-text'));
};

function renderAnswerFeedbackPage(state, element) {
  renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
  renderAnswerFeedbackText(state, element.find(".feedback-text"));
  renderNextButtonText(state, element.find(".see-next"));
};

function renderQuestionPage(state, element) {
  renderQuestionCount(state, element.find('.question-count'));
  renderQuestionText(state, element.find('.question-text'));
  renderChoices(state, element.find('.choices'));
};

function renderQuestionCount(state, element) {
  var text = (state.currentQuestionIndex + 1) + "/" + state.questions.length;
  element.text(text);
};

function renderQuestionText(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  element.text(currentQuestion.text);
};

function renderChoices(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  var choices = currentQuestion.choices.map(function(choice, index) {
    return (
      '<li>' +
        '<input type="radio" name="user-answer" value="' + index + '" required>' +
        '<label>' + choice + '</label>' +
      '</li>'
    );
  });
  element.html(choices);
};

function renderAnswerFeedbackHeader(state, element) {
  var html = state.lastAnswerCorrect ?
      "<h6 class='user-was-correct'>Correct!</h6>" :
      "<h1 class='user-was-incorrect'>Incorrect!</>";

  element.html(html);
};

function renderNextButtonText(state, element) {
    var text = state.currentQuestionIndex < state.questions.length - 1 ?
      "Next" : "How did I do?";
  element.text(text);
};

function renderAnswerFeedbackText(state, element) {
  var choices = state.lastAnswerCorrect ? state.praises : state.admonishments;
  var text = choices[Math.floor(state.feedbackRandom * choices.length)];
  element.text(text);
};

function renderFinalFeedbackText(state, element) {
  var text = "You got " + state.score + " out of " +
    state.questions.length + " questions correct.";
  element.text(text);
};