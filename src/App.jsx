// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import fetch from 'isomorphic-fetch';

import summaryDonations from './helpers';

const Card = styled.div`
  margin: 10px;
  border: 1px solid #ccc;
`;

const GlobalMessage = styled.p`
  color: red;
  margin: 1em 0;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
`;

type Charity = {
  currency: string,
  id: number,
  image: string,
  name: string,
};

type Props = {
  dispatch: ({ type: string, [string]: any }) => void,
  donate: number,
  message: string,
};

type State = {
  charities: Charity[],
  selectedAmount: number,
};

class App extends React.Component<Props, State> {
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

  handlePay = (id: number, amount: number, currency: string) => {
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
    return (
      <div>
        <h1>Tamboon React</h1>
        <p>All donations: {this.props.donate}</p>
        <GlobalMessage>{this.props.message}</GlobalMessage>
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
