import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { Curso, DataDialogAsignacionCurso, PostAsignarCurso } from 'src/app/utils/types';
import { DateTime } from 'luxon'
import { message, question } from 'src/app/utils/message';

@Component({
  selector: 'app-asignacion-curso',
  templateUrl: './asignacion-curso.component.html',
  styleUrls: ['./asignacion-curso.component.css']
})
export class AsignacionCursoComponent implements OnInit {

  //#region Properties

  frm!: FormGroup

  nombreEstudiante = ''

  cursosAsignados: Curso[] = []

  cursosDisponibles: Curso[] = []

  displayedColumns: string[] = [
    'strNombre',
    'dtmFechaCreacion',
    'accion'
  ];

  //#endregion

  //#region Constructors

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: DataDialogAsignacionCurso,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AsignacionCursoComponent>
  ) {

    this.nombreEstudiante = data.nombre
  }

  get cursoSelected() { return this.frm.controls['curso'] }

  ngOnInit() {
    this.#buildForm()
    this.#consultarCursosAsignados()
    this.#consultarCursosDisponibles()
  }

  //#endregion

  //#region Methods

  #buildForm() {

    this.frm = new FormGroup({
      curso: new FormControl(null, [Validators.required])
    })
  }

  #consultarCursosAsignados() {

    this.cursosAsignados = []

    this.apiService
      .getCursosXEstudiante(this.data.id)
      .then((val: Curso[]) => {

        val.forEach(x => x.dtmFechaCreacion = DateTime
          .fromISO(x.dtmFechaCreacion)
          .toFormat('yyyy/LL/dd HH:mm'))

        this.cursosAsignados = val
      })
      .catch(err => {
        message(
          'Cursos asignados',
          '¡Ha ocurrido un error consultando los cursos asignados!',
          false
        )
      })
  }

  #consultarCursosDisponibles() {

    this.cursosDisponibles = []

    this.apiService
      .getCursosDisponibleXEstudiante(this.data.id)
      .then((val: Curso[]) => {

        this.cursosDisponibles = val

        if (!val.length) {
          this.cursoSelected.disable()
        }
      })
      .catch(err => {
        message(
          'Cursos disponibles',
          '¡Ha ocurrido un error consultando los cursos disponibles!',
          false
        )
      })
  }

  async prevEliminar(curso: Curso) {

    const value = await question(
      'Desvincular curso',
      `¿Está seguro de desvincular el curso "${curso.strNombre}"?`
    )

    if (!value) return

    this.#eliminar(curso)
  }

  #eliminar(curso: Curso) {

    this.apiService
      .deleteCursoXEstudiante(curso.idCursoXEstudiante)
      .then(val => {

        const isOk = val > 0

        message(
          'Desvincular curso',
          isOk
            ? `¡El curso "${curso.strNombre}" se ha desvinculado exitosamente!`
            : '¡Ha ocurrido un error desvinculando el curso!',
          isOk
        )

        if (!isOk) {
          return
        }

        this.cursosDisponibles.push(curso)

        // Habilitamos el select de cursos

        if (this.cursosDisponibles.length === 1) {
          this.cursoSelected.enable()
        }

        this.#eliminarCursoAsignado(curso.idCursoXEstudiante)
      })
      .catch(err => {
        message('Asignar curso', '¡Ha ocurrido un error desvinculando el curso!', false)
      })
  }

  guardar() {

    if (this.frm.invalid) {
      this.frm.markAllAsTouched()
      return
    }

    const body: PostAsignarCurso = {
      idCurso: this.cursoSelected.value.idCurso,
      idEstudiante: this.data.id
    }

    this.apiService
      .postAsignarCurso(body)
      .then(val => {

        const isOk = val > 0

        message(
          'Asignar curso',
          isOk
            ? `¡El curso "${this.cursoSelected.value.strNombre}" se ha asignado exitosamente!`
            : '¡Ha ocurrido un error asignando el curso!',
          isOk
        )

        if (!isOk) {
          return
        }

        this.#agregarCursoAsignado({
          dtmFechaCreacion: DateTime.local().toFormat('yyyy/LL/dd HH:mm'),
          idCurso: body.idCurso,
          strNombre: this.cursoSelected.value.strNombre,
          idCursoXEstudiante: val
        })

        this.#eliminarCursoDisponible(body.idCurso)

        this.frm.reset()
      })
      .catch(err => {
        message('Asignar curso', '¡Ha ocurrido un error asignando el curso!', false)
      })
  }

  #agregarCursoAsignado(curso: Curso) {

    const arr = [...this.cursosAsignados]

    arr.push(curso)

    this.cursosAsignados = arr
  }

  #eliminarCursoDisponible(idCurso: number) {

    const indice = this.cursosDisponibles.findIndex(x => x.idCurso === idCurso)

    if (indice !== -1) {

      this.cursosDisponibles.splice(indice, 1)

      // Deshabilitamos el select de cursos

      if (!this.cursosDisponibles.length) {
        this.cursoSelected.disable()
      }
    }
  }

  #eliminarCursoAsignado(idCursoXEstudiante?: number) {

    this.cursosAsignados = this.cursosAsignados
      .filter(x => x.idCursoXEstudiante !== idCursoXEstudiante)
  }

  cerrar() {
    this.dialogRef.close()
  }

  //#endregion
}
