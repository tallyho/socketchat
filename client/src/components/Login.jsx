import React from 'react'
import {connect} from 'react-redux'
import {login, logout} from '../reducers/user'
import fetch from 'isomorphic-fetch'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {message: null}
    this.loginClicked = this.loginClicked.bind(this)
    this.registerClicked = this.registerClicked.bind(this)
    this.fetchRoute = this.fetchRoute.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  validateHandle(handle) {
    return handle && handle.length >= 4
  }

  validatePassword(password) {
    return password && password.length >= 8
  }

  async fetchRoute(route) {
    const handle = this.refs.handle.value
    const password = this.refs.password.value
    if (!this.validateHandle(handle)) {
      this.setState({message: 'The username must be more than 3 characters.'})
      throw new Error()
    } else if (!this.validatePassword(password)) {
      this.setState({message: 'The password must be more than 7 characters.'})
      throw new Error()
    }

    try {
      const response = await fetch('http://localhost:8081/' + route, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
        body: JSON.stringify({handle, password})
      })

      const data = await response.json()

      if (data.status != 'success') throw new Error(data.reason)
      this.setState({message: 'Success!'})

      return data
    } catch (err) {
      console.log(err)
      this.setState({message: err.message})
      throw err
    }
  }

  async loginClicked() {
    try {
      const data = await this.fetchRoute('login')
      this.props.login(this.refs.handle.value, data.token)
    } catch (err) { return }
  }

  async registerClicked() {
    try {
      const data = await this.fetchRoute('register')
    } catch (err) { return }
  }

  handleKeyPress(e) {
    if (e.key !== 'Enter') return
    this.loginClicked()
  }

  render() {
    const user = this.props.user

    if (user.handle) {
      return <div>
        Signed in as {user.handle} (<button onClick={this.props.logout}>Logout</button>)
        </div>
    } else {
      return <div>
        <div>
          <input type="text" placeholder="Username" ref="handle" />
          <input type="password" placeholder="Password" ref="password" onKeyPress={this.handleKeyPress} />
          <button onClick={this.loginClicked}>Login</button>
          <button onClick={this.registerClicked}>Register</button>
        </div>
        <div>
        {this.state.message}
        </div>
      </div>
    }
  }
}

export default connect(
  (state) => ({user: state.user}),
  {login, logout}
)(Login)
