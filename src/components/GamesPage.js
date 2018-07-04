import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GamesList from './GamesList'
import { fetchGames } from '../actions'

export class GamesPage extends Component {
  static propTypes = {
    games: PropTypes.array.isRequired,
    fetchGames: PropTypes.func.isRequired
  }
  componentDidMount = () => {
    this.props.fetchGames();
  }

  render() {
    return (
      <GamesList games={this.props.games} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    games: state.games
  };
}

const mapDispatchToProps = {
  fetchGames

}

export default connect(mapStateToProps, mapDispatchToProps)(GamesPage)
