import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';

const Stars = (props) => {
	return (
    <div className="col-md-5">
    	{_.range(props.numberOfStars).map(i =>
        <i key={i} className="fa fa-star"></i>
      )}
    </div>
  )
}

Stars.propTypes = {
	numberOfStars: PropTypes.number.isRequired
}

const Button = (props) => {
  let button;
  switch(props.answerIsCorrect) {
    case true:
      button =
        <button className="btn btn-success" onClick={props.acceptAnswer}>
          <i className="fa fa-check"></i>
        </button>
      break;
    case false:
      button =
        <button className="btn btn-danger">
          <i className="fa fa-times"></i>
        </button>
      break;
    default:
      button =
        <button className="btn"
                onClick={props.checkAnswer}
                disabled={props.selectedNumbers.length === 0}>
          =
        </button>;
      break;
  }
	return (
    <div className="col-md-2 text-center">
    	{button}
      <br /><br />
      <button className="btn btn-warning btn-sm" onClick={props.redraw}
              disabled={props.redraws === 0}>
        <i className="fa fa-refresh"></i> {props.redraws}
      </button>
    </div>
  )
}

Button.propTypes = {
	answerIsCorrect: PropTypes.bool,
	acceptAnswer: PropTypes.func.isRequired,
	checkAnswer: PropTypes.func.isRequired,
	selectedNumbers: PropTypes.array.isRequired,
	redraw: PropTypes.func.isRequired,
	redraws: PropTypes.number.isRequired
}

const Answer = (props) => {
	const { selectedNumbers, unselectNumber } = props;
	return (
    <div className="col-md-5">
    	{ selectedNumbers.map((number, i) =>
        <span key={i} onClick={() => unselectNumber(number)}>
          {number}
        </span>
      )}
    </div>
  )
}

Answer.propTypes = {
	selectedNumbers: PropTypes.array.isRequired,
	unselectNumber: PropTypes.func.isRequired
}

const Numbers = (props) => {
  const {
    selectedNumbers,
    selectNumber,
    usedNumbers
  } = props;
  return (
    <div className="card text-center">
      <div>
        { Numbers.list.map(
          (number, i) =>
          <Number key={i} value={number}
                  selectedNumbers={selectedNumbers}
                  selectNumber={selectNumber}
                  usedNumbers={usedNumbers} />)
        }
      </div>
    </div>
  )
}
Numbers.list = _.range(1, 10);

class Number extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this, this.props.value);
  }

  numberClassName(number) {
    if (this.hasBeenUsed(number)) {
      return 'used'
    }
    if (this.hasBeenSelected(number)) {
      return 'selected';
    }
  }

  handleClick(number) {
    !this.hasBeenUsed(number) &&
    !this.hasBeenSelected(number) &&
    this.props.selectNumber(number);
  }

  hasBeenUsed(number) {
    if (this.props.usedNumbers.indexOf(number) >= 0) {
      return true;
    }
    return false;
  }

  hasBeenSelected(number) {
    if (this.props.selectedNumbers.indexOf(number) >= 0) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <span className={this.numberClassName(this.props.value)}
        onClick={this.handleClick}>
        {this.props.value}
      </span>
    )
  }
}

const DoneFrame = (props) => {
  return (
    <div className="text-center">
      <h2>{props.doneStatus}</h2>
      <button className="btn btn-secondary" onClick={props.resetGame}>
        Play Again
      </button>
    </div>
  )
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = Game.initialState();
    this.selectNumber = this.selectNumber.bind(this);
    this.unselectNumber = this.unselectNumber.bind(this);
    this.acceptAnswer = this.acceptAnswer.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.redraw = this.redraw.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  static initialState() {
    return {
      selectedNumbers: [],
      randomNumberOfStars: Game.randomNumber(),
      usedNumbers: [],
      answerIsCorrect: null,
      redraws: 5,
      doneStatus: null
    }
  }

  static randomNumber() {
    return 1 + Math.floor(Math.random() * 9);
  }

  selectNumber(clickedNumber) {
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  }

  unselectNumber(clickedNumber) {
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.filter(
        (number) => number !== clickedNumber)
    }));
  }

  checkAnswer() {
    this.setState(prevState => ({
      answerIsCorrect: prevState.randomNumberOfStars ===
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  }

  redraw() {
    if (this.state.redraws === 0) { return; }
    this.setState(prevState => ({
      randomNumberOfStars: Game.randomNumber(),
      answerIsCorrect: null,
      selectedNumbers: [],
      redraws: prevState.redraws - 1
    }), this.updateDoneStatus);
  }

  acceptAnswer() {
    this.setState(prevState => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber()
    }), this.updateDoneStatus);
  }

  possibleCombinationSum(arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
      arr.pop();
      return this.possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount ; i++ ) {
      var combinationSum = 0;
      for (var j=0 ; j < listSize ; j++) {
        if (i & (1 << j)) { combinationSum += arr[j]; }
      }
      if (n === combinationSum) { return true; }
    }
    return false;
  };

  possibleSolutions({randomNumberOfStars, usedNumbers}) {
    const possibleNumbers = _.range(1, 10).filter(
      number => usedNumbers.indexOf(number) === -1
    );
    return this.possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  }

  updateDoneStatus() {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9) {
        return { doneStatus: 'Done. Nice!' };
      }
      if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
        return { doneStatus: 'Game Over!' };
      }
    })
  }

  resetGame() {
    this.setState(() => Game.initialState());
  }

  render() {
    const {
      selectedNumbers,
      randomNumberOfStars,
      usedNumbers,
      answerIsCorrect,
      redraws,
      doneStatus
    } = this.state;

    return (
      <div className="container">
      	<h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />
          <Button selectedNumbers={selectedNumbers}
                  redraws={redraws}
                  checkAnswer={this.checkAnswer}
                  acceptAnswer={this.acceptAnswer}
                  redraw={this.redraw}
                  answerIsCorrect={answerIsCorrect}/>
          <Answer selectedNumbers={selectedNumbers}
                  unselectNumber={this.unselectNumber} />
        </div>
        <br />
        { doneStatus ?
          <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/> :
          <Numbers selectedNumbers={selectedNumbers}
                    selectNumber={this.selectNumber}
                    usedNumbers={usedNumbers} />
        }
      </div>
    )
  }
}

class App extends React.Component {
	render() {
  	return (
    	<div>
      	<Game />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('main'));
