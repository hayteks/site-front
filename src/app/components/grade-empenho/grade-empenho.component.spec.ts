import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeEmpenhoComponent } from './grade-empenho.component';

describe('GradeEmpenhoComponent', () => {
  let component: GradeEmpenhoComponent;
  let fixture: ComponentFixture<GradeEmpenhoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeEmpenhoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeEmpenhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
