import './App.css';
import React, { Component } from 'react';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      logged_in: localStorage.getItem('access_token') ? true : false,
      lock_spinner: false,
      username: null,
      pk: null,
      password: null,
    }
  }

  componentDidMount() {
    if (this.state.logged_in) {
      this.getAccountInfo()
    }
  }

  catchError = (e) => {
    localStorage.removeItem('access_token');
    this.setState({ logged_in: false, username: null, password: null });
  }

  handleLogin = (e) => {
    this.setState(
      {
          lock_spinner: true,
      }, () => {
        fetch(process.env.REACT_APP_BACKEND_URI + '/api/auth/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              username: this.state.username,
              password: this.state.password,
            }
          )
        })
        .then(res => {
          if (res.status === 401) {
            console.log(res.status)
            this.catchError(res.status);
            document.getElementById('toast-body-id').innerHTML = "Неверный логин или пароль";
            var x = document.getElementById("toast-wrapper-id");
            x.className = 'show';
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2200);
            return
          }
          if (res.status !== 200) {
            this.catchError(res.status);
            return
          }
          const response = res.json();
          return response;
        })
        .then(json => {
          if (!json) {
            this.setState({lock_spinner: false});
            return
          }
          localStorage.setItem('access_token', json.access_token);
          this.setState(
            { lock_spinner: false, logged_in: true },
            () => {
              this.getAccountInfo()
            }
          )
        })
      }
    )
  }

  getAccountInfo() {
    this.setState(
      {
          lock_spinner: true,
      }, () => {
        fetch(process.env.REACT_APP_BACKEND_URI + '/api/account/info/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        .then(res => {
          if (res.status === 401) {
              this.catchError(res.status);
              return
          }
          const response = res.json();
          return response;
        }).then(
          json => {
            if (!json) {
              return
            }
            this.setState({
              username: json.username,
              email: json.password,
              pk: json.pk,
              lock_spinner: false,
            });
          }
        )
      }
    )
  }

  render() {
    return (
      <div>
        {this.state.logged_in
          ? <div
              style={
                {
                  width: 'fit-content',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }
              }
            >
              <div
                style={
                  {
                    marginTop: '2rem',
                  }
                }
              >
                Hello, {this.state.username}
              </div>
              <div
                style={
                  {
                    width: 'fit-content',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '1rem',
                    border: '1px solid #000',
                    padding: '0.25rem',
                  }
                }
                onClick={
                  () => {
                    localStorage.removeItem('access_token')
                    this.setState({logged_in: false})
                  }
                }
              >
                Exit
              </div>
            </div>
          : <div
              style={
                {
                  width: 'fit-content',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }
              }
            >
              <h1>LogIn</h1>
                <label>
                  <p>Username</p>
                  <input
                    type="text"
                    onChange={
                      (e) => {
                        this.setState({username: e.target.value})
                      }
                    }
                  />
                </label>
                <label>
                  <p>Password</p>
                  <input
                    type="password"
                    onChange={
                      (e) => {
                        this.setState({password: e.target.value})
                      }
                    }
                  />
                </label>
                <div
                  style={
                    {
                      width: 'fit-content',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginTop: '1rem',
                      border: '1px solid #000',
                      padding: '0.25rem',
                    }
                  }
                  onClick={this.handleLogin}
                >
                  LogIn
                </div>
            </div>
        }
        {this.state.lock_spinner
          ? <Spinner />
          : ''
        }
        <div id="toast-wrapper-id">
          <div id="toast-body-id">
          </div>
        </div>
      </div>
    )
  }
}

class Spinner extends(Component) {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='background_lock_wrapper'>
                <div className='lock_wrapper'>
                    <div className='lock_modal_content_wrapper  lock_modal_continuous_content_wrapper'>
                         <div className="loader"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
