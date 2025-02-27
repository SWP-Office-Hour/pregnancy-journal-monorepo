import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe(HomeComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(HomeComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(HomeComponent);
  });
});
