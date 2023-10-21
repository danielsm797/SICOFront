import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { AsignacionCursoComponent } from 'src/app/components/asignacion-curso/asignacion-curso.component';
import { ApiService } from 'src/app/services/api.service';
import { message } from 'src/app/utils/message';
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

    const dialogRef = this.dialog
      .open(AsignacionCursoComponent, {
        data: {
          id: idEstudiante,
          nombre: `${strPrimerNombre} ${strPrimerApellido}`
        }
      })

    dialogRef
      .afterClosed()
      .subscribe(subs => {

      })
  }

  //#endregion
}
