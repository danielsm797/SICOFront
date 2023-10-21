import { Pipe, PipeTransform } from '@angular/core'
import { Estudiante } from '../utils/types'

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any[], texto: string, ...campos: any): any[] {

    if (texto === String()) { return arreglo }

    texto = texto.toLowerCase()

    const result: Estudiante[] = []

    campos.forEach((element: string) => {

      const filtro: Estudiante[] = arreglo
        .filter(x => x[element] && x[element].toLowerCase().includes(texto.toLowerCase()))

      // validamos que no se encuentre el
      // registro ya almacenado en el array

      if (result.length === 0) {

        result.push(...filtro)

      } else {

        filtro.forEach(f => {

          const indice = result.findIndex(x => x.idEstudiante === f.idEstudiante)

          if (indice === -1) {
            result.push(f)
          }
        })
      }
    })

    return result
  }
}
