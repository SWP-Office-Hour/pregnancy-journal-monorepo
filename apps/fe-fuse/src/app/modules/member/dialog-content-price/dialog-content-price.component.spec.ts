import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentPriceComponent } from './dialog-content-price.component';

describe('DialogContentPriceComponent', () => {
  let component: DialogContentPriceComponent;
  let fixture: ComponentFixture<DialogContentPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogContentPriceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogContentPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
