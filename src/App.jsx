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
  constructor(props) {
    super();

    this.state = {
      charities: [],
      selectedAmount: 10,
    };
  }

  componentDidMount() {
    const self = this;
    fetch('http://localhost:3001/charities')
      .then(resp => resp.json())
      .then(data => {
        self.setState({ charities: data });
      });

    fetch('http://localhost:3001/payments')
      .then(resp => resp.json())
      .then(data => {
        self.props.dispatch({
          type: 'UPDATE_TOTAL_DONATE',
          amount: summaryDonations(data.map(item => item.amount)),
        });
      });
  }

  render() {
    const self = this;
    const cards = this.state.charities.map((item, i) => {
      const payments = [10, 20, 50, 100, 500].map((amount, j) => (
        <label key={j}>
          <input
            name="payment"
            onClick={function() {
              self.setState({ selectedAmount: amount });
            }}
            type="radio"
          />{' '}
          {amount}
        </label>
      ));

      return (
        <Card key={i}>
          <p>{item.name}</p>
          {payments}
          <button
            onClick={handlePay.call(
              self,
              item.id,
              self.state.selectedAmount,
              item.currency,
            )}
            type="button"
          >
            Pay
          </button>
        </Card>
      );
    });

    const style = {
      color: 'red',
      margin: '1em 0',
      fontWeight: 'bold',
      fontSize: '16px',
      textAlign: 'center',
    };
    const donate = this.props.donate;
    const message = this.props.message;

    return (
      <div>
        <h1>Tamboon React</h1>
        <p>All donations: {donate}</p>
        <p style={style}>{message}</p>
        {cards}
      </div>
    );
  }
}

export default connect(state => state)(App);

function handlePay(id, amount, currency) {
  const self = this;
  return function() {
    fetch('http://localhost:3001/payments', {
      method: 'POST',
      body: `{ "charitiesId": ${id}, "amount": ${amount}, "currency": "${currency}" }`,
    })
      .then(resp => resp.json())
      .then(() => {
        self.props.dispatch({
          type: 'UPDATE_TOTAL_DONATE',
          amount,
        });
        self.props.dispatch({
          type: 'UPDATE_MESSAGE',
          message: `Thanks for donate ${amount}!`,
        });

        setTimeout(() => {
          self.props.dispatch({
            type: 'UPDATE_MESSAGE',
            message: '',
          });
        }, 2000);
      });
  };
}
