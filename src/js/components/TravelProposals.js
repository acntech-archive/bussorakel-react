import React from "react";
import Spinner from 'react-webpack-spinner'

import TravelProposal from "./TravelProposal"

export default class TravelProposals extends React.Component {
  render() {

  	const { fetching, travels, error } = this.props;
   	
		if (fetching) {
			return <Spinner width={32} height={32} color={'black'} />;
		}

		if (error) {
			return <div class="alert alert-danger col-md-4 col-md-offset-4">
  				<strong>Oh snap!</strong> Noe har feilet, prøv igjen...
				</div>;
		}

		const TravelProposals = travels.map((proposal) => {
      return <TravelProposal {...proposal} />;
    });

    return (
    	<div>
    		{TravelProposals}
    	</div>
    );
  }
}