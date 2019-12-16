"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Base = function Base(element) {
  _classCallCheck(this, Base);

  this.element = element;
};

var Quiz =
/*#__PURE__*/
function (_Base) {
  _inherits(Quiz, _Base);

  function Quiz(element, callback) {
    var _this;

    _classCallCheck(this, Quiz);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Quiz).call(this, element));

    _this.callback = callback || function () {};

    _this.selectedAnswer = -1;
    _this.alternatives = Array.prototype.slice.call(_this.element.querySelectorAll('.alternative'));
    _this.feedback = {
      positive: _this.element.querySelector('.feedback.feedback-positive'),
      negative: _this.element.querySelector('.feedback.feedback-negative')
    };
    _this.feedbacks = Array.prototype.slice.call(_this.element.querySelectorAll('.feedback'));

    _this.feedbacks.forEach(function (feed) {
      return feed.classList.add('hide');
    });

    _this.buttonSubmit = _this.element.querySelector('.quiz-submit');

    _this.buttonSubmit.classList.add('hide');

    _this.answer = _this.element.getAttribute('data-answer');

    _this.element.removeAttribute('data-answer');

    _this.addBehaviors();

    return _this;
  }

  _createClass(Quiz, [{
    key: "addBehaviors",
    value: function addBehaviors() {
      var _this2 = this;

      this.buttonSubmit.addEventListener('click', function () {
        return _this2.submit();
      });
      this.alternatives.forEach(function (alternative, index) {
        return alternative.addEventListener('click', function () {
          return _this2.selectAnswer(alternative, index);
        });
      });
    }
  }, {
    key: "submit",
    value: function submit() {
      var result = this.calcResult();
      this.showFeedback(result ? "positive" : "negative");
      this.element.classList.add("lock");
      this.callback(result);
    }
  }, {
    key: "showFeedback",
    value: function showFeedback(type) {
      this.feedback[type].classList.remove('hide');
    }
  }, {
    key: "calcResult",
    value: function calcResult() {
      return this.selectedAnswer == this.answer;
    }
  }, {
    key: "selectAnswer",
    value: function selectAnswer(alternative, index) {
      this.clearSelection();
      alternative.classList.add('selected');
      this.selectedAnswer = index;
      this.buttonSubmit.classList.remove('hide');
    }
  }, {
    key: "clearSelection",
    value: function clearSelection() {
      this.selectedAnswer = -1;
      this.alternatives.forEach(function (alternative) {
        return alternative.classList.remove('selected');
      });
    }
  }]);

  return Quiz;
}(Base);

var QuizSet =
/*#__PURE__*/
function (_Base2) {
  _inherits(QuizSet, _Base2);

  function QuizSet(element) {
    var _this3;

    _classCallCheck(this, QuizSet);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(QuizSet).call(this, element));
    MakeSlider(element);
    _this3.scoreElement = _this3.element.querySelector("#score");
    _this3.score = 0;
    _this3.quizes = Array.prototype.slice.call(_this3.element.querySelectorAll('.quiz')).map(function (element, index) {
      return _this3.buildQuiz(element, index);
    });
    return _this3;
  }

  _createClass(QuizSet, [{
    key: "addScore",
    value: function addScore(score) {
      if (score) {
        this.score++;
      }

      this.scoreElement.innerHTML = this.score;

      if (this.score / this.quizes.length < 0.7) {
        this.element.querySelector('.quiz-end .feedback').classList.add('feedback-negative');
      }
    }
  }, {
    key: "buildQuiz",
    value: function buildQuiz(element, index) {
      var quiz = new Quiz(element, this.addScore.bind(this));
      quiz.element.addEventListener('quizSubmit', console.log);
      return quiz;
    }
  }]);

  return QuizSet;
}(Base);
//# sourceMappingURL=quiz.js.map
