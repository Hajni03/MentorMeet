import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandStrip } from './brand-strip';

describe('BrandStrip', () => {
  let component: BrandStrip;
  let fixture: ComponentFixture<BrandStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandStrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandStrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
