import React from "react";

export default class TravelProposal extends React.Component {
  render() {

    const { proposal,key } = this.props;

    return (
			<div class="well col-md-4 col-md-offset-4">
  			{proposal}
			</div>
    );
  }
}