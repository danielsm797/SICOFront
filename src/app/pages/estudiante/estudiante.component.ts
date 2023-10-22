import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { AsignacionCursoComponent } from 'src/app/components/asignacion-curso/asignacion-curso.component';
import { FormularioEstudianteComponent } from 'src/app/components/formulario-estudiante/formulario-estudiante.component';
import { ApiService } from 'src/app/services/api.service';
import { message, question } from 'src/app/utils/message';
import { Estudiante } from 'src/app/utils/types';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit {

  //#region Properties

  filtro = ''

  estudiantes: Estudiante[] = []

  displayedColumns: string[] = [
    'strIdentificacion',
    'strPrimerNombre',
    'strSegundoNombre',
    'strPrimerApellido',
    'strSegundoApellido',
    'dtmFechaCreacion',
    'accion'
  ];

  //#endregion

  //#region Constructor

  constructor(
    private api: ApiService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.consultarEstudiantes()
  }

  //#endregion

  //#region Methods

  consultarEstudiantes() {

    this.estudiantes = []

    this.api
      .getEstudiantes()
      .then((val: Estudiante[]) => {

        val.forEach(x => x.dtmFechaCreacion = DateTime
          .fromISO(x.dtmFechaCreacion)
          .toFormat('yyyy/LL/dd HH:mm'))

        this.estudiantes = val
      })
      .catch(err => {
        message(
          'Estudiantes',
          '¡Ha ocurrido un error consultando los estudiantes!',
          false
        )
      })
  }

  verCursos(estudiante: Estudiante) {

    const { idEstudiante, strPrimerNombre, strPrimerApellido } = estudiante

    this.dialog
      .open(AsignacionCursoComponent, {
        data: {
          id: idEstudiante,
          nombre: `${strPrimerNombre} ${strPrimerApellido}`
        }
      })
  }

  nuevoEstudiante() {

    const dialogRef = this.dialog
      .open(FormularioEstudianteComponent, {
        width: '50%',
        height: 'auto'
      })

    dialogRef
      .afterClosed()
      .subscribe(subs => {

        if (!subs) {
          return
        }

        this.estudiantes.push(subs)
      })
  }

  async prevEliminarEstudiante(estudiante: Estudiante, indice: number) {

    const isOk = await question(
      'Eliminar estudiante',
      `¿Está seguro de eliminar el estudiante: ${estudiante.strPrimerNombre} ${estudiante.strPrimerApellido}?`
    )

    if (!isOk) return

    this.#eliminarEstudiante(estudiante.idEstudiante, indice)
  }

  #eliminarEstudiante(id: number, indice: number) {

    this.api
      .deleteEstudiante(id)
      .then(() => {

        message(
          'Eliminar estudiante',
          '¡Estudiante eliminado exitosamente!',
          true
        )

        this.estudiantes.splice(indice, 1)
      })
      .catch(err => {
        message(
          'Eliminar estudiante',
          'Ha ocurrido un error eliminando el estudiante',
          false
        )
      })
  }

  editar(estudiante: Estudiante, indice: number) {

    const dialogRef = this.dialog
      .open(FormularioEstudianteComponent, {
        width: '50%',
        height: 'auto',
        data: estudiante
      })

    dialogRef
      .afterClosed()
      .subscribe(subs => {

        if (!subs) {
          return
        }

        this.estudiantes[indice] = {
          ...subs,
          dtmFechaCreacion: DateTime.local().toFormat('yyyy/LL/dd HH:mm')
        }
      })
  }

  //#endregion
}
