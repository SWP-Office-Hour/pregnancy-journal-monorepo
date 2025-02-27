import { TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe(CounterComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(CounterComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(CounterComponent);
  });
});
