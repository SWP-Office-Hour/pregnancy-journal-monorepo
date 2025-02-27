import * as cy from 'cypress/angular';
import { GreetingComponent } from '../../../todo-list/src/app/components/greeting/greeting.component';

it('mount', () => {
  cy.mount(GreetingComponent);
});
