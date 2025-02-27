import { TestBed } from '@angular/core/testing';
import { GreetingComponent } from './greeting.component';

describe(GreetingComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(GreetingComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(GreetingComponent);
  });
});
