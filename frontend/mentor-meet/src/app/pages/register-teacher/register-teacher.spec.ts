import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTeacher } from './register-teacher';

describe('RegisterTeacher', () => {
  let component: RegisterTeacher;
  let fixture: ComponentFixture<RegisterTeacher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterTeacher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterTeacher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
