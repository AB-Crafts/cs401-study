/**
 * Reusable retrieval-practice quiz widget for CS401 lessons.
 *
 * Usage:
 *   <div class="interactive-card" data-quiz>
 *     ...
 *   </div>
 *   <script src="../assets/quiz.js"></script>
 *   <script>
 *     renderQuiz(document.querySelector('[data-quiz]'), [
 *       {
 *         prompt: "Question text?",
 *         options: ["Opt A", "Opt B", "Opt C", "Opt D"],
 *         answer: 1,
 *         explanation: "Why Opt B is correct."
 *       }
 *     ]);
 *   </script>
 */
(function () {
  function renderQuiz(container, questions) {
    if (!container || !Array.isArray(questions)) return;

    const state = {
      answered: new Array(questions.length).fill(null),
      firstTryCorrect: new Array(questions.length).fill(null)
    };

    const body = document.createElement("div");
    const scoreBar = document.createElement("div");
    scoreBar.className = "quiz-scorebar";

    const scoreText = document.createElement("span");
    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "btn btn-secondary";
    resetBtn.textContent = "Reset Quiz";

    function updateScore() {
      const done = state.answered.filter((v) => v !== null).length;
      const right = state.answered.filter((v, i) => v === questions[i].answer).length;
      scoreText.textContent = `Solved: ${right} / ${questions.length} (${done} attempted)`;
    }

    function build() {
      body.innerHTML = "";
      questions.forEach((q, qIdx) => {
        const qEl = document.createElement("div");
        qEl.className = "quiz-question";

        const promptEl = document.createElement("div");
        promptEl.className = "quiz-prompt";
        promptEl.textContent = `${qIdx + 1}. ${q.prompt}`;
        qEl.appendChild(promptEl);

        const optsEl = document.createElement("div");
        optsEl.className = "quiz-options";

        const fbEl = document.createElement("div");
        fbEl.className = "quiz-feedback";

        q.options.forEach((optText, oIdx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "quiz-option";
          btn.textContent = optText;

          btn.addEventListener("click", () => {
            const buttons = optsEl.querySelectorAll(".quiz-option");
            buttons.forEach((b) => b.classList.remove("is-correct", "is-wrong"));

            const isCorrect = oIdx === q.answer;
            if (state.firstTryCorrect[qIdx] === null) {
              state.firstTryCorrect[qIdx] = isCorrect;
            }
            state.answered[qIdx] = oIdx;

            if (isCorrect) {
              btn.classList.add("is-correct");
              fbEl.className = "quiz-feedback show ok";
              fbEl.textContent = `Correct. ${q.explanation}`;
            } else {
              btn.classList.add("is-wrong");
              fbEl.className = "quiz-feedback show err";
              fbEl.textContent = `Not quite — try again. Hint: ${q.hint || "Re-check the bus roles above."}`;
            }
            updateScore();
          });

          optsEl.appendChild(btn);
        });

        qEl.appendChild(optsEl);
        qEl.appendChild(fbEl);
        body.appendChild(qEl);
      });
      updateScore();
    }

    resetBtn.addEventListener("click", () => {
      state.answered.fill(null);
      state.firstTryCorrect.fill(null);
      build();
    });

    scoreBar.appendChild(scoreText);
    scoreBar.appendChild(resetBtn);
    container.appendChild(body);
    container.appendChild(scoreBar);
    build();
  }

  window.renderQuiz = renderQuiz;
})();
