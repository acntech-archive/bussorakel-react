import React from "react"
import { connect } from "react-redux"

import { fetchTravel } from "../actions/travelActions"

import SearchForm from "./SearchForm"
import TravelProposals from "./TravelProposals"

@connect((store) => {
  return {
    travel: store.travel,
  };
})
export default class Layout extends React.Component {

  fetchTravel(question) {
    this.props.dispatch(fetchTravel(question))
  }

  render() {
    const { travel } = this.props;

    return <div class="text-center">
      <SearchForm fetchTravel={this.fetchTravel.bind(this)} />
      <TravelProposals {...travel} />
    </div>
  }
}
