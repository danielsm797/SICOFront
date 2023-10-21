import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionCursoComponent } from './asignacion-curso.component';

describe('AsignacionCursoComponent', () => {
  let component: AsignacionCursoComponent;
  let fixture: ComponentFixture<AsignacionCursoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionCursoComponent]
    });
    fixture = TestBed.createComponent(AsignacionCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
