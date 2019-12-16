
class Base {
    constructor(element) {
        this.element = element;
    }
}

class Quiz extends Base {
    constructor(element, callback) {
        super(element);
        this.callback = callback || function () { };
        this.selectedAnswer = -1;
        this.alternatives = Array.prototype.slice.call(this.element.querySelectorAll('.alternative'));

        this.feedback = {
            positive: this.element.querySelector('.feedback.feedback-positive'),
            negative: this.element.querySelector('.feedback.feedback-negative'),
        }
        this.feedbacks = Array.prototype.slice.call(this.element.querySelectorAll('.feedback'));

        this.feedbacks.forEach(feed => feed.classList.add('hide'));

        this.buttonSubmit = this.element.querySelector('.quiz-submit');
        this.buttonSubmit.classList.add('hide');

        this.answer = this.element.getAttribute('data-answer');
        this.element.removeAttribute('data-answer');

        this.addBehaviors();
    }

    addBehaviors() {
        this.buttonSubmit.addEventListener('click', () => this.submit());
        this.alternatives.forEach((alternative, index) => alternative.addEventListener('click', () => this.selectAnswer(alternative, index)));
    }

    submit() {
        let result = this.calcResult()
        this.showFeedback(result ? "positive" : "negative");
        this.element.classList.add("lock");
        this.callback(result);
    }

    showFeedback(type) {
        this.feedback[type].classList.remove('hide');
    };

    calcResult() { return this.selectedAnswer == this.answer; }

    selectAnswer(alternative, index) {
        this.clearSelection();
        alternative.classList.add('selected');
        this.selectedAnswer = index;
        this.buttonSubmit.classList.remove('hide');
    }
    clearSelection() {
        this.selectedAnswer = -1;
        this.alternatives.forEach(alternative => alternative.classList.remove('selected'));
    }
}

class QuizSet extends Base {
    constructor(element) {
        super(element);
        MakeSlider(element);
        this.scoreElement = this.element.querySelector("#score");
        this.score = 0;
        this.quizes = Array.prototype.slice.call(this.element.querySelectorAll('.quiz'))
            .map((element, index) => this.buildQuiz(element, index));

    }
    addScore(score) {
        if (score) {
            this.score++;
        }
        this.scoreElement.innerHTML = this.score;
        if(this.score/this.quizes.length<0.7){
            this.element.querySelector('.quiz-end .feedback').classList.add('feedback-negative');
        }
    }
    buildQuiz(element, index) {
        let quiz = new Quiz(element, this.addScore.bind(this));
        quiz.element.addEventListener('quizSubmit', console.log);
        return quiz;
    }
}

