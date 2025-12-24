import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPaper } from './my-paper';

describe('MyPaper', () => {
  let component: MyPaper;
  let fixture: ComponentFixture<MyPaper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPaper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPaper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
