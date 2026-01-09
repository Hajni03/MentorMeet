import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileEdit } from './student-profile-edit';

describe('StudentProfileEdit', () => {
  let component: StudentProfileEdit;
  let fixture: ComponentFixture<StudentProfileEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentProfileEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentProfileEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
