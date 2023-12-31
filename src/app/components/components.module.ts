import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionCursoComponent } from './asignacion-curso/asignacion-curso.component';
import { MatDialogModule } from '@angular/material/dialog'
import { MatTableModule } from '@angular/material/table'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { ReactiveFormsModule } from '@angular/forms';
import { FormularioEstudianteComponent } from './formulario-estudiante/formulario-estudiante.component';

@NgModule({
  declarations: [
    AsignacionCursoComponent,
    FormularioEstudianteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [
    AsignacionCursoComponent,
    FormularioEstudianteComponent
  ]
})
export class ComponentsModule { }
