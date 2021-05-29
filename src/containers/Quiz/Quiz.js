import React from "react";
import { connect } from "react-redux";
import classes from "./Quiz.module.css";
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import axios from "../../axios/axios-quiz";
import Loading from "../../components/UI/Loading/Loading";
import { fetchQuizById, quizAnswerClick, retryQuiz } from "../../store/actions/quiz"
class Quiz extends React.Component {
  onAnswerClickHandler = (answerId) => {
    this.props.quizAnswerClick(answerId)
  };

  componentDidMount() {
    this.props.fetchQuizById(this.props.match.params.id)
  }
  componentWillUnmount() {
    this.props.retryQuiz()
  }
  render() {
    return (
      <div className={classes.Quiz}>
        <div className={classes.QuizWrapper}>
          <h1>Ответьте на все вопросы</h1>
          {this.props.loading || !this.props.quiz ? (
            <Loading />
          ) : this.props.isFinished ? (
            <FinishedQuiz
              results={this.props.results}
              quiz={this.props.quiz}
              onRetry={this.props.retryQuiz}
            />
          ) : (
            <ActiveQuiz
              quizLength={this.props.quiz.length}
              answerNumber={this.props.activeQuestion + 1}
              answers={this.props.quiz[this.props.activeQuestion].answers}
              question={
                this.props.quiz[this.props.activeQuestion].question.value
              }
              onAnswerClick={this.onAnswerClickHandler}
              state={this.props.answerState}
            />
          )}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    results: state.quiz.results,
    isFinished: state.quiz.isFinished,
    activeQuestion: state.quiz.activeQuestion,
    answerState: state.quiz.answerState,
    quiz: state.quiz.quiz,
    loading: state.quiz.loading,
  };
}
function mapDispatchToProps(dispatch) {
    return {
      fetchQuizById: id => dispatch(fetchQuizById(id)),
      quizAnswerClick: answerId => dispatch(quizAnswerClick(answerId)),
      retryQuiz: () => dispatch(retryQuiz())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
