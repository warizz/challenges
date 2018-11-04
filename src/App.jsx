// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CharityCard from './CharityCard';

const axiosInstance = axios.create({ baseURL: 'http://localhost:3001' });

const Header = styled.h1`
  text-align: center;
`;

type Charity = {
  currency: string,
  id: number,
  image: string,
  name: string,
};

type Payment = {
  amount?: number,
  charitiesId?: string,
  currency?: string,
  id: string,
};

type Props = {
  dispatch: ({ type: string, [string]: any }) => void,
  donate: number,
};

type State = {
  charities: Charity[],
  openningCharity: ?number,
  selectedAmount: number,
};

const AMOUNTS: $ReadOnlyArray<number> = [10, 20, 50, 100, 500];

class App extends React.Component<Props, State> {
  state = {
    charities: [],
    selectedAmount: AMOUNTS[0],
    openningCharity: null,
  };

  componentDidMount() {
    axiosInstance.get('/charities').then(res => {
      this.setState({ charities: res.data });
    });

    axiosInstance.get('/payments').then((res: { data: Payment[] }) => {
      const payments = res.data;
      this.props.dispatch({
        type: 'UPDATE_TOTAL_DONATE',
        amount: payments.reduce((acc, val) => {
          if (Number.isNaN(Number(val.amount))) {
            return acc;
          }
          return acc + val.amount;
        }, 0),
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
        this.props.dispatch({ type: 'UPDATE_TOTAL_DONATE', amount });

        toast.success(`Thanks for donate ${amount}!`);
      });
  };

  render() {
    return (
      <Grid data-test-id="app" fluid>
        <Header>Tamboon React</Header>

        <p>
          All donations:
          <strong data-test-id="total-amount">{this.props.donate}</strong>
        </p>

        <Row>
          {this.state.charities.map(item => (
            <Col key={item.id} lg={6} md={12}>
              <CharityCard
                amounts={AMOUNTS}
                charity={item}
                isOpen={this.state.openningCharity === item.id}
                onClose={() => {
                  this.setState({ openningCharity: null });
                }}
                onOpen={() => {
                  this.setState({ openningCharity: item.id });
                }}
                onPay={() => {
                  this.handlePay(
                    item.id,
                    this.state.selectedAmount,
                    item.currency,
                  );
                }}
                onSelectAmount={amount => {
                  this.setState({ selectedAmount: amount });
                }}
                selectedAmount={this.state.selectedAmount}
              />
            </Col>
          ))}
        </Row>

        <ToastContainer />
      </Grid>
    );
  }
}

export default connect(state => state)(App);
