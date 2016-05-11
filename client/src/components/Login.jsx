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

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async fetchRoute(route) {
    const email = this.refs.email.value
    const password = this.refs.password.value
    if (!email || !this.validateEmail(email)) {
      this.setState({message: 'Please enter a valid email address.'})
      throw new Error()
    } else if (!password || password < 8) {
      this.setState({message: 'Invalid password. Must be > 8 characters.'})
      throw new Error()
    }

    try {
      const response = await fetch('http://localhost:8081/' + route, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
        body: JSON.stringify({email, password})
      })

      const data = await response.json()

      if (data.status != 'success') throw new Error(data.reason)
      this.setState({message: 'Success!'})

      return data
    } catch (err) {
      this.setState({message: err.message})
      throw err
    }
  }

  async loginClicked() {
    try {
      const data = await this.fetchRoute('login')
      this.props.login(this.refs.email.value, data.token)
    } catch (err) { return }
  }

  async registerClicked() {
    console.log("registering")
    try {
      const data = await this.fetchRoute('register')
      console.log(data)
    } catch (err) { return }
  }

  handleKeyPress(e) {
    if (e.key !== 'Enter') return
    this.loginClicked()
  }

  render() {
    const user = this.props.user

    if (user.email) {
      return <div>
        Signed in as {user.email} (<button onClick={this.props.logout}>Logout</button>)
        </div>
    } else {
      return <div>
        <div>
          <input type="text" placeholder="Email" ref="email" />
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
