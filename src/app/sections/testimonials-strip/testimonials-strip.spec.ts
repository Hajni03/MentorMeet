import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsStrip } from './testimonials-strip';

describe('TestimonialsStrip', () => {
  let component: TestimonialsStrip;
  let fixture: ComponentFixture<TestimonialsStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsStrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialsStrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
