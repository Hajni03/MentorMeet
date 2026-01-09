import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherProfileEdit } from './teacher-profile-edit';

describe('TeacherProfileEdit', () => {
  let component: TeacherProfileEdit;
  let fixture: ComponentFixture<TeacherProfileEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherProfileEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherProfileEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
