import React, { Component } from 'react';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value:   '',
    message: '',
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);


    this.setState({
      manager,
      players,
      balance,
    });
  }

  onSubmit = async event => {
    event.preventDefault();
    const account  = await web3.eth.getAccounts();

    this.setState({
      message: 'pls wait for the transaction to go through...',
    })

    await lottery.methods.enter().send({
      from: account[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({
      message: 'You have been entered',
    })


  }

  render() {
    return (
      <div>
          <h1>Lottery contract</h1>
          <p>this contract managed by: { this.state.manager } </p>
          <p>there are currently { this.state.players.length } people entered </p>
          <p>competing to win { web3.utils.fromWei(this.state.balance ) } ether </p>

          <form onSubmit={ this.onSubmit }>
            <h4>want to try your luck?</h4>
            <div>
              <label>Amount of ether to enter</label>
              <input value={ this.state.value }
              onChange={ event => this.setState({ value: event.target.value }) } />
            </div>
            <button>Enter</button>
          </form>

          <hr />
          <div>{ this.state.message }</div>
      </div>
    );
  }
}

export default App;
