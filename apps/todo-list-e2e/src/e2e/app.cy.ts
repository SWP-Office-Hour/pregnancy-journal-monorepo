describe('todo-list-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.get('app-greeting').should('contain.html', '<h2>Greetings!</h2>');
  });

  it('should display todos component', () => {
    cy.visit('/todos').then(() => {
      cy.get('app-todos').should('exist');
    });
  });

  it('should display 1 searched todo item', () => {
    cy.visit('/todos').then(() => {
      // eslint-disable-next-line cypress/unsafe-to-chain-command
      cy.get('#search_todo')
        .type('DELECTUS A')
        .then(() => {
          cy.get('app-todo-item').should('exist').and('have.length', 1);
        });
    });
  });

  it('should add todo item', () => {
    cy.visit('/todos');
    cy.get('#new_todo').type('New todo item');
    cy.get('#new_todo_btn').click();
    cy.get('app-todo-item').children().first().children('label').should('contain.html', 'New todo item'.toUpperCase());
  });

  it('should update todo item', () => {
    cy.visit('/todos');
    cy.get('app-todo-item').children().first().children('input').click();
    cy.get('app-todo-item').children().first().should('have.css', 'text-decoration', 'line-through solid rgb(108, 117, 125)');
  });
});
