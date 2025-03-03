import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TodosService } from '../services/todos.service';
import { TodosComponent } from './todos.component';

describe(TodosComponent.name, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosComponent],
      providers: [provideHttpClient(), TodosService],
    }).compileComponents();
  });

  it('renders', () => {
    cy.mount(TodosComponent);
  });

  it('should includes todo items', () => {
    cy.mount(TodosComponent);
    cy.get('.todos > app-todo-item').should('exist');
  });

  it('should add todo item', () => {
    cy.mount(TodosComponent);
    cy.get('#new_todo').type('New todo item');
    cy.get('#new_todo_btn').click();
    cy.get('app-todo-item').children().first().children('label').should('contain.html', 'New todo item'.toUpperCase());
  });

  it('should update todo item', () => {
    cy.mount(TodosComponent);
    cy.get('app-todo-item').children().first().children('input').click();
    cy.get('app-todo-item').children().first().should('have.css', 'text-decoration', 'line-through solid rgb(108, 117, 125)');
  });
});
