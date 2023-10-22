export type Estudiante = {
  dtmFechaCreacion: string,
  idEstudiante: number,
  strIdentificacion: string,
  strPrimerApellido: string,
  strPrimerNombre: string,
  strSegundoApellido: string,
  strSegundoNombre?: string,
  strEmail?: string
}

export type Curso = {
  idCursoXEstudiante?: number,
  idCurso: number,
  strNombre: string,
  dtmFechaCreacion: string
}

export type DataDialogAsignacionCurso = {
  id: number,
  nombre: string
}

export type PostAsignarCurso = {
  idEstudiante: number,
  idCurso: number
}

export type PostRegistrarEstudiante = {
  idEstudiante?: number,
  strIdentificacion: string,
  strPrimerNombre: string,
  strSegundoNombre?: string,
  strPrimerApellido: string,
  strSegundoApellido: string,
  strEmail: string
}