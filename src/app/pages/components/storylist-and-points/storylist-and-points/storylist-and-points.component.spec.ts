import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorylistAndPointsComponent } from './storylist-and-points.component';

describe('StorylistAndPointsComponent', () => {
  let component: StorylistAndPointsComponent;
  let fixture: ComponentFixture<StorylistAndPointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StorylistAndPointsComponent]
    });
    fixture = TestBed.createComponent(StorylistAndPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
