import axios from "axios";

export function fetchTravel(question) {
  return function(dispatch) {
		dispatch({type: "FETCH_TRAVEL"});
    axios.get("/rest/travel/" + encodeURI(question))
      .then((response) => {
      	console.log(response);
        dispatch({type: "FETCH_TRAVEL_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "FETCH_TRAVEL_REJECTED", payload: err})
      })
  }
}