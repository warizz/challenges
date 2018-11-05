// @flow
import * as React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  border: 1px solid blue;
  border-radius: 3px;
  background-color: white;
  padding: 0.5em 1em;
  color: blue;
  font-size: 1em;
  cursor: pointer;
  min-width: 80px;
`;

const Card = styled.div`
  margin-bottom: 1em;
  border: 1px solid #ccc;
  height: 400px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  :hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  * {
    box-sizing: border-box;
  }

  > img {
    object-fit: cover;
    width: 100%;
    height: 300px;
  }

  > .cover-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    padding: 1em;
  }

  > .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    > * {
      z-index: 1;
      margin-bottom: 1em;
    }

    ::after {
      background-color: rgba(255, 255, 255, 0.9);
      content: '';
      width: 100%;
      height: 100%;
      position: inherit;
    }

    > .amounts {
      display: flex;
      align-items: center;

      > label {
        margin: 0 1em 0 0;

        :last-child {
          margin: 0;
        }

        > input {
          margin: 0 1em 0 0;
        }
      }
    }

    > button.close {
      background-color: transparent;
      border: none;
      cursor: pointer;
      font-size: 2em;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
`;

type Props = {
  amounts: $ReadOnlyArray<number>,
  charity: {
    currency: string,
    id: number,
    image: string,
    name: string,
  },
  isOpen: boolean,
  onClose: () => void,
  onOpen: () => void,
  onPay: () => void,
  onSelectAmount: number => void,
  selectedAmount: number,
};

export default function CharityCard(props: Props) {
  const {
    charity,
    onPay,
    amounts,
    isOpen,
    onOpen,
    onClose,
    onSelectAmount,
    selectedAmount,
    totalDonation,
  } = props;
  return (
    <Card>
      <img alt={charity.name} src={`/images/${charity.image}`} />

      <div className="cover-content">
        <p data-test-id="name">
          {charity.name}
          <br />
          {`(${totalDonation})`}
        </p>

        <Button onClick={onOpen} type="button">
          Donate
        </Button>
      </div>

      {isOpen && (
        <div className="overlay">
          <button className="close" onClick={onClose} type="button">
            ×
          </button>

          <h3>Select the amount to donate (USD)</h3>

          <div className="amounts">
            {amounts.map(amount => {
              const inputId = `payment-${charity.id}-${amount}`;
              return (
                <label key={amount} htmlFor={inputId}>
                  <input
                    checked={selectedAmount === amount}
                    data-test-id={inputId}
                    id={inputId}
                    name="payment"
                    onChange={() => {
                      onSelectAmount(amount);
                    }}
                    type="radio"
                  />
                  {amount}
                </label>
              );
            })}
          </div>

          <Button data-test-id="donate" onClick={onPay} type="button">
            Pay
          </Button>
        </div>
      )}
    </Card>
  );
}
