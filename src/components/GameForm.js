import React, { Component } from 'react'
import classnames from 'classnames'
import { saveGame, fetchGame, updateGame } from '../actions'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

class GameForm extends Component {
  state = {
    _id: null,
    title: '',
    cover: '',
    errors: {},
    loading: false
  }

  componentDidMount = () => {
    const { match } = this.props
    if (match.params._id) {
      this.props.fetchGame(match.params._id)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      _id: nextProps.game._id,
      title: nextProps.game.title,
      cover: nextProps.game.cover
    })
  }



  handleChange = (event) => {
    if (this.state.errors[event.target.name]) {
      let errors = Object.assign({}, this.state.errors)
      delete errors[event.target.name]
      this.setState({
        [event.target.name]: event.target.value,
        errors
      })
    } else {
      this.setState({ [event.target.name]: event.target.value })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();

    let errors = {}

    if (this.state.title === '') errors.title = 'Can`t be empty'
    if (this.state.cover === '') errors.cover = 'Can`t be empty'
    this.setState({ errors })

    const isValid = Object.keys(errors).length === 0

    if (isValid) {
      const { _id, title, cover } = this.state;
      this.setState({ loading: true })
      if (_id) {
        this.props.updateGame({ _id, title, cover }).then(
          () => {
            this.setState({ done: true })
          },
          err => {
            err.response.json().then(({ errors }) => { this.setState({ errors, loading: false }) })
          }
        )
      } else {
        this.props.saveGame({ title, cover }).then(
          () => {
            this.setState({ done: true })
          },
          err => {
            err.response.json().then(({ errors }) => { this.setState({ errors, loading: false }) })
          }
        )
      }
    }
  }

  render() {
    const form = (<form className={classnames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
      <h1>Add new Game</h1>
      {!!this.state.errors.global && <div className='ui negative message'> {this.state.errors.global} </div>}
      <div className={classnames('field', { error: !!this.state.errors.title })}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          placeholder='Title'
          name='title'
          value={this.state.title}
          onChange={this.handleChange}
        />
      </div>
      <div className={classnames('field', { error: !!this.state.errors.cover })}>
        <label htmlFor="cover">cover url</label>
        <input
          type="text"
          placeholder='cover'
          name="cover"
          value={this.state.cover}
          onChange={this.handleChange}
        />
      </div >
      <div className="field">
        {this.state.cover !== '' && <img src={this.state.cover} alt="cover" className="ui small bordered image" />}
      </div>
      <div className="field">
        <button className="ui primary button">save</button>
      </div>
    </form >)
    return this.state.done ? <Redirect to='/games' /> : form
  }
}

const mapStateToProps = (state, props) => {
  const { match } = props
  if (match.params._id) {
    return {
      game: state.games.find(item => item._id === match.params._id)
    }
  }
  return { game: null }
}

const mapDispatchToProps = {
  saveGame,
  fetchGame,
  updateGame
}


export default connect(mapStateToProps, mapDispatchToProps)(GameForm)