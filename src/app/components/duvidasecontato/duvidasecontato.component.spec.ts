import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuvidasecontatoComponent } from './duvidasecontato.component';

describe('DuvidasecontatoComponent', () => {
  let component: DuvidasecontatoComponent;
  let fixture: ComponentFixture<DuvidasecontatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuvidasecontatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuvidasecontatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
