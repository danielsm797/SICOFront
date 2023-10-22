const host = 'https://localhost:7149'

export const environment = {
  getEstudiante: `${host}/api/estudiante`,
  getCursosXEstudiante: `${host}/api/estudiante/`,
  getCursosDisponiblesXEstudiante: `${host}/api/curso/`,
  postAsignarCurso: `${host}/api/cursoXEstudiante`,
  postRegistrarEmpleado: `${host}/api/estudiante`,
  deleteCursoXEstudiante: `${host}/api/cursoXEstudiante/`,
  deleteEstudiante: `${host}/api/estudiante/`,
  putEstudiante: `${host}/api/estudiante/`
};
