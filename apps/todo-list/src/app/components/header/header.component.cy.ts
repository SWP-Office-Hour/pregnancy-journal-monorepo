import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe(HeaderComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(HeaderComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(HeaderComponent);
  });
});
