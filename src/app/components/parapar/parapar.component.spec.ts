import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaparComponent } from './parapar.component';

describe('ParaparComponent', () => {
  let component: ParaparComponent;
  let fixture: ComponentFixture<ParaparComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParaparComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParaparComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
