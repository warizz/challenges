// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import fetch from 'isomorphic-fetch';

import summaryDonations from './helpers';

const Card = styled.div`
  margin: 10px;
  border: 1px solid #ccc;
`;

type Props = {};

type State = {};

class App extends Component<Props, State> {
  state = {
    charities: [],
    selectedAmount: 10,
  };

  componentDidMount() {
    fetch('http://localhost:3001/charities')
      .then(resp => resp.json())
      .then(data => {
        this.setState({ charities: data });
      });

    fetch('http://localhost:3001/payments')
      .then(resp => resp.json())
      .then(data => {
        this.props.dispatch({
          type: 'UPDATE_TOTAL_DONATE',
          amount: summaryDonations(data.map(item => item.amount)),
        });
      });
  }

  handlePay = (id, amount, currency) => {
    fetch('http://localhost:3001/payments', {
      method: 'POST',
      body: `{ "charitiesId": ${id}, "amount": ${amount}, "currency": "${currency}" }`,
    })
      .then(resp => resp.json())
      .then(() => {
        this.props.dispatch({
          type: 'UPDATE_TOTAL_DONATE',
          amount,
        });
        this.props.dispatch({
          type: 'UPDATE_MESSAGE',
          message: `Thanks for donate ${amount}!`,
        });

        setTimeout(() => {
          this.props.dispatch({
            type: 'UPDATE_MESSAGE',
            message: '',
          });
        }, 2000);
      });
  };

  render() {
    const style = {
      color: 'red',
      margin: '1em 0',
      fontWeight: 'bold',
      fontSize: '16px',
      textAlign: 'center',
    };

    return (
      <div>
        <h1>Tamboon React</h1>
        <p>All donations: {this.props.donate}</p>
        <p style={style}>{this.props.message}</p>
        {this.state.charities.map((item, i) => (
          <Card key={i}>
            <p>{item.name}</p>
            {[10, 20, 50, 100, 500].map((amount, j) => (
              <label key={j}>
                <input
                  name="payment"
                  onClick={() => {
                    this.setState({ selectedAmount: amount });
                  }}
                  type="radio"
                />
                {amount}
              </label>
            ))}
            <button
              onClick={() => {
                this.handlePay(
                  item.id,
                  this.state.selectedAmount,
                  item.currency,
                );
              }}
              type="button"
            >
              Pay
            </button>
          </Card>
        ))}
      </div>
    );
  }
}

export default connect(state => state)(App);
