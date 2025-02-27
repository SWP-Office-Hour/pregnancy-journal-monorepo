import { TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';

describe(TodoItemComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(TodoItemComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(TodoItemComponent);
  });
});
