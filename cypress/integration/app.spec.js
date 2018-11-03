/* eslint-disable prefer-arrow-callback, func-names */
describe('app', function() {
  beforeEach(function() {
    cy.fixture('charities').as('charities');
    cy.fixture('payments').as('payments');
  });

  beforeEach(function() {
    cy.server();
    cy.route({
      method: 'get',
      url: /\/charities/,
      response: this.charities,
    });
    cy.route({
      method: 'get',
      url: /\/payments/,
      response: this.payments,
    });
    cy.visit('http://localhost:3000');
  });

  specify('should display data correctly', function() {
    cy.get('[data-test-id=total-amount]').should('have.text', '4250');

    this.charities.forEach(charity => {
      cy.get(`[data-test-id="charity-${charity.name}"]`).within(() => {
        cy.get('[data-test-id=name]').should('have.text', charity.name);
      });
    });
  });

  specify('should be able to donate', function() {
    const amounts = [10, 20, 50, 100, 500];
    let total = 4250;
    amounts.forEach((amount, index) => {
      const charity = this.charities[index];
      cy.get(`[data-test-id="charity-${charity.name}"]`).within(() => {
        cy.get(`[data-test-id=payment-${charity.id}-${amount}]`).click();
        cy.get(`[data-test-id=donate]`).click();
      });
      total += amount;
      cy.get('[data-test-id=total-amount]').should(
        'have.text',
        total.toString(),
      );
    });
  });
});
