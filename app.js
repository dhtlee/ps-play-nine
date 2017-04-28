import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

const Stars = (props) => {
  const numberOfStars = 1 + Math.floor(Math.random()*9);

	return (
    <div className="col-md-5">
    	{_.range(numberOfStars).map(i =>
        <i key={i} className="fa fa-star"></i>
      )}
    </div>
  )
}

const Button = (props) => {
	return (
    <div className="col-md-2">
    	<button>=</button>
    </div>
  )
}

const Answer = (props) => {
	return (
    <div className="col-md-5">
    	{ props.selectedNumbers.map((number, i) =>
        <span key={i}>{number}</span>
      )}
    </div>
  )
}

const Numbers = (props) => {
  const { selectedNumbers, selectNumber } = props;
  return (
    <div className="card text-center">
      <div>
        { Numbers.list.map(
          (number, i) =>
          <Number key={i} value={number}
                  selectedNumbers={selectedNumbers}
                  selectNumber={selectNumber} />)
        }
      </div>
    </div>
  )
}
Numbers.list = _.range(1, 10);

class Number extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  numberClassName(number) {
    if (this.props.selectedNumbers.indexOf(number) >= 0) {
      return 'selected';
    }
  }

  handleClick() {
    this.props.selectNumber(this.props.value);
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

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedNumbers: []
    }
    this.selectNumber = this.selectNumber.bind(this);
  }

  selectNumber(clickedNumber) {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }))
  }

  render() {
    return (
      <div className="container">
      	<h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars />
          <Button />
          <Answer selectedNumbers={this.state.selectedNumbers} />
        </div>
        <br />
        <Numbers selectedNumbers={this.state.selectedNumbers}
                  selectNumber={this.selectNumber} />
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
