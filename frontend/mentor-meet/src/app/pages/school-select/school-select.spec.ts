import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSelect } from './school-select';

describe('SchoolSelect', () => {
  let component: SchoolSelect;
  let fixture: ComponentFixture<SchoolSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
