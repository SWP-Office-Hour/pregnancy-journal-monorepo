import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyNameFinderComponent } from './baby-name-finder.component';

describe('BabyNameFinderComponent', () => {
  let component: BabyNameFinderComponent;
  let fixture: ComponentFixture<BabyNameFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabyNameFinderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BabyNameFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
