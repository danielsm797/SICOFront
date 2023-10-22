import { Injectable } from '@angular/core';
import { PeticionService } from './peticion.service';
import { environment } from 'src/environments/environment.development';
import { HttpMethods } from '../utils/enums';
import { Estudiante, PostAsignarCurso, PostRegistrarEstudiante } from '../utils/types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private peticionService: PeticionService
  ) { }

  getEstudiantes() {
    return this.peticionService
      .send(environment.getEstudiante, HttpMethods.GET)
  }

  getCursosXEstudiante(idEstudiante: number) {
    return this.peticionService
      .send(`${environment.getCursosXEstudiante}${idEstudiante}`, HttpMethods.GET)
  }

  getCursosDisponibleXEstudiante(idEstudiante: number) {
    return this.peticionService
      .send(`${environment.getCursosDisponiblesXEstudiante}${idEstudiante}`, HttpMethods.GET)
  }

  postAsignarCurso(body: PostAsignarCurso) {
    return this.peticionService
      .send(environment.postAsignarCurso, HttpMethods.POST, body)
  }

  deleteCursoXEstudiante(idCursoXEstudiante?: number) {
    return this.peticionService
      .send(`${environment.deleteCursoXEstudiante}${idCursoXEstudiante}`, HttpMethods.DELETE)
  }

  deleteEstudiante(idEstudiante: number) {
    return this.peticionService
      .send(`${environment.deleteEstudiante}${idEstudiante}`, HttpMethods.DELETE)
  }

  postRegistrarEstudiante(body: PostRegistrarEstudiante) {
    return this.peticionService
      .send(environment.postRegistrarEmpleado, HttpMethods.POST, body)
  }

  putEstudiante(body: PostRegistrarEstudiante) {
    return this.peticionService
      .send(`${environment.putEstudiante}${body.idEstudiante}`, HttpMethods.PUT, body)
  }
}
