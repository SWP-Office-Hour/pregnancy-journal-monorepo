import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularToolComponent } from './popular-tool.component';

describe('PopularToolComponent', () => {
  let component: PopularToolComponent;
  let fixture: ComponentFixture<PopularToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularToolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopularToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
