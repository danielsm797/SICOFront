import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { Curso, DataDialogAsignacionCurso, PostAsignarCurso } from 'src/app/utils/types';
import { DateTime } from 'luxon'

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
      curso: new FormControl('', [Validators.required])
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
        console.log('err :>> ', err);
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
        console.log('err :>> ', err);
      })
  }

  eliminar(curso: Curso) {

    this.apiService
      .deleteCursoXEstudiante(curso.idCursoXEstudiante)
      .then(val => {

        if (!val) {
          return
        }

        // TODO: Mostrar mensaje de confirmación

        this.cursosDisponibles.push(curso)

        // Habilitamos el select de cursos

        if (this.cursosDisponibles.length === 1) {
          this.cursoSelected.enable()
        }

        this.#eliminarCursoAsignado(curso.idCursoXEstudiante)
      })
      .catch(err => {
        console.log('err :>> ', err);
      })
  }

  guardar() {

    const body: PostAsignarCurso = {
      idCurso: this.cursoSelected.value.idCurso,
      idEstudiante: this.data.id
    }

    this.apiService
      .postAsignarCurso(body)
      .then(val => {

        if (!val) {
          // TODO: Mostrar mensaje
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
        console.log('err :>> ', err);
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
