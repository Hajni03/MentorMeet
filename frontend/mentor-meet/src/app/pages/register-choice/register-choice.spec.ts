import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterChoice } from './register-choice';

describe('RegisterChoice', () => {
  let component: RegisterChoice;
  let fixture: ComponentFixture<RegisterChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterChoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
