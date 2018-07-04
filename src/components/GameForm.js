import React, { Component } from 'react'
import classnames from 'classnames'
import { saveGame } from '../actions'
import { connect } from 'react-redux';

class GameForm extends Component {
  state = {
    title: '',
    cover: '',
    errors: {},
    loading: false
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
      const { title, cover } = this.state;
      this.setState({ loading: true })
      this.props.saveGame({ title, cover }).then(
        () => {

        },
        err => {
          err.response.json().then(({ errors }) => { this.setState({ errors, loading: false }) })
        }
      )
    }
  }

  render() {
    return (
      <form className={classnames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
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
      </form >
    )
  }
}

export default connect(null, { saveGame })(GameForm)