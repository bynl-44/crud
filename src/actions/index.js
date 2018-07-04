import { SET_GAMES, ADD_GAME, GAME_FETCHED, GAME_UPDATE } from '../constants'

export const setGames = (games) => {
  return {
    type: SET_GAMES,
    games
  }
}

export const addGame = game => {
  return {
    type: ADD_GAME,
    game
  }
}

export const fetchGames = () => {
  return dispatch => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => dispatch(setGames(data.games)))
  }

}

const handleResponse = res => {
  if (res.ok) {
    return res.json();
  } else {
    let error = new Error(Response.statusText)
    error.response = res
    throw error
  }
}

export const saveGame = data => {
  return dispatch => {
    return fetch('/api/games', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse)
      .then(data => dispatch(addGame(data.game)))
  }
}
export const gameFetched = game => {
  return {
    type: GAME_FETCHED,
    game
  }
}
export const fetchGame = id => {
  return dispatch => {
    fetch(`/api/games/${id}`)
      .then(res => res.json())
      .then(data => dispatch(gameFetched(data.game)))
  }
}

export const gameUpdated = game => {
  return {
    type: GAME_UPDATE,
    game
  }
}

export const updateGame = game => {
  return dispatch => {
    return fetch(`/api/games/${game._id}`, {
      method: 'put',
      body: JSON.stringify(game),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse)
      .then(data => dispatch(gameUpdated(data.game)))
  }
}