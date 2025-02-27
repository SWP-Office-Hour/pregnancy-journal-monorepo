import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { HeaderComponent } from './header.component';

describe(HeaderComponent.name, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('renders', () => {
    cy.mount(HeaderComponent);
  });
});
