import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaparEmpenhoComponent } from './parapar-empenho.component';

describe('ParaparEmpenhoComponent', () => {
  let component: ParaparEmpenhoComponent;
  let fixture: ComponentFixture<ParaparEmpenhoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParaparEmpenhoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParaparEmpenhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
