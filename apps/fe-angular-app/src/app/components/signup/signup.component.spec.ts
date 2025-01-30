import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponentComponent } from './signup.component';

describe('SignupComponentComponent', () => {
  let component: SignupComponentComponent;
  let fixture: ComponentFixture<SignupComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
