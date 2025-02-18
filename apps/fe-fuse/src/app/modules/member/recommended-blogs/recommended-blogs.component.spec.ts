import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedBlogsComponent } from './recommended-blogs.component';

describe('RecommendedBlogsComponent', () => {
  let component: RecommendedBlogsComponent;
  let fixture: ComponentFixture<RecommendedBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedBlogsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
