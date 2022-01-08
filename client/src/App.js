import React from 'react';
import classNames from 'classnames';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: false,
      password: '',
      error: false,
    };
    this.onHandleInputKeyup = this.onHandleInputKeyup.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onHandleInputKeyup(e) {
    this.setState({ password: e.target.value, error: false });
  }

  onSubmit() {
    if(this.state.password === 'besadetroit2021') {
      this.setState({ hasPermission: true });
    } else {
      this.setState({ error: true });
    }
  }

  render() {
    const { hasPermission, error } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          {hasPermission && <h1>Access granted!</h1>}
          {!hasPermission &&
            <div>
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                This site is under maintenance. Pleae enter the password to continue.
              </p>

              <div className="input-group mb-3">
                <input onKeyUp={this.onHandleInputKeyup} type="text" className="form-control" placeholder="Enter the password..." aria-label="Password entry" />
                <button onClick={this.onSubmit} className="btn btn-primary" type="button">Button</button>
              </div>
              <p className={classNames(
                {'text-danger fst-italic': error},
                {'opacity-0': !error}
              )}>Sorry that password is incorrect.</p>
            </div>}
        </header>
      </div>
    );
  }
}

export default App;
