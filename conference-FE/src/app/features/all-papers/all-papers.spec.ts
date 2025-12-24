import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPapers } from './all-papers';

describe('AllPapers', () => {
  let component: AllPapers;
  let fixture: ComponentFixture<AllPapers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPapers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPapers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
