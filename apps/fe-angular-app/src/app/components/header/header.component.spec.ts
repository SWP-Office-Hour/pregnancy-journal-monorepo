import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponentComponent } from './header.component';

describe('HeaderComponentComponent', () => {
  let component: HeaderComponentComponent;
  let fixture: ComponentFixture<HeaderComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
