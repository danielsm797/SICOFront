import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AsignacionCursoComponent } from 'src/app/components/asignacion-curso/asignacion-curso.component';
import { ApiService } from 'src/app/services/api.service';
import { Estudiante } from 'src/app/utils/types';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit {

  //#region Properties

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
    this.#init()
  }

  //#endregion

  //#region Methods

  #init() {

    this.estudiantes = []

    this.api
      .getEstudiantes()
      .then((val: Estudiante[]) => this.estudiantes = val)
      .catch(err => {
        debugger
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
