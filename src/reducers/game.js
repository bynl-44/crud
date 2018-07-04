import { SET_GAMES, ADD_GAME, GAME_FETCHED, GAME_UPDATE } from '../constants'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {

    case SET_GAMES:
      return action.games
    case ADD_GAME:
      return [
        ...state,
        action.game
      ]
    case GAME_FETCHED:
      const index = state.findIndex(item => item._id === action.game._id)
      if (index > -1) {
        return state.map(item => {
          if (item._id === action.game.id) return action.game
          return item
        })
      } else {
        return [
          ...state,
          action.game
        ]
      }
    case GAME_UPDATE:
      return state.map(item => {
        if (item._id === action.game._id) return action.game
        return item
      })
    default:
      return state
  }
}

