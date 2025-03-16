import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildrenProfileTableComponent } from './children-profile-table.component';

describe('ChildrenProfileTableComponent', () => {
  let component: ChildrenProfileTableComponent;
  let fixture: ComponentFixture<ChildrenProfileTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildrenProfileTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChildrenProfileTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
