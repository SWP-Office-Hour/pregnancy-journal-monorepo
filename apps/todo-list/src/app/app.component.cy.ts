import { TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';

describe(AppComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(AppComponent, {
      add: {
        imports: [RouterOutlet],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(AppComponent);
  });
});
