import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaigaDashboardComponent } from './taiga-dashboard.component';

describe('TaigaDashboardComponent', () => {
  let component: TaigaDashboardComponent;
  let fixture: ComponentFixture<TaigaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaigaDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaigaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
