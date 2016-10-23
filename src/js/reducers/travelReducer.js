export default function reducer(state={
    travels: [],
    fetching: false,
    fetched: false,
    error: null,
  }, action) {

    switch (action.type) {
      case "FETCH_TRAVEL": {
        return {...state, travels: [], fetching: true}
      }
      case "FETCH_TRAVEL_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_TRAVEL_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          error: null,
          travels: action.payload,
        }
      }
    }

    return state
}
