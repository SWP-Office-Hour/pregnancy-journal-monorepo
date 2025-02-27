import { signal } from '@angular/core';
import { TodoItemComponent } from './todo-item.component';

describe(TodoItemComponent.name, () => {
  it('renders', () => {
    cy.mount(TodoItemComponent, {
      componentProperties: {
        todo: signal({
          id: 1,
          title: 'Test',
          completed: false,
          userId: 1,
        }) as any,
      },
    });
  });
});
