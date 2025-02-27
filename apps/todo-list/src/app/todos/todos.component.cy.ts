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
});
