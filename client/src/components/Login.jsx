import React from 'react'
import {connect} from 'react-redux'
import {login, logout} from '../user'
import fetch from 'isomorphic-fetch'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {error: null}
    this.loginClicked = this.loginClicked.bind(this)
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  loginClicked() {
    const email = this.refs.email.value
    const password = this.refs.password.value
    if (!email || !this.validateEmail(email)) {
      this.setState({error: 'Please enter a valid email address.'})
      return
    } else if (!password || password < 8) {
      this.setState({error: 'Invalid password. Must be > 8 characters.'})
      return
    }

    fetch('http://localhost:8081/login', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
      body: JSON.stringify({email, password})
    })
    .then(response => { return response.json() })
    .then(data => { return data })
    .then(data => {
      if (data.status == 'failed') {
        this.setState({error: data.reason})
        return
      }
    }).catch(error => {
      console.log("Error from server:", error);
      this.setState({error})
    })
  }

  registerClicked() {

  }

  render() {
    const user = this.props.user

    if (user.get('email')) {
      return <div>
        Hi, {user.get('email')}
        <button onClick={this.logoutClick}>Logout</button>
        </div>
    } else {
      return <div>
        <div>
          <input type="text" placeholder="Email" ref="email" />
          <input type="password" placeholder="Password" ref="password" />
          <button onClick={this.loginClicked}>Login</button>
          <button onClick={this.registerClicked}>Register</button>
        </div>
        <div>
        {this.state.error}
        </div>
      </div>
    }
  }
}

export default connect(
  (state) => ({user: state.user}),
  {login, logout}
)(Login)
