import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { ApiService } from 'src/app/services/api.service';
import { ErrorForm } from 'src/app/utils/errorForm';
import { message, question } from 'src/app/utils/message';
import { Estudiante, PostRegistrarEstudiante } from 'src/app/utils/types';

@Component({
  selector: 'app-formulario-estudiante',
  templateUrl: './formulario-estudiante.component.html',
  styleUrls: ['./formulario-estudiante.component.css']
})
export class FormularioEstudianteComponent implements OnInit {

  //#region Properties

  isUpdate = false

  frmEstudiante!: FormGroup

  //#endregion

  //#region Constructors

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: Estudiante,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<FormularioEstudianteComponent>
  ) { }

  ngOnInit() {
    this.#createForm()
  }

  //#endregion

  //#region Methods

  #createForm() {

    this.frmEstudiante = new FormGroup({
      identificacion: new FormControl('', [Validators.required, Validators.maxLength(12), Validators.pattern("^[0-9]*$")]),
      primerNombre: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      segundoNombre: new FormControl('', [Validators.maxLength(12)]),
      primerApellido: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      segundoApellido: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(60)])
    })

    if (this.data) {
      this.#llenarFormulario()
    }
  }

  #llenarFormulario() {

    this.frmEstudiante.setValue({
      identificacion: this.data.strIdentificacion,
      primerNombre: this.data.strPrimerNombre,
      segundoNombre: this.data.strSegundoNombre,
      primerApellido: this.data.strPrimerApellido,
      segundoApellido: this.data.strSegundoApellido,
      email: this.data.strEmail
    })

    this.isUpdate = true
  }

  async prevSave() {

    if (this.frmEstudiante.invalid) {
      this.frmEstudiante.markAllAsTouched()
      return
    }

    const titulo = this.isUpdate ? 'Actualizar estudiante' : 'Registrar estudiante'

    const isOk = await question(titulo)

    if (!isOk) {
      return
    }

    if (this.isUpdate) {
      this.#actualizar()
    } else {
      this.#guardar()
    }
  }

  #getBody(): PostRegistrarEstudiante {

    const {
      email,
      identificacion,
      primerApellido,
      primerNombre,
      segundoApellido,
      segundoNombre
    } = this.frmEstudiante.value

    const body: PostRegistrarEstudiante = {
      strEmail: email,
      strIdentificacion: identificacion,
      strPrimerApellido: primerApellido,
      strPrimerNombre: primerNombre,
      strSegundoApellido: segundoApellido,
      strSegundoNombre: segundoNombre
    }

    if (this.isUpdate) {
      body.idEstudiante = this.data.idEstudiante
    }

    return body
  }

  #actualizar() {

    const body = this.#getBody()

    this.apiService
      .putEstudiante(body)
      .then(() => {

        message(
          'Actualizar estudiante',
          '¡Estudiante actualizado exitosamente!',
          true
        )

        this.dialogRef
          .close(body)
      })
      .catch(err => {
        message(
          'Actualizar estudiante',
          'Ha ocurrido un error actualizando el estudiante',
          false
        )
      })
  }

  #guardar() {

    const body = this.#getBody()

    this.apiService
      .postRegistrarEstudiante(body)
      .then((val: number) => {

        const isOk = val > 0

        message(
          'Registrar estudiante',
          isOk
            ? '¡Estudiante registrado exitosamente!'
            : '¡No se ha podido registrar el estudiante!',
          isOk
        )

        if (!isOk) {
          return
        }

        const estudiante: Estudiante = {
          dtmFechaCreacion: DateTime.local().toFormat('yyyy/LL/dd HH:mm'),
          idEstudiante: val,
          ...body
        }

        this.dialogRef
          .close(estudiante)
      })
      .catch(err => {
        message(
          'Registar estudiante',
          'Ha ocurrido un error registrando el estudiante',
          false
        )
      })
  }

  cerrar() {
    this.dialogRef.close()
  }

  errorMessage(field: string) {
    return ErrorForm.get(this.frmEstudiante, field)
  }

  limpiar() {
    this.frmEstudiante.reset()
  }

  //#endregion
}
