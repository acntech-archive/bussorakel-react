import React from "react";

export default class SearchForm extends React.Component {

  constructor() {
    super();
    this.state = {"question": "Når går bussen"}
  }

  inputChanged(e) {
    this.setState({"question" : e.target.value})
  }

  keyPressed(e) {
    if(e.keyCode == 13) { // If enter is pressed
      this.fetchTravel();
    }
  }

  fetchTravel() {
    this.props.fetchTravel(this.state.question);
  }

  render() {
    const inputRowStyle = {
      'marginBottom': '20px'
    }

    return (
			<div class="input-group col-md-4 col-md-offset-4" style={inputRowStyle}>
        <input type="text" class="form-control" value={this.state.question} onChange={this.inputChanged.bind(this)} onKeyDown={this.keyPressed.bind(this)} />
        <span class="input-group-btn">
          <button className="btn btn-default" type="button" onClick={this.fetchTravel.bind(this)}>Spør</button>
        </span>
      </div>
    );
  }
}