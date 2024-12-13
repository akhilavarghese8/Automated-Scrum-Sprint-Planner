import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSelectedSprintComponent } from './auto-selected-sprint.component';

describe('AutoSelectedSprintComponent', () => {
  let component: AutoSelectedSprintComponent;
  let fixture: ComponentFixture<AutoSelectedSprintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoSelectedSprintComponent]
    });
    fixture = TestBed.createComponent(AutoSelectedSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
