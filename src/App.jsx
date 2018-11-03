// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';

const axiosInstance = axios.create({ baseURL: 'http://localhost:3001' });

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
    axiosInstance.get('/charities').then(res => {
      this.setState({ charities: res.data });
    });

    axiosInstance.get('/payments').then(res => {
      const payments = res.data;
      this.props.dispatch({
        type: 'UPDATE_TOTAL_DONATE',
        amount: payments.reduce((acc, val) => acc + val.amount, 0),
      });
    });
  }

  handlePay = (charitiesId: number, amount: number, currency: string) => {
    axiosInstance
      .post('/payments', {
        charitiesId,
        amount,
        currency,
      })
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
      <div data-test-id="app">
        <h1>Tamboon React</h1>
        <p>
          All donations:
          <strong data-test-id="total-amount">{this.props.donate}</strong>
        </p>
        <GlobalMessage>{this.props.message}</GlobalMessage>
        {this.state.charities.map(item => (
          <Card key={item.id} data-test-id={`charity-${item.name}`}>
            <p data-test-id="name">{item.name}</p>

            {[10, 20, 50, 100, 500].map(amount => {
              const inputId = `payment-${item.id}-${amount}`;
              return (
                <label key={amount} htmlFor={inputId}>
                  <input
                    data-test-id={inputId}
                    id={inputId}
                    name="payment"
                    onClick={() => {
                      this.setState({ selectedAmount: amount });
                    }}
                    type="radio"
                  />
                  {amount}
                </label>
              );
            })}

            <button
              data-test-id="donate"
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
