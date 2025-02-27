import { TestBed } from '@angular/core/testing';
import { TodosComponent } from './todos.component';

describe(TodosComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(TodosComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(TodosComponent);
  });
});
